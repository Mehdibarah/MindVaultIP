// src/utils/api.js
export const API_BASE = import.meta.env.VITE_API_URL || "";

export async function postForm(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,          // DO NOT set Content-Type manually
    mode: "cors",
    credentials: "omit",     // set to 'include' only if server uses cookies + CORS allows it
    redirect: "manual"       // avoid following 30x after multipart
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  
  return res.json();
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
    const result = await get('/api/awards');
    console.log('📋 Fetched awards from server:', result);
    return result;
  } catch (error) {
    console.error('awards.fetch.error', { scope: 'fetchAwards', error: error.message });
    throw error;
  }
}

export async function deleteAward(awardId, walletAddress) {
  try {
    const res = await fetch(`${API_BASE}/api/awards?id=${encodeURIComponent(awardId)}`, {
      method: "DELETE",
      headers: {
        "X-Wallet-Address": walletAddress,
      },
      mode: "cors",
      credentials: "omit",
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${text}`);
    }
    
    const result = await res.json();
    console.log('🗑️ Award deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('awards.delete.error', { scope: 'deleteAward', error: error.message });
    throw error;
  }
}

// Health check functions
export async function checkHealth() {
  try {
    const [config, ping] = await Promise.all([
      get('/api/health/config'),
      get('/api/health/ping')
    ]);
    return { config, ping, healthy: true };
  } catch (error) {
    console.error('health.check.error', { scope: 'healthCheck', error: error.message });
    return { healthy: false, error: error.message };
  }
}
