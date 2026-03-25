import { redirect, fail, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { Actions, PageServerLoad } from './$types';
import emitter from '$lib/server/events';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const user = await prisma.user.findUnique({
		where: { id: locals.user.id }
	});

	if (!user) {
		throw error(404, 'User not found');
	}

	let conversations;
	let profileId: number | null = null;
	let profileType: 'startup' | 'investor' | null = null;

	if (user.role === 'founder' && user.founder_id) {
		const founder = await prisma.founder.findUnique({ where: { id: user.founder_id } });
		if (founder) {
			profileId = founder.startup_id;
			profileType = 'startup';
			conversations = await prisma.conversation.findMany({
				where: { startupId: profileId },
				include: {
					investor: { select: { name: true, image_path: true } },
					messages: { orderBy: { createdAt: 'desc' }, take: 1 }
				},
				orderBy: { updatedAt: 'desc' }
			});
		}
	} else if (user.role === 'investor' && user.investor_id) {
		profileId = user.investor_id;
		profileType = 'investor';
		conversations = await prisma.conversation.findMany({
			where: { investorId: profileId },
			include: {
				startup: { select: { name: true, image_path: true } },
				messages: { orderBy: { createdAt: 'desc' }, take: 1 }
			},
			orderBy: { updatedAt: 'desc' }
		});
	} else {
		throw error(403, 'User profile not configured for messaging.');
	}

	if (!profileId) {
		throw error(404, 'Associated profile not found.');
	}

	const conversationId = url.searchParams.get('id');
	let selectedConversation = null;

	if (conversationId) {
		const id = parseInt(conversationId);
		const whereClause =
			user.role === 'founder' ? { id, startupId: profileId } : { id, investorId: profileId };

		selectedConversation = await prisma.conversation.findFirst({
			where: whereClause, // Security check: user can only load their own conversations
			include: {
				messages: {
					include: { sender: { select: { id: true, name: true, image_path: true } } },
					orderBy: { createdAt: 'asc' }
				},
				startup: { select: { id: true, name: true, image_path: true } },
				investor: { select: { id: true, name: true, image_path: true } }
			}
		});

		if (!selectedConversation && conversations.length > 0) {
			// Invalid conversation ID for this user, redirect to the first one or none
			throw redirect(303, `/messages?id=${conversations[0].id}`);
		}
	}

	return {
		conversations,
		selectedConversation,
		currentUser: user,
		profileType
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		const formData = await request.formData();
		const content = formData.get('content') as string;
		const conversationId = Number(formData.get('conversationId'));

		if (!content || !conversationId) {
			return fail(400, { error: 'Message content and conversation ID are required.' });
		}

		// Security Check: Verify user is a participant of the conversation
		const user = await prisma.user.findUnique({ where: { id: locals.user.id } });
		if (!user) return fail(401, { error: 'Unauthorized' });

		const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
		if (!conversation) return fail(404, { error: 'Conversation not found.' });

		let isParticipant = false;
		if (user.role === 'founder' && user.founder_id) {
			const founder = await prisma.founder.findUnique({ where: { id: user.founder_id } });
			if (founder?.startup_id === conversation.startupId) isParticipant = true;
		} else if (user.role === 'investor' && user.investor_id) {
			if (user.investor_id === conversation.investorId) isParticipant = true;
		}

		if (!isParticipant) {
			return fail(403, { error: 'You are not a participant in this conversation.' });
		}

		const newMessage = await prisma.message.create({
			data: {
				content,
				conversationId,
				senderId: locals.user.id
			},
			include: {
				sender: {
					select: {
						id: true,
						name: true,
						image_path: true
					}
				}
			}
		});

		// Also touch the conversation to update its `updatedAt` timestamp
		await prisma.conversation.update({
			where: { id: conversationId },
			data: { updatedAt: new Date() }
		});

		// Emit the event with the new message payload
		const eventName = `message:conversation:${conversationId}`;
		emitter.emit(eventName, newMessage);

		return { success: true };
	}
};
