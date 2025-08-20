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

export default async function handler(req: Request) {
	if (req.method !== 'GET') {
		return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const cookieHeader = req.headers.get('cookie');
	const cookies = parseCookies(cookieHeader);
	const token = cookies['auth_token'];
	if (!token) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	try {
		const backendRes = await fetch(`${backendBaseUrl}/api/v1/auth/me`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` },
			credentials: 'include',
		});
		if (!backendRes.ok) {
			const errorData = await backendRes.json().catch(() => ({ message: 'Unauthorized' }));
			return new Response(JSON.stringify(errorData), {
				status: backendRes.status,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		const data = await backendRes.json();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

