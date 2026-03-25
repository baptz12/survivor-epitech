<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Search, Filter } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	// Data from load
	let projects = $state(data.projects || []);
	let sectors = $state(data.sectors || []);
	let maturities = $state(data.maturities || []);

	let searchTerm = $state('');
	let selectedSector = $state<string[]>([]);
	let selectedMaturity = $state<string[]>([]);

	let isMounted = false;
	onMount(() => (isMounted = true));

	async function fetchProjects() {
		if (!isMounted) return;

		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (selectedSector.length > 0) params.set('sector', selectedSector.join(','));
		if (selectedMaturity.length > 0) params.set('maturity', selectedMaturity.join(','));

		try {
			const response = await fetch(`/api/startups?${params.toString()}`);
			if (response.ok) {
				const result = await response.json();
				projects = result.data || []
			}
		} catch (error) {
			console.error('Failed to fetch projects:', error);
		}
	}

	let debounceTimeout: number;

	$effect(() => {
		// Timer to handle crash or bad stuff
		const _s = searchTerm;
		const _ss = selectedSector;
		const _sm = selectedMaturity;

		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(fetchProjects, 300);
	});
</script>

<svelte:head>
	<title>Startups Portfolio - JEB Incubator</title>
	<meta
		name="description"
		content="Explore our diverse ecosystem of innovative technology startups. Browse by sector, maturity stage, and location to discover the next big thing."
	/>
</svelte:head>

<div class="min-h-screen bg-background">
	<Header />

	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-background to-card/30 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h1 class="mb-4 font-playfair text-4xl font-bold text-foreground md:text-5xl">
					Our Portfolio of <span class="text-primary">Innovative Startups</span>
				</h1>
				<p class="mx-auto max-w-3xl text-xl text-muted-foreground">
					Explore the diverse ecosystem of technology companies we've helped grow from idea to
					market success
				</p>
			</div>
			<!-- Filters -->
			<div class="mx-auto mb-12 max-w-4xl">
				<div class="flex flex-col items-center gap-4 md:flex-row">
					<div class="relative flex-1">
						<Search
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
						/>
						<Input
							placeholder="Search by name, keyword, address..."
							bind:value={searchTerm}
							class="pl-10"
						/>
					</div>
					<div class="flex gap-4">
						<Select bind:value={selectedSector}>
							<SelectTrigger class="w-40">
								<Filter class="mr-2 h-4 w-4" />
								Sector
							</SelectTrigger>
							<SelectContent>
								{#each sectors as sector}
									<SelectItem value={sector}>
										{sector === '' ? 'All sectors' : sector}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
						<Select bind:value={selectedMaturity}>
							<SelectTrigger class="w-40">Maturity</SelectTrigger>
							<SelectContent>
								{#each maturities as maturity}
									<SelectItem value={maturity}>
										{maturity === '' ? 'All maturities' : maturity}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Projects Grid -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each projects as project (project.id)}
					<ProjectCard
						image={project.image_path}
						name={project.name}
						sector={project.sector}
						maturity={project.maturity}
						description={project.description}
						id={project.id}
						adress={project.address}
					/>
				{/each}
			</div>
			{#if projects.length === 0}
				<div class="py-16 text-center">
					<p class="text-lg text-muted-foreground">No projects found matching your criteria.</p>
					<Button
						variant="outline"
						on:click={() => {
							searchTerm = '';
							selectedSector = '';
							selectedMaturity = '';
						}}
						class="mt-4 border-primary text-primary hover:bg-primary/10 hover:text-primary"
					>
						Clear filters
					</Button>
				</div>
			{/if}
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-card py-20 text-foreground">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-6 font-playfair text-4xl font-bold">Interested in Our Portfolio?</h2>
			<p class="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
				Get detailed insights about our startups and their success stories in our comprehensive
				portfolio brochure.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button
					size="lg"
					variant="secondary"
					class="bg-secondary text-secondary-foreground hover:bg-secondary/80"
				>
					Apply to Join
				</Button>
				<Button
					size="lg"
					variant="secondary"
					class="bg-secondary text-secondary-foreground hover:bg-secondary/80"
				>
					Download brochure
				</Button>
			</div>
		</div>
	</section>

	<Footer />
</div>
