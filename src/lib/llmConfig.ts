// LLM config file: configure provider, model, and API keys here

export type LLMProvider = 'gemini' | 'openai' | 'gemma';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey: string;
}

// Load config from environment variables
export const llmConfig: LLMConfig = {
  provider: (process.env.LLM_PROVIDER as LLMProvider) || 'gemini',
  model: process.env.LLM_MODEL || 'gemini-pro',
  apiKey: process.env.LLM_API_KEY || '',
};

// Example usage:
// import { llmConfig } from '@/lib/llmConfig';
// fetchLLMResponse({ ...llmConfig, prompt: '...' }) 