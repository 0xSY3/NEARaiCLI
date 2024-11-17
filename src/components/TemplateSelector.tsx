"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NEAR_CONTRACTS, CONTRACT_METADATA } from "@/lib/contractTemplates";
import { useState } from "react";

interface TemplateSelectorProps {
  onSelect: (code: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const contracts = Object.entries(NEAR_CONTRACTS);

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {contracts.map(([id, contract]) => (
        <motion.div
          key={id}
          layoutId={id}
          onClick={() => {
            setSelectedId(id);
            onSelect(contract.code);
          }}
          className={`glass-card cursor-pointer relative overflow-hidden
            ${selectedId === id ? 'border-near-cyan' : 'border-near-blue/20'}
            border rounded-xl p-6 hover:border-near-cyan/50 transition-colors`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-near-blue/20 to-transparent opacity-50" />
          
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              {CONTRACT_METADATA[id as keyof typeof CONTRACT_METADATA].icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {contract.name}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4">
                {contract.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {contract.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs bg-near-blue/20 text-near-cyan"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Difficulty:</span>
                  <span className="text-xs text-near-cyan">
                    {CONTRACT_METADATA[id as keyof typeof CONTRACT_METADATA].difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Est. Gas:</span>
                  <span className="text-xs text-near-cyan">
                    {CONTRACT_METADATA[id as keyof typeof CONTRACT_METADATA].estimatedGas}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Indicator */}
          {selectedId === id && (
            <motion.div
              className="absolute inset-0 border-2 border-near-cyan rounded-xl"
              layoutId="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}