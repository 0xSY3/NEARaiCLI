"use client";

import { motion } from "framer-motion";
import { Wand2, Code2, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-near-blue/5 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-near-cyan">NEAR</span>ide
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Build, deploy, and manage smart contracts on NEAR Protocol with AI assistance
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Wand2,
              title: "AI-Powered",
              description: "Generate smart contracts from natural language"
            },
            {
              icon: Code2,
              title: "Developer-First",
              description: "Advanced IDE with NEAR-specific features"
            },
            {
              icon: Sparkles,
              title: "Production-Ready",
              description: "Deploy contracts directly to NEAR testnet"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-dark p-6 rounded-lg"
            >
              <feature.icon className="w-8 h-8 text-near-cyan mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <button
            onClick={onStart}
            className="btn-primary text-lg px-8 py-3 relative overflow-hidden group"
          >
            <span className="relative z-10">Start Building</span>
            <motion.div
              className="absolute inset-0 bg-near-cyan/20"
              initial={false}
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </button>

          <p className="text-gray-500">
            Powered by NEAR Protocol
          </p>
        </motion.div>
      </div>

      {/* Animated Background Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-near-cyan/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}