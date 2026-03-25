<script>
	import { Card, CardContent } from '$lib/components/ui/card';
	import { slugify } from '$lib';
	import { page } from '$app/stores';
  
	export let image;
	export let name;
	export let description;
  </script>
  
  <Card
	class="group flex h-full flex-col border border-border overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg w-64"
  >
	<a
	  href="/startups/{slugify(name)}?from={$page.url.pathname}"
	  class="flex h-full flex-col text-foreground"
	>
	  <!-- Image avec fallback -->
	  {#if image}
		<img
		src={image}
		alt={name}
		class="w-42 h-42 rounded-full object-cover mx-auto transition-transform duration-300 group-hover:scale-105"
		on:error={(e) => e.target.src = '/placeholder.png'}
		/>
	
	  {:else}
		<div class="h-48 w-full flex items-center justify-center bg-gray-200 text-gray-600 text-3xl font-bold">
		  {name?.charAt(0) ?? "?"}
		</div>
	  {/if}
  
	  <CardContent class="flex flex-1 flex-col p-4">
		<!-- Nom -->
		<h2 class="mb-2 text-lg font-bold text-foreground">{name}</h2>
  
		<!-- Description limitée en taille -->
		<p class="text-sm text-muted-foreground line-clamp-3">
		  {description || "Pas de description disponible"}
		</p>
	  </CardContent>
	</a>
  </Card>
  