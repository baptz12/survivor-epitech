import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Investor } from '$lib/types';
import { isUnknownKey, checkIdValidity, createForbiddenMessage, createUnauthorizedMessage, roles } from '$lib/index';

const payloadParams = [
    'name',
    'legal_status',
    'address',
    'email',
    'phone',
    'description',
    'investor_type',
    'investment_focus',
];

const checkInvestorUpdatePayload = (data: unknown): data is Partial<Investor> => {
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
        if  (locals.user.role === 'investor') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.investor_id) {
                return createForbiddenMessage();
            }
            const investor = await prisma.investor.findUnique({
                where: { external_id: user.investor_id }
            });
            if (!investor || Number(investor.external_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
    const id = params.id;

    try {
        await checkIdValidity("Investors", id, prisma.investor);
    } catch (response) {
        return json(response);
    }
    const investorId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkInvestorUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const investorData = data as Record<string, any>;
    const updatedInvestor = await prisma.investor.update({
        where: { id: investorId },
        data: investorData
    });
    return json({ message: 'Investor updated successfully', data: updatedInvestor });
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        if  (locals.user.role === 'investor') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.investor_id) {
                return createForbiddenMessage();
            }
            const investor = await prisma.investor.findUnique({
                where: { external_id: user.investor_id }
            });
            if (!investor || Number(investor.external_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
    const id = params.id;

    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid investor ID' }), { status: 400 });
    }
    const investorId = Number(id);

    const existingInvestor = await prisma.investor.findUnique({
        where: { id: investorId }
    });
    if (!existingInvestor) {
        return json({ error: 'Investor not found' }, { status: 404 });
    }
    await prisma.investor.delete({
        where: { id: investorId }
    });
    return json({ message: 'Investor deleted successfully' });
};