/**
 * Proxy API: reenvía /api/* a app.inxora.com
 * Evita CORS (el cliente llama a mismo origen).
 */
const BACKEND_URL = process.env.API_BACKEND_URL || 'https://app.inxora.com';

export default async function handler(req, res) {
  const pathSegments = Array.isArray(req.query.path) ? req.query.path : (req.query.path ? [req.query.path] : []);
  const pathStr = pathSegments.filter(Boolean).join('/');
  const qs = { ...req.query };
  delete qs.path;
  const queryString = Object.keys(qs).length ? '?' + new URLSearchParams(qs).toString() : '';
  const url = `${BACKEND_URL.replace(/\/$/, '')}/api/${pathStr}${pathStr ? '/' : ''}${queryString}`;

  const headers = {};
  ['content-type', 'authorization'].forEach((h) => {
    const v = req.headers[h];
    if (v && typeof v === 'string') headers[h] = v;
  });

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method || '') && req.body
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await backendRes.text();
    res.setHeader('Content-Type', backendRes.headers.get('Content-Type') || 'application/json');
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error('[API Proxy] Error:', err);
    res.status(502).json({ error: 'Proxy request failed', message: String(err) });
  }
}
