// Environment validation utility for backend
export const ENV = {
  FOUNDER_ADDRESS: (process.env.FOUNDER_ADDRESS || "").toLowerCase().trim(),
  MAX_UPLOAD_BYTES: (Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024),
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || process.env.VITE_SUPABASE_BUCKET || 'awards'
};

export function assertEnv() {
  const errors = [];
  
  if (!ENV.FOUNDER_ADDRESS) {
    errors.push("FOUNDER_ADDRESS missing");
  }
  
  if (!ENV.SUPABASE_URL) {
    errors.push("SUPABASE_URL missing");
  }
  
  if (!ENV.SUPABASE_SERVICE_KEY) {
    errors.push("SUPABASE_SERVICE_KEY missing");
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
}

export function logEnvStatus() {
  const founderDisplay = ENV.FOUNDER_ADDRESS 
    ? `${ENV.FOUNDER_ADDRESS.slice(0, 6)}...${ENV.FOUNDER_ADDRESS.slice(-4)}`
    : 'NOT SET';
    
  console.log('🔧 Environment Status:');
  console.log(`  FOUNDER_ADDRESS: ${founderDisplay}`);
  console.log(`  MAX_UPLOAD_BYTES: ${ENV.MAX_UPLOAD_BYTES}`);
  console.log(`  SUPABASE_URL: ${ENV.SUPABASE_URL ? 'SET' : 'MISSING'}`);
  console.log(`  SUPABASE_SERVICE_KEY: ${ENV.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING'}`);
  console.log(`  SUPABASE_BUCKET: ${ENV.SUPABASE_BUCKET}`);
}
