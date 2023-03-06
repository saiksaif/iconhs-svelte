<script>
  	import { writable } from 'svelte/store';
    let currentPage = writable(
		localStorage.getItem('currentPage') || "Home"
	);
	currentPage.subscribe(value => {
		localStorage.setItem('currentPage', value);
	});
    

    // Carousel Code
    import { fade, fly } from 'svelte/transition';
    import { onDestroy } from 'svelte';
    let interval;
    function onInterval() {
        interval = setInterval(handleNext, 7000);
    }
    function stopInterval() {
        clearInterval(interval);
    }
    onInterval();
    let count = 0;
    let x = true;
    function handlePrev() { count=count>0 ? count-1 : 2; x = false; stopInterval(); onInterval(); }
    function handleNext() { count=count<2 ? count+1 : 0; x = true; stopInterval(); onInterval(); }

    import { onMount } from 'svelte';
    let time = new Date();
    let hours = time.getHours();
    onMount(() => {
        setInterval(() => {
        time = new Date();
        hours = time.getHours();
        }, 1000);
    });


    let day = '/assets/dayCycles/day.jpg';              // 
    // let day = 'URL("https://www.publicdomainpictures.net/pictures/150000/velka/white-background-14532158163GC.jpg")';              // 
    let afternoon = '/assets/dayCycles/afternoon.jpg';  //
    let evening = '/assets/dayCycles/evening.jpg';      //
    let night = '/assets/dayCycles/night.jpg';          //
    let currentImg = day;

    $: if (hours >= 0 && hours <= 5 || hours >= 20 && hours <= 23) {
        currentImg = night;
    } else if (hours >= 6 && hours <= 11) {
        currentImg = day;
    } else if (hours >= 12 && hours <= 16) {
        currentImg = afternoon;
    } else if (hours >= 17 && hours <= 19) {
        currentImg = evening;
    }


	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

    
	let hereKitty = false;
	let hereKitty2 = false;
</script>

<svelte:head>
    <title>ICONHS - Home</title>
