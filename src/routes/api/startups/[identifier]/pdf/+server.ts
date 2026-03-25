import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import PDFDocument from 'pdfkit';
import { error } from '@sveltejs/kit';

// Define theme colors based on app.css
const colors = {
	// From the website's default dark theme (`:root`)
	background: '#262030', // --background: Very dark desaturated purple
	foreground: '#eed5fb', // --foreground: Lightest purple for text
	primary: '#c174f2', // --primary: Vibrant purple
	muted: '#f6aeae', // --muted-foreground: Muted pink for muted text

	// For the second page, we'll mimic the light theme's appearance (`.dark` class)
	page2Background: '#eed5fb', // --background from .dark theme (lightest purple)
	page2Foreground: '#3c364b' // --foreground from .dark theme (dark purple text)
};

export const GET: RequestHandler = async ({ params }) => {
	const id = params.identifier;
	if (!id || isNaN(Number(id))) {
		throw error(400, 'Invalid startup ID');
	}
	const project = await prisma.startupDetail.findUnique({
		where: { external_id: Number(id) }
	});
	if (!project) {
		throw error(404, 'Project not found');
	}

	// --- Image Handling with Bun.file() ---
	// Use relative paths; no need for path.resolve if static dir is configured in SvelteKit.
	// For module-relative: new URL('./static/logo.png', import.meta.url).pathname
	const logoPath = './static/logo.png';
	const projectImagePath = project.image_path
		? `./static${project.image_path}`
		: './static/placeholder.png';

	let logoBuffer: Buffer | null = null;
	let projectImageBuffer: Buffer | null = null;
	try {
		// Bun.file() for faster async read; .bytes() returns Uint8Array
		const logoFile = Bun.file(logoPath);
		const projectImageFile = Bun.file(projectImagePath);

		// Await in parallel for efficiency
		const [logoBytes, projectImageBytes] = await Promise.all([
			logoFile.bytes(),
			projectImageFile.bytes()
		]);

		// Convert to Buffer (Bun's Buffer.from is native and fast)
		logoBuffer = Buffer.from(logoBytes);
		projectImageBuffer = Buffer.from(projectImageBytes);
	} catch (err) {
		console.error('Error reading image files:', err);
		// Proceed without images
	}

	// --- PDF Generation ---
	const doc = new PDFDocument({
		size: 'A4',
		margin: 0, // We will handle margins manually for the background
		info: {
			Title: `${project.name} - Pitch Deck`,
			Author: 'JEB Incubator'
		}
	});

	const generatePdf = (): Promise<Buffer> => {
		return new Promise((resolve) => {
			const buffers: Buffer[] = [];
			doc.on('data', (buffer) => buffers.push(buffer));
			doc.on('end', () => resolve(Buffer.concat(buffers))); // Bun's Buffer.concat is optimized

			// --- PDF Content (Themed to match website) ---
			// Page 1: Main info (Dark Theme)
			doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.background);
			if (logoBuffer) {
				doc.image(logoBuffer, 50, 40, { width: 100 });
			}
			doc
				.font('Helvetica-Bold')
				.fontSize(36)
				.fillColor(colors.foreground)
				.text(project.name, 50, 150, { width: doc.page.width - 100 });
			doc.moveDown();
			const shortDescription = project.description
				? project.description.substring(0, 200) + '...'
				: 'Innovative startup.';
			doc
				.font('Helvetica')
				.fontSize(14)
				.fillColor(colors.muted)
				.text(shortDescription, {
					width: doc.page.width - 100,
					align: 'left',
					continued: false,
					x: 50
				});
			if (projectImageBuffer) {
				doc.image(projectImageBuffer, 50, 350, {
					fit: [doc.page.width - 100, 250],
					align: 'center',
					valign: 'center'
				});
			}
			doc
				.font('Helvetica-Bold')
				.fontSize(20)
				.fillColor(colors.primary)
				.text('Key Highlights', 50, 650);
			doc.rect(50, 675, doc.page.width - 100, 1).fill(colors.primary);
			const stats = [
				{ label: 'Sector', value: project.sector },
				{ label: 'Maturity', value: project.maturity },
				{ label: 'Location', value: project.address }
			];
			let yPos = 700;
			stats.forEach((stat) => {
				if (stat.value) {
					doc
						.font('Helvetica-Bold')
						.fontSize(12)
						.fillColor(colors.foreground)
						.text(stat.label, 50, yPos);
					doc.font('Helvetica').fontSize(12).fillColor(colors.muted).text(stat.value, 150, yPos);
					yPos += 25;
				}
			});
			// Page 2: Details (Light Theme)
			doc.addPage();
			doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.page2Background);
			doc
				.font('Helvetica-Bold')
				.fontSize(24)
				.fillColor(colors.page2Foreground)
				.text('About the Project', 50, 60);
			doc.rect(50, 90, doc.page.width - 100, 1.5).fill(colors.page2Foreground);
			doc
				.font('Helvetica')
				.fontSize(12)
				.fillColor(colors.page2Foreground)
				.text(project.description || 'No detailed description available.', 50, 120, {
					width: doc.page.width - 100,
					align: 'justify'
				});
			doc.moveDown(4);
			if (project.website_url) {
				doc
					.font('Helvetica-Bold')
					.fontSize(16)
					.fillColor(colors.page2Foreground)
					.text('Learn More');
				doc.moveDown(0.5);
				doc.font('Helvetica').fontSize(12).fillColor(colors.primary).text(project.website_url, {
					link: project.website_url,
					underline: true
				});
			}
			// --- End of PDF Content ---
			doc.end();
		});
	};

	const pdfBuffer = await generatePdf();
	const sanitizedName = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

	// Response is web-standard, native to Bun
	return new Response(pdfBuffer, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Length': pdfBuffer.length.toString(),
			'Content-Disposition': `attachment; filename="${sanitizedName}_pitch.pdf"`
		}
	});
};
