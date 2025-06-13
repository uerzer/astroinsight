import OpenAI from 'openai';

const provider = process.env.LLM_PROVIDER || 'openai';

export async function generate(systemPrompt: string, userPrompt: string) {
  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 350,
    });
    return completion.choices[0].message.content?.trim() || '';
  }
  // Fallback simple provider
  throw new Error(`Unsupported LLM_PROVIDER ${provider}`);
} 