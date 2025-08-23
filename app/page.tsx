"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { WarpBackground } from "@/components/magicui/warp-background";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { MagicCard } from "@/components/magicui/magic-card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

// Magic UI Components
const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="transition-all duration-300"
  >
    {children}
  </motion.div>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
  </div>
);

const SparkleIcon = () => (
  <motion.div
    className="absolute -top-2 -right-2 h-4 w-4"
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  >
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
      <path
        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
        fill="currentColor"
        className="text-yellow-400"
      />
    </svg>
  </motion.div>
);

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-semibold text-xl">ShoppingChat</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <Link href="/chat">
              <Button variant="ghost" className="hover:bg-blue-50">
                Start Chat
              </Button>
            </Link>
            <Link href="/chat">
              <ShimmerButton>Get Started</ShimmerButton>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <AnimatedGradientText className="text-6xl md:text-7xl font-bold mb-6">
              AI-Powered Shopping Assistant
            </AnimatedGradientText>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your shopping experience with intelligent AI that understands your preferences, 
              finds the best deals, and helps you make informed purchasing decisions.
            </motion.p>
          </motion.div>

          {/* Email Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <ShimmerButton onClick={() => handleEmailSubmit}>
                Join Waitlist
              </ShimmerButton>
            </form>
          </motion.div>

          {/* Feature Cards with Warp Background */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FloatingCard delay={0.1}>
              <WarpBackground className="p-6">
                <MagicCard className="relative border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <SparkleIcon />
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span>Smart Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Get personalized product recommendations based on your preferences, budget, and shopping history.
                    </CardDescription>
                  </CardContent>
                </MagicCard>
              </WarpBackground>
            </FloatingCard>

            <FloatingCard delay={0.2}>
              <WarpBackground className="p-6">
                <MagicCard className="relative border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <SparkleIcon />
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span>Price Tracking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Track prices across multiple retailers and get notified when items go on sale.
                    </CardDescription>
                  </CardContent>
                </MagicCard>
              </WarpBackground>
            </FloatingCard>

            <FloatingCard delay={0.3}>
              <WarpBackground className="p-6">
                <MagicCard className="relative border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <SparkleIcon />
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span>24/7 Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Chat with our AI assistant anytime for instant help with your shopping decisions.
                    </CardDescription>
                  </CardContent>
                </MagicCard>
              </WarpBackground>
            </FloatingCard>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to revolutionize your shopping?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of smart shoppers who are already saving time and money with AI-powered recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Start Shopping Now
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-gray-500"
          >
            <p>&copy; 2024 ShoppingChat. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
