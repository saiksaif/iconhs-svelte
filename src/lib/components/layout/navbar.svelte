<script>
    export let currentPage;

    import PopupNav from "./popupNav.svelte";
    import {aBtn} from '../../scripts/stores.js';

    let y;

    syncPageBtn(aBtn, currentPage);
    function syncPageBtn(aBtn, currentPage) {
        if (localStorage.getItem('aBtn') == 1)
            currentPage.set('Home');
        else if (localStorage.getItem('aBtn') == 2)
            currentPage.set('About');
        else if (localStorage.getItem('aBtn') == 3)
            currentPage.set('Admissions');
        else if (localStorage.getItem('aBtn') == 4)
            currentPage.set('Contact');
        else if (localStorage.getItem('aBtn') == 5)
            currentPage.set('Academics');
        else if (localStorage.getItem('aBtn') == 6)
            currentPage.set('Student');
        else if (localStorage.getItem('aBtn') == 7)
            currentPage.set('Careers');
        else if (localStorage.getItem('aBtn') == 8)
            currentPage.set('News');
    }
</script> 

<svelte:window bind:scrollY={y}/>
<div class="thisMain">
    <div class="upperLower" style="position:fixed;z-index:1; width: 100%">
        <div class="upper">
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 5} on:click={() => aBtn.set("5")} on:click={() => currentPage.set("Academics")}>Academics</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 6} on:click={() => aBtn.set("6")} on:click={() => currentPage.set("Student")}>Student Life</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 7} on:click={() => aBtn.set("7")} on:click={() => currentPage.set("Careers")}>Career Services</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 8} on:click={() => aBtn.set("8")} on:click={() => currentPage.set("News")}>News & Events</a>
        </div>
        <div class="lower">
            <div class="navTitleLower">
                <img class="title1" src="assets/title/titlePurple2.png" alt="Inspire College of Nursing and Health Sciences">
            </div>

            <div style="display: flex;">
                <div class="navLinksLower">
                    <a href="/" class:activeU={localStorage.getItem('aBtn') == 1} on:click={() => aBtn.set("1")} on:click={() => currentPage.set("Home")}>Home</a>
                    <a href="/" class:activeU={localStorage.getItem('aBtn') == 2} on:click={() => aBtn.set("2")} on:click={() => currentPage.set("About")}>About Us</a>
                    <a href="/" class:activeU={localStorage.getItem('aBtn') == 3} on:click={() => aBtn.set("3")} on:click={() => currentPage.set("Admissions")}>Admissions</a>
                    <a href="/" class:activeU={localStorage.getItem('aBtn') == 4} on:click={() => aBtn.set("4")} on:click={() => currentPage.set("Contact")}>Contact Us</a>
                </div>            

                <div class="searchModal">
                    <!-- Button trigger modal -->
                    <button type="button" class="searchModalBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div> 
        </div>
        <div class="logoBox">
            <a href="/" on:click={() => currentPage.set("Home")}>
                <img src="assets/logo/Logo_m.png" alt="ICONHS Logo">
            </a>
        </div>
    </div>

    <div class="searchModal">
        <!-- Modal -->
        <div class="modal " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <PopupNav />
                </div>
            </div>
        </div>
    </div>
    
</div>

<style>
    .activeU {
        --underline-width: 100%;
    }

    .thisMain {
        width: 100%;
    }
    .upperLower {
        display: flex;
        flex-direction: column;
    }

    .upper {
        width: 100%;
        background-color: #132d76;
        height: fit-content;
        padding: 5px 5vw;
        text-align: end;
    } .upper a {
        color: white;
        text-decoration: none;
        margin: 0 10px;

        background: linear-gradient(#FFF 0 0) 
            bottom left/
            var(--underline-width, 0%) 0.1em
            no-repeat;
        color: #FFF;
        text-decoration: none;
        transition: background-size 0.5s;
    } .upper  a:hover {
        --underline-width: 100%;
    }
    /* If browser window is 760px or smaller */
    @media only screen and (max-width:1200px) {
        .upper {
            height: 28px;
            background-color: #FFF;
        }.upper a {
            display: none;
        }
    }

    .lower {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 5vw;
        width: 100%;
        background-color: rgb(250, 250, 250);
        height: fit-content;
    } .navTitleLower {
        margin-left: 12vw;
        height: 70px;
    } .navLinksLower {
        padding: 20px;
    } .navLinksLower a {
        margin: 0 10px;
        font-size: large;
        transition: 0.3s;

        background: linear-gradient(#132d76 0 0) 
            bottom left/
            var(--underline-width, 0%) 0.1em
            no-repeat;
        color: #132d76;
        text-decoration: none;
        transition: background-size 0.5s;
    } .navLinksLower a:hover {
        --underline-width: 100%;
    }
    .title1 {
        height: 60px;
        margin: 5px 0;
    }

    .searchModalBtn {
        background-color: orange;
        color: white;
        width: 75px;
        height: 40px;
        border-radius: 7px;
        border: 0px;
        margin: 15px 0;
    }

    .logoBox {
        backdrop-filter: blur(15px) saturate(150%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        background-color: rgba(255, 255, 255, 0.65);
        border-radius: 0 0 7px 7px;
        border: 1px solid rgba(209, 213, 219, 0.3);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.30);
        height: fit-content;
        width: fit-content;
        padding: 10px;
        position: fixed;
        top: 0px;
        left: 7vw;
        z-index: 5;
    }
    .logoBox a img {
        /* height: 120px; */
        width: 100px;
    }
    
    /* If browser window is 760px or smaller */
    @media only screen and (max-width:1200px) {
        .lower {
            background-color: #132d76;
            height: 75px;
            justify-content: end;
        } .navTitleLower {
            display: none;
        } .navLinksLower {
            display: none;
        }
        .logoBox a img {
            width: 80px;
        }
    }
</style>