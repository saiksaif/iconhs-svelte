<script>
    export let currentPage;

    console.log(currentPage);
</script>

<div class="thisMain">
    <br><br>
    <div class="upper">
        <div class="upperLeft">
            <img src="assets/title/titleWhite1.png" alt="">
        </div>

        <div class="upperRight">
            <div class="address">
                Hali Road, Gulberg III, Lahore Pakistan.
                <br>
                Phone: +92-42-37881521, 042-37881522
            </div>
            
            <div class="externalLinks">
                facebook instagram linkedin
            </div>
        </div>
    </div>

    <br>

    <div class="lower">
        <div class="lower1">
            <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-light">STUDENT LIFE</button>
                <button type="button" class="btn btn-outline-light">MAP</button>
                <button type="button" class="btn btn-outline-light">CAREER SERVICES</button>
                <button type="button" class="btn btn-outline-light">NEWS & EVENTS</button>
                <button type="button" class="btn btn-outline-light">LIBRARY</button>
                <button type="button" class="btn btn-outline-light">CONTACT US</button>
              </div>
        </div>
        <div class="lower12">
            <div class="btn-group-vertical" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-light">STUDENT LIFE</button>
                <button type="button" class="btn btn-outline-light">MAP</button>
                <button type="button" class="btn btn-outline-light">CAREER SERVICES</button>
                <button type="button" class="btn btn-outline-light">NEWS & EVENTS</button>
                <button type="button" class="btn btn-outline-light">LIBRARY</button>
              </div>
        </div>
        <a class="btn btn-outline-light" href="/" on:click={() => currentPage.set("Contact")}>CONTACT Us</a>

        <br>

        <div class="lower2">
            @2023 ICONHS

        </div>
    </div>
    <br><br>
</div>

<style>
    .thisMain {
        background-color: #2d0d64;
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
        height: 60px;
        text-align: end;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .lower {
        display: flex;
        flex-direction: column;
    } .lower1 {
        margin: 0 auto;
    } .lower2 {
        margin: 0 auto;
    } .lower12 {
        margin: 0 auto;
        display: none;
    }

    
    @media only screen and (max-width:760px) {
        .upper {
            flex-direction: column;
            width: fit-content;
            margin: 0 auto;
        } .upperLeft {
            width: fit-content;
        } .upperLeft img {
            height: 50px;
        } .upperRight {
            width: fit-content;
        }
        .lower1 {
            display: none;
        } .lower12 {
            display: block;
        }
    }
</style>