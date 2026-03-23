const API_BASE = 'https://min-api.cryptocompare.com/data';
const FUNCTION_BASE_PATH = '/.netlify/functions/cryptocompare';

const ALLOWED_ENDPOINTS = new Set([
  '/all/coinlist',
  '/pricemultifull',
  '/top/mktcapfull',
  '/v2/histominute',
  '/v2/histohour',
  '/v2/histoday',
]);

export async function handler(event) {
  try {
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing CRYPTOCOMPARE_API_KEY' }),
      };
    }

    const requestUrl = new URL(event.rawUrl || `http://localhost${event.path}`);
    const endpointPath =
      requestUrl.pathname.replace(FUNCTION_BASE_PATH, '') || '/';

    if (!endpointPath.startsWith('/') || !ALLOWED_ENDPOINTS.has(endpointPath)) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: `Endpoint not allowed: ${endpointPath}`,
        }),
      };
    }

    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    queryParams.set('api_key', apiKey);

    const upstreamResponse = await fetch(
      `${API_BASE}${endpointPath}?${queryParams.toString()}`
    );
    const body = await upstreamResponse.text();

    return {
      statusCode: upstreamResponse.status,
      headers: {
        'content-type':
          upstreamResponse.headers.get('content-type') || 'application/json',
        'cache-control': 'public, max-age=15, s-maxage=30',
      },
      body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Unknown function error',
      }),
    };
  }
}
