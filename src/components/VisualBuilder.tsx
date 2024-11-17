"use client";

import { motion, Reorder } from "framer-motion";
import { useState } from "react";
import { 
  Database, 
  Function, 
  Bell, 
  Shield, 
  Key, 
  DollarSign,
  Users,
  Sword,
  Clock,
  Lock,
  Cpu,
  ScrollText
} from 'lucide-react';

interface ContractComponent {
  type: 'storage' | 'method' | 'event' | 'modifier' | 'access' | 'payment' | 
        'social' | 'gaming' | 'time' | 'security' | 'compute' | 'state';
  name: string;
  code: string;
  description: string;
  icon: any;
  color: string;
}

const COMPONENT_TYPES = [
  {
    type: 'storage',
    label: 'Storage',
    icon: Database,
    color: '#00ffff',
    description: 'Add state variables and data structures'
  },
  {
    type: 'method',
    label: 'Method',
    icon: Function,
    color: '#00ff98',
    description: 'Add contract functions and logic'
  },
  {
    type: 'event',
    label: 'Event',
    icon: Bell,
    color: '#9d4edd',
    description: 'Add event emissions for tracking'
  },
  {
    type: 'modifier',
    label: 'Modifier',
    icon: Shield,
    color: '#ff6b6b',
    description: 'Add function modifiers and guards'
  },
  {
    type: 'access',
    label: 'Access',
    icon: Key,
    color: '#ffd93d',
    description: 'Add access control and permissions'
  },
  {
    type: 'payment',
    label: 'Payment',
    icon: DollarSign,
    color: '#4ade80',
    description: 'Add payment and token handling'
  },
  {
    type: 'social',
    label: 'Social',
    icon: Users,
    color: '#60a5fa',
    description: 'Add social and community features'
  },
  {
    type: 'gaming',
    label: 'Gaming',
    icon: Sword,
    color: '#f472b6',
    description: 'Add gaming mechanics and NFTs'
  },
  {
    type: 'time',
    label: 'Time',
    icon: Clock,
    color: '#a78bfa',
    description: 'Add time-based mechanics'
  },
  {
    type: 'security',
    label: 'Security',
    icon: Lock,
    color: '#fb923c',
    description: 'Add security features and checks'
  },
  {
    type: 'compute',
    label: 'Compute',
    icon: Cpu,
    color: '#94a3b8',
    description: 'Add computational logic'
  },
  {
    type: 'state',
    label: 'State',
    icon: ScrollText,
    color: '#38bdf8',
    description: 'Add state management'
  }
];

export function VisualBuilder() {
  const [components, setComponents] = useState<ContractComponent[]>([]);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  
  const addComponent = (type: ContractComponent['type'], icon: any, color: string) => {
    const newComponent = {
      type,
      name: `New${type}${components.length}`,
      code: '',
      description: `Add a description for your ${type}`,
      icon,
      color
    };
    setComponents([...components, newComponent]);
  };

  return (
    <div className="space-y-6">
      {/* Component Palette */}
      <div className="p-4 glass-dark rounded-xl">
        <h3 className="text-lg font-semibold text-near-cyan mb-4">Contract Components</h3>
        <div className="grid grid-cols-4 gap-4">
          {COMPONENT_TYPES.map((componentType) => (
            <motion.button
              key={componentType.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredComponent(componentType.type)}
              onHoverEnd={() => setHoveredComponent(null)}
              onClick={() => addComponent(
                componentType.type as ContractComponent['type'], 
                componentType.icon,
                componentType.color
              )}
              className="relative group"
            >
              <div className="p-4 rounded-lg border-2 border-transparent transition-all duration-300"
                   style={{
                     backgroundColor: `${componentType.color}10`,
                     borderColor: hoveredComponent === componentType.type ? componentType.color : 'transparent'
                   }}>
                <div className="flex flex-col items-center gap-2">
                  <componentType.icon 
                    className="w-6 h-6"
                    style={{ color: componentType.color }}
                  />
                  <span className="text-sm font-medium text-gray-200">
                    {componentType.label}
                  </span>
                </div>

                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredComponent === componentType.type ? 1 : 0,
                    y: hoveredComponent === componentType.type ? 0 : 10 
                  }}
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48 p-2 rounded-lg bg-gray-900 text-xs text-gray-300 z-10"
                >
                  {componentType.description}
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Visual Editor */}
      <div className="min-h-[400px] p-4 glass-dark rounded-xl">
        <h3 className="text-lg font-semibold text-near-cyan mb-4">Contract Structure</h3>
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400 text-center">
              Start building your contract by adding components from above
            </p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={components} onReorder={setComponents} className="space-y-4">
            {components.map((component) => (
              <Reorder.Item key={component.name} value={component}>
                <motion.div 
                  className="glass-dark p-4 rounded-lg cursor-move"
                  whileHover={{ scale: 1.01 }}
                  style={{
                    backgroundColor: `${component.color}10`,
                    borderLeft: `4px solid ${component.color}`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <component.icon className="w-5 h-5" style={{ color: component.color }} />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={component.name}
                        onChange={(e) => {
                          const updatedComponents = components.map(c =>
                            c.name === component.name ? { ...c, name: e.target.value } : c
                          );
                          setComponents(updatedComponents);
                        }}
                        className="bg-transparent border-none text-white focus:outline-none"
                      />
                      <textarea
                        value={component.description}
                        onChange={(e) => {
                          const updatedComponents = components.map(c =>
                            c.name === component.name ? { ...c, description: e.target.value } : c
                          );
                          setComponents(updatedComponents);
                        }}
                        className="w-full bg-transparent border-none text-gray-400 text-sm focus:outline-none resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setComponents(components.filter(c => c.name !== component.name));
                      }}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </motion.button>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}