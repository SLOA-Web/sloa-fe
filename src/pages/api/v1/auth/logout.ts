export const runtime = 'edge';

function parseCookies(cookieHeader: string | null | undefined): Record<string, string> {
	const cookies: Record<string, string> = {};
	if (!cookieHeader) return cookies;
	cookieHeader.split(';').forEach(cookie => {
		const [name, ...rest] = cookie.trim().split('=');
		cookies[name] = decodeURIComponent(rest.join('='));
	});
	return cookies;
}

function setCookieHeader(name: string, value: string, options: Record<string, string | number | boolean> = {}) {
	let cookie = `${name}=${encodeURIComponent(value)}`;
	if (options.HttpOnly) cookie += '; HttpOnly';
	if (options.Path) cookie += `; Path=${options.Path}`;
	if (options.SameSite) cookie += `; SameSite=${options.SameSite}`;
	if (options['Max-Age'] !== undefined) cookie += `; Max-Age=${options['Max-Age']}`;
	return cookie;
}

export default async function handler(req: Request) {
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const cookieHeader = req.headers.get('cookie');
	const cookies = parseCookies(cookieHeader);
	const token = cookies['auth_token'];
	const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	try {
		if (token) {
			await fetch(`${backendBaseUrl}/api/v1/auth/logout`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				credentials: 'include',
			});
		}
	} catch {
		// Ignore backend logout errors; proceed to clear cookie
	}

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		'Set-Cookie': setCookieHeader('auth_token', '', {
			HttpOnly: true,
			Path: '/',
			SameSite: 'Strict',
			'Max-Age': 0,
		}),
	};
	return new Response(JSON.stringify({ message: 'Logged out' }), {
		status: 200,
		headers,
	});
}