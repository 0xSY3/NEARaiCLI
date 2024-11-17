import { useCallback, useEffect, useState } from 'react';
import { useNear } from '../providers';
import { utils } from 'near-api-js';

export function useNearWallet() {
  const { wallet, isConnected, accountId, connect, disconnect } = useNear();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const getBalance = useCallback(async () => {
    if (wallet && accountId) {
      try {
        const account = wallet.account();
        const balance = await account.getAccountBalance();
        setBalance(utils.format.formatNearAmount(balance.available));
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  }, [wallet, accountId]);

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected, getBalance]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return {
    wallet,
    isConnected,
    accountId,
    balance,
    loading,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance: getBalance,
  };
}