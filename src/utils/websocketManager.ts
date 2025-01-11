// src/utils/websocketManager.ts

import WebSocket from "ws";
import { Config } from "../config";

interface PendingRequest {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws?: WebSocket;
  private isConnected = false;
  private requestIdCounter = 1;
  private pendingRequests: Map<number, PendingRequest> = new Map();
  private config: Config;

  private constructor(config: Config) {
    this.config = config;
    this.connect();
  }

  /**
   * Singleton pattern so we only have one WS connection open at a time.
   */
  public static getInstance(config: Config): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager(config);
    }
    return WebSocketManager.instance;
  }

  private connect() {
    this.ws = new WebSocket(this.config.backendUrl, {
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
      },
    });

    this.ws.on("open", () => {
      this.isConnected = true;
      console.log("[WebSocket] Connected to Maestro backend");
    });

    this.ws.on("message", (data: WebSocket.Data) => {
      if (data.toString() === "ping") {
        this.ws?.send("pong"); // Respond to server heartbeat to maintain any gpus we hold
      } else {
        this.handleMessage(data.toString());
      }
    });

    this.ws.on("error", (err: Error) => {
      console.error("[WebSocket] Error:", err);
      this.isConnected = false;
    });

    this.ws.on("close", () => {
      console.warn("[WebSocket] Connection closed");
      this.isConnected = false;
      // Optionally attempt reconnection logic here
    });
  }

  private handleMessage(message: string) {
    try {
      const { requestId, success, payload, error } = JSON.parse(message);

      if (requestId && this.pendingRequests.has(requestId)) {
        const { resolve, reject } = this.pendingRequests.get(requestId)!;
        this.pendingRequests.delete(requestId);

        if (success) {
          resolve(payload);
        } else {
          reject(new Error(error || "Unknown error from server"));
        }
      } else {
        console.warn(
          "[WebSocket] Received message with no matching requestId",
          message
        );
      }
    } catch (e) {
      console.error("[WebSocket] Failed to parse message:", message, e);
    }
  }

  /**
   * Sends a request over the WebSocket, returning a promise that resolves
   * when the server responds with matching requestId.
   */
  public sendRequest<T = any>(action: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error("WebSocket not connected"));
      }

      const requestId = this.requestIdCounter++;
      this.pendingRequests.set(requestId, { resolve, reject });

      const message = JSON.stringify({
        requestId,
        action,
        data,
      });

      this.ws.send(message, (err) => {
        if (err) {
          this.pendingRequests.delete(requestId);
          reject(err);
        }
      });
    });
  }
}
