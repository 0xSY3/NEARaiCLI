// src/config/near.ts
import { keyStores } from 'near-api-js';

export interface NearConfig {
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
    keyStore?: keyStores.KeyStore;
}

export const getNearConfig = (networkId: string = process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet'): NearConfig => {
    switch (networkId) {
        case 'mainnet':
            return {
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                walletUrl: 'https://wallet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
                explorerUrl: 'https://explorer.near.org',
                keyStore: new keyStores.BrowserLocalStorageKeyStore()
            };
        case 'testnet':
        default:
            return {
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                explorerUrl: 'https://explorer.testnet.near.org',
                keyStore: new keyStores.BrowserLocalStorageKeyStore()
            };
    }
};  