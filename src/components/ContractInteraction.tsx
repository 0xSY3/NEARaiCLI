import React, { useState } from 'react';
import { Contract } from 'near-api-js';

interface ContractInteractionProps {
  contract: Contract;
  methods: string[];
  accountId: string;
}

export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  contract,
  methods,
  accountId,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [args, setArgs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleMethodCall = async () => {
    try {
      setError('');
      setResult('');

      if (!selectedMethod) {
        throw new Error('Please select a method');
      }

      const response = await (contract as any)[selectedMethod]({
        ...args,
        account_id: accountId,
      });

      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Contract Interaction</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select method</option>
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {selectedMethod && (
          <div>
            <label className="block text-sm mb-2">Arguments</label>
            <textarea
              value={JSON.stringify(args, null, 2)}
              onChange={(e) => {
                try {
                  setArgs(JSON.parse(e.target.value));
                  setError('');
                } catch {
                  setError('Invalid JSON');
                }
              }}
              className="w-full p-2 rounded bg-gray-700 text-white font-mono"rows={4}
              placeholder='{"arg1": "value1"}'
            />
          </div>
        )}

        <button
          onClick={handleMethodCall}
          disabled={!selectedMethod || !!error}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Call Method
        </button>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Result:</h4>
            <pre className="p-3 bg-gray-900 rounded overflow-x-auto text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Add ContractDeployment component
export const ContractDeployment: React.FC<{
  accountId: string;
  onDeploy: (contractId: string) => void;
}> = ({ accountId, onDeploy }) => {
  const [contractId, setContractId] = useState(`${Date.now()}.${accountId}`);
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      // Contract deployment logic here
      onDeploy(contractId);
    } catch (error) {
      console.error('Deployment error:', error);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Contract Deployment</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Contract ID</label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={handleDeploy}
          disabled={deploying || !contractId}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {deploying ? 'Deploying...' : 'Deploy Contract'}
        </button>
      </div>
    </div>
  );
};

// Add ContractLoader component
export const ContractLoader: React.FC<{
  onLoad: (contractId: string) => void;
}> = ({ onLoad }) => {
  const [contractId, setContractId] = useState('');

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Load Existing Contract</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Contract ID</label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="example.testnet"
          />
        </div>

        <button
          onClick={() => onLoad(contractId)}
          disabled={!contractId}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Load Contract
        </button>
      </div>
    </div>
  );
};