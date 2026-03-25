import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const projectsPromise = fetch(`${url.origin}/api/startups`);
		const sectorsPromise = fetch(`${url.origin}/api/startups/sectors`);
		const maturitiesPromise = fetch(`${url.origin}/api/startups/maturities`);

		const [projectsResponse, sectorsResponse, maturitiesResponse] = await Promise.all([
			projectsPromise,
			sectorsPromise,
			maturitiesPromise
		]);

		if (!projectsResponse.ok) throw error(projectsResponse.status, 'Impossible to load projects');
		if (!sectorsResponse.ok) throw error(sectorsResponse.status, 'Impossible to load sectors');
		if (!maturitiesResponse.ok)
			throw error(maturitiesResponse.status, 'Impossible to load maturities');

		const projectsResult = await projectsResponse.json();
		const sectorsResult = await sectorsResponse.json();
		const maturitiesResult = await maturitiesResponse.json();

		const projects = projectsResult.data || [];
		const sectors = [...(sectorsResult || [])];
		const maturities = [...(maturitiesResult || [])];


		return {
			projects,
			sectors,
			maturities
		};
	} catch (err) {
		console.error('Load error:', err);
		throw error(500, 'Impossible to load projects page data.');
	}
};
