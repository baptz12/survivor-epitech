// src/routes/admin/events/[id]/edit/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// This file now uses FAKE data and has NO DATABASE CONNECTION.
// This will allow you to work on your page UI without any database errors.

export const load: PageServerLoad = async ({ params }) => {
	console.log(`Loading FAKE data for event ID: ${params.id}`);

	// --- FAKE EVENT DATA ---
	// This object simulates what Prisma would normally return.
	const fakeEvent = {
		id: params.id, // Use the ID from the URL to feel dynamic
		title: 'Fake Workshop: Introduction to SvelteKit',
		category: 'Workshop',
		// The HTML datetime-local input needs a 'YYYY-MM-DDTHH:mm' format.
		// We slice the ISO string to get this.
		event_date: new Date().toISOString().slice(0, 16),
		location: 'Main Conference Room (Simulated)',
		description:
			'This is a description for a fake event loaded from the server.\n\n- You can edit any field and click "Save Changes" to see the data logged in your server console.\n- Clicking "Delete" will simulate deletion and redirect you.'
	};

	return {
		// Your Svelte page will receive this fake data and render it in the form.
		event: fakeEvent
	};
};

export const actions: Actions = {
	// This action SIMULATES updating the event.
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title');

		console.log(`--- SIMULATING UPDATE for event ${params.id} ---`);
		console.log(`New Title: ${title}`);
		console.log('--- Form data received on the server: ---');
		console.log(Object.fromEntries(formData)); // Log all form data to the console
		console.log('-------------------------------------------');

		// Return a success message to the UI.
		return { success: true, message: 'Success! (Simulated Update)' };
	},

	// This action SIMULATES deleting the event.
	delete: async ({ params }) => {
		console.log(`--- SIMULATING DELETE for event ${params.id} ---`);
		console.log('Redirecting to /events...');
		console.log('-------------------------------------------');

		// Redirect to the events page, just like the real action would.
		throw redirect(303, '/events');
	}
};