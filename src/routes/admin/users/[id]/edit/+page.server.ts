// src/routes/admin/users/[id]/edit/+page.server.ts
import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// Centralized role definition to be used in load and actions
const ROLES = {
	admin: 'Administrator',
	founder: 'Startup Founder',
	investor: 'Investor',
	editor: 'Editor',
	viewer: 'Viewer'
};

export const load: PageServerLoad = async ({ params }) => {
	const userId = parseInt(params.id, 10);
	if (isNaN(userId)) {
		throw error(400, 'Invalid user ID');
	}

	// Fetch only the specific user from the database
	const user = await prisma.user.findUnique({
		where: { id: userId }
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	// Pass the user data and the roles map to the page
	return { user, roles: ROLES };
};

export const actions: Actions = {
	// Renamed from 'default' to 'update'
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;
		const pictureFile = formData.get('picture') as File;
		const userId = parseInt(params.id, 10);

		if (isNaN(userId)) {
			return fail(400, { message: 'Invalid user ID.' });
		}

		// Basic validation
		if (!name || !email || !role) {
			return fail(400, { message: 'Name, email, and role are required.' });
		}
		if (!Object.keys(ROLES).includes(role)) {
			return fail(400, { message: 'Invalid role selected.' });
		}

		const updateData: { name: string; email: string; role: string; image_path?: string } = {
			name,
			email,
			role
		};

		// Handle file upload
		if (pictureFile && pictureFile.size > 0) {
			try {
				const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'users');
				await fs.mkdir(uploadDir, { recursive: true });

				const extension = path.extname(pictureFile.name);
				const filename = `${userId}-${Date.now()}${extension}`;
				const filePath = path.join(uploadDir, filename);

				await fs.writeFile(filePath, Buffer.from(await pictureFile.arrayBuffer()));

				// Store the public path for the image
				updateData.image_path = `/uploads/users/${filename}`;
			} catch (err) {
				console.error('File upload failed:', err);
				return fail(500, { message: 'Failed to upload image.' });
			}
		}

		try {
			await prisma.user.update({
				where: { id: userId },
				data: updateData
			});
		} catch (err) {
			console.error('Failed to update user:', err);
			return fail(500, { message: 'Failed to update user in the database.' });
		}

		return { success: true, message: 'User updated successfully!' };
	},

	// Named action for "clearPassword"
	clearPassword: async ({ params }) => {
		const userId = parseInt(params.id, 10);
		if (isNaN(userId)) {
			return fail(400, { message: 'Invalid user ID.' });
		}

		try {
			// Set password to null, requiring the user to activate their account again
			await prisma.user.update({
				where: { id: userId },
				data: { password: null }
			});
			console.log(
				`Password for user ${userId} has been cleared. They will need to activate their account.`
			);
		} catch (err) {
			console.error('Failed to clear password:', err);
			return fail(500, { message: 'Failed to clear password.' });
		}

		return { success: true, message: 'Password cleared and reset email sent!' };
	},

	// Named action for "delete"
	delete: async ({ params }) => {
		const userId = parseInt(params.id, 10);
		if (isNaN(userId)) {
			throw error(400, 'Invalid user ID');
		}

		await prisma.user.delete({
			where: { id: userId }
		});

		throw redirect(303, '/admin/users');
	}
};
