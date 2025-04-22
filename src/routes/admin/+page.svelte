<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { userArray, check, isAdmin } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMsg = $state(false);

	async function handleLogin() {
		loading = true;
		errorMsg = false;
		try {
			await signInWithEmailAndPassword(auth, email, password);
			isAdmin.value = true;
			loading = false;
		} catch (error) {
			console.error('Login failed:', error);
			loading = false;
			errorMsg = true;
		}
	}

	async function handleLogout() {
		loading = true;
		await signOut(auth);
		isAdmin.value = false;
		loading = false;
	}
	let sortedUsers = $state([] as any[]);
	onMount(() => {
		check().then(() => {
			sortedUsers = [...userArray.value].sort((a, b) => b.total - a.total);
		});
	});
</script>

{#if isAdmin.value}
	<div class="flex flex-col gap-2">
		<div>
			<h1>Leaderboard</h1>
			<div>
				{#each sortedUsers as user, i}
					<div class="flex">
						<div class="flex w-full justify-between">
							<span class="w-10">{i + 1}.</span>
							<span class="w-full text-left">{user.name}</span>
							<span class="w-full text-left">{user.nivel}</span>
							<span class="w-full text-left">{user.fase}</span>
							<span class="w-10 text-end">{user.total}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<button class="rounded bg-gray-600" onclick={handleLogout}>Log Out</button>
		{#if loading}
			<div>Loading...</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col gap-2">
		<div>Login screen</div>
		<input type="email" name="user" id="user" bind:value={email} placeholder="Admin email" />
		<input
			type="password"
			name="password"
			id="password"
			bind:value={password}
			placeholder="Password"
		/>
		<button class="rounded bg-gray-600" onclick={handleLogin}>Log In</button>
		{#if errorMsg}
			<div class="text-red-500">Erro no login</div>
		{/if}
		{#if loading}
			<div>Loading...</div>
		{/if}
	</div>
{/if}
