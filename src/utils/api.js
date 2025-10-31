// src/utils/api.js
export const API_BASE = import.meta.env.VITE_API_URL || "";

export async function postForm(path, formData) {
  // In development mode, this function is not used
  // since we handle uploads directly in components
  throw new Error('postForm is not supported in development mode. Use direct Supabase upload instead.');
}

export async function postJson(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "omit",
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: HTTP ${res.status} ${text}`);
  }
  
  return res.json();
}

export async function get(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: HTTP ${res.status} ${text}`);
  }
  
  return res.json();
}

// Awards functions
export async function fetchAwards() {
  try {
    // In development mode, fetch directly from Supabase
    // since API endpoints don't work with Vite
    const { supabase } = await import('@/lib/supabaseClient');
    
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('awards')
      .select('id,title,category,recipient,recipient_name,recipient_email,timestamp,image_url,summary')
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch awards: ${error.message}`);
    }

    console.log('📋 Fetched awards from Supabase:', data?.length || 0);
    return { ok: true, awards: data || [] };
  } catch (error) {
    console.error('awards.fetch.error', { scope: 'fetchAwards', error: error.message });
    throw error;
  }
}

export async function deleteAward(awardId, walletAddress) {
  try {
    // In development mode, delete from localStorage
    // since we're using localStorage instead of Supabase
    console.log('🗑️ Deleting award from localStorage:', awardId);
    
    // Get current awards from localStorage
    const storedAwards = JSON.parse(localStorage.getItem('awards') || '[]');
    
    // Filter out the award to delete
    const updatedAwards = storedAwards.filter(award => award.id !== awardId);
    
    // Update localStorage
    localStorage.setItem('awards', JSON.stringify(updatedAwards));
    
    console.log('✅ Award deleted from localStorage:', awardId);
    return { ok: true, success: true };
  } catch (error) {
    console.error('awards.delete.error', { scope: 'deleteAward', error: error.message });
    throw error;
  }
}

// Health check functions
export async function checkHealth() {
  try {
    // In development mode, return a mock health check
    // since API endpoints don't work with Vite
    return { 
      healthy: true, 
      config: {
        founderConfigured: true,
        maxUploadMB: 10,
        supabaseConfigured: true
      },
      ping: { status: 'ok' }
    };
  } catch (error) {
    console.error('health.check.error', { scope: 'healthCheck', error: error.message });
    return { healthy: false, error: error.message };
  }
}
