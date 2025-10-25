import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Upload, User, Award, Calendar, FileText, Shield } from 'lucide-react';
import { postForm } from '@/utils/api';
import HealthCheck from '@/components/HealthCheck';

const FOUNDER_ADDRESS = (import.meta.env.VITE_FOUNDER_ADDRESS || '').toLowerCase();

async function compressImage(file, {maxW=1600, maxH=1600, quality=0.8} = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject('Compression failed');
          const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
            type: 'image/jpeg',
          });
          resolve(compressed);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function NewAward() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    recipient: '',
    recipientName: '',
    recipientEmail: '',
    title: '',
    category: '',
    year: new Date().getFullYear().toString(),
    summary: ''
  });
  
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isFounder, setIsFounder] = useState(false);

  // Check if user is founder
  useEffect(() => {
    const checkFounderStatus = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0].toLowerCase();
            setConnectedAddress(address);
            const founderStatus = address === FOUNDER_ADDRESS;
            setIsFounder(founderStatus);
            
            if (!founderStatus) {
              toast({
                title: "Access Denied",
                description: "Only the founder can create awards.",
                variant: "destructive",
                duration: 4000
              });
              navigate('/multimindawards');
            }
          } else {
            // No wallet connected, redirect to awards page
            navigate('/multimindawards');
          }
        } else {
          // No ethereum provider, redirect to awards page
          navigate('/multimindawards');
        }
      } catch (error) {
        console.log('Error checking founder status:', error);
        navigate('/multimindawards');
      }
    };

    checkFounderStatus();
  }, [navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setCompressedFile(null);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(selectedFile);
        setCompressedFile(compressed);
      } catch (err) {
        console.warn('⚠️ فشرده‌سازی ناموفق:', err);
      }
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (!window?.ethereum) {
        toast({ title: 'Error', description: 'Wallet not available', duration: 4000 });
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setConnectedAddress(address);
      toast({ title: 'Wallet Connected', description: `Address: ${address}`, duration: 4000 });
    } catch (err) {
      toast({ title: 'Error', description: err.message, duration: 4000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let timeoutId;
    
    try {
      if (!formData.title.trim()) {
        toast({ title: 'Missing title', description: 'Please provide an award title', duration: 4000 });
        return;
      }
      if (!formData.recipient && !formData.recipientName) {
        toast({ title: 'Missing recipient', description: 'Please provide recipient info', duration: 4000 });
        return;
      }
      if (formData.recipient && !ethers.utils.isAddress(formData.recipient)) {
        toast({ title: 'Invalid address', description: 'Recipient address is invalid', duration: 4000 });
        return;
      }
      if (!file && !compressedFile) {
        toast({ title: 'Missing file', description: 'Please select an image file', duration: 4000 });
        return;
      }

      setLoading(true);
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.warn('⚠️ Award creation timeout - resetting loading state');
        setLoading(false);
      }, 60000); // 60 seconds timeout
      
      const id = `award_${Date.now()}`;
      const timestamp = new Date().toISOString();
      const message = JSON.stringify({ id, title: formData.title, category: formData.category, recipient: formData.recipient || '', timestamp });

      if (!window?.ethereum) throw new Error('Wallet not available');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Debug logging
      console.log('🔧 Debug Info:');
      console.log('  FOUNDER env var:', FOUNDER_ADDRESS);
      console.log('  FOUNDER length:', FOUNDER_ADDRESS.length);
      console.log('  Signer address:', signerAddress);
      console.log('  Signer address (lowercase):', signerAddress.toLowerCase());
      console.log('  Comparison result:', signerAddress.toLowerCase() === FOUNDER_ADDRESS);

      if (!FOUNDER_ADDRESS) {
        throw new Error('FOUNDER address not configured on server');
      }

      if (signerAddress.toLowerCase() !== FOUNDER_ADDRESS) {
        throw new Error(`Only founder wallet can create awards. Expected: ${FOUNDER_ADDRESS}, Got: ${signerAddress.toLowerCase()}. Please connect the correct wallet or contact support.`);
      }

      const signature = await signer.signMessage(message);
      const fileToUpload = compressedFile || file;

      const fd = new FormData();
      fd.append('walletAddress', signerAddress); // Always append wallet address
      fd.append('title', formData.title);
      fd.append('category', formData.category);
      fd.append('recipient', formData.recipient || '');
      fd.append('recipient_name', formData.recipientName || '');
      fd.append('recipient_email', formData.recipientEmail || '');
      fd.append('year', formData.year || '');
      fd.append('summary', formData.summary || '');
      fd.append('timestamp', timestamp);
      fd.append('signature', signature);
      fd.append('message', message); // Add the message for signature verification
      if (fileToUpload) fd.append('image', fileToUpload, fileToUpload.name); // Use 'image' key

      // Use the new API utility for safe FormData upload
      const result = await postForm('/api/awards/issue', fd);

      if (!result.ok && !result.success) throw new Error(result.error);
      
      console.log('✅ Award created successfully:', result);
      
      toast({ title: 'Award created', description: 'Multimind Award successfully created', duration: 4000 });
      
      // Navigate back to awards list with refresh flag
      navigate('/multimindawards', { 
        state: { 
          refresh: true
        } 
      });
      
    } catch (err) {
      console.error('createAward.error', { 
        scope: 'createAward', 
        status: err.message?.includes('HTTP') ? err.message.split(' ')[1] : 'unknown',
        message: err.message || String(err) 
      });
      toast({ 
        title: 'Error', 
        description: err.message || String(err),
        variant: "destructive",
        duration: 4000
      });
    } finally {
      // Clear timeout and reset loading state
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(false);
      console.log('🔄 Loading state reset to false - button should be enabled');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Health Check */}
      <HealthCheck />
      
      {/* Founder Status Indicator */}
      {isFounder && connectedAddress && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <h3 className="text-green-300 font-semibold">Founder Access Granted</h3>
              <p className="text-green-200 text-sm">
                Connected as: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-900/20 border-b border-yellow-500/30 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm">
                  <strong>Debug Info:</strong> FOUNDER address: <code className="bg-gray-800 px-2 py-1 rounded">{FOUNDER_ADDRESS || 'NOT SET'}</code>
                </p>
                <p className="text-yellow-400 text-sm mt-1">
                  <strong>Note:</strong> You must connect the wallet with this exact address to create awards.
                </p>
                {connectedAddress && (
                  <p className="text-yellow-400 text-sm mt-1">
                    <strong>Connected:</strong> <code className="bg-gray-800 px-2 py-1 rounded">{connectedAddress}</code>
                  </p>
                )}
              </div>
              <button
                onClick={checkWalletConnection}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded"
              >
                Check Wallet
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/multimindawards')}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Create New Award
                </h1>
                <p className="text-gray-300">Fill out the form to create a new Multimind Award</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Recipient Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Recipient Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Award Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Award Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Award Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter award title"
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Innovation, Research, Development"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2024"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Award Description</h2>
            </div>
            
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Describe the award, achievements, and recognition details..."
            />
          </div>

          {/* File Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Award Image (Optional)</h2>
            </div>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              
              {file && (
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{file.name}</div>
                      <div className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Founder Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-blue-300 font-semibold mb-1">Founder Access Required</h4>
                <p className="text-blue-200 text-sm">
                  Only the founder wallet can create awards. Make sure you're connected with the correct wallet address.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/multimindawards')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Award...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Create Award
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
