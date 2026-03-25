import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const GET: RequestHandler = async () => {
    const news = await prisma.news.findMany();
    const sortedNews = news.sort((a, b) => {
        return new Date(b.news_date ?? '1970-01-01').getTime() - new Date(a.news_date ?? '1970-01-01').getTime();
    });
    return new Response(JSON.stringify({ data: sortedNews }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
