// Simple ping endpoint
export const runtime = 'nodejs';

export default async function handler(req, res) {
  // Set CORS headers
  const allowed = new Set([
    "https://www.mindvaultip.com",
    "https://mindvaultip.com", 
    "http://localhost:5173",
    "http://localhost:3000"
  ]);
  
  const origin = req.headers.origin || "";
  if (allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    ok: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}