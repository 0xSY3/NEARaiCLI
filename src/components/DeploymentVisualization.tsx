"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface DeploymentStep {
  id: number;
  title: string;
  description: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
}

interface DeploymentVisualizationProps {
  contractName: string;
  onComplete?: () => void;
}

export function DeploymentVisualization({ contractName, onComplete }: DeploymentVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: 1,
      title: "Compiling Contract",
      description: "Optimizing and building WASM binary",
      status: 'waiting'
    },
    {
      id: 2,
      title: "Preparing Deployment",
      description: "Generating transaction payload",
      status: 'waiting'
    },
    {
      id: 3,
      title: "Deploying to NEAR",
      description: "Sending transaction to network",
      status: 'waiting'
    },
    {
      id: 4,
      title: "Verifying Contract",
      description: "Confirming successful deployment",
      status: 'waiting'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps(prev => prev.map(step => 
          step.id === currentStep + 1 
            ? { ...step, status: 'processing' }
            : step.id < currentStep + 1
            ? { ...step, status: 'completed' }
            : step
        ));
        setCurrentStep(prev => prev + 1);
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h3 className="text-xl font-semibold text-near-cyan mb-6 text-center">
        Deploying {contractName}
      </h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-near-blue/20" />
            )}

            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {step.status === 'waiting' && (
                    <motion.div
                      key="waiting"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-gray-800 border border-near-blue/20"
                    />
                  )}
                  {step.status === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-near-blue/20"
                    >
                      <div className="w-full h-full rounded-full animate-ping bg-near-blue/40" />
                    </motion.div>
                  )}
                  {step.status === 'completed' && (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-near-cyan/20 border border-near-cyan flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-near-cyan"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}