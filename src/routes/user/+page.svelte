<script lang="ts">
	import Adminbtn from '$lib/Components/Adminbtn.svelte';
	import Adminlog from '$lib/Components/Adminlog.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import { user, add, resetAll, remove } from '$lib/state.svelte';
</script>

<div class="my-2 flex w-[1000px] flex-col gap-5">
	<Userheader {user} />
	<Adminbtn {add} {resetAll} />
	<Adminlog {remove} {user} />
</div>
