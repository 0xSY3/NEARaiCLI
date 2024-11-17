"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const LEARNING_PATHS = {
  beginner: {
    title: "NEAR Beginner",
    steps: [
      {
        id: 1,
        title: "Basic Token Contract",
        description: "Create your first NEAR token",
        interactive: true,
        template: `// Let's create your first NEAR token
#[near_bindgen]
pub struct Token {
    // Try adding total_supply here!
    // Hint: use Balance type
}`,
        hints: [
          "Use Balance for monetary values",
          "Consider adding an owner_id field",
        ],
        completion: `pub total_supply: Balance,`
      },
      // More interactive steps...
    ]
  },
  defi: {
    title: "DeFi Developer",
    steps: [
      {
        id: 1,
        title: "AMM Implementation",
        description: "Build an Automated Market Maker",
        features: ["Liquidity Pools", "Price Discovery", "Swap Logic"]
      }
    ]
  },
  gaming: {
    title: "Gaming & NFTs",
    steps: [
      {
        id: 1,
        title: "Character NFT",
        description: "Create game characters as NFTs",
        features: ["Attributes", "Leveling", "Equipment"]
      }
    ]
  }
};

export function InteractivePath() {
  const [activePath, setActivePath] = useState<keyof typeof LEARNING_PATHS | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-8">
      {/* Path Selection */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(LEARNING_PATHS).map(([key, path]) => (
          <motion.button
            key={key}
            onClick={() => setActivePath(key as keyof typeof LEARNING_PATHS)}
            className="glass-dark p-6 rounded-xl text-left relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-near-purple/20 to-near-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-xl font-bold text-near-cyan mb-2">{path.title}</h3>
            <p className="text-sm text-gray-400">
              {path.steps.length} interactive lessons
            </p>
          </motion.button>
        ))}
      </div>

      {/* Interactive Workspace */}
      {activePath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-6"
        >
          {/* Implementation details here */}
        </motion.div>
      )}
    </div>
  );
}