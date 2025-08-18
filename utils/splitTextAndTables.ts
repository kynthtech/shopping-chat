export default function splitTextAndTables(output: string) {
  const tableRegex = /(\|.+\|(?:\n\|.*\|)+)/g;
  let parts: { type: "text" | "table"; content: string }[] = [];
  let lastIndex = 0;

  output.replace(tableRegex, (match, table, index) => {
    if (lastIndex < index) {
      parts.push({
        type: "text",
        content: output.slice(lastIndex, index).trim(),
      });
    }
    parts.push({ type: "table", content: table.trim() });
    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < output.length) {
    parts.push({ type: "text", content: output.slice(lastIndex).trim() });
  }

  return parts.filter((p) => p.content.length > 0);
}
