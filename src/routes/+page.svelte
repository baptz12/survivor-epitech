<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight, Users, TrendingUp, Award } from 'lucide-svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';
	let { data } = $state(page);
	let featuredProjects = $derived(data.projects || []);

	let stats = [
		{ label: 'Incubated Startups', value: '150+', icon: Users },
		{ label: 'Success Rate', value: '85%', icon: TrendingUp },
		{ label: 'Funds Raised', value: '€50M', icon: Award }
	];
</script>

<svelte:head>
	<title>JEB Incubator - Accelerator for Innovative Startups</title>
	<meta
		name="description"
		content="We support visionary entrepreneurs in creating and developing technological solutions that transform industries. Join our community of innovative startups."
	/>
</svelte:head>

<div class="min-h-screen bg-background">
	<Header />
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-background to-card/30 py-20">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-6 font-playfair text-5xl font-bold text-balance text-foreground md:text-6xl">
				Accelerator for
				<span class="text-primary">Innovative Startups</span>
			</h1>
			<p class="mx-auto mb-8 max-w-3xl text-xl text-pretty text-muted-foreground">
				We support visionary entrepreneurs in creating and developing technological solutions that
				transform industries.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90">
					<a href="/startups" class="flex items-center">
						Discover our projects
						<ArrowRight class="ml-2 h-5 w-5" />
					</a>
				</Button>
			</div>
		</div>
	</section>
	<!-- Stats Section -->
	<section class="bg-card py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each stats as stat (stat.label)}
					{@const Icon = stat.icon}
					<div class="text-center">
						<div
							class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
						>
							<Icon class="h-8 w-8 text-primary" />
						</div>
						<div class="mb-2 text-3xl font-bold text-foreground">{stat.value}</div>
						<div class="text-muted-foreground">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
	<!-- Featured Projects -->
	<section id="projects" class="py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 font-playfair text-4xl font-bold text-foreground">Our Featured Projects</h2>
				<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
					Discover the innovative startups we support towards success
				</p>
			</div>
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{#each featuredProjects as project (project.id)}
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
		</div>
	</section>
	<!-- CTA Section -->
	<section class="bg-card py-20 text-foreground">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-6 font-playfair text-4xl font-bold">
				Ready to Transform Your Idea into Success?
			</h2>
			<p class="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
				Join our community of entrepreneurs and benefit from our expertise, network, and resources
				to accelerate your growth.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
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
