<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { slugify } from '$lib';
	import { ArrowRight, MessageSquare } from 'lucide-svelte';
	import { page } from '$app/stores';

	let { image, name, sector, maturity, id, adress, user } = $props();

	// Fallback for address if it's not provided
	const displayAddress = adress || 'Location not specified';
</script>

<Card
	class="group flex h-full flex-col overflow-hidden rounded-lg border-border pt-0 transition-all duration-300 hover:shadow-lg"
>
	<div class="relative overflow-hidden rounded-t-lg">
		<a
			href="/startups/{slugify(name)}"
			class="flex h-full flex-col text-foreground"
		>
			<img
				src={image || '/placeholder.png'}
				alt={name}
				class="h-48 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
			/>
		</a>
		{#if sector}
			<Badge
				variant="secondary"
				class="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm"
			>
				{sector}
			</Badge>
		{/if}
	</div>
	<CardHeader class="pt-4">
		<div class="flex items-center justify-between gap-2">
			<CardTitle class="font-playfair text-xl">{name}</CardTitle>
			{#if maturity}
				<Badge variant="outline">{maturity}</Badge>
			{/if}
		</div>
	</CardHeader>
	<CardContent class="flex flex-1 flex-col justify-between pt-0">
		<p class="text-sm text-muted-foreground">{displayAddress}</p>
		<div
			class="mt-4 flex items-center justify-end gap-2 {user && user.role === 'investor'
				? '!justify-between'
				: ''}"
		>
			{#if user && user.role === 'investor'}
				<form method="POST" action="?/startConversation">
					<input type="hidden" name="startupId" value={id} />
					<Button type="submit" size="sm">
						<MessageSquare class="mr-2 h-4 w-4" />
						Contact
					</Button>
				</form>
			{/if}
			<Button variant="ghost" size="sm" class="text-foreground" href="/startups/{slugify(name)}">
				Learn more
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</CardContent>
</Card>
