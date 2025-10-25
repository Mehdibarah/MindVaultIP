import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Award, Calendar, User, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FOUNDER_ADDRESS = (import.meta.env.VITE_FOUNDER_ADDRESS || '').toLowerCase();

// Hook to check if current user is founder
function useIsFounder() {
  const [isFounder, setIsFounder] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);

  useEffect(() => {
    // Check if user has connected wallet and is founder
    const checkFounderStatus = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0].toLowerCase();
            setConnectedAddress(address);
            setIsFounder(address === FOUNDER_ADDRESS);
          }
        }
      } catch (error) {
        console.log('No wallet connected or error checking founder status');
      }
    };

    checkFounderStatus();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase();
          setConnectedAddress(address);
          setIsFounder(address === FOUNDER_ADDRESS);
        } else {
          setConnectedAddress(null);
          setIsFounder(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

  return { isFounder, connectedAddress };
}

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
    <a href={`/verify/${award.id}`} className="block p-4 border rounded hover:shadow">
      <h3 className="font-bold">{award.title}</h3>
      <p className="text-sm text-gray-400">{award.category}</p>
      <p className="text-xs mt-2">Recipient: {getRecipientDisplay()}</p>
      <p className="text-xs text-gray-500">{new Date(award.timestamp).toLocaleString()}</p>
    </a>
  );
}

export default function MultimindAwards() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isFounder, connectedAddress } = useIsFounder();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAwards = async () => {
    if (!supabase) {
      setAwards([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('awards')
        .select('id,title,category,recipient,recipient_name,recipient_email,timestamp,image_url,summary')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Failed to load awards', error);
        setAwards([]);
      } else {
        setAwards(data || []);
      }
    } catch (err) {
      console.error('Error fetching awards:', err);
      setAwards([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    async function loadAwards() {
      setLoading(true);
      await fetchAwards();
      setLoading(false);
    }

    loadAwards();
    return () => { mounted = false; };
  }, []);

  // Handle refresh from navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      // If we have new award data, add it immediately to the list
      if (location.state?.newAward) {
        console.log('🎉 Adding new award to list immediately:', location.state.newAward);
        setAwards(prev => [location.state.newAward, ...prev]);
        
        // Show success toast
        toast({
          title: "Award Added Successfully!",
          description: "Your new award has been added to the list.",
        });
        
        // Clear the refresh state
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        // Fallback: fetch from server
        setRefreshing(true);
        fetchAwards().finally(() => {
          setRefreshing(false);
          // Show success toast
          toast({
            title: "Award Added Successfully!",
            description: "Your new award has been added to the list.",
          });
          // Clear the refresh state
          navigate(location.pathname, { replace: true, state: {} });
        });
      }
    }
  }, [location.state, navigate, location.pathname, toast]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing && !loading) {
        fetchAwards();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refreshing, loading]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
                <Award className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Multimind Awards
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Recognizing excellence and innovation in the MindVaultIP community
                </p>
                {connectedAddress && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isFounder ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm text-gray-400">
                      {isFounder ? 'Founder Mode' : 'Viewer Mode'} • {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setRefreshing(true);
                  fetchAwards().finally(() => setRefreshing(false));
                }}
                disabled={refreshing}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {/* Only show New Award button for founder */}
              {isFounder && (
                <button 
                  onClick={() => navigate('/MultimindAwards/new')} 
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Award
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Recent Uploads Section */}
        {!loading && awards.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Awards</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                {refreshing && (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {awards.slice(0, 8).map(award => (
                <div key={award.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
                  <Link to={`/verify/${award.id}`} className="block">
                    {award.image_url ? (
                      <div className="relative">
                        <img 
                          src={award.image_url} 
                          alt={award.title} 
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Award className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{award.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{award.category || 'General'}</span>
                        <span>{new Date(award.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading awards...</p>
            </div>
          </div>
        ) : (
          <>
            {awards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Awards Yet</h3>
                <p className="text-gray-500 mb-6">
                  {isFounder ? 'Be the first to create a Multimind Award' : 'No awards have been created yet'}
                </p>
                {isFounder && (
                  <button 
                    onClick={() => navigate('/MultimindAwards/new')} 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Award
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* All Awards Section */}
                {awards.length > 8 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-6">All Awards</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {awards.map(a => (
                        <div key={a.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
                          <Link to={`/verify/${a.id}`} className="block">
                            {a.image_url ? (
                              <div className="relative">
                                <img 
                                  src={a.image_url} 
                                  alt={a.title} 
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                              </div>
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                <Award className="w-16 h-16 text-gray-600" />
                              </div>
                            )}
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
                              {a.summary && (
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{a.summary}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                {a.category && (
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                                    {a.category}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(a.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <User className="w-4 h-4" />
                                <span>
                                  {a.recipient_name || (a.recipient ? `${String(a.recipient).slice(0,6)}...${String(a.recipient).slice(-4)}` : 'Unknown')}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
