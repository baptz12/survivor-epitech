<!-- src/routes/startup/opportunities/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, ExternalLink } from 'lucide-svelte';

	// State to manage the active tab
	let activeTab: 'projects' | 'funding' | 'investors' = 'projects';

	// --- DUMMY DATA ---
	// Replace this with data loaded from your server (e.g., via a `load` function)

	const callsForProjects = [
		{
			title: 'Future of FinTech Challenge 2025',
			organization: 'Innovate Bank & Capital Ventures',
			deadline: 'October 31, 2025',
			description:
				'Seeking disruptive solutions in blockchain, AI-powered lending, and personal finance management. Winners receive a pilot project opportunity and potential seed funding.',
			category: 'FinTech',
			url: '#'
		},
		{
			title: 'Sustainable Tech Grant',
			organization: 'Green Future Foundation',
			deadline: 'November 20, 2025',
			description:
				'A call for startups developing technologies that address climate change, promote circular economies, or enhance renewable energy solutions.',
			category: 'CleanTech',
			url: '#'
		},
		{
			title: 'HealthTech Innovation Call',
			organization: 'Helix Health Incubator',
			deadline: 'December 15, 2025',
			description:
				'We are looking for groundbreaking ideas in telemedicine, digital diagnostics, and personalized patient care. Selected startups will join our next incubation cohort.',
			category: 'HealthTech',
			url: '#'
		}
	];

	const fundingOpportunities = [
		{
			title: 'Seed Round for AI Innovators',
			type: 'Seed Funding',
			amount: '$250k - $750k',
			description:
				'Early-stage fund targeting AI-first companies with a validated MVP and early traction. Focus on SaaS, automation, and data analytics.',
			status: 'Open'
		},
		{
			title: 'Series A for B2B SaaS',
			type: 'Series A',
			amount: '$2M - $5M',
			description:
				'Growth capital for B2B SaaS startups with strong monthly recurring revenue and a proven product-market fit, looking to scale their sales and marketing teams.',
			status: 'Open'
		},
		{
			title: 'Impact Investment Fund',
			type: 'Grant / Seed',
			amount: 'Up to $500k',
			description:
				'Dedicated to startups with a measurable social or environmental impact. Open to various sectors, including education, sustainability, and social equity.',
			status: 'Closes Soon'
		}
	];

	const investorMatches = [
		{
			name: 'Quantum Ventures',
			focus: 'Deep Tech & AI',
			stage: 'Pre-Seed, Seed',
			checkSize: '$100k - $1M',
			description:
				'A team of former founders and technologists backing ambitious technical teams solving hard problems.'
		},
		{
			name: 'Momentum Growth Partners',
			focus: 'Marketplaces & E-commerce',
			stage: 'Seed, Series A',
			checkSize: '$500k - $4M',
			description:
				'We partner with consumer-focused startups that have a clear path to profitability and brand loyalty.'
		},
		{
			name: 'Catalyst Angel Group',
			focus: 'SaaS & FinTech',
			stage: 'Angel, Pre-Seed',
			checkSize: '$50k - $250k',
			description:
				'A network of experienced operators and executives investing in the next generation of software businesses.'
		}
	];
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-4xl font-bold text-foreground">Opportunities Hub</h1>
			<p class="mt-2 text-lg text-muted-foreground">
				Discover calls for projects, funding opportunities, and investor matches to accelerate your
				growth.
			</p>
		</header>

		<!-- Tab Navigation -->
		<div class="mt-8 mb-12 border-b border-border">
			<nav class="-mb-px flex justify-start gap-6">
				<button
					class="whitespace-nowrap border-b-2 px-1 py-4 text-lg font-bold transition-colors {activeTab ===
					'projects'
						? 'border-primary text-primary'
						: 'border-transparent text-muted-foreground hover:border-gray-400/50 hover:text-foreground'}"
					on:click={() => (activeTab = 'projects')}
				>
					Calls for Projects
				</button>
				<button
					class="whitespace-nowrap border-b-2 px-1 py-4 text-lg font-bold transition-colors {activeTab ===
					'funding'
						? 'border-primary text-primary'
						: 'border-transparent text-muted-foreground hover:border-gray-400/50 hover:text-foreground'}"
					on:click={() => (activeTab = 'funding')}
				>
					Funding Opportunities
				</button>
				<button
					class="whitespace-nowrap border-b-2 px-1 py-4 text-lg font-bold transition-colors {activeTab ===
					'investors'
						? 'border-primary text-primary'
						: 'border-transparent text-muted-foreground hover:border-gray-400/50 hover:text-foreground'}"
					on:click={() => (activeTab = 'investors')}
				>
					Investor Matches
				</button>
			</nav>
		</div>

		<!-- Content Area -->
		<div class="space-y-8">
			<!-- Calls for Projects Section -->
			{#if activeTab === 'projects'}
				<section id="projects" class="space-y-6">
					{#each callsForProjects as call}
						<div
							class="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/80 hover:shadow-md"
						>
							<div class="flex flex-col justify-between sm:flex-row">
								<div>
									<span
										class="mb-2 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary-foreground"
										>{call.category}</span
									>
									<h3 class="font-playfair text-2xl font-bold text-foreground">{call.title}</h3>
									<p class="mt-1 font-semibold text-muted-foreground">{call.organization}</p>
									<p class="mt-3 max-w-2xl text-foreground/90">{call.description}</p>
								</div>
								<div class="mt-4 flex-shrink-0 text-left sm:ml-6 sm:mt-0 sm:text-right">
									<p class="font-semibold text-primary">Deadline: {call.deadline}</p>
									<Button href={call.url} target="_blank" class="mt-4">
										Learn More
										<ExternalLink class="ml-2 h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					{/each}
				</section>
			{/if}

			<!-- Funding Opportunities Section -->
			{#if activeTab === 'funding'}
				<section id="funding" class="space-y-6">
					{#each fundingOpportunities as fund}
						<div
							class="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center"
						>
							<div class="flex-grow">
								<div class="flex items-center gap-4">
									<h3 class="font-playfair text-2xl font-bold text-foreground">{fund.title}</h3>
									<span
										class="rounded-full px-3 py-1 text-xs font-semibold {fund.status === 'Open'
											? 'bg-accent/20 text-accent'
											: 'bg-destructive/20 text-destructive'}"
									>
										{fund.status}
									</span>
								</div>
								<p class="mt-1 text-lg font-semibold text-primary">{fund.amount}</p>
								<p class="mt-3 text-foreground/90">{fund.description}</p>
							</div>
							<div class="flex-shrink-0">
								<Button>Request Introduction</Button>
							</div>
						</div>
					{/each}
				</section>
			{/if}

			<!-- Investor Matches Section -->
			{#if activeTab === 'investors'}
				<section id="investors" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{#each investorMatches as investor}
						<div
							class="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
						>
							<h3 class="font-playfair text-2xl font-bold text-foreground">{investor.name}</h3>
							<div class="my-3 flex flex-wrap gap-2">
								<span
									class="rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
									>Focus: {investor.focus}</span
								>
								<span
									class="rounded-full border border-accent/50 bg-accent/20 px-3 py-1 text-xs font-medium text-accent"
									>Stage: {investor.stage}</span
								>
							</div>
							<p class="flex-grow text-foreground/90">{investor.description}</p>
							<div class="mt-4 flex items-center justify-between">
								<span class="font-semibold text-muted-foreground"
									>Check Size: {investor.checkSize}</span
								>
								<Button variant="outline">View Profile</Button>
							</div>
						</div>
					{/each}
				</section>
			{/if}
		</div>
	</div>
</div>