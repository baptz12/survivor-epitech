import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { NewsDetail, News } from '$lib/types';
import { isUnknownKey, checkIdValidity, createUnauthorizedMessage, roles, createForbiddenMessage } from '$lib/index';

const payloadParams = [
    'news_date',
    'location',
    'category',
    'startup_id',
    'title',
    'description'
];

const newsKeywords = new Set([
    'news_date',
    'location',
    'category',
    'startup_id',
    'title',
]);

const checkNewsUpdatePayload = (data: unknown): data is Partial<NewsDetail> => {
    if (!data || typeof data !== 'object')
        return false;
    const d = data as Record<string, unknown>;
    for (const key of Object.keys(d)) {
        if (isUnknownKey(new Set(payloadParams), key)) return false;
    }
    return true;
}

const updateNewsList = async (id: number, data: Record<string, any>) => {
    let payload: Partial<News> = {};
    for (const key of Object.keys(data)) {
        if (newsKeywords.has(key)) {
            payload[key as keyof News] = data[key];
        }
    }
    await prisma.news.update({
        where: { id },
        data: payload
    });
}

export const PUT: RequestHandler = async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        if (locals.user.role === 'founder') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.founder_id) {
                return createForbiddenMessage();
            }
            const founder = await prisma.founder.findUnique({
                where: { external_id: user.founder_id }
            });
            if (!founder || Number(founder.startup_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
    const id = params.id;

    try {
        await checkIdValidity("News", id, prisma.newsDetail);
    } catch (response) {
        return json(response);
    }
    const newsId = Number(id);
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const checkedData = checkNewsUpdatePayload(data);
    if (!checkedData) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const newsData = data as Record<string, any>;
    const updatedNews = await prisma.newsDetail.update({
        where: { id: newsId },
        data: newsData
    });
    await updateNewsList(newsId, newsData);
    return json({ message: 'News updated successfully', data: updatedNews });
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!locals.user || locals.user.role === undefined) {
        return createUnauthorizedMessage();
    }
    if (roles.includes(locals.user.role)) {
        if (locals.user.role === 'founder') {
            const user = await prisma.user.findUnique({
                where: { external_id: Number(locals.user.id) }
            });
            if (!user || !user.founder_id) {
                return createForbiddenMessage();
            }
            const founder = await prisma.founder.findUnique({
                where: { external_id: user.founder_id }
            });
            if (!founder || Number(founder.startup_id) !== Number(params.id)) {
                return createForbiddenMessage();
            }
        } else {
            return createForbiddenMessage();
        }
    }
    const id = params.id;

    if (!id || isNaN(Number(id))) {
        return new Response(JSON.stringify({ error: 'Invalid news ID' }), { status: 400 });
    }
    const newsId = Number(id);

    const existingNews = await prisma.newsDetail.findUnique({
        where: { id: newsId }
    });
    if (!existingNews) {
        return json({ error: 'News not found' }, { status: 404 });
    }
    await prisma.news.delete({
        where: { id: newsId }
    });
    await prisma.newsDetail.delete({
        where: { id: newsId }
    });
    return json({ message: 'News deleted successfully' });
};