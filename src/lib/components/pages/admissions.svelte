<script>
    import WelcomeImg from "../content/welcomeImg.svelte";

    import NursingPogs from "../content/nursingPogs.svelte";
    import Curriculum from "../content/curriculum.svelte";
    import FactSheet from "../content/factSheet.svelte";

    import { onMount } from 'svelte';

    function changeUrl(url) {
    window.history.pushState({}, '', url);
    }

    onMount(() => {
        // Change the URL to '/about-us' after the component is mounted
        changeUrl('/Admissions/');
    });
</script>

<svelte:head>
    <title>ICONHS - Admissions</title>
</svelte:head>
<div class="thisAdmission">
    <WelcomeImg title='Admissions' image='https://www.glentreeacademy.com/admissions-open/img/banner-1.jpg' />

    <div class="main">
        <NursingPogs />
        
        <Curriculum />

        <FactSheet />
    </div>
</div>

<style>
    .thisAdmission {
        background-color: white;
    }
</style>