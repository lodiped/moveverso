<script lang="ts">
	import Adminbtn from '$lib/Components/Adminbtn.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import { contabil } from '$lib/state.svelte';

	let user = $derived(contabil.user);

	function resetAll() {
		user.total = 0;
		calc();
	}

	function add(n: number) {
		user.total += n;
		if (user.total < 0) {
			user.total = 0;
		}
		if (user.total >= 15000) {
			user.total = 15000;
		}
		calc();
	}

	function calc() {
		user.current = Math.abs(1500 * faseCalc() - user.total - 1500);
		nivelCalc();
		faseCalc();
	}

	function xpCalc() {
		return user.current / 1500;
	}

	function nivelCalc() {
		user.nivel = Math.ceil(user.current / 150);
		if (user.nivel === 0) {
			user.nivel = 1;
		}
		return user.nivel;
	}
	function faseCalc() {
		user.fase = Math.ceil(user.total / 1500);
		if (user.fase === 0) {
			user.fase = 1;
		}
		return user.fase;
	}
</script>

<div class="my-2 flex w-[1000px] flex-col gap-5">
	<Userheader {user} />
	<Adminbtn {add} {resetAll} />
</div>
