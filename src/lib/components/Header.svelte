<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { User, Sun, Moon } from 'lucide-svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	let currentPath = $derived(page.url.pathname);
	let { user } = $derived(page.data);
	// State for theme toggle. Note: .dark class in app.css enables the LIGHT theme.
	let isLightMode = $state(false);
	// On component mount, sync the button's state with the actual theme on the <html> element.
	// The initial theme is set by the script in app.html to prevent a flash of unstyled content.
	onMount(() => {
		isLightMode = document.documentElement.classList.contains('dark');
	});
	$effect(() => {
		if (isLightMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'light');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'dark');
		}
	});
	function toggleTheme() {
		isLightMode = !isLightMode;
	}
	const uid = 'theme-toggle';
</script>

<header class="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<div
					class="relative flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary"
				>
					<a href="/"><img src="/logo.png" alt="Logo" /></a>
				</div>
				<div class="flex flex-col">
					<span class="font-playfair text-2xl leading-none font-bold text-foreground">JEB</span>
					<span
						class="font-sans text-xs leading-none tracking-wider text-muted-foreground uppercase"
					>
						INCUBATOR
					</span>
				</div>
			</div>
			<nav class="hidden items-center space-x-8 md:flex">
				<a
					href="/"
					class={currentPath === '/'
						? 'font-medium text-foreground'
						: 'text-muted-foreground transition-colors hover:text-foreground'}
				>
					Home
				</a>
				<a
					href="/startups"
					class={currentPath === '/startups'
						? 'font-medium text-foreground'
						: 'text-muted-foreground transition-colors hover:text-foreground'}
				>
					Projects
				</a>
				<a
					href="/news"
					class={currentPath === '/news'
						? 'font-medium text-foreground'
						: 'text-muted-foreground transition-colors hover:text-foreground'}
				>
					News
				</a>
				<a
					href="/events"
					class={currentPath === '/events'
						? 'font-medium text-foreground'
						: 'text-muted-foreground transition-colors hover:text-foreground'}
				>
					Events
				</a>
				<a
					href="/about"
					class={currentPath === '/about'
						? 'font-medium text-foreground'
						: 'text-muted-foreground transition-colors hover:text-foreground'}
				>
					About
				</a>
			</nav>
			<div class="flex items-center space-x-4">
				<div>
					<Label for={uid} class="sr-only">Toggle switch</Label>
					<div
						class="group inline-flex items-center gap-2"
						data-state={isLightMode ? 'checked' : 'unchecked'}
					>
						<button
							id="{uid}-off-label"
							class="flex-1 cursor-pointer text-right text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
							onclick={toggleTheme}
						>
							<Moon size={16} aria-hidden="true" />
						</button>
						<Switch
							id={uid}
							bind:checked={isLightMode}
							aria-labelledby="{uid}-off-label {uid}-on-label"
							aria-label="Toggle between dark and light mode"
						/>
						<button
							id="{uid}-on-label"
							class="flex-1 cursor-pointer text-left text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
							onclick={toggleTheme}
						>
							<Sun size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
				{#if user}
					<!-- CAS 1 : L'utilisateur EST connecté -->
					<a
						href="/startup/dashboard"
						aria-label="Go to your dashboard"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
					>
						<User class="h-5 w-5" />
					</a>
				{:else}
					<!-- CAS 2 : L'utilisateur N'EST PAS connecté -->
					<a href="/auth/login">
						<Button>Login</Button>
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>
