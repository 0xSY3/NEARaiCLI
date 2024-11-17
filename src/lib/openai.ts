import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateContractPrompt = (description: string, language: 'rust' | 'assemblyscript') => {
  return `Create a NEAR smart contract in ${language} with these requirements:
${description}

Include:
- Proper error handling
- Events/logging
- Tests
- Comments explaining the code
- Best practices for NEAR development

The contract should be production-ready and follow security best practices.`;
};