"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, CreditCard, BarChart3, Zap, Bot, ArrowRight, CheckCircle } from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  color: "blue" | "green" | "orange" | "purple" | "indigo" | "teal";
};

function FeatureCard({ icon, title, description, example, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-700",
    green: "from-green-500 to-green-600 bg-green-50 text-green-700",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-700",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-700",
    indigo: "from-indigo-500 to-indigo-600 bg-indigo-50 text-indigo-700",
    teal: "from-teal-500 to-teal-600 bg-teal-50 text-teal-700"
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} flex items-center justify-center text-white`}>
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        <div className={`${colorClasses[color].split(' ').slice(2).join(' ')} px-3 py-2 rounded-lg text-xs font-medium`}>
          {example}
        </div>
      </CardContent>
    </Card>
  );
}

type TechBadgeProps = {
  name: string;
  description: string;
};

function TechBadge({ name, description }: TechBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
        {name}
      </div>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
  );
}

export default function IntroStatement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Bot className="w-4 h-4" />
            Next-Gen AI Commerce
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            AI Shopping Assistant
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Beyond chatbots. This AI doesn't just answer questions — it runs a complete
            <span className="font-semibold text-indigo-600"> e-commerce ecosystem</span> with
            real transactions, inventory management, and order processing.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShoppingCart className="w-6 h-6" />}
            title="Natural Shopping"
            description="Browse products with conversational queries"
            example='"Show me gaming laptops under $1200"'
            color="blue"
          />

          <FeatureCard
            icon={<Package className="w-6 h-6" />}
            title="Real-time Inventory"
            description="Instant stock checks and product details"
            example={`"What's available in iPhone 15 Pro?"`}
            color="green"
          />

          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Smart Cart Management"
            description="Add, modify, and manage items effortlessly"
            example='"Add 2 wireless headphones to cart"'
            color="orange"
          />

          <FeatureCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Seamless Checkout"
            description="Process payments with simple commands"
            example='"Checkout with my saved card"'
            color="purple"
          />

          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Order Tracking"
            description="Monitor orders and delivery status"
            example='"Track order #ORD-001234"'
            color="indigo"
          />

          <FeatureCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Complete Workflow"
            description="End-to-end shopping experience"
            example="From discovery to delivery"
            color="teal"
          />
        </div>

        {/* Technology Stack */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Powered by Production-Grade Tech</h2>

              <div className="flex flex-wrap justify-center items-center gap-6">
                <TechBadge name="LangChain" description="AI Orchestration" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <TechBadge name="SQLite" description="Database Engine" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <TechBadge name="OpenAI" description="Language Model" />
              </div>

              <p className="text-gray-600 max-w-2xl mx-auto">
                Not a mockup or prototype — this is a fully functional backend system that
                processes real transactions, manages inventory, and handles order fulfillment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why This Matters */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">🎯 Why This Changes Everything</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
                    Most AI is Just Text
                  </h3>
                  <p className="text-indigo-100">
                    Traditional chatbots only generate responses. They can't take meaningful actions
                    or interact with real systems.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
                    This AI Actually Works
                  </h3>
                  <p className="text-indigo-100">
                    Here, AI manages inventory, processes payments, tracks orders, and handles
                    customer service — like a real business system.
                  </p>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-lg font-medium">
                  It's the bridge between <span className="bg-white/20 px-2 py-1 rounded">chatbots</span> and
                  <span className="bg-white/20 px-2 py-1 rounded ml-2">real applications</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center pb-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Ready to explore the future of AI commerce
          </div>
        </div>
      </div>
    </div>
  );
}



// Write a React component using shadcn/ui and Tailwind CSS. Keep the design clean, minimal, and use default shadcn styles — no extra borders, shadows, or background colors unless necessary. Typography should feel modern but simple, with clear hierarchy. The layout should have good spacing and readability, but avoid over-styling. I want the output to feel like a Stripe-style landing section: confident, clean, and minimal.