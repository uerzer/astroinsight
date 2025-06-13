import { NextRequest, NextResponse } from 'next/server';
import { llmConfig } from '@/lib/llmConfig';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();
    if (!Array.isArray(answers) || answers.length < 10) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    // Build a clear, English prompt for Gemini
    const prompt = `You are an expert astrologer. A user has completed a zodiac compatibility quiz. Here are their answers to 10 questions about their personality and relationship style:\n\n${answers.map((a, i) => `Q${i+1}: ${a}`).join('\n')}\n\nBased on these answers, write a personalized, insightful, and friendly astrological compatibility analysis. Explain their likely strengths in relationships, potential challenges, and what kind of partner or sign they might be most compatible with. Be specific, use clear English, and avoid generic statements. End with a practical tip for their love life.`;

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${llmConfig.model}:generateContent?key=${llmConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const text = await geminiRes.text();
    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'Gemini API error', detail: text }, { status: 500 });
    }
    let data;
    try { data = JSON.parse(text); } catch { data = {}; }
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no result.';
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, detail: e.stack }, { status: 500 });
  }
} 