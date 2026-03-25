import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { User } from '$lib/types';
import { isUnknownKey, checkIdValidity, createForbiddenMessage, roles } from '$lib/index';
import { createUnauthorizedMessage } from '$lib';

const payloadParams = [
    'name',
    'email',
    'role',
    'founder_id',
    'investor_id',
];

const checkUserUpdatePayload = (data: unknown): data is Partial<User> => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(new Set(payloadParams), key)) return false;
    }
    return true;
}

export const PUT: RequestHandler = async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        return createForbiddenMessage();
    }
    const id = params.id;

    try {
        await checkIdValidity("Users", id, prisma.user);
    } catch (response) {
        return json(response);
    }
    const userId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkUserUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const userData = data as Record<string, any>;
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData
    });
    return json({ message: 'User updated successfully', data: updatedUser });
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        return createForbiddenMessage();
    }
    const id = params.id;

    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
    }
    const userId = Number(id);

    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!existingUser) {
        return json({ error: 'User not found' }, { status: 404 });
    }
    await prisma.user.delete({
        where: { id: userId }
    });
    return json({ message: 'User deleted successfully' });
};