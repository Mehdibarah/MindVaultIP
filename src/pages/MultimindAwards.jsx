import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, Plus, Trash2, RefreshCw, Calendar, User, Eye, Crown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsFounder } from "@/hooks/useIsFounder";

export default function MultimindAwards() {
  const { toast } = useToast();
  const { isFounder, connectedAddress } = useIsFounder();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debug logging
  console.log('🔍 MultimindAwards Debug:');
  console.log('- isFounder:', isFounder);
  console.log('- connectedAddress:', connectedAddress);
  console.log('- awards.length:', awards.length);
  console.log('- loading:', loading);
  console.log('Fetched awards count =', awards.length, awards?.[0]);

  const handleDeleteAward = async (award) => {
    if (!isFounder) {
      toast({
        title: "Access Denied",
        description: "Only the founder can delete awards.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${award.title}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      
      // Try API first
      try {
        const response = await fetch(`/api/awards/${award.id}`, {
          method: 'DELETE',
          headers: {
            'x-wallet-address': connectedAddress,
          },
        });

        if (response.ok) {
          console.log('✅ Award deleted via API');
          await fetchAwards();
          toast({
            title: "Success",
            description: "Award deleted successfully!",
          });
          return;
        }
      } catch (apiError) {
        console.log('⚠️ API delete failed, trying localStorage:', apiError.message);
      }

      // Fallback to localStorage
      const storedAwards = JSON.parse(localStorage.getItem('awards') || '[]');
      const updatedAwards = storedAwards.filter(a => a.id !== award.id);
      localStorage.setItem('awards', JSON.stringify(updatedAwards));
      
      console.log('✅ Award deleted from localStorage');
      await fetchAwards();
      toast({
        title: "Success",
        description: "Award deleted successfully!",
      });
    } catch (error) {
      console.error('❌ Error deleting award:', error);
      toast({
        title: "Error",
        description: "Failed to delete award. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const fetchAwards = async () => {
    try {
      console.log('🔄 MultimindAwards: Fetching ALL awards for public access...');
      
      // Try API first
      try {
        const response = await fetch('/api/awards');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ MultimindAwards: Awards fetched from API:', data.count);
          console.log('🎯 MultimindAwards: Setting awards state with:', data.awards);
          
          // If API returns empty array, fallback to localStorage
          if (data.awards && data.awards.length > 0) {
            setAwards(data.awards);
            setLoading(false);
            setRefreshing(false);
            return;
          } else {
            console.log('⚠️ MultimindAwards: API returned empty array, falling back to localStorage');
          }
        } else {
          console.log('⚠️ MultimindAwards: API failed with status:', response.status);
        }
      } catch (apiError) {
        console.log('⚠️ MultimindAwards: API error:', apiError.message);
      }
      
      // Fallback to localStorage
      console.log('🔄 MultimindAwards: Falling back to localStorage...');
      const storedAwards = JSON.parse(localStorage.getItem('awards') || '[]');
      console.log('📦 MultimindAwards: Raw awards from localStorage:', storedAwards);
      console.log('📊 MultimindAwards: Number of awards:', storedAwards.length);
      
      // Sort by created_at (newest first)
      const sortedAwards = storedAwards.sort((a, b) => 
        new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp)
      );
      
      console.log('✅ MultimindAwards: Awards fetched from localStorage:', sortedAwards.length);
      console.log('🎯 MultimindAwards: Setting awards state with:', sortedAwards);
      setAwards(sortedAwards);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('❌ MultimindAwards: Error fetching awards:', err);
      setAwards([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAwards();
  };

  useEffect(() => {
    let mounted = true;

    async function loadAwards() {
      console.log('🚀 MultimindAwards: Component mounted - fetching awards for ALL users');
      console.log('🔍 MultimindAwards: isFounder:', isFounder, 'connectedAddress:', connectedAddress);
      await fetchAwards();
    }

    // Always load awards regardless of founder status
    if (mounted) {
      loadAwards();
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for storage changes (when awards are created in other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('🔄 MultimindAwards: Storage event detected:', e.key, e.newValue);
      if (e.key === 'awards') {
        console.log('🔄 MultimindAwards: localStorage changed, refreshing awards...');
        fetchAwards();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (same tab)
    const handleCustomStorageChange = () => {
      console.log('🔄 MultimindAwards: Custom storage event, refreshing awards...');
      fetchAwards();
    };

    window.addEventListener('awardsUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('awardsUpdated', handleCustomStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading awards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Multimind Awards</h1>
                  <p className="text-gray-400">Recognizing excellence across all domains</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{awards.length} awards</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {isFounder && (
                <Link
                  to="/multimindawards/new"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                >
                  <Plus className="w-4 h-4" />
                  New Award
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public Access Notice */}
        <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            <p className="text-green-400 text-sm">
              <strong>Public Access:</strong> All awards are visible to everyone. 
              {isFounder ? ' You can create and manage awards as the founder.' : ' Only the founder can create and manage awards.'}
            </p>
          </div>
        </div>


        {awards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Awards Yet</h3>
            <p className="text-gray-500 mb-6">
              {isFounder 
                ? "Create the first award to get started!" 
                : "The founder hasn't created any awards yet."}
            </p>
            {isFounder && (
              <Link
                to="/multimindawards/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
              >
                <Plus className="w-5 h-5" />
                Create First Award
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Debug Info */}
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Debug:</strong> Found {awards.length} awards. First award: {awards[0]?.title || 'No title'}
              </p>
            </div>
            
            {/* Awards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {awards.map((award) => {
                console.log('🎯 Rendering award:', award.title, award.id);
                return (
                <div
                  key={award.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <Link to={`/verify/${award.id}`} className="block">
                    {award.image_url ? (
                      <div className="relative">
                        <img
                          src={award.image_url}
                          alt={award.title}
                          className="w-full h-48 object-contain bg-gray-900 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Award className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{award.title}</h3>
                      {award.summary && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{award.summary}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        {award.category && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            {award.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(award.timestamp || award.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <User className="w-4 h-4" />
                        <span>
                          {award.recipient_name || (award.recipient ? `${String(award.recipient).slice(0, 6)}...${String(award.recipient).slice(-4)}` : 'Unknown')}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Founder Actions */}
                  {isFounder && (
                    <div className="p-4 border-t border-gray-700 bg-gray-800/30">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAward(award);
                        }}
                        disabled={deleting}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting ? 'Deleting...' : 'Delete Award'}
                      </button>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
