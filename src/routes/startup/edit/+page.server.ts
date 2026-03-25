import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { slugify } from '$lib';

// Load function to get the startup data for the form
export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user || locals.user.role !== 'founder') {
		throw redirect(303, '/auth/login');
	}

	const dbUserResponse = await fetch(`/api/users/${locals.user.id}`);

	if (!dbUserResponse.ok) {
		const errorData = await dbUserResponse.json();
		throw error(dbUserResponse.status, errorData.error || 'Impossible to load user from API');
	}

	const { data: dbUser } = await dbUserResponse.json();

	if (!dbUser || !dbUser.founder_id) {
		throw error(403, 'User is not associated with any founder profile.');
	}

	const dbFounderResponse = await fetch(`/api/founders/${dbUser.founder_id}`);

	if (!dbFounderResponse.ok) {
		const errorData = await dbFounderResponse.json();
		throw error(dbFounderResponse.status, errorData.error || 'Impossible to load founder from API');
	}

	const founderData = await dbFounderResponse.json();

	const dbStartupResponse = await fetch(`/api/startups/${founderData.startup_id}`);

	if (!dbStartupResponse.ok) {
		const errorData = await dbStartupResponse.json();
		throw error(dbStartupResponse.status, errorData.error || 'Impossible to load startup from API');
	}

	const dbStartupData = await dbStartupResponse.json();

	if (!dbStartupData) {
		throw error(403, 'Startup is not associated with any founder profile.');
	}

	return { startup: dbStartupData };
};

// Actions object to handle form submission
export const actions: Actions = {
	default: async ({ request, locals, fetch }) => {
		// 1. Re-authenticate and authorize the user for the action
		if (!locals.user || locals.user.role !== 'founder') {
			return fail(401, { message: 'Unauthorized' });
		}

		const dbUserResponse = await fetch(`/api/users/${locals.user.id}`);

		if (!dbUserResponse.ok) {
			const errorData = await dbUserResponse.json();
			throw error(dbUserResponse.status, errorData.error || 'Impossible to load user from API');
		}

		const { data: dbUser } = await dbUserResponse.json();

		if (!dbUser || !dbUser.founder_id) {
			throw error(403, 'User is not associated with any founder profile.');
		}

		const dbFounderResponse = await fetch(`/api/founders/${dbUser.founder_id}`);

		if (!dbFounderResponse.ok) {
			const errorData = await dbFounderResponse.json();
			throw error(
				dbFounderResponse.status,
				errorData.error || 'Impossible to load startup from API'
			);
		}

		const founder = await dbFounderResponse.json();

		if (!founder) {
			throw error(404, 'Startup profile not found for this founder.');
		}

		// 2. Get form data (No changes needed here)
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const startupData = {
			name: String(data.name ?? ''),
			description: String(data.description ?? ''),
			slug_url: String(slugify(data.name.toString() ?? '') ?? ''),
			sector: String(data.sector ?? ''),
			maturity: String(data.maturity ?? ''),
			website_url: String(data.website_url ?? ''),
			social_media_url: String(data.social_media_url ?? ''),
			phone: String(data.phone ?? ''),
			address: String(data.address ?? ''),
			legal_status: String(data.legal_status ?? ''),
			project_status: String(data.project_status ?? ''),
			needs: String(data.needs ?? '')
		};

		if (!startupData.name) {
			return fail(400, { message: 'Startup name is required.', data: startupData });
		}

		try {
			const response = await fetch(`/api/startups/${founder.startup_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(startupData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					message: errorData.message || 'An error occurred.',
					data: startupData
				});
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Failed to update profile. Please try again.' });
		}

		// 4. Return a success message
		return { success: true, message: 'Profile updated successfully!' };
	}
};
