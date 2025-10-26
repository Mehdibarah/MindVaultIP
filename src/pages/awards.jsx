import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import AwardForm from '@/components/AwardForm';

const FOUNDER = (import.meta.env.VITE_FOUNDER_ADDRESS || '').toLowerCase();

function AwardCard({ award }) {
  const getRecipientDisplay = () => {
    if (award.recipient_name) {
      return award.recipient_name;
    } else if (award.recipient) {
      return `${award.recipient.slice(0, 6)}...${award.recipient.slice(-4)}`;
    } else {
      return 'Unknown recipient';
    }
  };

  return (
    <Link to={`/verify/${award.id}`} className="block p-4 border rounded hover:shadow">
      <h3 className="font-bold">{award.title}</h3>
      <p className="text-sm text-gray-400">{award.category}</p>
      <p className="text-xs mt-2">Recipient: {getRecipientDisplay()}</p>
      <p className="text-xs text-gray-500">{new Date(award.timestamp).toLocaleString()}</p>
    </Link>
  );
}

export default function Awards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchAwards() {
      setLoading(true);
      if (!supabase) {
        setAwards([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('awards')
        .select('id,title,category,recipient,recipient_name,recipient_email,timestamp')
        .order('timestamp', { ascending: false });
      if (error) {
        console.error('Failed to load awards', error);
        setAwards([]);
      } else if (mounted) {
        setAwards(data || []);
      }
      setLoading(false);
    }

    fetchAwards();
    return () => { mounted = false; };
  }, []);

  // Removed client-side wallet gating: the new award action is available without a connected wallet.

  async function handleCreated(newAward) {
    // refresh list
    try {
      const { data } = await supabase.from('awards').select('*').order('created_at', { ascending: false });
      setAwards(data || []);
    } catch (err) {
      console.error('Failed to refresh awards', err);
    }
  }

  // New award creation is handled via a founder-only route (/founder/issue).
  // This page only lists awards and exposes the action link for the founder.

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Multimind Awards</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + New Award
        </button>
      </div>

      {loading ? (
        <div>Loading awards...</div>
      ) : (
        <>
          {awards.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No awards yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {awards.map(a => (
                <div key={a.id} className="bg-[#0f1724] rounded overflow-hidden border">
                  <Link to={`/verify/${a.id}`} className="block">
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-800 flex items-center justify-center">No image</div>
                    )}
                    <div className="p-3">
                      <h3 className="font-bold">{a.title}</h3>
                      <div className="text-sm text-gray-400">{a.category} • {a.year}</div>
                      <div className="text-xs mt-2">
                        Recipient: {a.recipient_name || (a.recipient ? `${String(a.recipient).slice(0,6)}...${String(a.recipient).slice(-4)}` : 'Unknown')}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <AwardForm onClose={() => setShowForm(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}