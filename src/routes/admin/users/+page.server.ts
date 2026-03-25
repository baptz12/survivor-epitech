// src/routes/admin/roles/+page.server.ts
import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

const roles = {
	'admin': 'Admin',
	'founder': 'Startup Founder',
	'investor': 'Investor'
};

const fetchUsers = async () => {
	const users = await prisma.user.findMany();
	if (!users) {
		return [];
	}
	return users.map(user => ({
		...user,
		role: roles[user.role as keyof typeof roles] || 'Unknown'
	}));
}

export const load: PageServerLoad = async () => {
	// This page will load and display the users from the array above.
	const users = await fetchUsers();
	return {
		users: users
	};
};