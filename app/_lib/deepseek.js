const API_KEY = process.env.DEEPSEEK_API_KEY;

const SYSTEM_PROMPT = `You write a short, funny Gen Z style label for someone's movie taste, based on their watch history. Max 10 words, one line, plain everyday words, no film jargon or fancy terms. Use light brainrot slang (like "cooked", "no cap", "locked in", "lowkey", "fr", "main character", "NPC") but keep it easy to understand, 1 or 2 slang bits at most. Be specific to their actual movies or genres. No em dashes, no hashtags, no emojis, no quotes. Example shapes: "Lowkey a sci-fi nerd who is locked in on Nolan, no cap." or "Horror main character, scared but keeps pressing play." Just the line.`;

export async function generateTasteBlurb({ rows, topGenres, topDirectors, avgRating, top }) {
  if (!API_KEY) return null;

  // Prioritise rated films, then fill with unrated. Cap at 50 to keep input tokens reasonable.
  const rated = rows.filter((r) => r.userRating > 0).sort((a, b) => b.userRating - a.userRating);
  const unrated = rows.filter((r) => !r.userRating);
  const sample = [...rated, ...unrated].slice(0, 50);

  const movieList = sample
    .map((r) => {
      const parts = [`"${r.title}" (${r.year ?? "?"})`];
      if (r.genres?.length) parts.push(r.genres.slice(0, 3).join("/"));
      if (r.director) parts.push(r.director);
      if (r.userRating) parts.push(`rated ${r.userRating}/10`);
      return parts.join(", ");
    })
    .join("\n");

  const userMessage = `Here are the movies they've watched:\n\n${movieList}`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 50,
        temperature: 0.8,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}
