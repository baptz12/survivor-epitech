import { redirect, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { StartupDetail } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';

/**
 * Calculates the completion percentage of a startup's profile based on filled fields.
 */
function calculateProfileCompletion(startup: StartupDetail): {
	completion: number;
	suggestion: string;
} {
	let completion = 0;
	const weights = {
		name: 10,
		description: 20,
		address: 5,
		phone: 5,
		website_url: 10,
		social_media_url: 10,
		sector: 10,
		maturity: 10,
		image_path: 10,
		legal_status: 5,
		project_status: 5
	};

	const suggestions: Record<keyof typeof weights, string> = {
		description: 'Add a detailed description of your project.',
		image_path: 'Upload a logo or project image.',
		website_url: 'Add your company website URL.',
		social_media_url: 'Link your social media profiles.',
		phone: 'Provide a contact phone number.',
		sector: 'Specify your industry sector.',
		maturity: "Define your startup's maturity stage.",
		project_status: 'Update your current project status.',
		address: 'Add your business address.',
		legal_status: 'Specify your legal status.',
		name: 'Make sure your startup name is set.'
	};

	for (const [key, weight] of Object.entries(weights)) {
		if (startup[key as keyof StartupDetail]) {
			completion += weight;
		}
	}

	if (completion >= 100) {
		return { completion: 100, suggestion: 'Your profile is complete!' };
	}

	// Find the first missing field to suggest
	for (const [key, text] of Object.entries(suggestions)) {
		if (!startup[key as keyof StartupDetail]) {
			return { completion, suggestion: text };
		}
	}

	return { completion, suggestion: 'Review and update your profile information.' };
}

export async function load({ locals, url, fetch }) {
	if (!locals.user || locals.user.role !== 'founder') {
		throw redirect(303, '/auth/login');
	}
	// FIX: Fetch the full user record from the database using the ID from the JWT
	const dbUserResponse = await fetch(`${url.origin}/api/users/${locals.user.id}`);

	if (!dbUserResponse.ok) {
		const errorData = await dbUserResponse.json();
		throw error(dbUserResponse.status, errorData.error || 'Impossible to load user from API');
	}

	const { data: dbUser } = await dbUserResponse.json();

	if (!dbUser || !dbUser.founder_id) {
		throw error(403, 'User is not associated with any founder profile.');
	}

	const founder = await prisma.founder.findUnique({
		where: { id: dbUser.founder_id }
	});

	if (!founder) {
		throw error(404, 'Founder profile not found.');
	}

	const startup = await prisma.startupDetail.findUnique({
		where: { id: founder.startup_id }
	});

	if (!startup) {
		throw error(404, 'Startup not found for founder.');
	}

	const { completion: profileCompletion, suggestion: profileCompletionSuggestion } =
		calculateProfileCompletion(startup);

	// NOTE: The following stats are generated as the database schema does not support tracking these metrics.
	const stats = [
		{
			title: 'Profile Views',
			value: (Math.floor(Math.random() * 500) + 1000).toLocaleString(),
			change: `+${(Math.random() * 15 + 5).toFixed(1)}%`,
			icon: 'Eye',
			color: 'text-blue-400'
		},
		{
			title: 'Investor Messages',
			value: (Math.floor(Math.random() * 10) + 15).toString(),
			change: `+${Math.floor(Math.random() * 5) + 1} since last week`,
			icon: 'MessageCircle',
			color: 'text-green-400'
		},
		{
			title: 'Opportunity Clicks',
			value: (Math.floor(Math.random() * 40) + 50).toString(),
			change: 'Top interest: GreenTech Fund',
			icon: 'Briefcase',
			color: 'text-orange-400'
		}
	];

	const viewHistory = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
		day,
		views: Math.floor(Math.random() * 150) + 50 // Random views between 50 and 200
	}));

	// Fetch real conversations from the database
	const conversations = await prisma.conversation.findMany({
		where: { startupId: startup.id },
		include: {
			investor: { select: { name: true, image_path: true } },
			messages: { orderBy: { createdAt: 'desc' }, take: 1 }
		},
		orderBy: { updatedAt: 'desc' },
		take: 3
	});

	const recentMessages = conversations.map((c) => ({
		id: c.id,
		sender: c.investor.name,
		avatar: c.investor.name.charAt(0),
		image_path: c.investor.image_path,
		message: c.messages[0]?.content ?? 'No messages yet.',
		time: c.messages[0]?.createdAt
			? `${formatDistanceToNow(c.messages[0].createdAt)} ago`
			: 'No activity'
	}));

	const events = await prisma.event.findMany({
		take: 3,
		orderBy: { id: 'desc' }
	});

	const mapEventTypeToBadge = (eventType: string | null) => {
		switch (eventType?.toLowerCase()) {
			case 'funding':
			case 'grant':
				return { type: 'Funding', badgeColor: 'bg-green-500/20 text-green-300' };
			case 'competition':
			case 'pitch':
				return { type: 'Competition', badgeColor: 'bg-purple-500/20 text-purple-300' };
			case 'program':
			case 'accelerator':
				return { type: 'Program', badgeColor: 'bg-yellow-500/20 text-yellow-300' };
			default:
				return { type: 'Event', badgeColor: 'bg-blue-500/20 text-blue-300' };
		}
	};

	const opportunities = events.map((event) => {
		const { type, badgeColor } = mapEventTypeToBadge(event.event_type);
		return {
			title: event.name,
			type,
			deadline: event.dates || 'Details to be announced',
			badgeColor
		};
	});

	return {
		startup,
		profileCompletion,
		profileCompletionSuggestion,
		stats,
		viewHistory,
		recentMessages,
		opportunities
	};
}
