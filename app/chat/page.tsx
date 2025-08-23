"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { motion } from "motion/react";
import { Send, StopCircle, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      
      <div className="relative flex flex-col items-center px-4 py-8 max-w-4xl mx-auto min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Shopping AI Assistant
            </h1>
          </div>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Ask about products, get recommendations, and shop smarter with AI.
          </p>
        </motion.header>

        {/* Messages Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex-1 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden"
        >
          <ChatMessageList messages={messages} values={values} stream={stream} />
        </motion.div>

        {/* Input Section */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            submit({ messages: [{ type: "human", content: input }] });
            setInput("");
          }}
          className="w-full flex gap-3 mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-sm"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products or ask shopping questions..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-700 placeholder:text-slate-400"
            disabled={isLoading}
          />

          {isLoading ? (
            <Button 
              type="button" 
              onClick={() => stop()} 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <ShimmerButton>
              <Send className="h-4 w-4 mr-2" />
              Send
            </ShimmerButton>
          )}
        </motion.form>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs text-slate-400 mt-8 text-center"
        >
          Powered by GPT-5 · Built with LangGraph · Kynth Tech 2025
        </motion.footer>
      </div>
    </div>
  );
}
