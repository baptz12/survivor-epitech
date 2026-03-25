import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
    const id = params.id;
    if (id) {
        if (isNaN(Number(id))) {
            return new Response(JSON.stringify({ error: 'Invalid investor ID' }), { status: 400 });
        }
        const investor = await prisma.investor.findUnique({
            where: { external_id: Number(id) },
        });
        if (investor) {
            return new Response(JSON.stringify(investor), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    return new Response(JSON.stringify({ error: 'Investor not found' }), { status: 404 });
};
