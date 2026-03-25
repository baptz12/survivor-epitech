// src/routes/admin/events/create/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import prisma from '$lib/prisma'; // Assuming prisma is setup in $lib

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const title = formData.get('title') as string;
		const category = formData.get('category') as string;
		const event_date = formData.get('event_date') as string; // Will be in ISO format
		const location = formData.get('location') as string;
		const description = formData.get('description') as string;

		// Basic validation
		if (!title || !category || !event_date || !description) {
			return fail(400, {
				error: 'Please fill out all required fields: Title, Category, Date, and Description.'
			});
		}

		try {
			// Create the event in the database
			await prisma.event.create({
				data: {
					title,
					category,
					event_date: new Date(event_date), // Convert string date back to a Date object
					location,
					description
				}
			});
		} catch (err) {
			console.error('Error creating event:', err);
			return fail(500, { error: 'Could not create the event due to a server error.' });
		}

		// Redirect to a future events list page upon success
		throw redirect(303, '/events'); // Assuming you'll have an /events page
	}
};