import { NextResponse } from 'next/server';
import { compileContract } from '@/lib/near/compiler';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    const result = await compileContract(code, language);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Compilation failed' },
      { status: 500 }
    );
  }
}

// /src/app/api/near/doubt/route.ts
import { OpenAI } from 'openai';
import { AssistantResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { threadId, message } = await req.json();
  
  const newThreadId = threadId ?? (await openai.beta.threads.create({})).id;
  
  const createdMessage = await openai.beta.threads.messages.create(newThreadId, {
    role: 'user',
    content: message,
  });

  return AssistantResponse(
    { threadId: newThreadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(newThreadId, {
        assistant_id: process.env.NEAR_ASSISTANT_ID!,
      });

      await forwardStream(runStream);
    }
  );
}

// /src/app/api/near/generator/route.ts
import { OpenAI } from 'openai';
import { AssistantResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { threadId, message, language = 'rust' } = await req.json();
  
  const newThreadId = threadId ?? (await openai.beta.threads.create({})).id;
  
  const enhancedPrompt = `Generate a NEAR smart contract in ${language}. Requirements: ${message}
  Include proper error handling, events, and follow NEAR best practices.`;
  
  const createdMessage = await openai.beta.threads.messages.create(newThreadId, {
    role: 'user',
    content: enhancedPrompt,
  });

  return AssistantResponse(
    { threadId: newThreadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(newThreadId, {
        assistant_id: process.env.NEAR_GENERATOR_ASSISTANT_ID!,
      });

      await forwardStream(runStream);
    }
  );
}