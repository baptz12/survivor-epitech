import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Founder, StartupList, StartupDetail } from '$lib/types';
import { isUnknownKey, isFounder, checkIdValidity, createUnauthorizedMessage, createForbiddenMessage, roles } from '$lib/index';

const optionalPayload = [
    'legal_status',
    'description',
    'address',
    'phone',
    'created_at',
    'website_url',
    'social_media_url',
    'project_status',
    'needs',
    'sector',
    'maturity'
];

const mandatoryPayload = ['name', 'email', 'founders'];

const allowedKeys = new Set([...mandatoryPayload, ...optionalPayload]);

const checkStartupCreationPayload = (data: unknown): data is StartupDetail => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(allowedKeys, key)) return false;
    }
    const { name, email, founders } = d;
    if (typeof name !== 'string' || name.trim() === '') return false;
    if (typeof email !== 'string' || email.trim() === '') return false;
    if (typeof founders !== 'object' || !Array.isArray(founders) || founders.length === 0) return false;
    for (const founder of founders) {
        if (!isFounder(founder)) return false;
    }
    return true;
}

const createStartupList = async (data: Omit<StartupDetail, 'founders'>) => {
    const { name, legal_status, description, address, email, phone, sector, maturity } = data;
    const payload: StartupList = {
        name,
        legal_status,
        address,
        email,
        phone,
        sector,
        maturity,
        description
    }
    const response = await prisma.startupList.create({ data: payload });
    return response;
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
        console.warn('POST /api/admin/startups: invalid JSON body', (err as Error).message);
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }
    if (!data) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const checkedData = checkStartupCreationPayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const { founders, ...startupData } = data as Record<string, unknown>;
    const createdStartup = await prisma.startupDetail.create({
        data: startupData as Omit<StartupDetail, 'founders'>
    });
    if (!createdStartup) {
        return new Response(JSON.stringify({ error: 'Failed to create startup' }), { status: 500 });
    }
    const foundersData: Founder[] = Array.isArray(founders) ? founders.map((f: any) => ({
        name: f.name,
        startup_id: createdStartup.id
    })) : [];
    if (foundersData.length > 0) {
        await prisma.founder.createMany({
            data: foundersData
        });
    }
    const startupList = await createStartupList(createdStartup);
    if (!startupList) {
        return new Response(JSON.stringify({ error: 'Failed to create startup list entry' }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};