</svelte:head>
<div class="thisHome">
    
    <div class="welcomeMsg" style="background-image: url({currentImg});">
        <!-- Carousel Code -->
        <div class="overImg d-flex">
            <button class="carouselBtns1 carouselBtns display-4" on:click={handlePrev} on:mouseenter={() => hereKitty2 = true} on:mouseleave={() => hereKitty2 = false}>
                <svg viewBox="0 0 24 24" height="80px" width="80px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 4L7 12L15 20" stroke="#FFF" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <div class="carouselBtnPopover2" class:curious2={hereKitty2}>
                    {#if count == 0}
                        APPLY NOW!
                    {:else if count == 1}
                        MISSION
                    {:else if count == 2}
                        VISION
                    {/if}
                </div>
            </button>

            {#if count == 0}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    <div class="carouselItemTitle d-flex" on:mouseleave={() => progress.set(0)} on:mouseenter={() => progress.set(1)}>
                        <span class="display-2">MISSION</span>
                        <progress class="underBar underBar1" value={$progress}></progress>
                    </div>
                    <p>Inspire College of Nursing educates and empowers students to become global leaders in healthcare through a comprehensive curriculum and a commitment to service.</p> 
                </div>
            {:else if count == 1}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    <div class="carouselItemTitle d-flex" on:mouseleave={() => progress.set(0)} on:mouseenter={() => progress.set(1)}>
                        <span class="display-2">VISION</span>
                        <progress class="underBar underBar2" value={$progress}></progress>
                    </div>
                    <p>Innovating healthcare education for global impact with compassionate, skilled, socially responsible professionals.</p>
                </div>
            {:else if count == 2}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    <div class="carouselItemTitle d-flex" on:mouseleave={() => progress.set(0)} on:mouseenter={() => progress.set(1)}>
                        <span class="display-2">APPLY NOW!</span>
                        <progress class="underBar underBar3" value={$progress}></progress>
                    </div>
                    <p>Start your journey at ICONHS!</p>                    
                </div>
            {/if}

            <button class="carouselBtns2 carouselBtns display-4" on:click={handleNext} on:mouseenter={() => hereKitty = true} on:mouseleave={() => hereKitty = false}>
                <svg viewBox="0 0 24 24" height="80px" width="80px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 20L17 12L9 4" stroke="#FFF" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <div class="carouselBtnPopover" class:curious={hereKitty}>
                    {#if count == 0}
                        VISION
                    {:else if count == 1}
                        APPLY NOW!
                    {:else if count == 2}
                        MISSION
                    {/if}
                </div>
            </button>
        </div>
    </div>


    <div class="main">
        <div class="values">
            <span class="h2">What We Value</span> <br><br>

            <span class="h3 colourPrimary" style="font-weight: 400;">Caring</span>
            <p class="lead">We are committed to interpersonal relationships that promote the well-being of self and others.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Excellence </span>
            <p class="lead">We seek to achieve the highest possible quality in our educational programs and in our teaching, research, service and public engagement.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Innovation </span>
            <p class="lead">We strive for innovation in teaching, research and public engagement, in order to involve students in learning and to advance knowledge in nursing education, research, and public engagement.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Professionalism </span>
            <p class="lead">We are committed to professional growth, collegiality, and teamwork.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Respect </span>
            <p class="lead">We create a respectful learning and working environment and demonstrate respect with students, faculty, staff, external partners, and ourselves.</p> <br>

        </div>
        <br>
        
        <div class="messages">
            <div class="messageFromChairman">
                <h3>Message from Chairman</h3>
                <p>
                    The traditional roles of health professional groups are currently in the process of review and modernization to adapt to challenges imposed by advancement in technology. Secondly, the challenge posed by the global shortage of trained nursing professionals, including teaching faculty has assumed critical proportions.
                    At the Inspire College of Nursing & Health Sciences, we are committed to take up these challenges and to make a contribution to the modernization of the health and social care agenda. We believe that every crisis can be taken as an opportunity.
                </p>
            </div>
            <div class="messageFromChiefExec">
                <h3>Message from Chief Executive</h3>
                <p>
                    Inspire College of Nursing & Health Sciences has worked hard to improve nursing education since it opened and is now one of Pakistan's best places to teach nurses. It views nurses as one of the most essential members of the healthcare delivery team, and we place a high priority on their education. The best qualified and driven instructors are employed by our nursing institution, and they are committed to raising the bar for the nursing profession.
                </p>
            </div>
            <div class="messageFromBoardMember">
                <h3>Message from Board Member</h3>
                <p>
                    One of Pakistan's largest nursing colleges is Inspire College of Nursing & Health sciences. It has embraced the challenge of educating and producing nurses across all specialties, which is a critical necessity in today's world. The beginning of the graduate programs in Post RN BSN and BSN is not only a source of relief, but it will also restore dignity to this great profession that has been sorely underappreciated. Nurses in Punjab who want to advance their education can now do so at the Inspire College of Nursing & Health sciences.
                </p>
            </div>
        </div>

        <div class="programs">
            <h3>Our Programs</h3>
            <ul>
                <li>B.Sc. Nursing - 4 Years</li>
                <li>Post RN B.Sc. Nursing - 2 Years</li>
            </ul>
        </div>

        <div class="contactUs">
            <h3>Contact Us</h3>
            <a href="/" on:click={() => currentPage.set("Contact")}>Contact Us</a>
        </div>
    </div>
   
</div>

<style>
    .thisHome {
        background-color: white;
    }

    .welcomeMsg {
        position: relative;
        z-index: 0;
        text-align: center;

        width:100%;
        height: 100vh;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .overImg {
        /* background-color: rgba(255, 255, 255, 0.6); */
        color: white;
        /* margin-top: 105px; */
        position: absolute;
        bottom: 0px;
        right: 0%;
        width: 100%;
        height: 86.7%;
        overflow-x: hidden;
        justify-content: space-between;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));  
        
		overflow: hidden;
    }
    .carouselItem {
        position: absolute;
        bottom: 0;
        /* border: 1px solid black; */
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
    } .carouselItemTitle {
        flex-direction: column;
        width: fit-content;
        margin: 0 auto;
    } .carouselItem span {
        font-weight: 400;
    } .carouselItem p {
        font-weight: 400;
        width: 75%;
        margin: 0 auto;
        text-justify: inter-word;
    } .carouselBtns {
        z-index: 2;
        font-weight: 200;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        padding: 100px 25px;
        border: none;
        background: none;
        transition: 0.5s;
    } .carouselBtns1:hover {
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.15) , rgba(255, 255, 255, 0));
    } .carouselBtns2:hover {
        background-image: linear-gradient(to left, rgba(0, 0, 0, 0.15) , rgba(255, 255, 255, 0));
    } .carouselBtns1:active {
        background-color: rgba(0, 0, 0, 0.1);
    } .carouselBtns2:active {
        background-color: rgba(0, 0, 0, 0.1);
    } .carouselBtnPopover, .carouselBtnPopover2 {
        background-color: white;
        color: #132d76;
        font-size: 1.4rem;
        text-decoration: underline orange;
        padding: 10px;
        width: 110px;
        position: absolute;
    } .carouselBtnPopover {
		right: 0;
        top: 50%;
		transform: translate(120%, 0);
		transform-origin: 100% 100%;
		transition: transform 0.4s;
    } .curious {
		transform: translate(-0%, 0);
	} .carouselBtnPopover2 {
        
		left: 0;
        top: 50%;
		transform: translate(-150%, 0);
		transform-origin: 100% 100%;
		transition: transform 0.4s;
    } .curious2 {
		transform: translate(0%, 0);
	} .underBar {
        margin: 0 auto;
        border-radius: 0%;
        height: 5px;
        width: 100%;
    }
    progress::-webkit-progress-bar {
        background-color: rgba(255, 255, 255, 0.5); /* change the background color for webkit browsers */
        /* border-radius: 10px;  */
    }

    progress::-webkit-progress-value {
        background-color: orange; /* change the fill color for webkit browsers */
        /* border-radius: 10px; */
    }

    progress::-moz-progress-bar {
        background-color: orange; /* change the fill color for Firefox */
        /* border-radius: 10px; */
    }
    .main {
        /* border: 1px solid black; */
        max-width: 1000px;
        padding: 5vh 5vw;
        margin: 0 auto;
    } .values {
        /* font-weight: lighter; */
    }

    
    /* If browser window is 760px or smaller */
    @media only screen and (max-width:1200px) {
        .carouselBtns {
            display: none;
        }
    }
</style>