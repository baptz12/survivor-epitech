import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {

  const limitParam = url.searchParams.get('limit');

  let limit = 0;
  if (limitParam) {
      limit = parseInt(limitParam, 10);
  }

  const investors = await prisma.event.findMany({
      take: limit > 0 ? limit : undefined,
  });

  return new Response(JSON.stringify({ data: investors }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
