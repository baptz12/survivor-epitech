<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Download, ArrowLeft } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	function goBackOrFallback() {
		if (!browser) {
			return;
		}

		if (history.length > 1) {
			history.back();
		} else {
			goto('/startups');
		}
	}

	let { data } = $state($page);
	let { project } = data;

	const projectDate = new Date(project.created_at);
	const projectYear = projectDate.getFullYear();

	// Create a slug-like version of the project name for the download attribute
	const downloadFileName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch.pdf`;
</script>

<svelte:head>
	<title>{project.name} - JEB Incubator</title>
	<meta
		name="description"
		content={project.description ||
			`Learn more about ${project.name}, an innovative startup in the ${project.sector || 'technology'} sector.`}
	/>
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<Header />
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<!-- Back Button -->
		<button
			onclick={goBackOrFallback}
			class="mb-8 inline-flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-stone-200"
		>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back
		</button>

		<!-- Header Section -->
		<header
			class="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
		>
			<div>
				<h1 class="font -playfair text-4xl font-bold text-primary md:text-5xl">{project.name}</h1>
				<div class="mt-4 flex flex-wrap gap-2">
					{#if project.sector}
						<Badge variant="secondary">{project.sector}</Badge>
					{/if}
					{#if project.maturity}
						<Badge variant="secondary">{project.maturity}</Badge>
					{/if}
					{#if project.address}
						<Badge variant="outline" class="border-border text-foreground">
							{project.address}
						</Badge>
					{/if}
				</div>
			</div>

			<!-- EXPORT BUTTON -->
			<a
				href={`/api/startups/${project.id}/pdf`}
				download={downloadFileName}
				class="mt-4 md:mt-0"
				aria-label="Download project pitch deck"
			>
				<Button class="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
					<Download class="mr-2 h-4 w-4" />
					Export Pitch PDF
				</Button>
			</a>
		</header>

		<!-- Main Content -->
		<main class="space-y-8">
			<!-- Image -->
			<img
				src={project.image_path || '/placeholder.png'}
				alt="{project.name} cover image"
				class="mb-8 aspect-video w-full rounded-lg object-cover shadow-lg"
			/>

			<!-- Description -->
			<section>
				<h2 class="mb-4 font-playfair text-2xl font-bold">About the Project</h2>
				<p class="text-lg leading-relaxed text-muted-foreground">
					{project.description || 'No description available.'}
				</p>
			</section>

			<!-- Key Details -->
			<section>
				<h2 class="mb-4 font-playfair text-2xl font-bold">Key Details</h2>
				<div
					class="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card/50 p-6 sm:grid-cols-2"
				>
					<div>
						<span class="block text-sm font-medium text-muted-foreground">Website</span>
						{#if project.website_url}
							<a
								href={project.website_url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary hover:underline"
							>
								{project.website_url}
							</a>
						{:else}
							<span class="text-muted-foreground">Not provided</span>
						{/if}
					</div>
					<div>
						<span class="block text-sm font-medium text-muted-foreground">Founding Year</span>
						<span class="text-foreground">{projectYear || 'N/A'}</span>
					</div>
				</div>
			</section>
		</main>
	</div>
	<Footer />
</div>
