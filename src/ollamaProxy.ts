// src/ollamaProxy.ts

import {
  ChatRequest,
  ChatResponse,
  CopyRequest,
  CreateRequest,
  DeleteRequest,
  EmbedRequest,
  EmbedResponse,
  GenerateRequest,
  GenerateResponse,
  ListResponse,
  Ollama,
  ProgressResponse,
  PullRequest,
  PushRequest,
  ShowRequest,
  ShowResponse,
  StatusResponse,
} from "ollama";
import { Maestro } from "./maestro";

export class OllamaProxy {
  private static clients: Record<string, Ollama> = {};

  private static getClient(host: string, port: number): Ollama {
    const key = `${host}:${port}`;
    if (this.clients[key]) {
      return this.clients[key];
    }
    const newClient = new Ollama();
    this.clients[key] = newClient;
    return newClient;
  }

  /**
   * Helper function to handle the stream and non-stream responses.
   */
  private static async handleStreamableRequest<TStream, TNonStream>(
    method: (request: any) => Promise<TStream | TNonStream>,
    request: { stream?: boolean }
  ): Promise<TStream | TNonStream> {
    if (request.stream) {
      const iterator = (await method(request)) as TStream;
      return iterator;
    } else {
      const response = (await method(request)) as TNonStream;
      return response;
    }
  }

  /**
   * Chat method that supports both streaming and non-streaming responses.
   */
  public static async chat(
    request: ChatRequest
  ): Promise<ChatResponse | AsyncIterable<ChatResponse>> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: request.model,
    });
    try {
      return this.handleStreamableRequest(
        this.getClient(assignment.host, assignment.port).chat.bind(
          this.getClient(assignment.host, assignment.port)
        ),
        request
      );
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Generate method that supports both streaming and non-streaming responses.
   */
  public static async generate(
    request: GenerateRequest
  ): Promise<GenerateResponse | AsyncIterable<GenerateResponse>> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: request.model,
    });
    try {
      return this.handleStreamableRequest(
        this.getClient(assignment.host, assignment.port).generate.bind(
          this.getClient(assignment.host, assignment.port)
        ),
        request
      );
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Generate method that supports both streaming and non-streaming responses.
   */
  public static async pull(
    request: PullRequest
  ): Promise<GenerateResponse | AsyncIterable<ProgressResponse>> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: request.model,
    });
    try {
      return this.handleStreamableRequest(
        this.getClient(assignment.host, assignment.port).generate.bind(
          this.getClient(assignment.host, assignment.port)
        ),
        request
      );
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Generate method that supports both streaming and non-streaming responses.
   */
  public static async push(
    request: PushRequest
  ): Promise<GenerateResponse | AsyncIterable<ProgressResponse>> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: request.model,
    });
    try {
      return this.handleStreamableRequest(
        this.getClient(assignment.host, assignment.port).generate.bind(
          this.getClient(assignment.host, assignment.port)
        ),
        request
      );
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Generate method that supports both streaming and non-streaming responses.
   */
  public static async create(
    request: CreateRequest
  ): Promise<GenerateResponse | AsyncIterable<ProgressResponse>> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: request.model,
    });
    try {
      return this.handleStreamableRequest(
        this.getClient(assignment.host, assignment.port).generate.bind(
          this.getClient(assignment.host, assignment.port)
        ),
        request
      );
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Delete an existing model.
   */
  public static async delete(params: DeleteRequest): Promise<StatusResponse> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: params.model,
    });

    try {
      const response = await this.getClient(
        assignment.host,
        assignment.port
      ).delete(params);
      return response;
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Copy a model to a new destination.
   */
  public static async copy(params: CopyRequest): Promise<StatusResponse> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: params.source,
    });

    try {
      const response = await this.getClient(
        assignment.host,
        assignment.port
      ).copy(params);
      return response;
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Show information about a model.
   */
  public static async show(params: ShowRequest): Promise<ShowResponse> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: params.model,
    });

    try {
      const response = await this.getClient(
        assignment.host,
        assignment.port
      ).show(params);
      return response;
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * Generate embeddings for the given input.
   */
  public static async embed(params: EmbedRequest): Promise<EmbedResponse> {
    const assignment = await Maestro.requestCompute({
      service: "ollama",
      model: params.model,
    });

    try {
      const response = await this.getClient(
        assignment.host,
        assignment.port
      ).embed(params);
      return response;
    } finally {
      await Maestro.releaseCompute(assignment.assignmentId);
    }
  }

  /**
   * List all available models.
   */
  public static async list(): Promise<ListResponse> {
    const assignment = await Maestro.requestCompute({ service: "ollama" });

    const response = await this.getClient(
      assignment.host,
      assignment.port
    ).list();
    return response;
  }

  /**
   * List running models.
   */
  public static async ps(): Promise<ListResponse> {
    const assignment = await Maestro.requestCompute({ service: "ollama" });

    const response = await this.getClient(
      assignment.host,
      assignment.port
    ).ps();
    return response;
  }

  /**
   * Abort all running operations.
   */
  public static async abort(): Promise<void> {
    const assignment = await Maestro.requestCompute({ service: "ollama" });

    this.getClient(assignment.host, assignment.port).abort();
  }
}
