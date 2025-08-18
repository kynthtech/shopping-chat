"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Annotation,
  MessagesAnnotation,
  type StateType,
  type UpdateType,
} from "@langchain/langgraph/web";
import ChatMessageList from "@/components/chat-message-list";
import { uiMessageReducer } from "@langchain/langgraph-sdk/react-ui";

// Define schema for Shopping Agent state
const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
  context: Annotation<{
    product_query?: string;
    recommendations?: string[];
    [key: string]: unknown;
  }>(),
});

export default function ShoppingAgentPage() {
  const [input, setInput] = useState("");

  const stream = useStream<
    StateType<typeof AgentState.spec>, // State
    { UpdateType: UpdateType<typeof AgentState.spec> } // Update type
  >({
    assistantId: "agent",
    apiUrl: "http://127.0.0.1:2024",
    messagesKey: "messages",
    // onCustomEvent: (event, options) => {
    //   options.mutate((prev) => {
    //     const ui = uiMessageReducer(prev.ui ?? [], event);
    //     return { ...prev, ui };
    //   });
    // },
  });
  const { messages, values, submit, isLoading, stop } = stream;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-6">
      {/* Hero Section */}
      <header className="max-w-2xl text-center sticky mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Shopping AI Agent
        </h1>
        <p className="text-gray-600">
          Ask about products, get recommendations, and shop smarter with AI.
        </p>
      </header>

      {/* Messages */}
      <div className="w-full max-w-2xl flex-1">
        <ChatMessageList messages={messages} values={values} stream={stream} />
      </div>

      {/* Input Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          submit({ messages: [{ type: "human", content: input }] });
          setInput("");
        }}
        className="w-full max-w-2xl flex gap-2 mt-4"
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search products or ask shopping questions..."
          className="flex-1"
        />

        {isLoading ? (
          <Button type="button" onClick={() => stop()} variant="destructive">
            Stop
          </Button>
        ) : (
          <Button type="submit">Send</Button>
        )}
      </form>

      {/* Footer */}
      <footer className="text-xs text-gray-500 mt-6">
        Powered by GPT-5 · Built with LangGraph · Kynth Tech 2025
      </footer>
    </div>
  );
}
