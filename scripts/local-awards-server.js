import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.LOCAL_AWARDS_PORT || 3001;

// Import the handler
import handler from '../services/awards/issue.js';

app.use((req, res, next) => {
  // Disable any body parsing (let formidable handle multipart)
  res.setHeader('X-Local-Awards-Server', '1');
  next();
});

app.options('/api/awards/issue', (req, res) => {
  // Delegate to handler for OPTIONS (the handler handles CORS/OPTIONS)
  return handler(req, res);
});

app.all('/api/awards/issue', (req, res) => {
  // Call the serverless handler and catch promise rejections
  try {
    const result = handler(req, res);
    if (result && typeof result.then === 'function') {
      result.catch((err) => {
        console.error('Handler promise rejected:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: err?.message || 'Upload failed' });
        }
      });
    }
  } catch (err) {
    console.error('Handler threw:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message || 'Upload failed' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Local awards server listening on http://localhost:${PORT}/api/awards/issue`);
});
