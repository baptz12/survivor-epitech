<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Plus } from 'lucide-svelte';

	let { data } = $props();

	const roleStyles: Record<string, string> = {
		Admin: 'bg-primary/20 text-primary border-primary/50',
		Editor: 'bg-accent/20 text-accent border-accent/50',
		'Startup Founder': 'bg-chart-4/20 text-chart-4 border-chart-4/50',
		Investor: 'bg-chart-5/20 text-chart-5 border-chart-5/50',
		Viewer: 'bg-muted/20 text-muted-foreground border-muted/50'
	};
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">
						User Management
					</h1>
					<p class="mt-1 text-muted-foreground">Add, edit, or remove user accounts.</p>
				</div>
				<Button href="/admin/users/create">
					<Plus class="mr-2 h-4 w-4" />
					Add New User
				</Button>
			</div>
		</header>

		<div class="space-y-4">
			{#each data.users as user (user.id)}
				<div
					class="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary"
						>
							{#if user.image_path}
								<img src={user.image_path} alt={user.name} class="h-full w-full object-cover" />
							{:else}
								<span class="text-xl font-bold text-secondary-foreground">
									{user.name.charAt(0)}
								</span>
							{/if}
						</div>
						<div>
							<p class="font-bold text-foreground">{user.name}</p>
							<p class="text-sm text-muted-foreground">{user.email}</p>
						</div>
					</div>

					<div class="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
						<span
							class="rounded-full border px-3 py-1 text-xs font-semibold {roleStyles[user.role] ??
								roleStyles['Viewer']}"
						>
							{user.role}
						</span>
						<Button href={`/admin/users/${user.id}/edit`} variant="outline" size="sm">
							Edit User
						</Button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>