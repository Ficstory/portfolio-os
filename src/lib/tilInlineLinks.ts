export type TILInlinePart = { text: string; href?: string };

// Only explicit HTTP(S) Markdown links become anchors. All other text stays inert.
export function parseTILInlineLinks(text: string): TILInlinePart[] {
  const parts: TILInlinePart[] = [];
  const links = /\[([^\]\n]+)\]\((https?:\/\/[^\s()]+)\)/gi;
  let cursor = 0;
  for (const match of text.matchAll(links)) {
    try {
      const url = new URL(match[2]);
      if (!url.hostname) continue;
    } catch {
      continue;
    }
    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
    parts.push({ text: match[1], href: match[2] });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) });
  return parts;
}
