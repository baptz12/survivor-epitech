import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
  const founders = await prisma.founder.findMany();

  return new Response(JSON.stringify({ data: founders }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
