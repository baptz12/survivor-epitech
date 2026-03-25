// src/routes/admin/news/[id]/edit/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// This file uses FAKE data and has NO DATABASE CONNECTION.
// The error "Property 'id' does not exist" is a TypeScript issue.
// Please restart the Svelte Language Server in your editor to fix it.

export const load: PageServerLoad = async ({ params }) => {
	// The `params.id` comes from the [id] in your folder structure.
	// TypeScript knows this via the auto-generated './$types' file.
	console.log(`Loading FAKE data for article ID: ${params.id}`);

	// --- FAKE NEWS ARTICLE DATA ---
	const fakeArticle = {
		id: params.id,
		title: 'A Fake Title for a Demo Article',
		category: 'Funding',
		location: 'Virtual, Internet',
		news_date: new Date().toISOString().split('T')[0],
		description:
			'This is the content of the fake news article. **Markdown is supported!**\n\n- You can edit this text.\n- Clicking "Save Changes" will log the new data to the server console.\n- Clicking "Delete" will redirect you.',
		image_path: '/placeholder.png',
		slug: 'a-fake-title-for-a-demo-article'
	};

	return {
		newsArticle: fakeArticle
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title');

		console.log(`--- SIMULATING UPDATE for article ${params.id} ---`);
		console.log(`New Title: ${title}`);
		console.log('--- Form data received on the server: ---');
		console.log(Object.fromEntries(formData));
		console.log('-------------------------------------------');

		return { success: true, message: 'Success! (Simulated Update)' };
	},

	delete: async ({ params }) => {
		console.log(`--- SIMULATING DELETE for article ${params.id} ---`);
		console.log('Redirecting to /news...');
		console.log('-------------------------------------------');

		throw redirect(303, '/news');
	}
};