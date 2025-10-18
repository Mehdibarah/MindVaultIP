
// Client-side file hashing utility
export async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Real IPFS upload via public gateway (NO SIMULATION FALLBACK)
export async function uploadToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Try multiple IPFS services
    const ipfsServices = [
      {
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {}
      },
      {
        url: 'https://ipfs.infura.io:5001/api/v0/add',
        headers: {}
      },
      {
        url: 'https://api.web3.storage/upload',
        headers: {}
      }
    ];

    for (const service of ipfsServices) {
      try {
        const response = await fetch(service.url, {
          method: 'POST',
          headers: service.headers,
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          const cid = result.IpfsHash || result.Hash || result.cid;
          if (cid) {
            return { cid };
          }
        }
      } catch (serviceError) {
        console.warn(`IPFS service failed: ${service.url}`, serviceError);
        continue;
      }
    }

    throw new Error('All IPFS services failed');
    
  } catch (error) {
    console.error('IPFS upload completely failed:', error);
    throw new Error('Unable to upload to IPFS. Please check your internet connection and try again.');
  }
}

// Real blockchain transaction on Base Network (NO SIMULATION FALLBACK)
export async function registerOnBlockchain(hash, ownerAddress) {
  try {
    // Check if Web3 is available
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is required. Please install MetaMask and connect your wallet.');
    }

    const { ethers } = await import('ethers');
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Connect to Base Network
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check if user is on Base network (Chain ID: 8453)
    const network = await provider.getNetwork();
    if (network.chainId !== 8453n) {
      try {
        // Switch to Base network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 8453 in hex
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          // Network not added, add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          });
        } else {
          throw switchError;
        }
      }
    }
    
    const signer = await provider.getSigner();
    
    // MindVaultIP Smart Contract on Base Network
    const contractAddress = '0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c'; // Real deployed contract
    const contractABI = [
      "function registerProof(string memory _hash, address _owner) external payable returns (uint256)",
      "function getProof(uint256 _proofId) external view returns (string memory hash, address owner, uint256 timestamp)",
      "function proofCount() external view returns (uint256)",
      "event ProofRegistered(uint256 indexed proofId, string hash, address indexed owner)"
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    // Check balance for gas
    const balance = await provider.getBalance(ownerAddress);
    if (balance < ethers.parseEther('0.001')) {
      throw new Error('Insufficient ETH balance for gas fees. You need at least 0.001 ETH on Base network.');
    }
    
    // Register the proof on blockchain (with gas estimation)
    const gasEstimate = await contract.registerProof.estimateGas(hash, ownerAddress);
    const tx = await contract.registerProof(hash, ownerAddress, {
      gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    return {
      transactionId: tx.hash,
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      network: 'Base',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error('Blockchain registration failed:', error);
    
    // Provide specific error messages
    if (error.message.includes('MetaMask')) {
      throw new Error('MetaMask is required. Please install MetaMask extension and connect your wallet.');
    } else if (error.message.includes('Insufficient')) {
      throw new Error(error.message);
    } else if (error.code === 4001) {
      throw new Error('Transaction was rejected by user.');
    } else if (error.code === -32603) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(`Blockchain registration failed: ${error.message}`);
    }
  }
}

// Check if user's wallet is connected and on correct network
export async function checkWalletConnection() {
  if (typeof window.ethereum === 'undefined') {
    return { connected: false, error: 'MetaMask not installed' };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      return { connected: false, error: 'No wallet connected' };
    }

    const provider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    return {
      connected: true,
      account: accounts[0],
      network: network.name,
      chainId: network.chainId.toString(),
      isBaseNetwork: network.chainId === 8453n
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
