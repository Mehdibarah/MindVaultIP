
import { useEffect, useState, useRef } from "react";
import { useAccount, useBalance, useSwitchChain, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { base } from 'wagmi/chains'
import { useNavigate } from 'react-router-dom';

// ==========================================
// تنظیمات Base Network
// ==========================================
const BASE_CONFIG = {
  chainId: "0x2105",
  chainIdDecimal: 8453,
  chainName: "Base Mainnet",
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
};

// ==========================================
// کامپوننت اصلی
// ==========================================
export default function UnifiedWalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { data: balance } = useBalance({ address })
  const { switchChain } = useSwitchChain()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const navigate = useNavigate()
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // ==========================================
  // تبدیل Balance
  // ==========================================
  const formatBalance = (balance) => {
    if (!balance) return "0";
    try {
      return parseFloat(balance.formatted).toFixed(4);
    } catch {
      return "0";
    }
  };

  // ==========================================
  // تغییر به Base Network
  // ==========================================
  const switchToBase = async () => {
    try {
      await switchChain({ chainId: base.id });
      return true;
    } catch (err) {
      console.error("Error switching to Base:", err);
      return false;
    }
  };

  // ==========================================
  // اتصال با MetaMask
  // ==========================================
  const connectMetaMask = async () => {
    try {
      open();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  // ==========================================
  // قطع اتصال
  // ==========================================
  const disconnect = async () => {
    try {
      // Disconnect from wagmi
      await wagmiDisconnect();
      
      // Close the menu
      setShowMenu(false);
      
      // Redirect to landing page
      navigate('/');
      
      // Clear any local storage or session data if needed
      localStorage.removeItem('walletConnected');
      sessionStorage.clear();
      
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  // ==========================================
  // کپی آدرس
  // ==========================================
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert("✅ آدرس کپی شد!");
    }
  };

  // ==========================================
  // بستن منو با کلیک بیرون
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  // ==========================================
  // نمایش آدرس کوتاه
  // ==========================================
  const shortAddr = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : "";

  // ==========================================
  // UI - اگر متصل نیست
  // ==========================================
  if (!isConnected || !address) {
    return (
      <div className="relative flex flex-row gap-2 items-center">
        {/* دکمه MetaMask */}
        <button
          onClick={connectMetaMask}
          className="w-full md:w-auto group relative px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 40 40" fill="none">
              <path d="M32.9582 1L20 13.125L22.9167 6.875L32.9582 1Z" fill="white"/>
              <path d="M7.04176 1L19.8749 13.2083L17.0832 6.875L7.04176 1Z" fill="white"/>
              <path d="M28.2917 27.7917L25.0417 33.3333L32.3333 35.4167L34.5 28.0417L28.2917 27.7917Z" fill="white"/>
              <path d="M5.5 28.0417L7.66667 35.4167L15 33.3333L11.7083 27.7917L5.5 28.0417Z" fill="white"/>
            </svg>
            <span className="hidden sm:inline">Connect Wallet</span>
          </div>
        </button>
      </div>
    );
  }

  // ==========================================
  // UI - اگر متصل است
  // ==========================================
  const isWrongNetwork = chainId && chainId !== base.id;

  return (
    <div className="relative" ref={menuRef}>
      {/* هشدار شبکه اشتباه */}
      {isWrongNetwork && (
        <div className="mb-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <button
            onClick={switchToBase}
            className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ⚠️ Switch to Base Network
          </button>
        </div>
      )}

      {/* دکمه Wallet متصل */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <span className="font-mono text-sm">{shortAddr}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Connected with</span>
              <span className="text-xs font-semibold text-emerald-400 uppercase">
                Wallet
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-gray-800 rounded-lg">
                <code className="text-xs text-gray-300 break-all">{address}</code>
              </div>
              <button
                onClick={copyAddress}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy Address"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Balance & Network */}
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Balance</span>
              <span className="text-sm font-semibold text-white">{formatBalance(balance)} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Network</span>
              <span className={`text-sm font-semibold ${isWrongNetwork ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {chainId === base.id ? "Base Mainnet" : `Chain ${chainId}`}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-700" />

          {/* Actions */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  window.open(`${BASE_CONFIG.blockExplorer}/address/${address}`, "_blank");
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on BaseScan
              </button>
              
              <button
                onClick={disconnect}
                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect Wallet
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
