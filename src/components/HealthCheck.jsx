import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { checkHealth } from '@/utils/api';

export default function HealthCheck() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        // Check health and get founder config from environment
        const healthResult = await checkHealth().catch(() => ({ healthy: false, error: 'Health check failed' }));
        const founderAddr = (import.meta.env.VITE_FOUNDER_ADDRESS || '').toLowerCase().trim();
        
        setHealth({
          ...healthResult,
          founderConfigured: !!founderAddr,
          founderAddress: founderAddr
        });
      } catch (error) {
        setHealth({ healthy: false, error: error.message });
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-300">Checking system health...</span>
        </div>
      </div>
    );
  }

  if (!health?.healthy) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-red-300 font-semibold">System Health Check Failed</h3>
            <p className="text-red-200 text-sm">{health?.error || 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { config } = health;

  if (!health?.founderConfigured) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-yellow-300 font-semibold">Founder Not Configured</h3>
            <p className="text-yellow-200 text-sm">
              The founder address is not configured on the server. Award creation will be disabled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <div>
          <h3 className="text-green-300 font-semibold">System Healthy</h3>
          <p className="text-green-200 text-sm">
            Max upload: {config?.maxUploadMB}MB • Supabase: {config?.supabaseConfigured ? 'Connected' : 'Not configured'}
          </p>
        </div>
      </div>
    </div>
  );
}
