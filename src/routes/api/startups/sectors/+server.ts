import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit'; // Utilisez le helper json

export const GET: RequestHandler = async ({ }) => {

    try {
        const sectors = await prisma.startupList.findMany({ 
            select: { sector: true }, 
            distinct: ['sector'],
            where: { sector: { not: null } }
          });

        const sectorsList = sectors.map(s => s.sector);

        return json(sectorsList);
    } catch (e) {
        return json({ error: 'Failed to load sectors' }, { status: 500 });
    }
};