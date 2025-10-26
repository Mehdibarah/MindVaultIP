// لازم برای Vercel تا فانکشن روی Node اجرا بشه و به process.env دسترسی داشته باشه
export const runtime = 'nodejs';

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const founder = (
    process.env.FOUNDER_ADDRESS ??
    process.env.VITE_FOUNDER_ADDRESS ??
    ''
  ).trim().toLowerCase();

  res.status(200).json({ 
    founder,
    envKeys: {
      FOUNDER_ADDRESS: process.env.FOUNDER_ADDRESS ? 'SET' : 'MISSING',
      VITE_FOUNDER_ADDRESS: process.env.VITE_FOUNDER_ADDRESS ? 'SET' : 'MISSING'
    }
  });
}
