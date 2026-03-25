import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If the user is not authenticated, redirect them to a login page.
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(303, '/auth/login');
	}

	// The user is authenticated and an admin, so they can proceed.
	return {
		user: locals.user
	};
};
