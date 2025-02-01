# 🚀 We've Moved!

This project has reached the end of its lifecycle and has been **deprecated**. But don’t worry! We've built something even better: **[AI-Maestro](https://github.com/JEMeyer/ai-maestro)**. 

AI-Maestro is a **faster, more scalable, and actively maintained** solution that replaces and improves upon this project. 

We recommend checking it out for a **better experience and continued support**! 🎉

# ai-maestro-sdk

This is an SDK for reserving GPU resources and calling AI endpoints through a backend server that you control. This implementation uses **WebSockets** to avoid HTTP timeouts.

## Installation

```bash
npm install ai-maestro-sdk
```

## Usage

```ts
import { Maestro } from "ai-maestro-sdk";

// Initialize Maestro with custom configuration
Maestro.initialize({
  backendUrl: "ws://your-backend-server.com/socket",
  apiToken: "your-api-token",
});

// Chat with Ollama
const chatResult = await Maestro.chatOllama({
  prompt: "Hello, how are you?",
  temperature: 0.7,
});
console.log("chatResult:", chatResult);

// Transcribe an audio file
const transcriptionResult = await Maestro.transcribe({
  audioFilePath: "/path/to/audio/file.wav",
});
console.log("transcriptionResult:", transcriptionResult);

// Run diffusion
const diffusionResult = await Maestro.diffusion({
  prompt: "A fantasy landscape with dragons",
});
console.log("diffusionResult:", diffusionResult);

// Run an arbitrary amount of AI calls directly
```
