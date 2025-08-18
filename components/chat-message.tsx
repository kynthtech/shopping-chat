"use client";

import type { Message } from "@langchain/langgraph-sdk";
import splitTextAndTables from "@/utils/splitTextAndTables";
import MarkdownTable from "./MarkdownTable";

export default function ChatMessage({ message }: { message: Message }) {
  const contentStr =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content);

  const parts = splitTextAndTables(contentStr);

  const isHuman = message.type === "human";

  return (
    <div className={`flex ${isHuman ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed transition-all duration-200 space-y-2 ${
          isHuman
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {parts.map((part, idx) =>
          part.type === "text" ? (
            <p key={idx}>{part.content}</p>
          ) : (
            <MarkdownTable key={idx} tableText={part.content} />
          )
        )}
      </div>
    </div>
  );
}
