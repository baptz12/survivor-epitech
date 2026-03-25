import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Partner } from '$lib/types';
import { isUnknownKey, checkIdValidity, createUnauthorizedMessage, createForbiddenMessage, roles } from '$lib/index';

const payloadParams = [
    'name',
    'email',
    'legal_status',
    'address',
    'phone',
    'description',
    'partnership_type'
];

const checkPartnerUpdatePayload = (data: unknown): data is Partial<Partner> => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(new Set(payloadParams), key)) return false;
    }
    return true;
}

export const PUT: RequestHandler = async ({ request, params }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        return createForbiddenMessage();
    }
    const id = params.id;

    try {
        await checkIdValidity("Partners", id, prisma.partner);
    } catch (response) {
        return json(response);
    }
    const partnerId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkPartnerUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const partnerData = data as Record<string, any>;
    const updatedPartner = await prisma.partner.update({
        where: { id: partnerId },
        data: partnerData
    });
    return json({ message: 'Partner updated successfully', data: updatedPartner });
}

export const DELETE: RequestHandler = async ({ params }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        return createForbiddenMessage();
    }
    const id = params.id;

    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid partner ID' }), { status: 400 });
    }
    const partnerId = Number(id);

    const existingPartner = await prisma.partner.findUnique({
        where: { id: partnerId }
    });
    if (!existingPartner) {
        return json({ error: 'Partner not found' }, { status: 404 });
    }
    await prisma.partner.delete({
        where: { id: partnerId }
    });
    return json({ message: 'Partner deleted successfully' });
};