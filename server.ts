import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // API Route: Fetch website HTML for heuristic analysis
  app.post('/api/fetch-url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ success: false, error: 'URL is required' });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid URL format' });
      }

      // Security check: only allow http & https
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({ success: false, error: 'Only HTTP and HTTPS URLs are supported' });
      }

      // Prevent SSRF to local IP addresses
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.endsWith('.internal') ||
        hostname.endsWith('.local')
      ) {
        return res.status(400).json({ success: false, error: 'Local/private addresses cannot be scanned' });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `Website returned status code ${response.status} (${response.statusText})`,
        });
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
        // Still attempt to read text if it might be HTML
      }

      // Read text up to 3MB
      const html = await response.text();
      const truncatedHtml = html.length > 3_000_000 ? html.slice(0, 3_000_000) : html;

      return res.json({
        success: true,
        url: parsedUrl.toString(),
        html: truncatedHtml,
        status: response.status,
      });
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        return res.status(504).json({ success: false, error: 'Request timed out after 9 seconds' });
      }
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch the target URL',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Development: Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
