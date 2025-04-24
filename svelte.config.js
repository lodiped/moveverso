import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDvD-NmAzIyKclIao147pQ3zCxPoPNdhW8',
	authDomain: 'moveverso.firebaseapp.com',
	databaseURL: 'https://moveverso-default-rtdb.firebaseio.com',
	projectId: 'moveverso',
	storageBucket: 'moveverso.firebasestorage.app',
	messagingSenderId: '589898005458',
	appId: '1:589898005458:web:26f9e32af88ac7c17aa60b'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function listUserEntries() {
	const snapshot = await get(child(ref(db), 'users'));
	if (!snapshot.exists()) {
		return [];
	}
	return Object.keys(snapshot.val()).map((uid) => `/${uid}`);
}

const userEntries = await listUserEntries();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({}),

		prerender: {
			entries: ['*', ...userEntries]
		}
	}
};

export default config;
