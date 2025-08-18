"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, CreditCard, BarChart3, Zap, Bot, CheckCircle } from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
};

function FeatureCard({ icon, title, description, example }: FeatureCardProps) {
  return (
    <Card className="border bg-white">
      <CardContent className="p-6 space-y-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <p className="text-sm font-mono text-gray-800 bg-gray-50 px-3 py-2 rounded">
          {example}
        </p>
      </CardContent>
    </Card>
  );
}

export default function IntroStatement() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            <Bot className="w-4 h-4" />
            AI Commerce in Action
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            AI Shopping Assistant
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            An AI you can chat with — that doesn’t just answer questions, 
            but powers a <span className="font-semibold text-gray-900">fully working e-commerce store</span>.  
            From discovery to checkout, everything happens in conversation.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShoppingCart className="w-5 h-5" />}
            title="Natural Shopping"
            description="Browse products with plain language"
            example='"Show me laptops under $1000"'
          />
          <FeatureCard
            icon={<Package className="w-5 h-5" />}
            title="Real-time Stock"
            description="Check inventory and product details instantly"
            example='"Is iPhone 15 in stock?"'
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Smart Cart"
            description="Add, remove, and manage items effortlessly"
            example='"Add 2 headphones to my cart"'
          />
          <FeatureCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Checkout"
            description="Complete purchases with simple commands"
            example='"Checkout my order now"'
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Order Tracking"
            description="Monitor delivery status in real time"
            example='"Track order #12"'
          />
          <FeatureCard
            icon={<CheckCircle className="w-5 h-5" />}
            title="End-to-End"
            description="Discovery, payments, tracking — all connected"
            example="One flow, start to finish"
          />
        </div>

        {/* Why It Matters */}
        <Card className="border bg-gray-50">
          <CardContent className="p-8 space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Why it matters
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Most AI stops at text</h3>
                <p className="text-sm text-gray-600">
                  Typical chatbots only answer questions. They don’t 
                  connect to systems, move data, or perform real actions.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">This AI executes</h3>
                <p className="text-sm text-gray-600">
                  Here, conversation drives real workflows — payments, 
                  inventory, and fulfillment — bridging chat and applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <div className="text-center space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-gray-500">
            Built with
          </h3>
          <p className="text-gray-800 font-medium">
            LangChain · SQLite · OpenAI
          </p>
        </div>
      </div>
    </div>
  );
}
