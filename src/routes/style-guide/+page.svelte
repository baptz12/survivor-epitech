<!-- src/routes/style-guide/+page.svelte -->
<script lang="ts">
	// Import components from your library to demonstrate them
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { ArrowRight, Trash2, Image as ImageIcon } from 'lucide-svelte';

	// Define colors based on your app.css for easy looping
	const baseColors = [
		{ name: 'Background', variable: 'var(--background)', class: 'bg-background' },
		{ name: 'Foreground', variable: 'var(--foreground)', class: 'bg-foreground' },
		{ name: 'Card', variable: 'var(--card)', class: 'bg-card' },
		{ name: 'Card Foreground', variable: 'var(--card-foreground)', class: 'bg-card-foreground' },
		{ name: 'Primary', variable: 'var(--primary)', class: 'bg-primary' },
		{ name: 'Primary FG', variable: 'var(--primary-foreground)', class: 'bg-primary-foreground' },
		{ name: 'Secondary', variable: 'var(--secondary)', class: 'bg-secondary' },
		{
			name: 'Secondary FG',
			variable: 'var(--secondary-foreground)',
			class: 'bg-secondary-foreground'
		},
		{ name: 'Muted', variable: 'var(--muted)', class: 'bg-muted' },
		{ name: 'Muted FG', variable: 'var(--muted-foreground)', class: 'bg-muted-foreground' },
		{ name: 'Accent', variable: 'var(--accent)', class: 'bg-accent' },
		{ name: 'Destructive', variable: 'var(--destructive)', class: 'bg-destructive' },
		{ name: 'Border', variable: 'var(--border)', class: 'bg-border' },
		{ name: 'Input', variable: 'var(--input)', class: 'bg-input' },
		{ name: 'Ring', variable: 'var(--ring)', class: 'bg-ring' }
	];

	const spacingTokens = [
		{ name: '2xs (p-1)', class: 'p-1', value: '0.25rem' },
		{ name: 'xs (p-2)', class: 'p-2', value: '0.5rem' },
		{ name: 'sm (p-4)', class: 'p-4', value: '1rem' },
		{ name: 'md (p-6)', class: 'p-6', value: '1.5rem' },
		{ name: 'lg (p-8)', class: 'p-8', value: '2rem' },
		{ name: 'xl (p-12)', class: 'p-12', value: '3rem' }
	];

	const radiusTokens = [
		{ name: 'Small (--radius-sm)', class: 'rounded-sm', value: '0.3rem' },
		{ name: 'Medium (--radius-md)', class: 'rounded-md', value: '0.4rem' },
		{ name: 'Large (--radius-lg)', class: 'rounded-lg', value: '0.5rem' },
		{ name: 'Extra Large (--radius-xl)', class: 'rounded-xl', value: '0.7rem' }
	];
</script>

<svelte:head>
	<title>JEB Incubator | Design Guide</title>
	<meta
		name="description"
		content="Official style and component guide for the JEB Incubator platform."
	/>
</svelte:head>

