<script>
    import WelcomeImg from "../content/welcomeImg.svelte";

    import NursingPogs from "../content/nursingPogs.svelte";
    import Curriculum from "../content/curriculum.svelte";
    import FactSheet from "../content/factSheet.svelte";
</script>

<svelte:head>
    <title>ICONHS - Admissions</title>
</svelte:head>
<div class="thisAdmission">
    <WelcomeImg title='Admissions' image='https://www.glentreeacademy.com/admissions-open/img/banner-1.jpg' />

    <div class="this_Main">
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