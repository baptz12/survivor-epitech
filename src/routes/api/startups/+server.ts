import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { applyFilters } from '$lib';

const filterParams = ['sector', 'maturity', 'location'];

export const GET: RequestHandler = async ({ url }) => {

  const limitParam = url.searchParams.get('limit');
  const search = url.searchParams.get('search');  
  const sector = url.searchParams.get('sector');
  const maturity = url.searchParams.get('maturity');

  let limit = 0;
  if (limitParam) {
    limit = parseInt(limitParam, 10);
  }

  const where: any = {};

  if (search) {
    where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
    ];
  }

  if (sector) {
    const sectors = sector.split(',');
    where.sector = { in: sectors };
  }

  if (maturity) {
    const maturities = maturity.split(',');
    where.maturity = { in: maturities };
  }

  const projects = await prisma.startupList.findMany({
    where,
    take: limit > 0 ? limit : undefined
  });

  return new Response(JSON.stringify({ data: projects }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
