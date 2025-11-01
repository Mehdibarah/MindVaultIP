// ============================================================================
// 🔍 DEBUG SCRIPT: Complete Transaction Diagnostic
// ============================================================================
// این اسکریپت را در DevTools Console (F12) پیست کن و اجرا کن
// همه مراحل را شفاف لاگ می‌کند تا دقیقاً ببینیم کجا fail می‌شود
// ============================================================================

// === CONFIG ===
const RPC_URL = "https://mainnet.base.org"; // یا از VITE_RPC_URL بگیر
const CONTRACT = "0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c"; // از cryptoUtils.jsx
const ABI = [
  // حداقل امضای توابع مورد نیاز
  "function registerProof(string memory _hash, address _owner) external payable returns (uint256)",
  "function getProof(uint256 _proofId) external view returns (string memory hash, address owner, uint256 timestamp)",
  "function proofCount() external view returns (uint256)",
  "function fee() external view returns (uint256)", // Try to read fee from contract
  "function registrationFee() external view returns (uint256)", // Alternative
  "function regFee() external view returns (uint256)", // Alternative
  "event ProofRegistered(uint256 indexed proofId, string hash, address indexed owner)"
];
const FILE_HASH = "0x" + "a".repeat(64); // نمونه hash (64 hex chars for bytes32, or use string)
const OWNER_ADDRESS = null; // null = استفاده از address فعلی wallet
const FALLBACK_FIXED_FEE = "1000000000000000"; // 0.001 ETH به wei

// ============================================================================
// === EXECUTION ===
// ============================================================================

