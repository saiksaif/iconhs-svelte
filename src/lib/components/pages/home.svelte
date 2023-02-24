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


</script>

<svelte:head>
    <title>ICONHS - Home</title>
</svelte:head>
<div class="thisHome">
    
    <div class="welcomeMsg" style="background-image: url({currentImg});">
        <!-- Carousel Code -->
        <div class="overImg">
            {#if count == 0}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    Vision <br>
                    Inspire College of Nursing <br>
                    Innovating healthcare education for global impact with compassionate, skilled, socially responsible professionals.
                </div>
            {:else if count == 1}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    Mission <br>
                    Inspire College of Nursing educates and empowers students to become global leaders in healthcare through a comprehensive curriculum and a commitment to service.
                </div>
            {:else if count == 2}
                <div class="carouselItem" in:fly="{{ x: x? 200: -200, duration: 2000 }}" out:fade>
                    Apply Now
                </div>
            {/if}
            
            <br><br><br>
            <!-- Carousel Buttons -->
            <button on:click={handlePrev}>Prev</button>
            <button on:click={handleNext}>Next</button>
        </div>
    </div>


    <div class="main">
        <div class="values">
            <h3>Our values</h3>

            <h6>Caring:</h6>
            <p>We are committed to interpersonal relationships that promote the well-being of self and others.</p>
            <h6>Excellence: </h6>
            <p>We seek to achieve the highest possible quality in our educational programs and in our teaching, research, service and public engagement.</p>
            <h6>Innovation: </h6>
            <p>We strive for innovation in teaching, research and public engagement, in order to involve students in learning and to advance knowledge in nursing education, research, and public engagement.</p>
            <h6>Professionalism: </h6>
            <p>We are committed to professional growth, collegiality, and teamwork.</p>
            <h6>Respect: </h6>
            <p>We create a respectful learning and working environment and demonstrate respect with students, faculty, staff, external partners, and ourselves.</p>

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
        background-color: bisque;
    }

    .welcomeMsg {
        position: relative;
        z-index: 0;
        text-align: center;

        width:100%;
        height: 700px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .overImg {
        background-color: rgba(255, 255, 255, 0.6);
        border: 1px solid red;
        color: blue;
        margin-top: 105px;
        position: absolute;
        top: 0px;
        right: 0%;
        width: 100%;
        overflow-x: hidden;
    }
    .carouselItem {
        position: absolute;
        top: 0;
        border: 1px solid black;
        width: 100%;
    }
</style>