<div class="style-guide-body bg-background font-sans text-foreground">
	<main class="pdf-page mx-auto p-8 font-sans md:p-16">
		<header class="mb-12 border-b border-border pb-8">
			<div class="flex items-center space-x-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-card">
					<img src="/logo.png" alt="Logo" class="h-10 w-10" />
				</div>
				<div>
					<h1 class="font-playfair text-5xl font-bold text-foreground">Design System</h1>
					<p class="text-lg text-muted-foreground">Style and component guide for JEB Incubator</p>
				</div>
			</div>
		</header>

		<!-- 1. COLOUR PALETTE -->
		<section class="mb-16">
			<h2 class="section-title">1. Colour Palette</h2>
			<p class="section-description">
				Our palette uses CSS variables defined in <code class="code-inline">app.css</code>. The
				default theme is dark (Dark Navy & Cream). A light theme is available by applying the
				<code class="code-inline">.dark</code> class to a parent element (note: this seems inverted in
				the CSS, so we follow that convention).
			</p>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
				<div>
					<h3 class="mb-4 text-xl font-semibold">Dark Theme (Default)</h3>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{#each baseColors as color}
							<div class="space-y-1">
								<div class="{color.class} h-20 w-full rounded-lg border border-border"></div>
								<p class="text-sm font-medium">{color.name}</p>
								<p class="font-mono text-xs text-muted-foreground">{color.variable}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="dark rounded-xl border border-border bg-background p-6">
					<h3 class="mb-4 text-xl font-semibold text-foreground">
						Light Theme (<code class="code-inline">.dark</code>)
					</h3>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{#each baseColors as color}
							<div class="space-y-1">
								<div class="{color.class} h-20 w-full rounded-lg border border-border"></div>
								<p class="text-sm font-medium text-foreground">{color.name}</p>
								<p class="font-mono text-xs text-muted-foreground">{color.variable}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- 2. TYPOGRAPHY -->
		<section class="page-break mb-16">
			<h2 class="section-title">2. Typography</h2>
			<p class="section-description">
				We use a combination of two primary fonts to create a clear and elegant visual hierarchy.
			</p>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<h3 class="mb-2 font-mono text-lg tracking-wider text-muted-foreground uppercase">
						Headings
					</h3>
					<p class="mb-4">
						Use <strong class="text-foreground">Playfair Display</strong> for all headings (<code
							class="code-inline">font-playfair</code
						>) to convey sophistication and importance.
					</p>
					<div class="space-y-4">
						<h1 class="font-playfair text-5xl font-bold">Heading 1</h1>
						<h2 class="font-playfair text-4xl font-bold">Heading 2</h2>
						<h3 class="font-playfair text-3xl font-bold">Heading 3</h3>
						<h4 class="font-playfair text-2xl font-bold">Heading 4</h4>
					</div>
				</div>
				<div>
					<h3 class="mb-2 font-mono text-lg tracking-wider text-muted-foreground uppercase">
						Body & UI Text
					</h3>
					<p class="mb-4">
						Use <strong class="text-foreground">Geist Sans</strong> for body copy, labels, and all
						other UI text (<code class="code-inline">font-sans</code>). It is highly legible and
						neutral.
					</p>
					<div class="space-y-4 text-muted-foreground">
						<p class="text-lg leading-relaxed">
							This is a paragraph of body text. It's designed for readability. Visionary
							entrepreneurs create and develop technological solutions that transform industries. <a
								href="/"
								class="text-primary underline hover:no-underline">This is a text link</a
							> used to navigate.
						</p>
						<p>
							This is a smaller paragraph. It's suitable for descriptions, captions, and other
							secondary information within components.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 3. UI COMPONENTS -->
		<section class="page-break mb-16">
			<h2 class="section-title">3. UI Components</h2>
			<p class="section-description">
				Use these reusable Svelte components to ensure a consistent user experience across the
				platform.
			</p>
			<!-- BUTTONS -->
			<div class="mb-12">
				<h3 class="subsection-title">Buttons</h3>
				<div class="component-showcase">
					<div class="flex flex-wrap items-center gap-4">
						<Button size="lg">Primary Large</Button>
						<Button>Primary Default</Button>
						<Button size="sm">Primary Small</Button>
						<Button size="icon"><ImageIcon class="h-4 w-4" /></Button>
					</div>
					<div class="flex flex-wrap items-center gap-4">
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">
							<Trash2 class="mr-2 h-4 w-4" />
							Destructive
						</Button>
					</div>
				</div>
			</div>

			<!-- CARDS -->
			<div class="mb-12">
				<h3 class="subsection-title">Cards</h3>
				<div class="component-showcase">
					<div class="max-w-sm">
						<Card class="group flex h-full flex-col">
							<div class="relative overflow-hidden rounded-t-lg">
								<div class="flex h-48 w-full items-center justify-center bg-muted">
									<ImageIcon class="h-12 w-12 text-muted-foreground" />
								</div>
								<div class="absolute top-4 left-4">
									<Badge variant="secondary">FinTech</Badge>
								</div>
							</div>
							<CardHeader>
								<div class="flex items-center justify-between">
									<CardTitle class="font-playfair text-xl">Project Nova</CardTitle>
									<Badge variant="outline">Seed</Badge>
								</div>
							</CardHeader>
							<CardContent class="flex flex-1 flex-col">
								<CardDescription
									>A brief but compelling project description goes here.</CardDescription
								>
								<div class="mt-auto flex items-center justify-between pt-4">
									<span class="text-sm text-foreground">Paris, France</span>
									<Button variant="ghost" size="sm" class="text-foreground">
										Learn more
										<ArrowRight class="ml-2 h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<!-- FORMS -->
			<div>
				<h3 class="subsection-title">Forms</h3>
				<div class="component-showcase">
					<form class="w-full max-w-md space-y-6">
						<div class="grid w-full items-center gap-2">
							<Label for="name">Project Name</Label>
							<Input id="name" type="text" placeholder="e.g., Project Nova" />
						</div>
						<div class="grid w-full items-center gap-2">
							<Label for="sector">Sector</Label>
							<Select>
								<SelectTrigger id="sector" class="w-full">Select a sector</SelectTrigger>
								<SelectContent>
									<SelectItem value="fintech">FinTech</SelectItem>
									<SelectItem value="healthtech">HealthTech</SelectItem>
									<SelectItem value="saas">SaaS</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button type="submit" class="w-full">Submit Project</Button>
					</form>
				</div>
			</div>
		</section>

		<!-- 4. SPACING & ALIGNMENT -->
		<section class="page-break">
			<h2 class="section-title">4. Spacing & Alignment</h2>
			<p class="section-description">
				Consistent spacing creates rhythm and harmony. Our system is based on a <strong
					class="text-foreground">4px grid</strong
				>, aligned with Tailwind's default spacing scale. Use Tailwind's utility classes (<code
					class="code-inline">p-*, m-*, gap-*, space-y-*</code
				>) whenever possible.
			</p>

			<div class="mb-12">
				<h3 class="subsection-title">Spacing Scale</h3>
				<div class="component-showcase">
					<div class="flex flex-wrap gap-4">
						{#each spacingTokens as token}
							<div class="flex flex-col items-center space-y-2">
								<div
									class="flex h-28 w-28 items-center justify-center border border-border bg-card"
								>
									<div class="{token.class} h-fit w-fit bg-primary/50">
										<div class="h-8 w-8 bg-primary"></div>
									</div>
								</div>
								<p class="text-sm font-medium">{token.name}</p>
								<p class="font-mono text-xs text-muted-foreground">{token.value}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div>
				<h3 class="subsection-title">Border Radius</h3>
				<p class="mb-4 max-w-2xl text-muted-foreground">
					Border radius is controlled by CSS variables derived from <code class="code-inline"
						>--radius: 0.5rem</code
					>. Use Tailwind's <code class="code-inline">rounded-sm/md/lg/xl</code> classes.
				</p>
				<div class="component-showcase">
					<div class="flex flex-wrap gap-4">
						{#each radiusTokens as token}
							<div class="flex flex-col items-center space-y-2">
								<div class="{token.class} h-28 w-28 border border-border bg-card"></div>
								<p class="text-sm font-medium">{token.name}</p>
								<p class="font-mono text-xs text-muted-foreground">{token.value}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	@reference "../../app.css"

	/* Base styles for the guide itself */
	.style-guide-body {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.section-title {
		@apply mb-4 border-b border-border pb-4 font-playfair text-3xl font-bold;
	}

	.subsection-title {
		@apply mb-4 font-playfair text-2xl font-bold;
	}

	.section-description {
		@apply mb-8 max-w-3xl text-lg text-muted-foreground;
	}

	.component-showcase {
		@apply rounded-xl border border-border bg-card/30 p-8;
	}

	.code-inline {
		@apply rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground;
	}

	/* PDF Export Specifics: ensures clean page breaks and correct colors */
	@media print {
		/* This is the magic part! It forces the browser to print backgrounds. */
		* {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}

		.pdf-page {
			margin: 0;
			padding: 1cm;
			max-width: none;
			box-shadow: none;
		}
		.page-break {
			page-break-before: always;
		}
		/* Make sure borders and backgrounds are not transparent */
		.component-showcase {
			@apply border-border/50;
			background: transparent !important;
			box-shadow: none !important;
		}
		.dark {
			background-color: var(--background) !important;
		}
	}
</style>
