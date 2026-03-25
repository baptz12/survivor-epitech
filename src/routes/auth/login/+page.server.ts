import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// A helper function to determine the redirect path based on user role
const getDashboardPath = (role: string): string => {
	switch (role) {
		case 'investor':
			return '/investor/dashboard';
		case 'admin':
			return '/admin/dashboard';
		case 'founder':
			return '/startup/dashboard';
		default:
			// Fallback to a generic dashboard or home page if role is unknown
			return '/';
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		// If the user is already logged in, redirect them to their correct dashboard
		const redirectPath = getDashboardPath(locals.user.role);
		throw redirect(303, redirectPath);
	}
	// Return a clean initial state for the form if not logged in
	return {
		step: 'email',
		email: ''
	};
};

export const actions: Actions = {
	checkEmail: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');

		if (typeof email !== 'string' || !email) {
			return fail(400, { step: 'email', error: 'Please enter a valid email address.' });
		}

		const response = await fetch('/api/auth/check-email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email })
		});

		const body = await response.json();

		if (response.ok) {
			if (body.data.status === 'ACTIVATED') {
				return { step: 'password', email };
			}
			if (body.data.status === 'NEEDS_ACTIVATION') {
				return { step: 'activate', email };
			}
		}

		// This handles the NOT_FOUND case or any other API error
		return fail(404, {
			step: 'email',
			email,
			error: 'This email is not registered with JEB Incubator. Please contact an administrator.'
		});
	},

	loginOrActivate: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const intent = data.get('intent'); // 'login' or 'activate'

		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof intent !== 'string' ||
			!email ||
			!password
		) {
			return fail(400, {
				step: intent === 'login' ? 'password' : 'activate',
				email,
				error: 'An unexpected error occurred. Please try again.'
			});
		}

		// Use different endpoint based on intent
		const endpoint = intent === 'activate' ? '/api/auth/activate' : '/api/auth/login';

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			const body = await response.json();

			// Handle specific error codes
			if (body.error?.code === 'ALREADY_ACTIVATED') {
				// If user tries to activate an already activated account, switch to login mode
				return {
					step: 'password',
					email,
					error: 'Your account is already activated. Please sign in with your password.'
				};
			}

			return fail(response.status, {
				step: intent === 'login' ? 'password' : 'activate',
				email,
				error: body.error?.message || 'An error occurred.'
			});
		}

		// On successful login or activation, get the user data from the API response
		const body = await response.json();
		const user = body.data.user;

		if (!user || !user.role) {
			return fail(500, {
				step: intent === 'login' ? 'password' : 'activate',
				email,
				error: 'Login successful, but could not determine user role. Please contact support.'
			});
		}

		// Determine the correct dashboard and redirect
		const redirectPath = getDashboardPath(user.role);
		throw redirect(303, redirectPath);
	}
};
