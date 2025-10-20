import React from 'react';
import { useContractConnection } from '@/hooks/useContractConnection';

/**
 * Demo component showing contract connection functionality
 */
export function ContractConnectionDemo() {
  const {
    contract,
    address,
    isConnected,
    isMetaMaskAvailable,
    isLoading,
    error,
    network,
    connect,
    disconnect,
    executeContractMethod,
    clearError
  } = useContractConnection();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleTestRead = async () => {
    try {
      // Example: try to read a simple contract method
      // Replace 'name' with an actual method from your contract
      const result = await executeContractMethod('name');
      console.log('Contract name:', result);
      alert(`Contract name: ${result}`);
    } catch (err) {
      console.error('Read operation failed:', err);
      alert(`Read failed: ${err.message}`);
    }
  };

  const handleTestWrite = async () => {
    try {
      // Example: try to execute a write method (requires signer)
      // Replace with an actual write method from your contract
      alert('Write operations require a valid contract method. Please implement the specific method you want to test.');
    } catch (err) {
      console.error('Write operation failed:', err);
      alert(`Write failed: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Contract Connection</h3>
        <p className="text-gray-600">Initializing contract connection...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Contract Connection Demo</h3>
      
      {/* Connection Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="font-medium">
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        
        {address && (
          <p className="text-sm text-gray-600">
            Address: <code className="bg-gray-100 px-1 rounded">{address}</code>
          </p>
        )}
        
        {network && (
          <p className="text-sm text-gray-600">
            Network: {network.name} (Chain ID: {network.chainId})
          </p>
        )}
      </div>

      {/* MetaMask Status */}
      <div className="mb-4">
        <p className="text-sm">
          MetaMask: {isMetaMaskAvailable ? '✅ Available' : '❌ Not Available'}
        </p>
        <p className="text-sm">
          Contract: {contract ? '✅ Loaded' : '❌ Not Loaded'}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={clearError}
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Clear Error
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={!isMetaMaskAvailable || isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isMetaMaskAvailable ? 'Connect MetaMask' : 'MetaMask Not Available'}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTestRead}
            disabled={!contract}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Test Read
          </button>
          
          <button
            onClick={handleTestWrite}
            disabled={!contract || !isConnected}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Test Write
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Debug Info
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
          <pre>{JSON.stringify({
            isConnected,
            isMetaMaskAvailable,
            hasContract: !!contract,
            address,
            network,
            error
          }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
}

export default ContractConnectionDemo;
