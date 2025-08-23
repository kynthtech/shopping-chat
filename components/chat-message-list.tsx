/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Message } from "@langchain/langgraph-sdk";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { CartComponent, ProductCarousel, WeatherComponent } from "./agent/ui";
import splitTextAndTables from "@/utils/splitTextAndTables";
import MarkdownTable from "./MarkdownTable";

type Product = {
  image_url: string; // image url
  product_id: number;
  name: string;
  price: number;
  stock: number;
};

const clientComponents = {
  weather: WeatherComponent,
  list_products: (props: any) => (
    <ProductCarousel products={props.products as Product[]} />
  ),
  view_cart: (props: any) => (
    <CartComponent items={props.items} total={props.total} />
  ),
};

export default function ChatMessageList({
  messages,
  values,
  stream,
}: {
  messages: Message[];
  values?: any;
  stream: any;
}) {
  console.log("values", values);
  console.log("messages", messages);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages
        .filter(
          (m) =>
            (m.type === "human" || m.type === "ai") &&
            m.content &&
            (typeof m.content === "string"
              ? m.content.trim() !== ""
              : JSON.stringify(m.content).trim() !== "")
        )
        .map((m, i) => {
          // check if this message has a matching UI
          const attachedUi =
            values?.ui?.filter((ui: any) => ui.metadata?.message_id === m.id) ??
            [];

          const contentStr =
            typeof m.content === "string"
              ? m.content
              : JSON.stringify(m.content);

          const parts = splitTextAndTables(contentStr);
          const isHuman = m.type === "human";

          return (
            <div key={`msg-${i}`} className="space-y-2">
              {/* If UI exists -> render only UI, skip chat bubble */}
              {attachedUi.length > 0 ? (
                attachedUi.map((ui: any) => (
                  <LoadExternalComponent
                    key={ui.id}
                    stream={stream}
                    message={ui}
                    components={clientComponents}
                  />
                ))
              ) : (
                // Otherwise, render normal chat bubble
                <div
                  className={`flex ${
                    isHuman ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed transition-all duration-200 space-y-2 ${
                      isHuman
                        ? "bg-gray-600 text-white rounded-br-none"
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
              )}
            </div>
          );
        })}
    </div>
  );
}
