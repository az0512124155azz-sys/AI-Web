export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ success: false, error: 'Only HTTP and HTTPS URLs are supported' });
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
      error: error.message || 'Failed to fetch target URL',
    });
  }
}
