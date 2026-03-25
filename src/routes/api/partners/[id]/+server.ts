import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (id) {
        if (isNaN(Number(id))) {
            return new Response(JSON.stringify({ error: 'Invalid partner ID' }), { status: 400 });
        }
        const partner = await prisma.partner.findUnique({
            where: { external_id: Number(id) },
        });
        if (partner) {
            return new Response(JSON.stringify(partner), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    return new Response(JSON.stringify({ error: 'Partner not found' }), { status: 404 });
};
