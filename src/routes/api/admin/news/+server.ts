import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { News, NewsDetail } from '$lib/types';
import { createForbiddenMessage, createUnauthorizedMessage, isUnknownKey, roles } from '$lib/index';

const optionalPayload = [
    'news_date',
    'location',
    'category',
];

const mandatoryPayload = ['title', 'description', 'startup_id'];

const allowedKeys = new Set([...mandatoryPayload, ...optionalPayload]);

const checkNewsCreationPayload = (data: unknown): data is NewsDetail => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(allowedKeys, key)) return false;
    }
    const { title, description } = d;
    if (typeof title !== 'string' || title.trim() === '') return false;
    if (typeof description !== 'string' || description.trim() === '') return false;
    return true;
}

const createNews = async (data: NewsDetail) => {
    const { title, location, category, startup_id } = data;
    const payload: News = {
        title,
        location,
        category,
        startup_id,
    }
    const response = await prisma.news.create({ data: payload });
    return response;
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    let data: unknown;
    try {
        data = await request.json();
    } catch (err) {
        console.warn('POST /api/admin/news: invalid JSON body', (err as Error).message);
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }
    if (!data) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const checkedData = checkNewsCreationPayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const newsData = data as NewsDetail;
    if (roles.includes(locals.user.role)) {
        if (locals.user.role === 'founder') {
            if (locals.user.startup_id !== newsData.startup_id) {
                return createForbiddenMessage();
            }
        }
    }
    const createdNews = await prisma.newsDetail.create({
        data: newsData
    });
    if (!createdNews) {
        return new Response(JSON.stringify({ error: 'Failed to create news' }), { status: 500 });
    }
    const news = await createNews(newsData);
    if (!news) {
        return new Response(JSON.stringify({ error: 'Failed to create news entry' }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};