import { openai, generateContractPrompt } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { description, language = 'rust' } = await req.json();

    const prompt = generateContractPrompt(description, language);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert NEAR Protocol smart contract developer. 
Generate secure, well-documented smart contracts following NEAR best practices.
Always include proper error handling and events.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    return NextResponse.json({ 
      success: true, 
      code: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Contract generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate contract' },
      { status: 500 }
    );
  }
}