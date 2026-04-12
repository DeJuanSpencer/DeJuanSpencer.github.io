const extractJSON = (text) => {
  const stripped = text.replace(/```json\s?|```/g, "").trim();
  const firstBrace = stripped.indexOf("{");
  const firstBracket = stripped.indexOf("[");
  let start = -1, opener, closer;
  if (firstBrace === -1 && firstBracket === -1) return null;
  if (firstBrace === -1) { start = firstBracket; opener = "["; closer = "]"; }
  else if (firstBracket === -1) { start = firstBrace; opener = "{"; closer = "}"; }
  else if (firstBracket < firstBrace) { start = firstBracket; opener = "["; closer = "]"; }
  else { start = firstBrace; opener = "{"; closer = "}"; }
  let depth = 0;
  for (let i = start; i < stripped.length; i++) {
    if (stripped[i] === opener) depth++;
    else if (stripped[i] === closer) { depth--; if (depth === 0) return stripped.slice(start, i + 1); }
  }
  return null;
};

const safeParseJSON = (str) => {
  try { return JSON.parse(str); } catch {}
  try { return JSON.parse(str.replace(/[\x00-\x1F\x7F]/g, " ")); } catch {}
  try {
    const fixed = str.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    return JSON.parse(fixed);
  } catch {}
  return null;
};

const callClaude = async (systemPrompt, userPrompt, maxTokens = 2000) => {
  try {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.type === "error") throw new Error(data?.error?.message || "API error");
    if (data.stop_reason === "max_tokens") throw new Error("Response truncated");
    const text = data.content?.map(i => i.type === "text" ? i.text : "").join("\n") || "";
    const json = extractJSON(text);
    if (!json) throw new Error("No JSON found in response");
    const parsed = safeParseJSON(json);
    if (!parsed) throw new Error("JSON parse failed");
    return parsed;
  } catch (err) {
    console.error("Claude API error:", err.message);
    return { _error: err.message };
  }
};

export { extractJSON, safeParseJSON, callClaude };
