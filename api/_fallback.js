// Fallback handler for unmatched routes
// Returns 404 with proper CORS headers
export default function handler(req, res) {
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
  
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Return 404 for unmatched routes
  res.status(404).json({
    error: "Not Found",
    message: "The requested API endpoint does not exist",
    path: req.url,
    availableEndpoints: [
      "/api/health/ping",
      "/api/health/config",
      "/api/awards",
      "/api/awards/issue",
      "/api/awards/founder",
      "/api/upload"
    ]
  });
}

