"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CollaborationSession {
  id: string;
  name: string;
  participants: string[];
  contractType: string;
}

export function CollaborationHub() {
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);

  return (
    <div className="space-y-8">
      {/* Active Sessions */}
      <div className="grid grid-cols-2 gap-4">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            className="glass-dark p-6 rounded-xl"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-near-cyan font-bold mb-2">{session.name}</h3>
            <div className="flex gap-2">
              {session.participants.map((participant, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-near-purple/20 flex items-center justify-center"
                >
                  {participant[0]}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}