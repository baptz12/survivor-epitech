import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import emitter from '$lib/server/events';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const conversationId = Number(params.id);
	if (isNaN(conversationId)) {
		throw error(400, 'Invalid conversation ID');
	}

	// Security Check: Verify the logged-in user is a participant of the conversation
	const user = await prisma.user.findUnique({ where: { id: locals.user.id } });
	if (!user) throw error(401, 'Unauthorized');

	const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
	if (!conversation) throw error(404, 'Conversation not found.');

	let isParticipant = false;
	if (user.role === 'founder' && user.founder_id) {
		const founder = await prisma.founder.findUnique({ where: { id: user.founder_id } });
		if (founder?.startup_id === conversation.startupId) isParticipant = true;
	} else if (user.role === 'investor' && user.investor_id) {
		if (user.investor_id === conversation.investorId) isParticipant = true;
	}

	if (!isParticipant) {
		throw error(403, 'You are not authorized to access this conversation.');
	}

	let listener: (message: any) => void;

	const stream = new ReadableStream({
		start(controller) {
			const eventName = `message:conversation:${conversationId}`;

			listener = (message: any) => {
				const data = `data: ${JSON.stringify(message)}\n\n`;
				controller.enqueue(data);
			};

			emitter.on(eventName, listener);

			// Send a connection confirmation event
			controller.enqueue('event: connected\ndata: {}\n\n');
		},
		cancel() {
			const eventName = `message:conversation:${conversationId}`;
			// When the client disconnects, remove the listener to prevent memory leaks
			if (listener) {
				emitter.off(eventName, listener);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
