<!-- src/routes/admin/events/create/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<div class="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8">
			<Button variant="ghost" href="/startup/dashboard" class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to Dashboard
			</Button>
			<h1 class="font-playfair text-3xl font-bold text-foreground md:text-4xl">Plan a New Event</h1>
			<p class="mt-1 text-muted-foreground">
				Schedule conferences, workshops, and pitch sessions for the incubator.
			</p>
		</header>

		<form method="POST" class="space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2 md:col-span-2">
					<Label for="title">Event Title</Label>
					<Input id="title" name="title" placeholder="e.g., Annual Investor Pitch Day" required />
				</div>

				<div class="space-y-2">
					<Label for="category">Event Type</Label>
					<select
						id="category"
						name="category"
						class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						required
					>
						<option value="" disabled selected>Select a category...</option>
						<option value="Conference">Conference</option>
						<option value="Pitch Session">Pitch Session</option>
						<option value="Workshop">Workshop</option>
						<option value="Networking">Networking</option>
					</select>
				</div>

				<div class="space-y-2">
					<Label for="event_date">Date and Time</Label>
					<Input id="event_date" name="event_date" type="datetime-local" required />
				</div>

				<div class="space-y-2 md:col-span-2">
					<Label for="location">Location</Label>
					<Input id="location" name="location" placeholder="e.g., Grand Auditorium or 'Online'" />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="Provide details about the event, its purpose, speakers, and schedule."
					class="min-h-[200px]"
					required
				/>
			</div>

			{#if $page.form?.error}
				<p class="text-sm font-medium text-destructive">{$page.form.error}</p>
			{/if}

			<div class="flex justify-end">
				<Button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Create Event
				</Button>
			</div>
		</form>
	</div>
</div>