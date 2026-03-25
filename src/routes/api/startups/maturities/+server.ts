import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit'; // Utilisez le helper json

export const GET: RequestHandler = async ({ }) => {

    try {
        const maturities = await prisma.startupList.findMany({ 
          select: { maturity: true }, 
          distinct: ['maturity'],
          where: { maturity: { not: null } }
        });

        const maturitiesList = maturities.map(m => m.maturity);

        // On renvoie directement le tableau
        return json(maturitiesList);
    } catch (e) {
        return json({ error: 'Failed to load maturities' }, { status: 500 });
    }
};