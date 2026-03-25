// src/lib/server/jeb-sync.ts
import prisma from '$lib/prisma';
import { slugify } from '$lib';

export const syncWithJebApi = async () => {
	console.log('🚀 Starting local mock data synchronization...');

	try {
		// 1. Seed Partners
		console.log('🤝 Syncing partners...');
		const partners =[
			{ id: 1, name: 'Tech Innovators Org', email: 'contact@techinnovators.org', partnership_type: 'Strategic', description: 'A global network of tech innovators.' },
			{ id: 2, name: 'Global Bank', email: 'partner@globalbank.com', partnership_type: 'Financial', description: 'Providing financial backing.' }
		];
		for (const p of partners) {
			await prisma.partner.upsert({
				where: { external_id: p.id },
				update: p,
				create: { external_id: p.id, ...p }
			});
		}

		// 2. Seed Startups
		console.log('📊 Syncing startups...');
		const startups =[
			{ id: 1, name: 'QuantumLeap AI', sector: 'Artificial Intelligence', maturity: 'Seed Stage', address: 'Paris, France', email: 'hello@quantumleap.ai', description: 'QuantumLeap AI is revolutionizing the way we process data. Using advanced neural networks, we provide real-time insights for enterprise businesses.', image_path: '/placeholder.png' },
			{ id: 2, name: 'BioSynth Solutions', sector: 'Biotechnology', maturity: 'Series A', address: 'Lyon, France', email: 'contact@biosynth.com', description: 'BioSynth creates sustainable, biodegradable materials for the future, replacing single-use plastics with organic alternatives.', image_path: '/placeholder.png' },
			{ id: 3, name: 'Helios Energy', sector: 'Renewable Energy', maturity: 'Growth Stage', address: 'Marseille, France', email: 'info@helios.com', description: 'Helios Energy provides next-gen solar panels with 40% higher efficiency than current market standards.', image_path: '/placeholder.png' }
		];

		for (const s of startups) {
			const { id, ...data } = s;
			await prisma.startupDetail.upsert({
				where: { external_id: id },
				update: { ...data, slug_url: slugify(data.name) },
				create: { external_id: id, slug_url: slugify(data.name), ...data }
			});
			await prisma.startupList.upsert({
				where: { external_id: id },
				update: data,
				create: { external_id: id, ...data }
			});
		}

		// 3. Seed Founders
		console.log('👥 Syncing founders...');
		const founders =[
			{ id: 1, name: 'John Founder', startup_id: 1, image_path: '/team/Gabriel.png' },
			{ id: 2, name: 'Marie Bio', startup_id: 2, image_path: '/team/Baptiste.png' },
			{ id: 3, name: 'Luc Helios', startup_id: 3, image_path: '/team/Antoine.png' }
		];
		for (const f of founders) {
			const startup = await prisma.startupDetail.findUnique({ where: { external_id: f.startup_id } });
			if (startup) {
				await prisma.founder.upsert({
					where: { external_id: f.id },
					update: { name: f.name, startup_id: startup.id, image_path: f.image_path },
					create: { external_id: f.id, name: f.name, startup_id: startup.id, image_path: f.image_path }
				});
			}
		}

		// 4. Seed Investors
		console.log('💰 Syncing investors...');
		const investors =[
			{ id: 1, name: 'Jane Investor', email: 'jane@capital.com', investment_focus: 'Tech', investor_type: 'Venture Capital', description: 'Looking for the next unicorn.', image_path: '/team/Cabrera.png' },
			{ id: 2, name: 'Paul Angel', email: 'paul@angel.com', investment_focus: 'GreenTech', investor_type: 'Angel', description: 'Investing in a sustainable future.', image_path: '/placeholder.png' }
		];
		for (const i of investors) {
			const { id, ...data } = i;
			await prisma.investor.upsert({
				where: { external_id: id },
				update: data,
				create: { external_id: id, ...data }
			});
		}

		// 5. Seed Users
		console.log('👤 Syncing users...');
		const users =[
			{ id: 1, email: 'admin@jeb.com', name: 'Admin User', role: 'admin' },
			{ id: 2, email: 'founder@quantumleap.ai', name: 'John Founder', role: 'founder', founder_id: 1 },
			{ id: 3, email: 'jane@capital.com', name: 'Jane Investor', role: 'investor', investor_id: 1 }
		];
		for (const u of users) {
			const { id, ...data } = u;
			
			// Resolve internal IDs for relations
			let internalFounderId = null;
			let internalInvestorId = null;

			if (data.founder_id) {
				const founder = await prisma.founder.findUnique({ where: { external_id: data.founder_id } });
				internalFounderId = founder?.id || null;
			}
			if (data.investor_id) {
				const investor = await prisma.investor.findUnique({ where: { external_id: data.investor_id } });
				internalInvestorId = investor?.id || null;
			}

			await prisma.user.upsert({
				where: { external_id: id },
				update: { email: data.email, name: data.name, role: data.role, founder_id: internalFounderId, investor_id: internalInvestorId },
				create: { external_id: id, email: data.email, name: data.name, role: data.role, founder_id: internalFounderId, investor_id: internalInvestorId }
			});
		}

		// 6. Seed Events
		console.log('🎫 Syncing events...');
		const events =[
			{ id: 1, name: 'Annual Investor Pitch Day', event_type: 'Pitch Session', dates: '2026-03-30T10:00:00', location: 'Paris, France', description: 'Join us for our annual pitch day where top startups present.', target_audience: 'Investors', image_path: '/placeholder.png' },
			{ id: 2, name: 'GreenTech Summit', event_type: 'Conference', dates: '2026-03-31T09:00:00', location: 'Lyon, France', description: 'The biggest GreenTech conference in Europe.', target_audience: 'Startups, Investors', image_path: '/placeholder.png' }
		];
		for (const e of events) {
			const { id, ...data } = e;
			await prisma.event.upsert({
				where: { external_id: id },
				update: data,
				create: { external_id: id, ...data }
			});
		}

		// 7. Seed News
		console.log('📰 Syncing news...');
		const news =[
			{ id: 1, title: 'QuantumLeap AI Secures $5M Seed Funding', category: 'Funding', news_date: '2025-08-15', location: 'Paris, France', startup_id: 1, description: 'We are thrilled to announce that QuantumLeap AI has secured $5M in seed funding, led by major venture capital firms.' },
			{ id: 2, title: 'BioSynth Solutions Launches New Product', category: 'Launch', news_date: '2025-09-01', location: 'Lyon, France', startup_id: 2, description: 'BioSynth is launching its new biodegradable plastic substitute, poised to replace single-use plastics.' }
		];
		for (const n of news) {
			const { id, description, ...data } = n;
			const startup = await prisma.startupDetail.findUnique({ where: { external_id: data.startup_id } });
			if (startup) {
				await prisma.news.upsert({
					where: { external_id: id },
					update: { ...data, startup_id: startup.id },
					create: { external_id: id, ...data, startup_id: startup.id }
				});
				await prisma.newsDetail.upsert({
					where: { external_id: id },
					update: { slug_url: slugify(data.title), description, ...data, startup_id: startup.id, image_path: '/placeholder.png' },
					create: { external_id: id, slug_url: slugify(data.title), description, ...data, startup_id: startup.id, image_path: '/placeholder.png' }
				});
			}
		}

		console.log('✅ Mock Sync completed successfully');
		return 'Data synced successfully';
	} catch (error) {
		console.error('❌ Sync failed:', error);
		throw error;
	}
};