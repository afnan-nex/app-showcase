/**
 * DevBench - Network & API Tools Engine
 * URL Parser & Live Query Inspector, and HTTP Request Builder / Simulator with code generators.
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
    return { isValid: false, error: 'Invalid URL format: ' + err.message };
  }
}

export function rebuildURL(parsedData, queryParams = []) {
  try {
    const portPart = parsedData.port && !['80', '443', ''].includes(String(parsedData.port)) ? ':' + parsedData.port : '';
    let base = `${parsedData.protocol}//${parsedData.hostname}${portPart}${parsedData.pathname || '/'}`;
    if (queryParams.length > 0) {
      const sp = new URLSearchParams();
      queryParams.forEach(p => {
        if (p && p.key && p.key.trim()) sp.append(p.key.trim(), p.value || '');
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
  mockLatency = 120
}) {
  if (!url || !url.trim()) {
    return { success: false, error: 'Request URL cannot be empty' };
  }

  const startTime = performance.now();

  // Simulated Offline Mode
  if (isSimulated) {
    await new Promise(r => setTimeout(r, Math.max(30, mockLatency)));
    const duration = Math.round(performance.now() - startTime);

    const mockResponses = {
      200: {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json; charset=utf-8', 'x-simulated-by': 'DevBench Workstation', 'x-ratelimit-remaining': '4980' },
        body: JSON.stringify({
          status: 'success',
          statusCode: 200,
          method: method.toUpperCase(),
          endpoint: url,
          timestamp: new Date().toISOString(),
          data: {
            serviceId: 'srv_auth_prod_01',
            healthy: true,
            cluster: 'us-west-2a',
            metrics: { activeConnections: 1420, p99LatencyMs: 14.8 }
          }
        }, null, 2)
      },
      201: {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json; charset=utf-8', 'location': `${url}/res_${Date.now()}` },
        body: JSON.stringify({
          status: 'created',
          id: 'res_' + Math.random().toString(36).substr(2, 9),
          acknowledged: true,
          createdAt: new Date().toISOString()
        }, null, 2)
      },
      204: {
        status: 204,
        statusText: 'No Content',
        headers: { 'x-action': 'deleted' },
        body: ''
      },
      400: {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'BAD_REQUEST',
          message: 'The server could not understand the request due to invalid syntax or missing required fields.',
          timestamp: new Date().toISOString()
        }, null, 2)
      },
      401: {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'www-authenticate': 'Bearer realm="api.enterprise.dev"' },
        body: JSON.stringify({
          error: 'UNAUTHORIZED',
          message: 'Missing or expired Bearer token authorization header.'
        }, null, 2)
      },
      404: {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'NOT_FOUND',
          message: `Resource endpoint '${url}' was not found on this server.`
        }, null, 2)
      },
      500: {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          error: 'INTERNAL_SERVER_FAULT',
          message: 'An unexpected fault occurred during request handling.',
          traceId: 'trc_' + Math.random().toString(36).substr(2, 10)
        }, null, 2)
      }
    };

    const resp = mockResponses[mockStatus] || mockResponses[200];
    return {
      success: true,
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
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

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
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
      error: `Network Error: ${err.message}. If this request is calling an external domain, the remote endpoint must include the header 'Access-Control-Allow-Origin: *'. You can check 'Offline Simulated Mock Mode' above to test simulated responses.`,
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

export function generateFetchSnippet({ method = 'GET', url = '', headers = {}, body = '' }) {
  const options = {
    method: method.toUpperCase(),
    headers: headers
  };
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
    try {
      options.body = JSON.parse(body);
    } catch (e) {
      options.body = body;
    }
  }

  return `const response = await fetch("${url}", ${JSON.stringify(options, null, 2)});
const data = await response.json();
console.log(data);`;
}
