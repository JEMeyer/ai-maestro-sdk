// src/interfaces.ts

/**
 * Basic interface for the request to reserve a compute resource.
 */
export interface RequestComputeParams {
  service?: string; // e.g. "ollama", "diffusion", "transcription"
  model?: string; // e.g. "llama3.1", "sdxl-turbo", "whisper", ...
}

/**
 * The response from the backend with GPU assignment information.
 */
export interface ComputeAssignment {
  assignmentId: string; // Unique ID to track the reservation
  host: string; // Host/IP of the server that will handle requests
  port: number; // Port for that service
  expiresAt: string; // ISO date/time string for resource expiry
}

/**
 * Example arguments for transcribe method.
 */
export interface TranscribeParams {
  audioFilePath: string;
  // ...other fields...
}

/**
 * Example arguments for diffusion method.
 */
export interface DiffusionParams {
  prompt: string;
  // ...other fields controlling the generation...
}

/**
 * Options for advanced usage, controlling timeouts, etc.
 */
export interface MaestroOptions {
  requestTimeoutMs?: number; // We can handle this ourselves or pass it to the server
  // Possibly add config for reconnection logic, etc.
}
