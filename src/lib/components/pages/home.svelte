<script>
    import HorizontalStyledCard from '../content/horizontalStyledCard.svelte';
    import {aBtn, currentPage, syncPageBtn} from '../../scripts/stores.js';
    syncPageBtn(aBtn, currentPage);

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

    let hover1 = false;
    let hover2 = false;
    let hover3 = false;
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

    <div class="homeIntersector">
        <div class="inIntersector">
            <div class="guideInter">
                <span style="font-size: xx-large;" class="lead">Know about ICONHS</span> <br>
                <p style="text-align: right;">See what we can offer our students at ICONHS</p>
            </div>

            <div class="interCards">
                <div class="interCard academicInter">
                    <a href="/" on:click={() => $aBtn="5"} on:click={() => $currentPage="Academics"}>
                        Academic Programs
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </div>
                
                <div class="interCard campusInter">
                    <a href="/">
                        Visit ICONHS
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </div>
                
                <div class="interCard libraryInter">
                    <a href="/">
                        Campus Library
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="this_Main">
        <div class="values">
            <span class="display-6 "><strong>What We Strive to Achieve</strong></span> <br><br>
            <p class="lead colourPrimary text-center px-4"><strong>Caring. Excellence. Innovation. Professionalism. Respect.</strong></p> 
            <br> <hr width="250px" style="margin: 0 auto;"> <br>

            <span class="h3 colourPrimary" style="font-weight: 400;">Caring</span> <br><br>
            <p class="lead">We are committed to interpersonal relationships that promote the well-being of self and others.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Excellence </span> <br><br>
            <p class="lead">We seek to achieve the highest possible quality in our educational programs and in our teaching, research, service and public engagement.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Innovation </span> <br><br>
            <p class="lead">We strive for innovation in teaching, research and public engagement, in order to involve students in learning and to advance knowledge in nursing education, research, and public engagement.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Professionalism </span> <br><br>
            <p class="lead">We are committed to professional growth, collegiality, and teamwork.</p> <br>
            <span class="h3 colourPrimary" style="font-weight: 400;">Respect </span> <br><br>
            <p class="lead">We create a respectful learning and working environment and demonstrate respect with students, faculty, staff, external partners, and ourselves.</p> 

        </div>
    </div>

    <div class="messages1">
        <div class="msgs" on:mouseenter={()=> {hover1 = true}} on:mouseleave={()=>{hover1 = false}}>
            <div class="overPortrait" style="background-image: url('https://th.bing.com/th/id/R.064f5cc8e4c2e5f615285b96151cb707?rik=ZKo%2bv7KmQxAokQ&pid=ImgRaw&r=0');">
                <div class="over">
                    {#if !hover1}
                        <div transition:fade class="overPt1">
                            <h2>Person A</h2>
                            <span class="h4">Chairman</span>
                        </div>
                    {:else}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div transition:fade class="overPt2">
                            <div class="insidePt2">
                                <span class="colourPrimary h1">Chairman</span> <br><br>
                                <hr width="100px"> <br>
                                <p class="lead px-4">
                                    "The traditional roles of health professional groups are currently in the process of review and modernization to adapt to challenges imposed by advancement in technology. Secondly, the challenge posed by the global shortage of trained nursing professionals, including teaching faculty has assumed critical proportions.
                                    At the Inspire College of Nursing & Health Sciences, we are committed to take up these challenges and to make a contribution to the modernization of the health and social care agenda. We believe that every crisis can be taken as an opportunity."
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="msgs" on:mouseenter={()=> {hover2 = true}} on:mouseleave={()=>{hover2 = false}}>
            <div class="overPortrait" style="background-image: url('https://th.bing.com/th/id/OIP.f5Kri_Mbf5C2C75jArJ4twHaLD?pid=ImgDet&rs=1');">
                <div class="over">
                    {#if !hover2}
                        <div transition:fade class="overPt1">
                            <h2>Person B</h2>
                            <span class="h4">Chief Executive</span>
                        </div>
                    {:else}
                        <div transition:fade class="overPt2">
                            <div class="insidePt2">
                                <span class="colourPrimary h1">Chief Executive</span> <br><br>
                                <hr width="100px"> <br>
                                <p class="lead px-4">
                                    "Inspire College of Nursing & Health Sciences has worked hard to improve nursing education since it opened and is now one of Pakistan's best places to teach nurses. It views nurses as one of the most essential members of the healthcare delivery team, and we place a high priority on their education. The best qualified and driven instructors are employed by our nursing institution, and they are committed to raising the bar for the nursing profession."
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="msgs" on:mouseenter={()=> {hover3 = true}} on:mouseleave={()=>{hover3 = false}}>
            <div class="overPortrait" style="background-image: url('https://th.bing.com/th/id/R.ff8a6bf7756d461760b1ac436b70312e?rik=KfytdeCThAVwnw&riu=http%3a%2f%2fmedia.cleveland.com%2favon-lake%2fphoto%2ff246645-232jpg-351f78fd51882f0e.jpg&ehk=Q6e2pII4SwNbrBjeRvQP0gSmd5Os231LhcDE7zrQ3XE%3d&risl=&pid=ImgRaw&r=0');">
                <div class="over">
                    {#if !hover3}
                        <div class="overPt1">
                            <h2>Person C</h2>
                            <span class="h4">Board Member</span>
                        </div>
                    {:else}
                        <div transition:fade class="overPt2">
                            <div class="insidePt2">
                                <span class="colourPrimary h1">Board Member</span> <br><br>
                                <hr width="100px"> <br>
                                <p class="lead px-4">
                                    "One of Pakistan's largest nursing colleges is Inspire College of Nursing & Health sciences. It has embraced the challenge of educating and producing nurses across all specialties, which is a critical necessity in today's world. The beginning of the graduate programs in Post RN BSN and BSN is not only a source of relief, but it will also restore dignity to this great profession that has been sorely underappreciated. Nurses in Punjab who want to advance their education can now do so at the Inspire College of Nursing & Health sciences."
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
                
            </div>
        </div>
    </div>

    <div class="this_Main">
        <div class="programs">
            <span class="display-6 "><strong>What We Have To Offer</strong></span> <br> <br>
            <p class="lead colourPrimary text-center px-4"><strong>Programs</strong></p> 
            <hr width="250px" style="margin: 0 auto;"> <br>

            <div class="progCont">
                <a href="/" on:click={() => $aBtn="5"} on:click={() => $currentPage="Academics"} class="progs deAnc" style="background-image: url('https://th.bing.com/th/id/R.e6fe35bc4de47978af8b989c02489e46?rik=lTfvBxvdbZJOPw&pid=ImgRaw&r=0');">
                    <div class="inProg">
                        <span class="colourPrimary lead" style="font-size:xx-large">B.Sc. Nursing</span> <br> <br>
                        <a href="/" class="btnLearnMore">Learn More <i class="fa fa-external-link" aria-hidden="true"></i></a>
                    </div>
                </a>
                <a href="/" on:click={() => $aBtn="5"} on:click={() => $currentPage="Academics"} class="progs deAnc" style="background-image: url('https://th.bing.com/th/id/R.a924cc167c78ac7e62d5327eb2a624e4?rik=wFSOvBDqXhBQ2A&pid=ImgRaw&r=0');">
                    <div class="inProg">
                        <span class="colourPrimary lead" style="font-size:xx-large">Post RN B.Sc. Nursing</span> <br> <br>
                        <a href="/" class="btnLearnMore" >Learn More <i class="fa fa-external-link" aria-hidden="true"></i></a>
                    </div>
                </a>
            </div>

            <br> <br>
            <p class="lead colourPrimary text-center px-4"><strong>Facilities</strong></p> 
            <hr width="250px" style="margin: 0 auto;"> <br> <br>

            <div class="styledCard">
                <HorizontalStyledCard 
                    image="https://th.bing.com/th/id/OIP._n3citWOk0MXVY9v5Ul1xgHaE8?pid=ImgDet&rs=1"
                    title="Faculty"
                    body="The faculty at Inspire College of Nursing and Health Sciences are experienced professionals dedicated to helping students achieve their goals."
                    linkTo="/"/>

                <HorizontalStyledCard 
                    image="https://th.bing.com/th/id/R.ad63780285bd79200a8e622bb29de576?rik=lVwIVBOrdTCzJw&riu=http%3a%2f%2fwww.anc.edu%2fcampus-tour%2fimages%2fsmallpic-AH-computer-lab.jpg&ehk=Xn4Qk5tb1jKYms9npdGbqmz5W8bvSU5bs%2f81Bx7eM%2fw%3d&risl=&pid=ImgRaw&r=0"
                    title="Labs"
                    body="The labs at Inspire College of Nursing and Health Sciences provide a nurturing environment that fosters student growth, empowers them to excel in their chosen fields, and ignites their passion for learning."
                    linkTo="/"/>

                <HorizontalStyledCard 
                    image="https://th.bing.com/th/id/OIP.cq-zIsPj9GD5_UqGtln51AHaFj?pid=ImgDet&rs=1"
                    title="Library"
                    body="The library at Inspire College of Nursing and Health Sciences is a treasure trove of knowledge, boasting an extensive collection of over 110+ books that cater to the diverse interests and academic pursuits of our students."
                    linkTo="/"/>
            </div>
        </div>
    </div>
    
        
    

    <br>        
   
</div>

<style>
        
    /* /////////////////////////////////////////////// */


    .thisHome {
        background-color: white;
    }

    .homeIntersector {
        background-color: #132d76;
        color: white;
        width: 100%;
        padding: 5vh 5vw;
    } .inIntersector {
        margin: 0 auto;
        max-width: 1200px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 100%;
    } .guideInter {
        min-width: 200px;
        max-width: 550px;
        margin: 7px 15px;
    } .interCards {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    } .interCard {
        border-left: 3px solid rgba(255, 255, 255, 0.423);
        padding: 20px 15px;
        margin: 7px 15px;
        transition: 0.3s;
        min-width: 200px;
        height: fit-content;
    } .interCards a {
        text-decoration: none;
        color: white;
    } .interCards i {
        text-decoration: none;
        color: orange;
    } .interCard:hover {
        border-left: 3px solid orange;
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
    
    .values {
        /* font-weight: lighter; */
        margin-top: 25px;
    }

    .messages1 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        /* border: 1px solid black; */
        padding: 20px 0;
        /* margin: 0 10px; */
        background-color: #FFF;
    } .msgs {
        min-width: 300px;
        width: 30%;
        height: 80vh;
        margin: 10px;
        /* border: 1px solid #000; */
        background-color: white;
        border-top: 10px solid orange;
        position: relative;
    } .overPortrait {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
        color: white;
    } .over {
        height: 100%;
        width: 100%;
        background-color: #0000005c;
    } .overPt1 {
        width: fit-content;
        text-align: center;

        position: absolute;
        bottom: 100px;
        left: 0;
        right: 0;
        margin: 0 auto;
    } .overPt2 {
        width: calc(100% - 35px);
        height: calc(100% - 35px);
        color: black;
        background-color: #FFF;

        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        margin: auto auto;
        align-content: center;
        display: flex;
        justify-content: center; /* horizontally center content */
        align-items: center;
    } .insidePt2 {
        text-align: center;
        margin: 25px auto;
    } .insidePt2 hr {
        margin: 0 auto;
    } .insidePt2 p {
        text-align: justify;
        text-justify: inter-word;
        font-size: large;
    }
    .btnLearnMore {
        background-color: orange;
        padding: 10px;
        border: none;
        border-radius: 7px;
        color: white;
        text-decoration: none;
    }

    .progCont {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
    } .progs {
        height: 300px;
        width: 400px;

        border: 7px solid #FFF;

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;   
        
        
        position:relative;
        overflow-y: hidden;

    } .progs:hover .inProg {
        transform: translateY(-0px);
    } .inProg {
        background-color: white;
        height: fit-content;
        width: fit-content;
        padding-top: 5px;
        padding-bottom: 20px;
        padding-right: 10px;

        position: absolute;
        bottom: 0;
        left: 0;
        transform: translateY(60px);
        transition: transform 0.5s;
    }

    .deAnc {
        text-decoration: none;
    }
    
    /* If browser window is 760px or smaller */
    @media only screen and (max-width:1200px) {
        .carouselBtns {
            display: none;
        }
    }
    /* If browser window is 760px or smaller */
    @media only screen and (max-width:900px) {
        .msgs {
            width: 100%;
        }
    }
    @media only screen and (max-height:750px) {
        .insidePt2 p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
        }
    }
    @media only screen and (max-width:1300px) {
        .insidePt2 p {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 13;
            -webkit-box-orient: vertical;
        }
    }
</style>