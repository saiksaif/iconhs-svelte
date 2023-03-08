<script>
    import {aBtn, currentPage, syncPageBtn} from '../../scripts/stores.js';
    syncPageBtn(aBtn, currentPage);
</script>

<div class="thisMain">
    <br><br>
    <div class="upper">
        <a href="/" class="upperLeft" on:click={() => $aBtn="1"} on:click={() => $currentPage="Home"}>
            <img src="assets/title/titleWhite1.png" alt="">
        </a>

        <div class="upperRight">
            <div class="address">
                <a class="mapAddressLink lead" target="_blank" rel="noreferrer" href="https://goo.gl/maps/JQzAiXsyXa5Yx4g3A">
                    14-E2 Gulberg III, Lahore
                </a>
                <i class="fas fa-map-marker-alt"></i>
                <br>

                <a class="phoneAddressLink" href="/">
                    +92-42-37881521
                </a>
                , 
                <a class="phoneAddressLink" href="/">
                    042-37881522
                </a>
                <i class="fas fa-phone-alt"></i>
            </div>
            
            <div class="externalLinks">
                <a target="_blank" rel="noreferrer" href="https://www.facebook.com"><i class="fab fa-facebook-square" aria-hidden="true"></i></a>
                <a target="_blank" rel="noreferrer" href="https://twitter.com"><i class="fab fa-twitter" aria-hidden="true"></i></a>
                <a target="_blank" rel="noreferrer" href="https://www.youtube.com"><i class="fab fa-youtube" aria-hidden="true"></i></a>
                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
                <a target="_blank" rel="noreferrer" href="https://www.instagram.com"><i class="fab fa-instagram" aria-hidden="true"></i></a>

            </div>
        </div>
    </div>

    <br><br>

    <div class="lower">
        <div class="newBtnGroup">
            <a href="/" on:click={() => $aBtn="4"} on:click={() => $currentPage="Contact"}>CONTACT US</a>
            <a href="/" on:click={() => $aBtn="13"} on:click={() => $currentPage="Map"}>MAP</a>
            <a href="/" on:click={() => $aBtn="11"} on:click={() => $currentPage="Faculty"}>FACULTY</a>
            <a href="/" on:click={() => $aBtn="7"} on:click={() => $currentPage="Careers"}>CAREER SERVICES</a>
            <a href="/" on:click={() => $aBtn="12"} on:click={() => $currentPage="Library"}>LIBRARY</a>
            <a href="/" on:click={() => $aBtn="10"} on:click={() => $currentPage="Campus"}>CAMPUS</a>
            <a href="/" on:click={() => $aBtn="9"} on:click={() => $currentPage="Apply"}>APPLY NOW</a>
        </div>
        <br>

        <div class="lower2" style="font-size: small;">
            ©2023 ICONHS

            &nbsp;&nbsp;&nbsp;&nbsp;

            <a on:click={() => $aBtn="15"} on:click={() => $currentPage="PrivacyP"} class="text-light" href="/" >Privacy Policy</a> &nbsp;
            <a on:click={() => $aBtn="14"} on:click={() => $currentPage="StudentP"} class="text-light" href="/">Student Policy</a> &nbsp;
            <a on:click={() => $aBtn="16"} on:click={() => $currentPage="Login"} class="text-light" href="/">Management</a>
        </div>
    </div>
    <br><br>
</div>

<style>
    .thisMain {
        background-color: #132d76;
        color: white;
    }

    .upper {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    } .upperLeft {
        width: 400px;
        height: fit-content;
    } .upperLeft img {
        height: 60px;
    }
     .upperRight {
        width: 400px;
        height: 70px;
        text-align: end;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .lower {
        display: flex;
        flex-direction: column;
    } .lower2 {
        margin: 0 auto;
    }

    .newBtnGroup {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
    } .newBtnGroup a {
        border: 1px solid white;
        color: white;
        text-decoration: none;
        padding: 10px 15px;
        font-size: small;
        font-weight: 600;

        transition: 0.2s;
    } .newBtnGroup a:hover {
        background-color: white;
        color: #132d76;
    }
    .externalLinks {
        display: flex;
        flex-direction: row;
        justify-content: end;
    } .externalLinks a {
        font-size: x-large;
        text-decoration: none;
        color: white;
        padding: 5px;
        margin: 5px;
        transition: 0.2s;
    } .externalLinks a:hover {
        font-size: 28px;
        margin: 0px 3px;
        cursor: pointer;
    }

    .address {
        cursor: pointer;
    }
    .mapAddressLink {
        text-decoration: none;
        color: white;
        transition: 0.2s;
    }.mapAddressLink:hover {
        color: orange;
    }
    .phoneAddressLink {
        text-decoration: none;
        color: white;
        transition: 0.2s;
    } .phoneAddressLink:hover {
        color: orange;
    }
    
    @media only screen and (max-width:800px) {
        .upper {
            flex-direction: column;
            width: fit-content;
            margin: 0 auto;
        } .upperLeft {
            width: fit-content;
            margin: 0 auto;
        } .upperLeft img {
            height: 50px;
        } .upperRight {
            width: fit-content;
            margin: 0 auto;
            height: 80px;
        }
        .address {
            text-align: center;
            margin-top: 15px;
        } .externalLinks {
            justify-content: center;
        }
        .newBtnGroup {
            flex-direction: column;
            margin: 0 auto;
        } .newBtnGroup a {
            width: 50vw;
            text-align: center;
        }
    }
</style>