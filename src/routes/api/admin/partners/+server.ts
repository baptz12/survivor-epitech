import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Partner } from '$lib/types';
import { createForbiddenMessage, createUnauthorizedMessage, isUnknownKey, roles } from '$lib/index';

const optionalPayload = [
    'name',
    'legal_status',
    'address',
    'phone',
    'description',
    'partnership_type'
];

const mandatoryPayload = ['name', 'email'];

const allowedKeys = new Set([...mandatoryPayload, ...optionalPayload]);

const checkPartnerCreationPayload = (data: unknown): data is Partner => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(allowedKeys, key)) return false;
    }
    const { name, email } = d;
    if (typeof name !== 'string' || name.trim() === '') return false;
    if (typeof email !== 'string' || email.trim() === '') return false;
    return true;
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        return createForbiddenMessage();
    }
    let data: unknown;
    try {
        data = await request.json();
    } catch (err) {
        console.warn('POST /api/admin/partners: invalid JSON body', (err as Error).message);
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }
    if (!data) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const checkedData = checkPartnerCreationPayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const partnerData = data as Partner;
    const createdPartner = await prisma.partner.create({
        data: partnerData
    });
    if (!createdPartner) {
        return new Response(JSON.stringify({ error: 'Failed to create partner' }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};