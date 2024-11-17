"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connect, keyStores, WalletConnection } from "near-api-js";

// Create Query Client
export const queryClient = new QueryClient();

// NEAR Context
interface NearContextType {
  wallet: WalletConnection | null;
  isConnected: boolean;
  accountId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const NearContext = React.createContext<NearContextType>({
  wallet: null,
  isConnected: false,
  accountId: null,
  connect: async () => {},
  disconnect: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = React.useState<WalletConnection | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [accountId, setAccountId] = React.useState<string | null>(null);

  React.useEffect(() => {
    initNear();
  }, []);

  const initNear = async () => {
    try {
      const near = await connect({
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        headers: {}
      });

      const wallet = new WalletConnection(near, 'nearide');
      setWallet(wallet);

      if (wallet.isSignedIn()) {
        setIsConnected(true);
        setAccountId(wallet.getAccountId());
      }
    } catch (error) {
      console.error('Failed to initialize NEAR:', error);
    }
  };

  const contextValue = React.useMemo(() => ({
    wallet,
    isConnected,
    accountId,
    connect: async () => {
      if (wallet) {
        await wallet.requestSignIn({
          contractId: 'nearide.testnet',
        });
      }
    },
    disconnect: () => {
      if (wallet) {
        wallet.signOut();
        setIsConnected(false);
        setAccountId(null);
      }
    },
  }), [wallet, isConnected, accountId]);

  return (
    <NearContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NearContext.Provider>
  );
}

// Hook for using NEAR context
export function useNear() {
  const context = React.useContext(NearContext);
  if (!context) {
    throw new Error('useNear must be used within a NearProvider');
  }
  return context;
}