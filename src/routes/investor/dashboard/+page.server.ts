import { redirect, error, fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import type { Actions } from './$types';

// Helper function to format currency
function formatCurrency(amount: number) {
	return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'investor') {
		throw redirect(303, '/auth/login');
	}

	// 1. Fetch Investor's Profile
	const user = await prisma.user.findUnique({
		where: { id: locals.user.id }
	});

	if (!user || !user.investor_id) {
		throw error(403, 'User is not associated with an investor profile.');
	}

	const kpiData = [
		{ title: 'Total Invested', value: '€1.2M', icon: 'DollarSign', change: '+5% vs last quarter' },
		{
			title: 'Portfolio Value',
			value: '€3.5M',
			icon: 'TrendingUp',
			change: '+12% vs last quarter'
		},
		{ title: 'Active Investments', value: '8', icon: 'Briefcase', change: '+1 new investment' },
		{ title: 'Overall Return', value: '2.9x', icon: 'TrendingUp', change: 'MoM: +0.2x' }
	];

	const portfolioCompaniesData = await prisma.startupDetail.findMany({
		take: 4,
		orderBy: { id: 'desc' },
		select: { name: true, sector: true, description: true, image_path: true }
	});

	const portfolioCompanies = portfolioCompaniesData.map((startup, index) => ({
		name: startup.name,
		image_path: startup.image_path,
		sector: startup.sector ?? 'N/A',
		invested: formatCurrency(250000 - index * 50000), // Mock data
		equity: `${12 - index * 2}%`, // Mock data
		lastUpdate: startup.description
			? startup.description.substring(0, 30) + '...'
			: 'No recent updates'
	}));

	const investorProfile = await prisma.investor.findUnique({
		where: { id: user.investor_id },
		select: { investment_focus: true, investor_type: true }
	});

	let featuredStartups;
	const desiredCount = 3;

	if (investorProfile && investorProfile.investment_focus) {
		const focus = investorProfile.investment_focus;
		const investorType = investorProfile.investor_type;

		// 1. Define mappings for scoring
		const focusToSectorsMap: { [key: string]: string[] } = {
			Tech: ['DeepTech', 'FinTech', 'SaaS', 'EdTech', 'HealthTech'],
			Green: ['Sustainability'],
			Health: ['HealthTech'],
			B2B: ['SaaS', 'DeepTech', 'Logistics', 'FinTech'],
			B2C: ['FinTech', 'EdTech', 'HealthTech', 'Sustainability'],
			'Social Impact': ['Sustainability', 'EdTech', 'HealthTech']
		};

		const investorTypeToMaturityMap: { [key: string]: string[] } = {
			Angel: ['Idea', 'Prototype'],
			'Family Office': ['Idea', 'Prototype', 'MVP'],
			'Venture Capital': ['MVP', 'Product-Market Fit'],
			Corporate: ['MVP', 'Product-Market Fit']
		};

		// 2. Get a pool of potential startups based on the broad filter
		const targetSectors = focusToSectorsMap[focus] || [focus];
		const potentialStartups = await prisma.startupList.findMany({
			where: { sector: { in: targetSectors } },
			orderBy: { id: 'desc' },
			take: 50 // Fetch a larger pool to score from
		});

		const preferredMaturities = investorType ? investorTypeToMaturityMap[investorType] || [] : [];

		// 3. Score each startup
		const scoredStartups = potentialStartups.map((startup) => {
			let score = 0;

			// A. Sector Score
			if (startup.sector === focus) {
				score += 10; // Direct match
			} else if (targetSectors.includes(startup.sector)) {
				score += 5; // Inferred match
			}

			// B. Maturity Score
			if (startup.maturity && preferredMaturities.includes(startup.maturity)) {
				score += 8; // Good fit for investor type
			}

			// C. Recency Tie-breaker
			score += startup.id * 0.01;

			return { ...startup, score };
		});

		// 4. Sort by score and select the top N
		scoredStartups.sort((a, b) => b.score - a.score);
		featuredStartups = scoredStartups.slice(0, desiredCount);

		// 5. Fallback: If not enough scored startups, fill with recent ones
		const remainingCount = desiredCount - featuredStartups.length;
		if (remainingCount > 0) {
			const alreadyFetchedIds = featuredStartups.map((s) => s.id);
			const fillerStartups = await prisma.startupList.findMany({
				where: { id: { notIn: alreadyFetchedIds } },
				take: remainingCount,
				orderBy: { id: 'desc' }
			});
			featuredStartups.push(...fillerStartups);
		}
	} else {
		// Fallback for investors with no focus set
		featuredStartups = await prisma.startupList.findMany({
			take: 3,
			orderBy: { id: 'desc' }
		});
	}

	const eventData = await prisma.event.findMany({
		take: 3,
		orderBy: { id: 'desc' },
		select: { name: true, dates: true, location: true }
	});

	const upcomingEvents = eventData.map((event) => ({
		name: event.name,
		date: event.dates
			? new Date(event.dates.split(' to ')[0]).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})
			: 'TBA',
		location: event.location ?? 'Online'
	}));

	// 5. Fetch recent messages
	const conversations = await prisma.conversation.findMany({
		where: { investorId: user.investor_id },
		include: {
			startup: { select: { name: true, image_path: true } },
			messages: { orderBy: { createdAt: 'desc' }, take: 1 }
		},
		orderBy: { updatedAt: 'desc' },
		take: 4
	});

	const recentMessages = conversations.map((c) => ({
		id: c.id,
		sender: c.startup.name,
		avatar: c.startup.name.charAt(0),
		image_path: c.startup.image_path,
		message: c.messages[0]?.content ?? 'No messages yet.',
		time: c.messages[0]?.createdAt
			? `${formatDistanceToNow(c.messages[0].createdAt)} ago`
			: 'No activity'
	}));

	return {
		investorName: user?.name ?? 'Investor',
		kpiData,
		portfolioCompanies,
		featuredStartups,
		upcomingEvents,
		recentMessages,
		user: locals.user
	};
}

export const actions: Actions = {
	startConversation: async ({ request, locals }) => {
		// The user is already verified as an investor by the load function's guard
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized.' });
		}

		const user = await prisma.user.findUnique({ where: { id: locals.user.id } });
		if (!user?.investor_id) {
			return fail(403, { error: 'User is not associated with an investor profile.' });
		}
		const investorId = user.investor_id;

		const formData = await request.formData();
		const startupId = Number(formData.get('startupId'));

		if (!startupId) {
			return fail(400, { error: 'Startup ID is required.' });
		}

		const startup = await prisma.startupDetail.findUnique({ where: { id: startupId } });
		if (!startup) {
			return fail(404, { error: 'Startup not found.' });
		}

		const conversation = await prisma.conversation.upsert({
			where: { startupId_investorId: { startupId, investorId } },
			create: { startupId, investorId },
			update: {}
		});

		throw redirect(303, `/messages?id=${conversation.id}`);
	}
};
