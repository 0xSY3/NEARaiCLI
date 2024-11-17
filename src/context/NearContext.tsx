import React, { createContext, useContext, useEffect, useState } from 'react';
import { connect, Contract, WalletConnection, utils } from 'near-api-js';

interface NearContextType {
  near: any;
  wallet: WalletConnection | null;
  accountId: string | null;
  contract: Contract | null;
  connected: boolean;
  loading: boolean;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  loadContract: (contractId: string) => Promise<void>;
}

const NearContext = createContext<NearContextType>({} as NearContextType);

export const NearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [near, setNear] = useState<any>(null);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initNear();
  }, []);

  const initNear = async () => {
    try {
      const config = {
        networkId: process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet',
        nodeUrl: process.env.NEXT_PUBLIC_NEAR_NODE_URL || 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        keyStore: new utils.keyStores.BrowserLocalStorageKeyStore(),
      };

      const nearConnection = await connect(config);
      const walletConnection = new WalletConnection(nearConnection, 'nearide');

      setNear(nearConnection);
      setWallet(walletConnection);
      setConnected(walletConnection.isSignedIn());
      
      if (walletConnection.isSignedIn()) {
        setAccountId(walletConnection.getAccountId());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize NEAR');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = () => {
    if (wallet) {
      wallet.requestSignIn({
        contractId: process.env.NEXT_PUBLIC_NEAR_CONTRACT_NAME,
      });
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.signOut();
      setAccountId(null);
      setConnected(false);
      setContract(null);
    }
  };

  const loadContract = async (contractId: string) => {
    try {
      if (!wallet || !accountId) {
        throw new Error('Wallet not connected');
      }

      const newContract = new Contract(
        wallet.account(),
        contractId,
        {
          viewMethods: ['get_balance', 'get_owner', 'get_token_info'],
          changeMethods: ['transfer', 'mint', 'burn'],
        }
      );

      setContract(newContract);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contract');
      throw err;
    }
  };

  return (
    <NearContext.Provider
      value={{
        near,
        wallet,
        accountId,
        contract,
        connected,
        loading,
        error,
        connectWallet,
        disconnectWallet,
        loadContract,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};

export const useNear = () => useContext(NearContext);