(async () => {
  console.log("=".repeat(60));
  console.log("🔍 DEBUG TX: شروع تشخیص مشکل");
  console.log("=".repeat(60));

  // چک کردن ethers
  if (!window.ethers) {
    console.error("❌ Ethers not found. Make sure MetaMask is installed and page is loaded.");
    console.log("💡 اگر از ethers v5 استفاده می‌کنی، باید window.ethers موجود باشد");
    return;
  }

  console.log("✅ Ethers found:", typeof window.ethers);

  // تنظیم provider
  console.log("\n🔌 Step 1: Connecting to wallet...");
  if (!window.ethereum) {
    console.error("❌ window.ethereum not found. Please install MetaMask.");
    return;
  }

  let provider;
  let signer;
  
  try {
    // برای ethers v5
    if (window.ethers.providers?.Web3Provider) {
      provider = new window.ethers.providers.Web3Provider(window.ethereum);
    } else if (window.ethers.BrowserProvider) {
      // برای ethers v6
      provider = new window.ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error("Ethers provider not found");
    }

    console.log("   Requesting accounts...");
    await provider.send("eth_requestAccounts", []);
    
    if (window.ethers.providers?.Web3Provider) {
      signer = provider.getSigner();
    } else {
      signer = await provider.getSigner();
    }
    
    const addr = await signer.getAddress();
    const network = await provider.getNetwork();
    
    console.log("✅ Wallet connected:");
    console.log("   Address:", addr);
    console.log("   Chain ID:", network.chainId.toString());
    
    // چک کردن chain ID
    if (Number(network.chainId) !== 8453) {
      console.error("❌ Wrong network! Expected Base Mainnet (8453), got:", network.chainId.toString());
      console.log("💡 Please switch to Base Mainnet in MetaMask");
      return;
    }
    
  } catch (e) {
    console.error("❌ Failed to connect wallet:", e.message);
    return;
  }

  // تنظیم contract
  console.log("\n📝 Step 2: Setting up contract...");
  const contractAddress = CONTRACT;
  console.log("   Contract:", contractAddress);
  
  let contract;
  try {
    contract = new window.ethers.Contract(contractAddress, ABI, signer);
    console.log("✅ Contract instance created");
  } catch (e) {
    console.error("❌ Failed to create contract:", e.message);
    return;
  }

  // خواندن fee
  console.log("\n💰 Step 3: Reading fee from contract...");
  let fee;
  let feeSource = "unknown";
  
  try {
    if (contract.fee) {
      fee = await contract.fee();
      feeSource = "fee()";
    } else if (contract.registrationFee) {
      fee = await contract.registrationFee();
      feeSource = "registrationFee()";
    } else if (contract.regFee) {
      fee = await contract.regFee();
      feeSource = "regFee()";
    } else {
      throw new Error("No fee function found");
    }
    
    // Convert to readable format
    const feeEth = window.ethers.formatEther ? window.ethers.formatEther(fee) : (Number(fee) / 1e18).toFixed(6);
    console.log(`✅ Fee from contract (${feeSource}):`, fee.toString(), "wei =", feeEth, "ETH");
  } catch (e) {
    fee = window.ethers.BigNumber ? new window.ethers.BigNumber(FALLBACK_FIXED_FEE) : BigInt(FALLBACK_FIXED_FEE);
    feeSource = "fallback";
    const feeEth = window.ethers.formatEther ? window.ethers.formatEther(fee) : (Number(fee) / 1e18).toFixed(6);
    console.warn(`⚠️  Fee function not found, using fallback:`, fee.toString(), "wei =", feeEth, "ETH");
    console.warn("   Error:", e.message);
  }

  // تنظیم owner address
  const ownerAddress = OWNER_ADDRESS || (await signer.getAddress());
  console.log("\n👤 Owner address:", ownerAddress);

  // Preflight: staticCall
  console.log("\n🧪 Step 4: Preflight check (staticCall)...");
  console.log("   Hash:", FILE_HASH);
  console.log("   Owner:", ownerAddress);
  console.log("   Value:", fee.toString(), "wei");
  
  try {
    // در ethers v5: callStatic
    // در ethers v6: staticCall
    let staticCallMethod;
    if (contract.registerProof.callStatic) {
      staticCallMethod = contract.registerProof.callStatic.bind(contract.registerProof);
    } else if (contract.registerProof.staticCall) {
      staticCallMethod = contract.registerProof.staticCall.bind(contract.registerProof);
    } else {
      throw new Error("staticCall method not found");
    }

    await staticCallMethod(FILE_HASH, ownerAddress, { value: fee });
    console.log("✅ staticCall OK - transaction will NOT fail on blockchain");
  } catch (e) {
    console.error("❌ staticCall REVERTED!");
    console.error("   Code:", e.code);
    console.error("   Reason:", e.reason || "Unknown");
    console.error("   Message:", e.message);
    console.error("\n💡 این یعنی تراکنش واقعاً fail می‌شود و هشدار MetaMask درست است.");
    console.error("💡 بررسی کن:");
    console.error("   1. مقدار fee درست است؟ (contract انتظار:", fee.toString(), "wei)");
    console.error("   2. ورودی‌ها valid هستند؟ (hash, owner)");
    console.error("   3. Contract state درست است؟ (paused, permissions, etc.)");
    return;
  }

  // Estimate gas
  console.log("\n⛽ Step 5: Estimating gas...");
  let gasEstimate;
  try {
    gasEstimate = await contract.registerProof.estimateGas(FILE_HASH, ownerAddress, { value: fee });
    console.log("✅ Gas estimate:", gasEstimate.toString(), "units");
    
    // Add 20% buffer
    const gasBuffer = gasEstimate.mul ? gasEstimate.mul(120).div(100) : (gasEstimate * 120n) / 100n;
    console.log("   With 20% buffer:", gasBuffer.toString());
  } catch (e) {
    console.error("❌ estimateGas FAILED!");
    console.error("   Code:", e.code);
    console.error("   Reason:", e.reason || "Unknown");
    console.error("   Message:", e.message);
    console.error("\n💡 این یعنی MetaMask نمی‌تواند gas معقول حدس بزند.");
    console.error("💡 معمولاً یعنی transaction revert می‌شود (مثل staticCall).");
    console.error("💡 MetaMask ممکنه «likely to fail» نشان دهد (محافظه‌کارانه).");
    gasEstimate = null;
  }

  // ارسال تراکنش
  console.log("\n🚀 Step 6: Sending transaction...");
  console.log("   ⚠️  MetaMask popup will open - please confirm if you want to proceed");
  
  let tx;
  try {
    const txOptions = {
      value: fee,
      ...(gasEstimate ? { gasLimit: gasEstimate.mul ? gasEstimate.mul(120).div(100) : (gasEstimate * 120n) / 100n } : {})
    };
    
    tx = await contract.registerProof(FILE_HASH, ownerAddress, txOptions);
    console.log("✅ Transaction sent!");
    console.log("   Hash:", tx.hash);
    console.log("   Explorer:", `https://basescan.org/tx/${tx.hash}`);
  } catch (e) {
    if (e.code === 4001 || e.code === "ACTION_REJECTED") {
      console.warn("⚠️  Transaction rejected by user");
      return;
    }
    console.error("❌ Failed to send transaction:", e.message);
    return;
  }

  // انتظار برای receipt
  console.log("\n⏳ Step 7: Waiting for confirmation...");
  console.log("   This may take a few moments...");
  
  let receipt;
  try {
    receipt = await tx.wait();
    console.log("✅ Receipt received!");
  } catch (e) {
    if (e.code === "TRANSACTION_REPLACED") {
      console.warn("♻️  Transaction was REPLACED (Speed Up/Cancel)");
      console.warn("   Original hash:", tx.hash);
      console.warn("   Reason:", e.reason || "Unknown");
      
      if (e.cancelled) {
        console.error("❌ Replacement was CANCELLED");
        return;
      }
      
      console.log("   Replacement hash:", e.replacement.hash);
      console.log("   Waiting for replacement...");
      
      try {
        receipt = await e.replacement.wait();
        console.log("✅ Replacement transaction confirmed!");
      } catch (repError) {
        console.error("❌ Replacement transaction failed:", repError.message);
        return;
      }
    } else {
      console.error("❌ Failed to get receipt:", e.message);
      return;
    }
  }

  // بررسی receipt
  console.log("\n📬 Step 8: Analyzing receipt...");
  console.log("   Status:", receipt.status);
  console.log("   Transaction Hash:", receipt.transactionHash || receipt.hash);
  console.log("   Block Number:", receipt.blockNumber);
  console.log("   Gas Used:", receipt.gasUsed.toString());
  
  if (receipt.status !== 1) {
    console.error("❌ Transaction FAILED (status != 1)");
    console.error("   این یعنی transaction mined شده اما revert شده.");
    return;
  }

  console.log("✅ Transaction SUCCESSFUL (status == 1)");

  // Parse logs
  console.log("\n🔔 Step 9: Parsing event logs...");
  try {
    const iface = new window.ethers.utils.Interface ? 
      new window.ethers.utils.Interface(ABI) : 
      new window.ethers.Interface(ABI);
    
    const parsedLogs = receipt.logs.map(log => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    if (parsedLogs.length > 0) {
      console.log("✅ Found", parsedLogs.length, "parsed event(s):");
      parsedLogs.forEach((log, i) => {
        console.log(`   Event ${i + 1}:`, log.name, log.args);
      });
    } else {
      console.warn("⚠️  No parsed events found (may be normal if event ABI doesn't match)");
    }
  } catch (e) {
    console.warn("⚠️  Failed to parse logs:", e.message);
  }

  // خلاصه
  console.log("\n" + "=".repeat(60));
  console.log("✅ DIAGNOSIS COMPLETE");
  console.log("=".repeat(60));
  console.log("Summary:");
  console.log("  ✅ staticCall: PASSED");
  console.log("  ✅ estimateGas:", gasEstimate ? "PASSED" : "FAILED");
  console.log("  ✅ Transaction sent:", tx.hash);
  console.log("  ✅ Receipt status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
  console.log("\n💡 اگر این اسکریپت OK بود اما UI شما سبز نمی‌شود،");
  console.log("💡 مشکل در UI state management است نه contract/network.");
  console.log("=".repeat(60));
})();

