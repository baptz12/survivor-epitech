// src/routes/admin/news/create/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import prisma from '$lib/prisma';
import { slugify } from '$lib'; // Assuming you have this helper

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const category = formData.get('category') as string;
		const location = formData.get('location') as string;
		const news_date = formData.get('news_date') as string;
		const description = formData.get('description') as string;
		// Handle image upload here and get the final path
		const image_path = '/placeholder.png'; // Placeholder

		if (!title || !description || !news_date) {
			return fail(400, { error: 'Title, Description, and Date are required.' });
		}

		try {
			await prisma.newsDetail.create({
				data: {
					title,
					category,
					location,
					news_date: new Date(news_date),
					description,
					image_path,
					// You might want a slug for friendlier URLs
					slug: slugify(title)
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Could not create the news article.' });
		}

		// Redirect to the main news page after successful creation
		throw redirect(303, '/news');
	}
};