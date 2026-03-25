import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	const title = params.title;

	const apiEndpoint = `${url.origin}/api/news/${title}`;

	const response = await fetch(apiEndpoint);

	if (!response.ok) {
		const errorData = await response.json();
		throw error(response.status, errorData.error || 'Impossible to load from API');
	}

	const News = await response.json();

	return {
		news: News
	};
};
