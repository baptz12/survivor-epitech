<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';

	let { data } = $state($page);
	let news = $derived(data.news);

	marked.setOptions({
		breaks: true
	});

	let descriptionHTML = $derived(news?.description ? marked.parse(news.description) : '');

	// Logique de style pour les badges de catégorie
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
	<title>{news?.title || 'News'} | JEB Incubator</title>
	<meta name="description" content={news?.description || 'News from JEB Incubator.'} />
</svelte:head>

<div class="min-h-screen bg-background">
	<Header />

	{#if news}
		{@const style = getStyleForCategory(news.category)}
		<article class="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
			<a
				href="/news"
				class="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft class="h-4 w-4" />
				Back to News
			</a>

			<header class="mb-12 text-center">
				<div class="mb-4 flex items-center justify-center">
					<span class="rounded-full border px-3 py-1 text-sm font-semibold {style.color}">
						{news.category || 'News'}
					</span>
				</div>
				<h1
					class="mb-4 font-playfair text-4xl font-bold text-balance text-foreground md:text-5xl lg:text-6xl"
				>
					{news.title}
				</h1>
				<p class="text-lg text-muted-foreground">
					Published on {formatDate(news.news_date)}
				</p>
			</header>

			<div class="mb-12 overflow-hidden rounded-lg border border-border shadow-md">
				<img
					src={news.image_path || '/placeholder.png'}
					alt={news.title}
					class="aspect-video w-full object-cover"
				/>
			</div>

			<div class="prose prose-invert lg:prose-xl mx-auto max-w-full">
				{@html descriptionHTML}
			</div>
		</article>
	{:else}
		<p class="py-20 text-center text-muted-foreground">Loading article...</p>
	{/if}

	<Footer />
</div>

<style>
	.prose {
		--tw-prose-body: var(--foreground);
		--tw-prose-headings: var(--foreground);
		--tw-prose-links: var(--primary);
	}
</style>
