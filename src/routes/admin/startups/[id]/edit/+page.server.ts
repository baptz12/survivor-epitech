// src/routes/projects/[id]/edit/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// --- (Your existing getProjectDataFromDatabase function) ---
const getProjectDataFromDatabase = async (id: string) => {
	console.log(`Fetching project with id: ${id}`);
	return {
		id: '123-abc',
		name: 'Project Nova',
		owner: 'Jane Doe',
		localisation: 'Paris, France',
		theme: 'Renewable Energy',
		founded_year: 2024,
		website_url: 'https://example.com',
		description: 'A groundbreaking initiative to harness solar power with next-gen panels.',
		picture_url: '/project-nova-logo.png'
	};
};

export const load: PageServerLoad = async ({ params }) => {
	const project = await getProjectDataFromDatabase(params.id);
	if (!project) {
		throw error(404, 'Project not found');
	}
	return {
		project
	};
};

// --- NEW: Add form actions for updating and deleting ---
export const actions: Actions = {
	// Default action for "Save Changes"
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		// ... get other form data
		console.log(`Updating project ${params.id} with new name: ${name}`);
		// In a real app, you would save this to the database.
		// You can return a success message here if you like.
		return { success: true, message: 'Project updated successfully!' };
	},

	// Named action for "Delete Project"
	delete: async ({ params }) => {
		console.log(`Deleting project ${params.id}...`);
		// In a real app, you would add your database deletion logic here.
		
		// After deleting, redirect the user to their dashboard.
		throw redirect(303, '/startup/dashboard');
	}
};