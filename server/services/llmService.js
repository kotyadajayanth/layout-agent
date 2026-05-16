import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callLLM(systemPrompt, history, userMessage) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  // Fix: Gemini requires history to start with 'user' and strictly alternate user/model
  // Filter out assistant-first messages and ensure correct alternation
  const cleanHistory = [];
  for (const msg of history.slice(-6)) {
    const geminiRole = msg.role === 'assistant' ? 'model' : 'user';
    const last = cleanHistory[cleanHistory.length - 1];

    // Skip if same role as last (no consecutive duplicates)
    if (last && last.role === geminiRole) continue;

    cleanHistory.push({
      role: geminiRole,
      parts: [{ text: msg.content }],
    });
  }

  // Fix: if history starts with 'model', remove it — Gemini requires user first
  while (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
    cleanHistory.shift();
  }

  const chat = model.startChat({ history: cleanHistory });

  const result = await chat.sendMessage(userMessage);
  const rawText = result.response.text();

  console.log('Gemini response preview:', rawText.slice(0, 200));

  let parsed;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    try {
      const stripped = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsed = JSON.parse(stripped);
    } catch {
      try {
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          parsed = JSON.parse(rawText.slice(start, end + 1));
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        console.error('All parse attempts failed. Full response:', rawText);
        throw new Error('Gemini returned text that could not be parsed as JSON.');
      }
    }
  }

  if (!parsed.updatedLayout) {
    throw new Error('Gemini response is missing the updatedLayout field.');
  }
  if (!parsed.explanation) {
    parsed.explanation = 'Done! The layout has been updated.';
  }

  return parsed;
}
