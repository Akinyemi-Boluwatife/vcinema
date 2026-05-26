const API_KEY = process.env.DEEPSEEK_API_KEY;

const SYSTEM_PROMPT = `You are a sharp, movie-obsessed friend. Given someone's watch history, write a single short descriptor, max 12 words, that captures who they are as a viewer. Format: a tight noun phrase, no subject pronoun, no "your taste", no full sentence, no em dashes. Think logline, not analysis. Be specific to their actual movies. Example shape: "Prestige crime obsessive with a soft spot for 80s Spielberg." Just the phrase.`;

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
        max_tokens: 40,
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
