"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterCodeProps {
  code: string;
  onComplete: () => void;
  speed?: number;
}

export function TypewriterCode({ code, onComplete, speed = 10 }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [code, currentIndex, speed, onComplete]);

  return (
    <div className="relative">
      <pre className="text-gray-300">{displayedCode}</pre>
      {currentIndex < code.length && (
        <motion.div
          className="absolute bottom-0 right-0 w-2 h-4 bg-near-cyan"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}