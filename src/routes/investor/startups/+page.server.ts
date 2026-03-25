import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	// Security: Protect this route, only for investors
	if (!locals.user || locals.user.role !== 'investor') {
		throw redirect(303, '/auth/login');
	}

	try {
		// Fetching logic is the same as the public page
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

		return {
			projects: projectsResult.data || [],
			sectors: [...(sectorsResult || [])],
			maturities: [...(maturitiesResult || [])],
			user: locals.user // Pass user session to the page
		};
	} catch (err) {
		console.error('Load error:', err);
		throw error(500, 'Impossible to load projects page data.');
	}
};

export const actions: Actions = {
	startConversation: async ({ request, locals }) => {
		// The user is already verified as an investor by the load function's guard
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized.' });
		}

		const user = await prisma.user.findUnique({ where: { id: locals.user.id } });
		if (!user?.investor_id) {
			return fail(403, { error: 'User is not associated with an investor profile.' });
		}
		const investorId = user.investor_id;

		const formData = await request.formData();
		const startupId = Number(formData.get('startupId'));

		if (!startupId) {
			return fail(400, { error: 'Startup ID is required.' });
		}

		const startup = await prisma.startupDetail.findUnique({ where: { id: startupId } });
		if (!startup) {
			return fail(404, { error: 'Startup not found.' });
		}

		const conversation = await prisma.conversation.upsert({
			where: {
				startupId_investorId: {
					startupId,
					investorId
				}
			},
			create: {
				startupId,
				investorId
			},
			update: {}
		});

		throw redirect(303, `/messages?id=${conversation.id}`);
	}
};
