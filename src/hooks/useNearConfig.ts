// src/hooks/useNearConfig.ts
import { useEffect, useState } from 'react';
import { NearConfig, getNearConfig } from '../config/near';

export const useNearConfig = () => {
    const [config, setConfig] = useState<NearConfig>(getNearConfig());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            const network = process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet';
            setConfig(getNearConfig(network));
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load NEAR config'));
            setLoading(false);
        }
    }, []);

    return { config, loading, error };
};