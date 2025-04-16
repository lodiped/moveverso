<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

	let email = $state('');
	let password = $state('');
	let isAdmin = $state(false);
	let loading = $state(false);

	async function handleLogin() {
		loading = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
			isAdmin = true;
			loading = false;
		} catch (error) {
			console.error('Login failed:', error);
			loading = false;
		}
	}

	async function handleLogout() {
		loading = true;
		await signOut(auth);
		isAdmin = false;
		loading = false;
	}
</script>

{#if isAdmin}
	<div class="flex flex-col gap-2">
		<div>content</div>
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
		{#if loading}
			<div>Loading...</div>
		{/if}
	</div>
{/if}
