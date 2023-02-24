<script>
    export let title, image;
</script>

<div class="thisMain">
    <div class="welcomeMsg" style="background-image: url({image});">
        <div class="overImg">
        </div>
    </div>
    <div class="WelcomeTitle">
        <h1 class="display-4 ">{title}</h1>
    </div>
</div>

<style>
    .welcomeMsg {
        width:100%;
        height: 560px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .WelcomeTitle {
        background-color: white;

        width: fit-content;
        min-width: 65vw;
        
        margin: 0 auto;
        padding: 30px;

        position: relative;
        top: -65px;
        
        align-content: center;
        text-align: center;
    }
</style>