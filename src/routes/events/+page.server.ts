import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {

	try {
		const apiEndpoint = `${url.origin}/api/events`;
		
		const response = await fetch(apiEndpoint);
		
		if (!response.ok) {
			const errorData = await response.json();
			throw error(response.status, errorData.error || 'Impossible to load from API');
		}
	
		const { data: events } = await response.json();

		return {
			events: events
		};
	} catch (err) {
		console.error('Load error:', err);
		throw error(500, 'Impossible to load news page data.');
	}
};