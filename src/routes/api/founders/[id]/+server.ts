import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (id) {
        if (isNaN(Number(id))) {
            return new Response(JSON.stringify({ error: 'Invalid founder ID' }), { status: 400 });
        }
        const founder = await prisma.founder.findUnique({
            where: { external_id: Number(id) },
        });
        if (founder) {
            return new Response(JSON.stringify(founder), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    return new Response(JSON.stringify({ error: 'Founder not found' }), { status: 404 });
};
