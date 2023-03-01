<script>
    export let currentPage;
    
    let width;

    import {aBtn} from '../../scripts/stores.js';
</script>

<svelte:window bind:innerWidth={width}/>

<div class="thisMain">
    <div class="upperLower" style="position:fixed;z-index:1; width: 100%;">
        <div class="upper" style="">
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 5} on:click={() => aBtn.set("5")} on:click={() => currentPage.set("Academics")}>Academics</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 6} on:click={() => aBtn.set("6")} on:click={() => currentPage.set("Student")}>Student Life</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 7} on:click={() => aBtn.set("7")} on:click={() => currentPage.set("Careers")}>Career Services</a>
            <a href="/" class:activeU={localStorage.getItem('aBtn') == 8} on:click={() => aBtn.set("8")} on:click={() => currentPage.set("News")}>News & Events</a>
        </div>
        <div class="lower">
            <div class="navTitleLower">
                <img class="title1" src="assets/title/titleWhite1.png" alt="">
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
                    <button type="button" class="searchModalBtn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="fa fa-times" style="font-size: x-large;"></i>
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
    
    <div class="main">
        <div class="innerMain">
            <hr>

            <div class="searchBarArea">
                <div class="inputArea d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search..." style="border-radius: 0; font-size: medium;">
                    <i class="fa fa-search" style="color: #132d76; font-size: x-large;"></i>
                </div>
            </div>

            <div class="goTos">
                {#if width >= 1200}
                    <div class="section1 section">
                        <a href="/" class="h2">About Us</a>
                        <div class="linkList">
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                        </div>
                    </div>
                    <div class="section2 section">
                        <a href="/" class="h2">Admission</a>
                        <div class="linkList">
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                        </div>
                    </div>
                    <div class="section3 section">
                        <a href="/" class="h2">Programs</a>
                        <div class="linkList">
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                        </div>
                    </div>
                    <div class="section4 section">
                        <a href="/" class="h2">Campus</a>
                        <div class="linkList">
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                        </div>
                    </div>
                    <div class="section5 section">
                        <a href="/" class="h2">Student Life</a>
                        <div class="linkList">
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                            <a href="/">Lorem</a>
                        </div>
                    </div>
                {:else if width < 1200}
                    hi
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .activeU {
        --underline-width: 100%;
    }

    .main {
        background-color: #132d76;
        width: 100%;
        height: 100vh;
        padding-top: 150px;
    } .innerMain {
        color: #FFF;
        height: fit-content;
        width: 100%;
    } .innerMain hr {
        color: #FFF;
        height: 5px;
        width: 65vw;
        margin: 0 auto;
    }
    .searchBarArea {
        /* margin-top: 20px; */
        margin: 30px 12vw;
        max-width: 85vw;
    } .searchBarArea .inputArea {
        height: 50px;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
    } .inputArea i {
        align-content: center;
        position: absolute;
        right: 24px;
        top: 14px;
    }
    .goTos {
        margin-top: 20px;
        padding: 0 12vw;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    } .goTos .section {
        /* border: 1px solid #FFF; */
        min-width: 200px;
    } .section a {
        text-decoration: none;
        color: #FFF;
    } .linkList {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        font-size: large;
        row-gap: 7px;
    } .linkList a {
        text-decoration: none;
        color: #FFF;
        font-size: medium;
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
        background-color: rgb(250, 250, 250);
        height: fit-content;
        padding: 5px 6vw;
        text-align: end;
    } .upper a {
        color: #132d76;
        text-decoration: none;
        margin: 0 10px;

        background: linear-gradient(#132d76 0 0) 
            bottom left/
            var(--underline-width, 0%) 0.1em
            no-repeat;
        color: #132d76;
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
        .main {
            background-color: #132d76;
            width: 100%;
            height: 100vh;
            padding-top: 120px;
        } .innerMain hr {
            color: #FFF;
            height: 5px;
            width: 95vw;
            margin: 0 auto;
        }
    }

    .lower {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 5vw;
        padding-right: 6vw;
        width: 100%;
        background-color: #132d76;
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

        background: linear-gradient(#FFF 0 0) 
            bottom left/
            var(--underline-width, 0%) 0.1em
            no-repeat;
        color: #FFF;
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
        width: 76px;
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