import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function POST({ request }) {
	const { email } = await request.json();

	if (!email || typeof email !== 'string') {
		return json({ error: { message: 'Email is required' } }, { status: 400 });
	}

	const user = await prisma.user.findUnique({
		where: { email: email.toLowerCase() }
	});

	if (!user) {
		return json({ data: { status: 'NOT_FOUND' } }, { status: 404 });
	}

	// User exists and has a password set
	if (user.password) {
		return json({ data: { status: 'ACTIVATED' } });
	}

	// User exists but has no password (needs to activate)
	return json({ data: { status: 'NEEDS_ACTIVATION' } });
}
