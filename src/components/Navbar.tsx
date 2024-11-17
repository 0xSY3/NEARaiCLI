"use client";

import Link from "next/link";
import Image from "next/image";
import { useNear } from "@/app/providers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isConnected, accountId, connect, disconnect } = useNear();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              height={40} 
              width={40} 
              alt="NEAR logo"
              className="animate-float"
            />
            <span className="text-2xl font-bold gradient-text">NEARide</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <span className="text-sm text-near-blue">
                  {accountId?.split('.')[0]}
                </span>
                <button
                  onClick={disconnect}
                  className="neon-button px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Disconnect
                </button>
              </motion.div>
            ) : (
              <motion.button
                onClick={connect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-6 py-2 rounded-lg text-sm font-medium"
              >
                Connect NEAR Wallet
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}