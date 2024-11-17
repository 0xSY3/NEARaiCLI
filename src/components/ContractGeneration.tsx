"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { CONTRACT_EXAMPLES } from '@/lib/contractTemplates';

interface ContractGenerationProps {
  prompt: string;
  onComplete: (code: string) => void;
}

// Add 'export default' here
export default function ContractGeneration({ prompt, onComplete }: ContractGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Step through the generation process
    STEPS.forEach((_, index) => {
      timeoutId = setTimeout(() => {
        setCurrentStep(index);
        setProgress((index + 1) / STEPS.length);
      }, index * 1500);
    });

    // Complete generation
    timeoutId = setTimeout(() => {
      // Select template based on prompt
      let code = CONTRACT_EXAMPLES.token.code;
      if (prompt.toLowerCase().includes('dao')) {
        code = CONTRACT_EXAMPLES.dao.code;
      } else if (prompt.toLowerCase().includes('nft')) {
        code = CONTRACT_EXAMPLES.gameNFT.code;
      }
      
      onComplete(code);
    }, STEPS.length * 1500);

    return () => clearTimeout(timeoutId);
  }, [prompt, onComplete]);

  return (
    <div className="glass-dark rounded-lg p-4 text-sm">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-800 rounded-full mb-4">
        <motion.div
          className="h-full bg-near-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="flex items-center gap-2 text-near-cyan">
        <Loader className="w-4 h-4 animate-spin" />
        <span>{STEPS[currentStep]}</span>
      </div>

      {/* Step Progress */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs">
        <div>
          <div className="text-near-cyan font-medium">
            {Math.round(progress * 100)}%
          </div>
          <div className="text-gray-400">Progress</div>
        </div>
        <div>
          <div className="text-near-cyan font-medium">
            {currentStep + 1}/{STEPS.length}
          </div>
          <div className="text-gray-400">Step</div>
        </div>
        <div>
          <div className="text-near-cyan font-medium">
            {STEPS.length - currentStep - 1}
          </div>
          <div className="text-gray-400">Steps Left</div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  "Analyzing requirements...",
  "Generating structure...",
  "Implementing logic...",
  "Optimizing code...",
];