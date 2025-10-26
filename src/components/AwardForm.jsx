import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';

const FOUNDER = (import.meta.env.VITE_FOUNDER_ADDRESS || '').toLowerCase();

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

export default function AwardForm({ onClose, onCreated }) {
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleFileSelect(selectedFile) {
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
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (!title.trim()) {
        toast({ title: 'Missing title', description: 'Please provide an award title' });
        return;
      }
      if (!recipient && !recipientName) {
        toast({ title: 'Missing recipient', description: 'Please provide recipient info' });
        return;
      }
      if (recipient && !ethers.utils.isAddress(recipient)) {
        toast({ title: 'Invalid address', description: 'Recipient address is invalid' });
        return;
      }

      setLoading(true);
      const id = `award_${Date.now()}`;
      const timestamp = new Date().toISOString();
      const message = JSON.stringify({ id, title, category, recipient: recipient || '', timestamp });

      if (!window?.ethereum) throw new Error('Wallet not available');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      if (signerAddress.toLowerCase() !== FOUNDER)
        throw new Error('Only founder wallet can create awards');

      const signature = await signer.signMessage(message);
      const fileToUpload = compressedFile || file;

      const fd = new FormData();
      fd.append('id', id);
      fd.append('title', title);
      fd.append('category', category);
      fd.append('recipient', recipient || '');
      fd.append('recipient_name', recipientName || '');
      fd.append('recipient_email', recipientEmail || '');
      fd.append('year', year || '');
      fd.append('summary', summary || '');
      fd.append('timestamp', timestamp);
      fd.append('signature', signature);
      if (fileToUpload) fd.append('file', fileToUpload, fileToUpload.name);

      const resp = await fetch('/api/awards/issue', { method: 'POST', body: fd });
      const result = await resp.json();

      if (!resp.ok || (!result.ok && !result.success)) throw new Error(result.error);
      toast({ title: 'Award created', description: 'Multimind Award successfully created' });
      onCreated && onCreated(result.award || null);
      onClose && onClose();
    } catch (err) {
      console.error('Award create failed', err);
      toast({ title: 'Error', description: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#0f1724] p-6 rounded max-w-xl w-full">
        {/* Header with Save button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">New Multimind Award</h3>
          <button type="submit" form="awardForm" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <form id="awardForm" onSubmit={handleSave} className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Recipient Information</label>
            <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Recipient wallet address" value={recipient} onChange={e => setRecipient(e.target.value)} />
            <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Recipient name" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
            <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Recipient email" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
          </div>

          <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input className="w-full p-2 bg-[#0b1220] border border-gray-600 text-white rounded" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
          
          <textarea
            name="summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={6}
            className="w-full h-48 p-3 bg-[#0b1220] border border-gray-600 text-white rounded-md overflow-y-auto overscroll-contain resize-none focus:outline-none"
            placeholder="Write the award summary here…"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Award Image (optional)</label>
            <input type="file" accept="image/*" onChange={e => handleFileSelect(e.target.files?.[0] || null)} className="text-white" />
            {file && (
              <div className="mt-2 p-3 bg-gray-800 rounded text-sm">
                <div className="text-gray-300">📁 {file.name}</div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-3">
            <button type="button" onClick={() => onClose && onClose()} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}