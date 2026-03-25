import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {

    const title = params.title;

    if (!title) {
      throw error(400, 'A title is required.');
    }

    const idAsNumber = parseInt(title, 10);
    let news;

    if (!isNaN(idAsNumber)) {
      news = await prisma.newsDetail.findUnique({
        where: { id: idAsNumber }
      });
    } else {
      // Search is now on slug_url
      news = await prisma.newsDetail.findUnique({
        where: { 
          slug_url: title
        }
      });
    }

    if (!news) {
      throw error(404, 'News not found');
    }

    return json(news);
};
