// src/routes/admin/roles/create/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// This file is self-contained and only handles CREATING a user.
// The data is not shared with other pages in this fake setup.

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;
		const password = formData.get('password') as string;

		const newUser = { name, email, role };

		console.log(`--- SIMULATING USER CREATION ---`);
		console.log('A new user would be added to the database with this data:', newUser);
		console.log(`Password (never log this in production!): ${password}`);
		console.log('--------------------------------');

		// After "creating", redirect back to the user list.
		throw redirect(303, '/admin/roles');
	}
};