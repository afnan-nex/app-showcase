/**
 * DevBench - Network & API Tools Engine
 * URL Parser & Query Inspector, and HTTP Request Builder / Simulator.
 */

// --- 1. URL Parser & Query Inspector ---
export function parseURL(urlStr) {
  if (!urlStr || !urlStr.trim()) {
    return { isValid: false, error: 'URL string is empty' };
  }

  let formattedUrl = urlStr.trim();
  if (!/^https?:\/\//i.test(formattedUrl) && !/^wss?:\/\//i.test(formattedUrl) && !/^file:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const parsed = new URL(formattedUrl);
    const searchParams = [];
    parsed.searchParams.forEach((val, key) => {
      searchParams.push({ key, value: val });
    });

    return {
      isValid: true,
      href: parsed.href,
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : (parsed.protocol === 'http:' ? '80' : '')),
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
      username: parsed.username,
      password: parsed.password,
      searchParams
    };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL: ' + err.message };
  }
}

export function rebuildURL(parsedData, queryParams = []) {
  try {
    let base = `${parsedData.protocol}//${parsedData.hostname}${parsedData.port && !['80', '443'].includes(parsedData.port) ? ':' + parsedData.port : ''}${parsedData.pathname || '/'}`;
    if (queryParams.length > 0) {
      const sp = new URLSearchParams();
      queryParams.forEach(p => {
        if (p.key.trim()) sp.append(p.key.trim(), p.value);
      });
      const qs = sp.toString();
      if (qs) base += '?' + qs;
    }
    if (parsedData.hash) {
      base += (parsedData.hash.startsWith('#') ? '' : '#') + parsedData.hash;
    }
    return base;
  } catch (e) {
    return parsedData.href || '';
  }
}

// --- 2. HTTP Request Builder & Simulator ---
export async function executeHTTPRequest({
  method = 'GET',
  url = '',
  headers = {},
  body = '',
  isSimulated = false,
  mockStatus = 200,
  mockLatency = 150
}) {
  if (!url) {
    return { success: false, error: 'Request URL cannot be empty' };
  }

  const startTime = performance.now();

  // Simulated Offline Mode
  if (isSimulated) {
    await new Promise(r => setTimeout(r, mockLatency));
    const duration = Math.round(performance.now() - startTime);
    const mockResponses = {
      200: { status: 200, statusText: 'OK', body: JSON.stringify({ message: 'Simulated 200 OK Response', method, url, timestamp: new Date().toISOString() }, null, 2) },
      201: { status: 201, statusText: 'Created', body: JSON.stringify({ message: 'Simulated 201 Resource Created', id: 'res_' + Math.random().toString(36).substr(2, 6) }, null, 2) },
      400: { status: 400, statusText: 'Bad Request', body: JSON.stringify({ error: 'Bad Request', detail: 'Invalid parameters in simulated request' }, null, 2) },
      404: { status: 404, statusText: 'Not Found', body: JSON.stringify({ error: 'Not Found', detail: `Endpoint ${url} was not found` }, null, 2) },
      500: { status: 500, statusText: 'Internal Server Error', body: JSON.stringify({ error: 'Internal Server Error', detail: 'Simulated server fault' }, null, 2) }
    };

    const resp = mockResponses[mockStatus] || mockResponses[200];
    return {
      success: true,
      status: resp.status,
      statusText: resp.statusText,
      headers: { 'content-type': 'application/json; charset=utf-8', 'x-simulated-by': 'DevBench' },
      body: resp.body,
      duration,
      isSimulated: true
    };
  }

  // Real HTTP Fetch
  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: new Headers(headers)
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && body) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const duration = Math.round(performance.now() - startTime);

    const respHeaders = {};
    response.headers.forEach((val, key) => {
      respHeaders[key] = val;
    });

    const textBody = await response.text();
    let formattedBody = textBody;
    try {
      formattedBody = JSON.stringify(JSON.parse(textBody), null, 2);
    } catch (e) {}

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
      body: formattedBody,
      duration,
      isSimulated: false
    };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return {
      success: false,
      error: `Network Error: ${err.message}. If this is a cross-origin request, the endpoint must support CORS (Access-Control-Allow-Origin). You can switch to "Simulated Mode" to test payloads offline.`,
      duration,
      isCorsError: true
    };
  }
}

export function generateCurlCommand({ method = 'GET', url = '', headers = {}, body = '' }) {
  let curl = `curl -X ${method.toUpperCase()} "${url}"`;
  Object.entries(headers).forEach(([k, v]) => {
    if (k && v) curl += ` \\\n  -H "${k}: ${v}"`;
  });
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
    const escaped = body.replace(/"/g, '\\"');
    curl += ` \\\n  -d "${escaped}"`;
  }
  return curl;
}
