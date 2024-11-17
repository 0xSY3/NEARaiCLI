"use client";

import { UserSelection } from "@/types/types";
import { motion } from "framer-motion";
import {
  Wand2,
  Hammer,
  Rocket,
  Settings,
  Code2,
  Terminal,
  Cpu,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  selection: UserSelection;
  setSelection: (selection: UserSelection) => void;
}

export default function Sidebar({ selection, setSelection }: SidebarProps) {
  const [isHovered, setIsHovered] = useState<UserSelection | null>(null);
  
  const sidebarItems = [
    { id: UserSelection.AI, icon: Wand2, label: 'AI Assistant', color: '#00ffff' },
    { id: UserSelection.Compile, icon: Hammer, label: 'Compile Contract', color: '#00ff98' },
    { id: UserSelection.Deploy, icon: Rocket, label: 'Deploy Contract', color: '#9d4edd' },
  ];

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    selected: { 
      scale: 1.05,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 0.5 },
    selected: { opacity: 0.8 }
  };
  
  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="z-[10] w-16 fixed left-0 items-center overflow-x-hidden h-screen glass-dark"
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col justify-between items-center py-6 relative">
        {/* Gradient Border */}
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-near-blue to-transparent" />

        <motion.div 
          className="w-full h-16 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <Terminal className="w-8 h-8 text-near-cyan" />
        </motion.div>

        <ul className="flex flex-col gap-8 font-medium">
          {sidebarItems.map(({ id, icon: Icon, label, color }) => (
            <li key={id} className="relative">
              <motion.button
                onClick={() => setSelection(id)}
                onHoverStart={() => setIsHovered(id)}
                onHoverEnd={() => setIsHovered(null)}
                className="relative"
                whileHover="hover"
                whileTap="tap"
                initial="initial"
                animate={selection === id ? "selected" : "initial"}
              >
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: color }}
                  variants={glowVariants}
                  initial="initial"
                  animate={selection === id || isHovered === id ? "selected" : "initial"}
                  transition={{ duration: 0.2 }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10 p-3"
                  variants={iconVariants}
                >
                  <Icon 
                    size={24} 
                    className={`text-white ${
                      selection === id ? 'drop-shadow-glow' : ''
                    }`}
                    style={{
                      filter: selection === id ? `drop-shadow(0 0 8px ${color})` : undefined
                    }}
                  />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isHovered === id ? 1 : 0,
                      x: isHovered === id ? 0 : -20
                    }}
                    className="glass px-3 py-1.5 rounded-lg whitespace-nowrap text-sm"
                    style={{
                      color,
                      textShadow: `0 0 10px ${color}`,
                    }}
                  >
                    {label}
                  </motion.div>
                </div>
              </motion.button>
            </li>
          ))}
        </ul>

        <motion.button
          onClick={() => setSelection(UserSelection.Settings)}
          whileHover="hover"
          whileTap="tap"
          initial="initial"
          animate={selection === UserSelection.Settings ? "selected" : "initial"}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-gray-400"
            variants={glowVariants}
          />
          <motion.div
            className="relative z-10 p-3"
            variants={iconVariants}
          >
            <Settings 
              size={24} 
              className={`text-white ${
                selection === UserSelection.Settings ? 'drop-shadow-glow' : ''
              }`}
            />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
}