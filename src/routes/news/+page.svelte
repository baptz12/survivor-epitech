<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ArrowRight } from 'lucide-svelte';

	import { slugify } from '$lib';
	import { page } from '$app/stores';

	let { data } = $state($page);

	let featuredNews = $derived(data.news?.[0]);
	let olderNews = $derived(data.news?.slice(1) || []);

	// Define styles using CSS variables for better theming
	const defaultStyle = { color: 'bg-muted/20 text-muted-foreground border-muted/50' };

	const newsTypeStyles = {
		Launch: { color: 'bg-primary/20 text-primary border-primary/50' },
		Funding: { color: 'bg-accent/20 text-accent border-accent/50' },
		Award: { color: 'bg-chart-5/20 text-chart-5 border-chart-5/50' },
		Partnership: { color: 'bg-chart-4/20 text-chart-4 border-chart-4/50' } // Using chart-4 for a distinct color
	};

	function getStyleForCategory(category: string | null | undefined) {
		// Si la catégorie est nulle, vide ou inconnue, on renvoie le style par défaut
		if (!category || !newsTypeStyles[category]) {
			return defaultStyle;
		}
		return newsTypeStyles[category];
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>News & Insights - JEB Incubator</title>
	<meta
		name="description"
		content="Stay updated with our latest funding rounds, events, competitions, and calls for projects. Get insights from the JEB Incubator ecosystem."
	/>
</svelte:head>

<div class="min-h-screen bg-background">
	<Header />

	<!-- Hero Section -->
	<section class="border-b border-border bg-gradient-to-br from-background to-card/30 py-20">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-4 font-playfair text-5xl font-bold text-foreground">
				Incubator News & Insights
			</h1>
			<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
				Stay updated with our latest funding rounds, events, competitions, and calls for projects.
			</p>
		</div>
	</section>

	<!-- Section "Featured News" -->
	{#if featuredNews}
		{@const style = getStyleForCategory(featuredNews?.category)}
		<section class="py-20">
			<div class="container mx-auto px-4">
				<a
					href="/news/{slugify(featuredNews.title)}"
					class="group grid grid-cols-1 items-center gap-12 md:grid-cols-2"
				>
					<div class="overflow-hidden rounded-lg">
						<img
							src={featuredNews.image_path || '/placeholder.png'}
							alt={featuredNews.title}
							class="h-100 w-300 object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
					<div>
						<div class="mb-4 flex items-center">
							<span class="rounded-full border px-3 py-1 text-xs font-semibold {style?.color}">
								{featuredNews.category || 'News'}
							</span>
						</div>
						<h2 class="mb-4 font-playfair text-4xl font-bold text-foreground">
							{featuredNews.title}
						</h2>
						<p class="mb-2 text-sm text-muted-foreground">{formatDate(featuredNews.news_date)}</p>
						<p class="mb-6 line-clamp-3 text-lg text-muted-foreground">{featuredNews.location}</p>
						<span class="flex items-center font-semibold text-foreground">
							Read more
							<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</span>
					</div>
				</a>
			</div>
		</section>
	{/if}

	<!-- Grille des articles plus anciens -->
	{#if olderNews.length > 0}
		<section class="border-t border-border bg-card py-20">
			<div class="container mx-auto px-4">
				<h2 class="mb-12 text-center font-playfair text-4xl font-bold text-foreground">
					More News
				</h2>
				<div class="grid-c ols-1 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each olderNews as newsItem (newsItem.id)}
						{@const style = getStyleForCategory(newsItem?.category)}
						<a
							href="/news/{slugify(newsItem.title)}"
							class="group flex h-full flex-col rounded-lg border border-border bg-background p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg"
						>
							<div class="mb-4 flex items-center justify-between">
								<span class="rounded-full border px-3 py-1 text-xs font-semibold {style?.color}">
									{newsItem.category || 'News'}
								</span>
								<p class="text-sm text-muted-foreground">{formatDate(newsItem.news_date)}</p>
							</div>
							<h3 class="font-playfair text-2xl font-bold text-foreground">{newsItem.title}</h3>
							<p class="line-clamp-4 flex-grow pt-4 text-muted-foreground">{newsItem.location}</p>
							<div class="mt-auto flex items-center pt-4 text-sm font-semibold text-foreground">
								Read more
								<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<Footer />
</div>
