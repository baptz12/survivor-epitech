import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Event } from '$lib/types';
import { createForbiddenMessage, createUnauthorizedMessage, isUnknownKey, roles } from '$lib/index';

const optionalPayload = [
    'dates',
    'location',
    'description',
    'event_type',
    'target_audience',
];

const mandatoryPayload = ['name'];

const allowedKeys = new Set([...mandatoryPayload, ...optionalPayload]);

const checkEventCreationPayload = (data: unknown): data is Event => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(allowedKeys, key)) return false;
    }
    const { name } = d;
    if (typeof name !== 'string' || name.trim() === '') return false;
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
        console.warn('POST /api/admin/events: invalid JSON body', (err as Error).message);
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }
    if (!data) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const checkedData = checkEventCreationPayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const eventData = data as Event;
    const createdEvent = await prisma.event.create({
        data: eventData
    });
    if (!createdEvent) {
        return new Response(JSON.stringify({ error: 'Failed to create event' }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};