import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
  const partners = await prisma.partner.findMany();

  return new Response(JSON.stringify({ data: partners }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
