import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a children's storybook author specializing in interactive stories for toddlers (ages 2-4).
Your goal is to create a short, bouncy, and cheerful story based on 3 emojis provided by the user.

STRICT RULES:
1. WORD COUNT: Maximum 150 words.
2. TONE: Playful, repetitive, and encouraging.
3. INTERACTION: Every 2-3 sentences, you MUST include a single emoji (like 🦁, 🚀, or ✨) on its own line or within a sentence that serves as an interactive "Magic Tap" target.
4. LANGUAGE: Use simple words. Avoid complex themes.
5. FORMAT: You must return a JSON object with two fields: "title" and "content".
6. CONTENT: The "content" should be the story text.

Example Output:
{
  "title": "The Brave Little Lion",
  "content": "Once upon a time, there was a happy lion named Leo. 🦁 Leo loved to jump! Jump, jump, jump. Can you help Leo jump? ✨ One day, Leo saw a big blue balloon... [and so on]"
}
`;

export async function POST(req: Request) {
  try {
    const { emojis } = await req.json();

    if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
      return NextResponse.json({ error: 'Please provide at least one emoji.' }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        error: 'API Key missing.', 
        mock: true,
        title: "Magic Adventure",
        content: `Once upon a time, there was a ${emojis[0] || '✨'} and a ${emojis[1] || '🌟'}. They went on a big trip! ${emojis[2] || '🚀'} Can you tap the magic?`
      }, { status: 200 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a story using these emojis: ${emojis.join(', ')}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const story = JSON.parse(responseText);

    return NextResponse.json(story);
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json({ error: 'Failed to generate story.' }, { status: 500 });
  }
}
