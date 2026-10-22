// Asks the configured AI model (AI_MODEL, with fallbacks) for a short reason
// per match. The prompt must ask for JSON shaped {"<id>": "<reason>"}.
// Returns null if the AI is unavailable, so callers can fall back to
// reasons built from the numbers.

export async function explainMatches(prompt: string): Promise<Record<string, string> | null> {
  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.AI_BASE_URL || 'https://api.tokenrouter.com/v1';
  const models = (process.env.AI_MODEL || 'deepseek/deepseek-v4.1-flash')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  for (const model of models) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        console.error('Match AI error:', model, res.status);
        if ([404, 429, 500, 502, 503, 504].includes(res.status)) continue;
        return null;
      }
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content ?? '';
      const json = text.match(/\{[\s\S]*\}/);
      if (!json) return null;
      return JSON.parse(json[0]);
    } catch (e) {
      console.error('Match AI request failed:', model, e);
    }
  }
  return null;
}
