import { json } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/auth';
import prisma from '$lib/prisma';

export async function GET({ cookies }) {
	const token = cookies.get('auth_token');

	if (!token) {
		return json({ data: { user: null } });
	}

	const payload = verifyToken(token);

	if (!payload) {
		return json({ data: { user: null } });
	}

	// Optionally, you can re-fetch the user from the DB to ensure data is fresh
	const user = await prisma.user.findUnique({
		where: { id: payload.id },
		select: { id: true, email: true, firstName: true, lastName: true, role: true }
	});

	return json({ data: { user } });
}
