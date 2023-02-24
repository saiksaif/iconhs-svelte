<script>
	// Libraries 2.0 working
	import 'bootstrap';
  	import { writable } from 'svelte/store'; 

	// Components
	import Navbar from './lib/components/layout/navbar.svelte';
	import Footer from './lib/components/layout/footer.svelte';
	import Home from "./lib/components/pages/home.svelte";
	import About from './lib/components/pages/aboutus.svelte';
	import Admissions from './lib/components/pages/admissions.svelte';
	import Academics from './lib/components/pages/academics.svelte';
	import StudentLife from './lib/components/pages/studentLife.svelte';
	import Careers from './lib/components/pages/careers.svelte';
	import Newsevents from './lib/components/pages/newsevents.svelte';
	import Contactus from './lib/components/pages/contactus.svelte';

	let currentPage = writable(
		localStorage.getItem('currentPage') || "Home"
	);

	currentPage.subscribe(value => {
		localStorage.setItem('currentPage', value);
	});
</script>

<main>
	<div class="navbar">
		<Navbar {currentPage} />
	</div>

	<div class="body">
		{#if $currentPage === "Home"}
			<Home />
		{:else if $currentPage === "About"}
			<About />
		{:else if $currentPage === "Admissions"}
			<Admissions />
		{:else if $currentPage === "Academics"}
			<Academics />
		{:else if $currentPage === "Student"}
			<StudentLife />
		{:else if $currentPage === "Careers"}
			<Careers />
		{:else if $currentPage === "News"}
			<Newsevents />
		{:else if $currentPage === "Contact"}
			<Contactus />
		{/if}
	</div>
	
	<div class="footer">
		<Footer {currentPage} />
	</div>
</main>

<style>
  @import '~bootstrap/dist/css/bootstrap.min.css';

	main {
		padding: 0;
		margin: 0;
	}
	.navbar {
		padding: 0;
	}
	.footer {
		padding: 0;
	}
</style>