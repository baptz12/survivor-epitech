import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Event } from '$lib/types';
import { isUnknownKey, checkIdValidity, createUnauthorizedMessage, createForbiddenMessage, roles } from '$lib/index';

const payloadParams = [
    'dates',
    'location',
    'description',
    'event_type',
    'target_audience',
];

const checkEventUpdatePayload = (data: unknown): data is Partial<Event> => {
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
        await checkIdValidity("Events", id, prisma.event);
    } catch (response) {
        return json(response);
    }
    const eventId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkEventUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const eventData = data as Record<string, any>;
    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: eventData
    });
    return json({ message: 'Event updated successfully', data: updatedEvent });
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
        return new Response(JSON.stringify({ error: 'Invalid event ID' }), { status: 400 });
    }
    const eventId = Number(id);

    const existingEvent = await prisma.event.findUnique({
        where: { id: eventId }
    });
    if (!existingEvent) {
        return json({ error: 'Event not found' }, { status: 404 });
    }
    await prisma.event.delete({
        where: { id: eventId }
    });
    return json({ message: 'Event deleted successfully' });
};
