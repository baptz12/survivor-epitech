<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import {
		Rocket,
		Users,
		DollarSign,
		FilePlus,
		Newspaper,
		UserPlus,
		Bell,
		ChevronRight,
		CalendarDays,
		LogOut
	} from 'lucide-svelte';

	// Fake data for the dashboard, reflecting the incubator's activities
	const kpis = [
		{ title: 'Total Startups', value: '78', icon: Rocket, change: '+12.5% this quarter' },
		{ title: 'Active Investors', value: '124', icon: Users, change: '+5 new investors' },
		{ title: 'Pending Applications', value: '12', icon: FilePlus, change: '-2 from yesterday' },
		{ title: 'Total Funding', value: '€5.2M', icon: DollarSign, change: '+€250k this month' }
	];

	const recentActivities = [
		{
			user: 'TechInnovate',
			action: 'submitted a new project application',
			time: '2m ago',
			type: 'project'
		},
		{
			user: 'Jane Doe (Investor)',
			action: 'messaged the QuantumLeap team',
			time: '30m ago',
			type: 'message'
		},
		{
			user: 'Admin',
			action: 'approved the "EcoSolutions" project',
			time: '1h ago',
			type: 'approval'
		},
		{ user: 'DataDriven Inc.', action: 'updated their pitch deck', time: '3h ago', type: 'update' },
		{ user: 'John Smith', action: 'registered as a new investor', time: 'yesterday', type: 'user' }
	];

	const startupsBySector = [
		{ sector: 'Fintech', percentage: 35, color: 'var(--chart-1)' },
		{ sector: 'HealthTech', percentage: 25, color: 'var(--chart-2)' },
		{ sector: 'SaaS', percentage: 20, color: 'var(--chart-3)' },
		{ sector: 'GreenTech', percentage: 15, color: 'var(--chart-4)' },
		{ sector: 'Other', percentage: 5, color: 'var(--chart-5)' }
	];

	const newProjectsData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		values: [5, 8, 12, 7, 15, 11],
		max: 20
	};

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.ok) {
			// After successful logout, redirect to the login page
			await goto('/auth/login');
		} else {
			console.error('Logout failed');
			alert('Logout failed. Please try again.');
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - JEB Incubator</title>
	<meta
		name="description"
		content="Manage your incubator platform with comprehensive admin tools. Track startups, investors, applications, and platform activity."
	/>
</svelte:head>

<div class="flex min-h-screen w-full flex-col bg-background text-foreground">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<header class="flex items-center justify-between">
			<div>
				<h1 class="font-playfair text-3xl font-bold">Admin Dashboard</h1>
				<p class="text-muted-foreground">Welcome back! Here's a summary of platform activity.</p>
			</div>
			<div class="flex items-center gap-2">
				<Button size="icon" variant="outline" class="rounded-full">
					<Bell class="h-4 w-4" />
				</Button>
				<Button
					onclick={handleLogout}
					size="icon"
					variant="outline"
					class="cursor-pointer rounded-full"
				>
					<LogOut class="h-4 w-4" />
				</Button>
			</div>
		</header>

		<!-- KPI Cards -->
		<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			{#each kpis as kpi}
				<Card>
					<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle class="text-sm font-medium">{kpi.title}</CardTitle>
						<svelte:component this={kpi.icon} class="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div class="text-2xl font-bold">{kpi.value}</div>
						<p class="text-xs text-muted-foreground">{kpi.change}</p>
					</CardContent>
				</Card>
			{/each}
		</div>

		<div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
			<!-- Recent Activities Card -->
			<Card class="xl:col-span-2">
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>An overview of the latest actions on the platform.</CardDescription>
				</CardHeader>
				<CardContent>
					<ul class="space-y-4">
						{#each recentActivities as activity}
							<li class="flex items-center space-x-4">
								<div
									class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted"
								>
									{#if activity.type === 'project' || activity.type === 'update'}
										<Rocket class="h-5 w-5 text-primary" />
									{:else if activity.type === 'user'}
										<UserPlus class="h-5 w-5 text-accent" />
									{:else}
										<Bell class="h-5 w-5 text-muted-foreground" />
									{/if}
								</div>
								<div class="flex-1">
									<p class="text-sm leading-none font-medium text-foreground">
										<span class="font-bold">{activity.user}</span>
										{activity.action}
									</p>
									<p class="text-sm text-muted-foreground">{activity.time}</p>
								</div>
								<Button variant="ghost" size="icon" class="h-8 w-8 rounded-full">
									<ChevronRight class="h-4 w-4" />
								</Button>
							</li>
						{/each}
					</ul>
				</CardContent>
			</Card>

			<!-- Side Cards Column -->
			<div class="space-y-4 md:space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent class="grid grid-cols-2 gap-4">
						<Button href="/admin/startups/create"
							><FilePlus class="mr-2 h-4 w-4" /> Add Project</Button
						>
						<Button href="/admin/startups"
							><Newspaper class="mr-2 h-4 w-4" /> Manage Projects</Button
						>
						<Button href="/admin/users/create"
							><UserPlus class="mr-2 h-4 w-4" /> Create new user</Button
						>
						<Button href="/admin/users"><Users class="mr-2 h-4 w-4" /> Manage Users</Button>
						<Button href="/admin/news/create"><Newspaper class="mr-2 h-4 w-4" /> Post News</Button>
						<Button href="/admin/news"><Newspaper class="mr-2 h-4 w-4" /> Manage News</Button>
						<Button href="/admin/events/create"
							><CalendarDays class="mr-2 h-4 w-4" /> Create Event</Button
						>
						<Button href="/admin/events/edit"
							><CalendarDays class="mr-2 h-4 w-4" /> Manage Events</Button
						>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Startups by Sector</CardTitle>
						<CardDescription>Distribution across different sectors.</CardDescription>
					</CardHeader>
					<CardContent>
						<ul class="space-y-3">
							{#each startupsBySector as item}
								<li>
									<div class="mb-1 flex justify-between">
										<span class="text-sm text-muted-foreground">{item.sector}</span>
										<span class="text-sm font-semibold text-foreground">{item.percentage}%</span>
									</div>
									<div class="h-2 w-full rounded-full bg-muted">
										<div
											class="h-2 rounded-full"
											style="width: {item.percentage}%; background-color: {item.color};"
										></div>
									</div>
								</li>
							{/each}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- New Projects Chart -->
		<Card>
			<CardHeader>
				<CardTitle>New Project Registrations</CardTitle>
				<CardDescription>Monthly new project sign-ups for the last 6 months.</CardDescription>
			</CardHeader>
			<CardContent class="pt-4 pl-2">
				<div class="flex h-64 items-end gap-2 sm:gap-4">
					{#each newProjectsData.values as value, i}
						<div class="group relative flex h-full flex-1 flex-col items-center justify-end">
							<div
								class="absolute -top-8 hidden rounded bg-card p-1.5 text-xs text-card-foreground shadow-lg group-hover:block"
							>
								{value} projects
							</div>
							<div
								class="w-full rounded-t-lg bg-primary transition-all duration-300 hover:bg-primary/90"
								style="height: {(value / newProjectsData.max) * 100}%;"
								title="{value} projects"
							></div>
							<span class="mt-2 text-xs text-muted-foreground">{newProjectsData.labels[i]}</span>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</main>
</div>
