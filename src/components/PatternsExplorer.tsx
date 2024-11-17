"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const PATTERNS = {
  security: [
    {
      name: "Reentrancy Guard",
      description: "Prevent reentrancy attacks in your contract",
      implementation: `// Implementation details...`,
      category: "Security"
    }
  ],
  optimization: [
    {
      name: "Storage Optimization",
      description: "Optimize storage usage and gas costs",
      implementation: `// Implementation details...`,
      category: "Optimization"
    }
  ],
  integration: [
    {
      name: "Cross-Contract Calls",
      description: "Safely interact with other contracts",
      implementation: `// Implementation details...`,
      category: "Integration"
    }
  ]
};

export function PatternsExplorer() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-6">
      {Object.entries(PATTERNS).map(([category, patterns]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-near-cyan font-bold text-lg">{category}</h3>
          {patterns.map((pattern) => (
            <motion.button
              key={pattern.name}
              onClick={() => setSelectedPattern(pattern.name)}
              className="w-full glass-dark p-4 rounded-lg text-left"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium text-white">{pattern.name}</h4>
              <p className="text-sm text-gray-400">{pattern.description}</p>
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}