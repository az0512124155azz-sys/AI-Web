export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let targetUrl = '';

    if (req.method === 'GET') {
      targetUrl = (req.query?.url as string) || '';
    } else if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          // keep as string
        }
      }
      targetUrl = body?.url || (typeof body === 'string' ? body : '');
    }

    if (!targetUrl || typeof targetUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ success: false, error: 'Only HTTP and HTTPS URLs are supported' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
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
    const truncatedHtml = html.length > 3_500_000 ? html.slice(0, 3_500_000) : html;

    return res.json({
      success: true,
      url: parsedUrl.toString(),
      html: truncatedHtml,
      status: response.status,
    });
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      return res.status(504).json({ success: false, error: 'Request timed out after 10 seconds' });
    }
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch target URL',
    });
  }
}
