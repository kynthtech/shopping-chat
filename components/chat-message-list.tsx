"use client";

import type { Message } from "@langchain/langgraph-sdk";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { WeatherComponent } from "./agent/ui";
import ChatMessage from "./chat-message";

export default function ChatMessageList({
  messages,
  values,
  stream,
}: {
  messages: Message[];
  values?: any;   // optional
  stream: any;
}) {

  console.log("values", values)
  console.log("messages", messages)

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages
        .filter((m) => {
          const hasUI = values?.ui?.some((ui: any) => ui.metadata?.message_id === m.id);
          if (m.type === "ai" && hasUI) {
            return false; // Exclude AI messages that have an associated UI component
          }
          return (
            (m.type === "human" || m.type === "ai") &&
            m.content &&
            (typeof m.content === "string" ? m.content.trim() !== "" : JSON.stringify(m.content).trim() !== "")
          );
        })
        .map((m, i) => (
          console.log("UI for message", m.id,
            values?.ui?.filter((ui: any) => ui.metadata?.message_id === m.id)),

          <div key={`msg-${i}`} className="space-y-2">
            {/* Normal chat message */}
            <ChatMessage message={m} />

            {/* Attached UI components for this message */}
            {values?.ui
              .map((ui: any) => (
                <LoadExternalComponent
                  key={ui.id}
                  stream={stream}
                  message={ui}
                  components={{
                    weather: WeatherComponent,
                  }}
                />
              ))}

          </div>
        ))}
    </div>
  );
}

