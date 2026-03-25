import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (id) {
        if (isNaN(Number(id))) {
            return new Response(JSON.stringify({ error: 'Invalid event ID' }), { status: 400 });
        }
        const event = await prisma.event.findUnique({
            where: { external_id: Number(id) },
        });
        if (event) {
            return new Response(JSON.stringify(event), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
};
