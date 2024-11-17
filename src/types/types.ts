export enum UserSelection {
  AI = "AI",
  Compile = "Compile",
  Deploy = "Deploy",
  Settings = "Settings"
}

export interface ContractTemplate {
  prompt: string;
  description: string;
  code: string;
}

export interface GenerationStep {
  title: string;
  description: string;
}

export interface CompilationResult {
  success: boolean;
  error?: string;
}