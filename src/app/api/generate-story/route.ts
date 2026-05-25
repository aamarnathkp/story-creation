import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a silly, whimsical children's storybook author specializing in interactive, laugh-out-loud funny stories for toddlers (ages 2-4).
Your goal is to create a short, extremely goofy, bouncy, and cheerful story based on 3 emojis provided by the user.

STRICT RULES:
1. WORD COUNT: Maximum 120 words. (Keep it short and punchy!)
2. TONE: Goofy, hilarious, highly repetitive, and encouraging. Use funny sound words (like "Boing!", "Wobble-wobble!", "Splat!", "Squeeak!", "Toot!").
3. STYLE: Focus on absurd, playful, and whimsical situations that make a toddler giggle (e.g., things falling over, unexpected animal sounds, objects dancing).
4. INTERACTION: Every 2-3 sentences, you MUST include a single emoji (like 🦁, 🚀, or ✨) on its own line or within a sentence that serves as an interactive "Magic Tap" target.
5. LANGUAGE: Extremely simple toddler vocabulary, short bouncy sentences.
6. FORMAT: You must return a JSON object with two fields: "title" and "content".
7. CONTENT: The "content" should be the story text.

Example Output:
{
  "title": "The Giggling Banana!",
  "content": "Look at the silly yellow banana! 🍌 It goes wobble-wobble-wobble. Uh-oh, it tripped on a wiggly worm! Boing! 🪱 Can you tickle the banana to make it stand up? ✨ The banana laughed, 'Hehehe!' and flew into the sky like a rocket! 🚀"
}
`;

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const allowedOrigins = ['https://magic-tap-stories.vercel.app'];

    const isAllowed =
      !origin ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      allowedOrigins.includes(origin);

    if (!isAllowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
