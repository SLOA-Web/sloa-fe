export const runtime = 'edge';

function setCookieHeader(name: string, value: string, options: Record<string, string | number | boolean> = {}) {
	let cookie = `${name}=${encodeURIComponent(value)}`;
	if (options.HttpOnly) cookie += '; HttpOnly';
	if (options.Path) cookie += `; Path=${options.Path}`;
	if (options.SameSite) cookie += `; SameSite=${options.SameSite}`;
	if (options['Max-Age']) cookie += `; Max-Age=${options['Max-Age']}`;
	return cookie;
}

export default async function handler(req: Request) {
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: Record<string, unknown> = {};
	try {
		body = await req.json();
	} catch {}
	const { email, password } = body || {};
	if (!email || !password) {
		return new Response(JSON.stringify({ message: 'Email and password are required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	try {
		const backendRes = await fetch(`${backendBaseUrl}/api/v1/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
			credentials: 'include',
		});

		const data = await backendRes.json().catch(() => ({}));

		if (!backendRes.ok) {
			return new Response(JSON.stringify(data || { message: 'Login failed' }), {
				status: backendRes.status,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Try to find an access token in common response shapes
		const accessToken = data?.session?.access_token || data?.access_token || data?.token;

		const headers: HeadersInit = { 'Content-Type': 'application/json' };
		if (accessToken) {
			headers['Set-Cookie'] = setCookieHeader('auth_token', accessToken, {
				HttpOnly: true,
				Path: '/',
				SameSite: 'Strict',
				'Max-Age': 7 * 24 * 60 * 60,
			});
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers,
		});
	} catch {
		return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}