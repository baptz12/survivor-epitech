import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { createForbiddenMessage, createUnauthorizedMessage, roles } from '$lib';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user || locals.user.role === undefined) {
		return createUnauthorizedMessage();
	}
	if (roles.includes(locals.user.role)) {
		if (locals.user.id !== Number(params.id)) {
			return createForbiddenMessage();
		}
	}
	const id = params.id;
	if (!id || isNaN(Number(id))) {
		return json({ error: { message: 'A valid user ID is required' } }, { status: 400 });
	}

	const user = await prisma.user.findUnique({
		where: { external_id: Number(id) },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			founder_id: true,
			investor_id: true,
		}
	});

	if (user) {
		return json({ data: user });
	}

	return json({ error: { message: 'User not found' } }, { status: 404 });
};
