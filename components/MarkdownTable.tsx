"use client";

export default function MarkdownTable({ tableText }: { tableText: string }) {
  const rows = tableText
    .trim()
    .split("\n")
    .filter((row) => !row.match(/^\|[-\s|]+\|$/)); // remove separator row

  const headers = rows[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  const bodyRows = rows.slice(1).map((r) =>
    r
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  return (
    <div className="flex justify-center my-4">
      <table className="text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-center">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-center border-t border-gray-200"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
