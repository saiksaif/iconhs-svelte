<script>
    import WelcomeImg from "../content/welcomeImg.svelte";
    
    import NursingPogs from "../content/nursingPogs.svelte";
    import Curriculum from "../content/curriculum.svelte";
    import FactSheet from "../content/factSheet.svelte";
</script>

<svelte:head>
    <title>ICONHS - Academics</title>
</svelte:head>
<div class="thisAcademics">
    <WelcomeImg title='Academics' image='https://th.bing.com/th/id/R.7fd1dab2640d2f223a7aaff6e13ac4d1?rik=tjbyURNPkcOyyg&pid=ImgRaw&r=0' />

    <div class="this_Main">
        <NursingPogs />

        <Curriculum />

        <FactSheet />

        
    </div>
</div>

<style>
    .thisAcademics {
        background-color: white;
    }
</style>