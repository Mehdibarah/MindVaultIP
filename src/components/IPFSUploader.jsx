import React, { useState, useEffect } from 'react';
import { useContractConnection } from '@/hooks/useContractConnection';
import { ethers } from 'ethers';

const IPFSUploader = () => {
  const { contract, isConnected, connect, address } = useContractConnection();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get web3.storage token from environment
  const web3StorageToken = import.meta.env.VITE_WEB3STORAGE_TOKEN;

  // Load user files when connected
  useEffect(() => {
    if (isConnected && contract) {
      loadUserFiles();
    }
  }, [isConnected, contract, address]);

  const loadUserFiles = async () => {
    if (!contract || !address) return;
    
    setLoading(true);
    try {
      console.log('Loading files for address:', address);
      const files = await contract.getFilesByOwner(address);
      console.log('Loaded files:', files);
      setUserFiles(files);
    } catch (error) {
      console.error('Failed to load user files:', error);
      setError('Failed to load files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToIPFS = async (file) => {
    if (!web3StorageToken) {
      throw new Error('Web3.Storage token not configured. Please set VITE_WEB3STORAGE_TOKEN in your .env file.');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.web3.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${web3StorageToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.cid;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload to IPFS: ' + error.message);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setError('Please select a file and enter a title');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting upload process...');
      
      // Step 1: Upload to IPFS
      console.log('Uploading to IPFS...');
      const cid = await uploadToIPFS(selectedFile);
      console.log('IPFS upload successful, CID:', cid);

      // Step 2: Register on-chain
      console.log('Registering on-chain...');
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(cid));
      const ipfsUrl = `ipfs://${cid}`;
      
      const tx = await contract.registerIP(hash, title, "document", ipfsUrl, true);
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Step 3: Refresh user files
      await loadUserFiles();

      // Reset form
      setSelectedFile(null);
      setTitle('');
      setError(null);
      
      console.log('Upload and registration completed successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGatewayUrl = (ipfsUrl) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      const cid = ipfsUrl.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${cid}`;
    }
    return ipfsUrl;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">IPFS Document Uploader</h2>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Wallet Connection</h3>
            <p className="text-sm text-gray-600">
              {isConnected ? `Connected: ${address}` : 'Not connected'}
            </p>
          </div>
          {!isConnected && (
            <button
              onClick={connect}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Upload Form */}
      {isConnected && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Upload Document</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !title.trim()}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload to IPFS & Register'}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* User Files List */}
      {isConnected && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Documents</h3>
            <button
              onClick={loadUserFiles}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loading ? (
            <p className="text-gray-600">Loading files...</p>
          ) : userFiles.length === 0 ? (
            <p className="text-gray-600">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {userFiles.map((file, index) => (
                <div key={index} className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{file.title || 'Untitled'}</h4>
                      <p className="text-sm text-gray-600">
                        Type: {file.fileType || 'Unknown'} | 
                        Hash: {file.hash ? file.hash.substring(0, 10) + '...' : 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={getGatewayUrl(file.ipfsUrl || '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View
                      </a>
                      <a
                        href={getGatewayUrl(file.ipfsUrl || '')}
                        download
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Configuration</h4>
        <p className="text-sm text-yellow-700">
          Web3.Storage Token: {web3StorageToken ? '✅ Configured' : '❌ Not configured'}
        </p>
        <p className="text-sm text-yellow-700">
          {!web3StorageToken && 'Please set VITE_WEB3STORAGE_TOKEN in your .env file'}
        </p>
      </div>
    </div>
  );
};

export default IPFSUploader;
