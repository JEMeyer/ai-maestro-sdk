// src/maestro.ts

import axios from "axios";
import { WebSocketManager } from "./utils/websocketManager";

import {
  RequestComputeParams,
  ComputeAssignment,
  TranscribeParams,
  DiffusionParams,
} from "./interfaces";
import { Config } from "./config";

export class Maestro {
  private static config: Config;

  /**
   * Initialize Maestro with custom configuration.
   * This should be called once before using other methods.
   */
  public static initialize(config: Config) {
    this.config = config;
    WebSocketManager.getInstance(this.config);
  }

  /**
   * requestCompute: Ask the server to find a GPU / resource that can handle our request.
   */
  public static async requestCompute(
    params: RequestComputeParams
  ): Promise<ComputeAssignment> {
    const ws = WebSocketManager.getInstance(this.config);
    const assignment = await ws.sendRequest<ComputeAssignment>(
      "RESERVE",
      params
    );
    return assignment;
  }

  /**
   * releaseCompute: Inform the server that we’re done with the GPU assignment.
   */
  public static async releaseCompute(assignmentId: string): Promise<void> {
    const ws = WebSocketManager.getInstance(this.config);
    await ws.sendRequest("RELEASE", { assignmentId });
  }

  /**
   * transcribe: A convenience method for audio transcription.
   */
  public static async transcribe(params: TranscribeParams): Promise<any> {
    const assignment = await this.requestCompute({
      service: "transcription",
      model: "whisper",
    });

    try {
      const serverUrl = `http://${assignment.host}:${assignment.port}`;
      const response = await axios.post(`${serverUrl}/transcribe`, params);
      return response.data;
    } finally {
      await this.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * diffusion: A convenience method for image generation (diffusion).
   */
  public static async diffusion(params: DiffusionParams): Promise<any> {
    const assignment = await this.requestCompute({
      service: "diffusion",
      model: "sdxl-turbo",
    });

    try {
      const serverUrl = `http://${assignment.host}:${assignment.port}`;
      const response = await axios.post(`${serverUrl}/diffuse`, params);
      return response.data;
    } finally {
      await this.releaseCompute(assignment.assignmentId);
    }
  }
}
