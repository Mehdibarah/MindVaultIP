// ✅ Using ethers v5 (project uses ethers@5.8.0)
// Registration fee from environment variable with fallback
const REG_FEE = (import.meta?.env?.VITE_REG_FEE_ETH ?? "0.001").toString();

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
    
    // ✅ Connect to Base Network using ethers v5
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Check if user is on Base network (Chain ID: 8453)
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== 8453) {
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
    
    // ✅ ethers v5: getSigner() (not async)
    const signer = provider.getSigner();
    
    // MindVaultIP Smart Contract on Base Network
    // ✅ Use checksum address format for MetaMask verification
    const rawContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c';
    
    // Validate address format before checksumming (must be 42 characters: 0x + 40 hex digits)
    const isValidAddress = (addr) => {
      return addr && 
             typeof addr === 'string' && 
             addr.startsWith('0x') && 
             addr.length === 42 && 
             /^0x[a-fA-F0-9]{40}$/.test(addr);
    };
    
    if (!isValidAddress(rawContractAddress)) {
      throw new Error(`Invalid contract address format: "${rawContractAddress}". Address must be 42 characters (0x + 40 hex digits).`);
    }
    
    const contractAddress = ethers.utils.getAddress(rawContractAddress); // Convert to checksum format
    
    const contractABI = [
      "function registerProof(string memory _hash, address _owner) external payable returns (uint256)",
      "function getProof(uint256 _proofId) external view returns (string memory hash, address owner, uint256 timestamp)",
      "function proofCount() external view returns (uint256)",
      "function fee() external view returns (uint256)", // Try to read fee from contract
      "function registrationFee() external view returns (uint256)", // Alternative function name
      "function regFee() external view returns (uint256)", // Alternative function name
      "event ProofRegistered(uint256 indexed proofId, string hash, address indexed owner)"
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    // 1) Try to read fee from contract (if view function exists), otherwise use fallback
    let regFeeWei;
    try {
      // Try different possible function names
      let feeResult;
      if (contract.fee) {
        feeResult = await contract.fee();
      } else if (contract.registrationFee) {
        feeResult = await contract.registrationFee();
      } else if (contract.regFee) {
        feeResult = await contract.regFee();
      } else {
        throw new Error('No fee function found');
      }
      
      // ✅ ethers v5: Contract call returns BigNumber directly
      regFeeWei = feeResult; // Already BigNumber from contract call
      
      // ✅ formatEther - always convert BigNumber to string first (safe for ethers v5)
      // This prevents any potential BigNumber constructor calls inside formatEther
      const feeWeiString = regFeeWei.toString();
      const feeEth = ethers.utils.formatEther(feeWeiString);
      console.log('[TX] fee from contract:', feeEth, 'ETH');
    } catch (feeError) {
      // ✅ Fallback: use ethers v5 utils.parseEther (returns BigNumber)
      regFeeWei = ethers.utils.parseEther(REG_FEE);
      console.log('[TX] fee (fallback):', REG_FEE, 'ETH');
    }
    
    // ✅ Ensure regFeeWei is BigNumber (ethers v5)
    // Contract call returns BigNumber, parseEther also returns BigNumber
    // Check if it's already a BigNumber by checking for _hex property (internal ethers v5 property)
    // Only convert if it's NOT a BigNumber (shouldn't happen normally)
    const isBigNumber = regFeeWei && typeof regFeeWei === 'object' && regFeeWei._hex !== undefined;
    
    if (!isBigNumber) {
      // Not a BigNumber - convert using from() (NOT constructor - that's the error!)
      try {
        regFeeWei = ethers.BigNumber.from(regFeeWei ? regFeeWei.toString() : '0');
        console.log('[TX] Converted to BigNumber using from():', regFeeWei.toString());
      } catch (fromError) {
        // If from() fails, use parseEther as last resort
        console.warn('[TX] BigNumber.from() failed, using parseEther fallback:', fromError.message);
        regFeeWei = ethers.utils.parseEther(REG_FEE);
      }
    } else {
      // Already BigNumber - use as is
      console.log('[TX] regFeeWei is already BigNumber');
    }
    
    // ✅ Debug logs before sending
    // network already fetched above for chain check, reuse it
    const currentNetwork = await provider.getNetwork();
    console.log('[dbg] chainId=', currentNetwork.chainId.toString()); // باید 8453 باشد (Base Mainnet)
    
    // ✅ Verify contract exists on network (MetaMask requires this for verification)
    const contractCode = await provider.getCode(contractAddress);
    const contractExists = contractCode && contractCode !== '0x' && contractCode.length > 2;
    
    if (!contractExists) {
      throw new Error(`Contract not found at address ${contractAddress} on Base network. Please verify the contract address is correct and deployed on Base mainnet (Chain ID: 8453).`);
    }
    
    console.log('[dbg] ✅ Contract verified at:', contractAddress);
    console.log('[dbg] contract code length:', contractCode.length); // > 2 یعنی قرارداد واقعاً دیپلوی شده
    
    console.log('[dbg] fee(wei)=', regFeeWei.toString());
    console.log('[dbg] args:', { hash, ownerAddress });
    
    // Check balance for gas + registration fee
    const balance = await provider.getBalance(ownerAddress);
    // ✅ ethers v5: utils.parseEther
    const requiredBalance = ethers.utils.parseEther(REG_FEE).add(ethers.utils.parseEther('0.0005')); // Fee + gas buffer
    if (balance < requiredBalance) {
      throw new Error(`Insufficient ETH balance. You need at least ${REG_FEE} ETH for registration fee plus gas on Base network.`);
    }
    
    // 2) Preflight check: callStatic (ethers v5) - simulate transaction to catch revert errors before MetaMask
    try {
      console.log('[TX] Preflight: callStatic - simulating transaction...');
      // ✅ ethers v5: callStatic (not staticCall)
      await contract.callStatic.registerProof(hash, ownerAddress, { value: regFeeWei });
      console.log('[TX] ✅ Preflight check passed - transaction will succeed');
    } catch (simulateError) {
      console.error('[TX] err', simulateError.code, simulateError.reason ?? simulateError.message);
      // Extract revert reason if available
      const errorMessage = simulateError.reason || simulateError.message || 'Transaction simulation failed';
      throw new Error(`Transaction will fail: ${errorMessage}. Please check contract requirements (fee amount, permissions, etc.).`);
    }
    
    // 3) Estimate gas with the value included (important for accurate estimation)
    console.log('[TX] Estimating gas...');
    let gasEstimate;
    try {
      gasEstimate = await contract.estimateGas.registerProof(hash, ownerAddress, { value: regFeeWei });
      console.log('[fee-check] estimated gas:', gasEstimate.toString());
    } catch (gasError) {
      console.error('[TX] err', gasError.code, gasError.reason ?? gasError.message);
      throw new Error(`Gas estimation failed: ${gasError.reason || gasError.message}. This usually means the transaction will revert.`);
    }
    
    // Add 20% buffer to gas estimate for safety (ethers v5 BigNumber)
    const gasLimit = gasEstimate.mul(120).div(100);
    console.log('[TX] Gas estimate:', gasEstimate.toString(), '→ with buffer:', gasLimit.toString());
    
    // 4) Send transaction
    console.log('[TX] Sending transaction...');
    const tx = await contract.registerProof(hash, ownerAddress, {
      value: regFeeWei,
      gasLimit: gasLimit,
    });
    
    console.log('[TX] hash', tx.hash);
    console.log('[TX] Transaction link: https://basescan.org/tx/' + tx.hash);
    
    // 5) Wait for confirmation - handle TRANSACTION_REPLACED
    console.log('[TX] Waiting for confirmation (1 block)...');
    let receipt;
    try {
      // ✅ ethers v5: wait(1) waits for 1 confirmation
      receipt = await tx.wait(1);
      
      // ✅ CRITICAL: Only proceed if receipt.status === 1 (transaction succeeded)
      if (!receipt || receipt.status !== 1) {
        throw new Error('Transaction failed or was reverted on blockchain. Status: ' + (receipt?.status || 'unknown'));
      }
      
      console.log('[TX] rcpt', receipt.status, receipt.transactionHash);
      console.log('[TX] ✅ Transaction confirmed on blockchain');
      
    } catch (waitError) {
      // Handle TRANSACTION_REPLACED (Speed Up/Cancel)
      if (waitError.code === 'TRANSACTION_REPLACED') {
        console.warn('[TX] Transaction replaced, waiting for replacement...');
        if (waitError.cancelled) {
          throw new Error('Transaction was cancelled (replaced by user).');
        } else {
          // Transaction was replaced (Speed Up) - wait for replacement
          try {
            const rep = waitError.replacement;
            receipt = await rep.wait(1);
            if (receipt.status === 1) {
              console.log('[TX] rcpt', receipt.status, receipt.transactionHash);
              console.log('[TX] ✅ Replacement transaction confirmed');
            } else {
              throw new Error('Replacement transaction failed or was reverted.');
            }
          } catch (repError) {
            console.error('[TX] err', repError.code, repError.reason ?? repError.message);
            throw new Error('Replacement transaction failed: ' + (repError.message || 'Unknown error'));
          }
        }
      } else {
        throw waitError;
      }
    }
    
    return {
      transactionId: receipt.transactionHash,
      status: 'confirmed',
      network: 'Base',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error('[TX] err', error.code, error.reason ?? error.message);
    
    // Handle specific error types
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      // User rejected/cancelled - return undefined (don't throw, let caller handle)
      return;
    } else if (error.code === 'CALL_EXCEPTION' || error.code === -32000) {
      throw new Error('Transaction execution failed. Please check contract requirements (fee amount, permissions, etc.).');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient ETH balance for transaction (fee + gas).');
    } else if (error.message.includes('MetaMask')) {
      throw new Error('MetaMask is required. Please install MetaMask extension and connect your wallet.');
    } else if (error.message.includes('Insufficient')) {
      throw new Error(error.message);
    } else if (error.code === -32603) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(`Blockchain registration failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Check if user's wallet is connected and on correct network
export async function checkWalletConnection() {
  if (typeof window.ethereum === 'undefined') {
    return { connected: false, error: 'MetaMask not installed' };
  }

  try {
    // Request account access (not just check)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      return { connected: false, error: 'No wallet connected' };
    }

    // ✅ ethers v5: Web3Provider (not BrowserProvider)
    const { ethers } = await import('ethers');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const currentNetwork = await provider.getNetwork();
    
    return {
      connected: true,
      account: accounts[0],
      network: currentNetwork.name,
      chainId: currentNetwork.chainId.toString(),
      // ✅ ethers v5: chainId is number (not bigint)
      isBaseNetwork: Number(currentNetwork.chainId) === 8453
    };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
