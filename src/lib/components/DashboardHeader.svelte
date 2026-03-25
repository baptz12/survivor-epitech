<!-- src/lib/components/DashboardHeader.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ExternalLink, LogOut, Mail } from 'lucide-svelte';

	let { startup } = $props<{ startup: { name: string; slug_url: string } }>();

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.ok) {
			await goto('/auth/login');
		} else {
			console.error('Logout failed');
			alert('Logout failed. Please try again.');
		}
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<!-- 1. Côté Gauche : Logo (Structure identique au header principal) -->
			<div class="flex items-center space-x-2">
				<div
					class="relative flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800"
				>
					<a href="/" aria-label="Go to homepage"><img src="/logo.png" alt="Logo" /></a>
				</div>
				<div class="flex flex-col">
					<span class="font-playfair text-2xl font-bold leading-none text-stone-200">JEB</span>
					<span
						class="font-sans text-xs uppercase leading-none tracking-wider text-stone-300"
					>
						INCUBATOR
					</span>
				</div>
			</div>

			<!-- 2. Centre : Message de Bienvenue (Remplace la <nav>) -->
			<div class="hidden text-center md:block">
				<h1 class="font-playfair text-xl font-bold text-foreground">
					Welcome back, {startup.name}!
				</h1>
				<p class="-mt-1 text-sm text-muted-foreground">Dashboard</p>
			</div>

			<!-- 3. Côté Droit : Boutons d'Action -->
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					class="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
					href="/startups/{startup.slug_url}"
                    target="_blank"
				>
					<ExternalLink class="mr-2 h-4 w-4" />
					View Public Profile
				</Button>
				<Button href="/messages" class="bg-primary text-primary-foreground hover:bg-primary/90">
					<Mail class="mr-2 h-4 w-4" />
					Messages
				</Button>
				<Button
					onclick={handleLogout}
					variant="ghost"
					size="icon"
					aria-label="Log out"
					class="cursor-pointer"
				>
					<LogOut class="h-5 w-5" />
				</Button>
			</div>
		</div>
	</div>
</header>