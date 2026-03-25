import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { StartupDetail, Founder, StartupList } from '$lib/types';
import { isUnknownKey, isFounder, checkIdValidity, createUnauthorizedMessage, createForbiddenMessage, roles } from '$lib/index';

const payloadParams = [
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
    'maturity',
    "name",
    "email",
    "founders"
];

const startupListKeywords = new Set([
    'name',
    'legal_status',
    'description',
    'address',
    'email',
    'phone',
    'sector',
    'maturity'
]);

const checkStartupUpdatePayload = (data: unknown): data is Partial<StartupDetail> => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(new Set(payloadParams), key)) return false;
    }
    const newFounders = d.founders;
    if (newFounders !== undefined) {
        if (typeof newFounders !== 'object' || !Array.isArray(newFounders)) return false;
        for (const founder of newFounders) {
            if (!isFounder(founder)) return false;
        }
    }
    return true;
}

const updateStartupList = async (id: number, data: Record<string, any>) => {
    let payload: Partial<StartupList> = {};
    for (const key of Object.keys(data)) {
        if (startupListKeywords.has(key)) {
            payload[key as keyof StartupList] = data[key];
        }
    }
    await prisma.startupList.update({
        where: { id },
        data: payload
    });
}

export const PUT: RequestHandler = async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        if (locals.user.role === 'founder') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.founder_id) {
                return createForbiddenMessage();
            }
            const founder = await prisma.founder.findUnique({
                where: { external_id: user.founder_id }
            });
            if (!founder || Number(founder.startup_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
    const id = params.id;
    try {
        await checkIdValidity("Startup", id, prisma.startupDetail);
    } catch (response) {
        return json(response);
    }
    const startupId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkStartupUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const { founders, ...startupData } = data as Record<string, any>;
    const updatedStartup = await prisma.startupDetail.update({
        where: { id: startupId },
        data: startupData
    });
    if (founders !== undefined) {
        await prisma.founder.deleteMany({
            where: { startup_id: startupId }
        });
        const foundersData: Founder[] = Array.isArray(founders) ? founders.map((f: any) => ({
            name: f.name,
            startup_id: startupId
        })) : [];
        if (foundersData.length > 0) {
            await prisma.founder.createMany({
                data: foundersData
            });
        }
    }
    await updateStartupList(startupId, data as Record<string, any>);
    return json({ message: 'Startup updated successfully', data: updatedStartup });
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        if (locals.user.role === 'founder') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.founder_id) {
                return createForbiddenMessage();
            }
            const founder = await prisma.founder.findUnique({
                where: { external_id: user.founder_id }
            });
            if (!founder || Number(founder.startup_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
	const id = params.id;

    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid startup ID' }), { status: 400 });
    }
    const startupId = Number(id);

    const existingStartup = await prisma.startupDetail.findUnique({
        where: { id: startupId }
    });
    if (!existingStartup) {
        return json({ error: 'Startup not found' }, { status: 404 });
    }
    await prisma.founder.deleteMany({
        where: { startup_id: startupId }
    });
    await prisma.startupDetail.delete({
        where: { id: startupId }
    });
    await prisma.startupList.delete({
        where: { id: startupId }
    });
	return json({ message: 'Startup deleted successfully' });
}