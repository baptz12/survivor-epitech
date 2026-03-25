import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { createForbiddenMessage, createUnauthorizedMessage, roles } from '$lib';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user || locals.user.role === undefined) {
		return createUnauthorizedMessage();
	}
	if (roles.includes(locals.user.role)) {
		return createForbiddenMessage();
	}
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			name: true,
			role: true
		}
	});

	return json({ data: users });
};
