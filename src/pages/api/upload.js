// Deprecated upload endpoint — uploads are handled by /api/awards/issue (server-side).
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(410).json({ error: 'Deprecated endpoint. Use /api/awards/issue instead.' });
}