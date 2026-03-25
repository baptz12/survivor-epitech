import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { createForbiddenMessage, createUnauthorizedMessage, roles } from '$lib';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user || locals.user.role === undefined) {
		return createUnauthorizedMessage();
	}
	if (roles.includes(locals.user.role)) {
		return createForbiddenMessage();
	}
	const email = params.email;
	if (!email) {
		return json({ error: { message: 'An email is required' } }, { status: 400 });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (typeof email !== 'string' || !emailRegex.test(email)) {
		return json({ error: { message: 'Invalid email format' } }, { status: 400 });
	}

	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			name: true,
			role: true
		}
	});

	if (user) {
		return json({ data: user });
	}

	return json({ error: { message: 'User not found' } }, { status: 404 });
};
