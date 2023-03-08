<script>
    import WelcomeImg from "../content/welcomeImg.svelte";
    import ApplyForm from "../content/applyForm.svelte";
    import {aBtn, currentPage, syncPageBtn} from '../../scripts/stores.js';
    syncPageBtn(aBtn, currentPage);
    
    let showModal = false;
</script>

<svelte:head>
    <title>ICONHS - Apply Now</title>
</svelte:head>
<div class="thisApply">
    <WelcomeImg title='Apply Now' image='https://th.bing.com/th/id/R.caf956233ae284a2c77e379c81ebbe1a?rik=X7outa9vIzQ7qA&pid=ImgRaw&r=0' />

    <div class="that_Main">
        <div class="programs">
            <span class="display-6 "><strong>Start Here To Be A Part of ICONHS</strong></span> <br> <br>
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

            <br>
            <p class="lead colourPrimary text-center px-4"><strong>Application</strong></p> 
            <hr width="250px" style="margin: 0 auto;"> <br>
            <p class="lead">Fill out the application and then submit it, we will contact you after reviewing it.</p>

            <button class="openFormBtn" on:click={() => (showModal = true)}>FILL APPLICATION FORM ONLINE!</button> <br> <br>
        </div>
    </div>
</div>

<ApplyForm bind:showModal class="applyForm">
    <h2 slot="header" class="applicationHeader">
        Admission Application Form
    </h2>

    <div class="pg1">
        <form class="addmissionFormSection" action="">
            <!-- <h2>Personal Information</h2> -->
            <div class="apPt1 d-flex">
                <div class="leftApPt1">
                    <div class="d-flex">
                        <label for="fname">First Name:</label> <br>
                        <input type="text" id="fname" name="fname" required><br>
                        
                        <label for="lname">Last Name:</label> <br>
                        <input type="text" id="lname" name="lname" required><br>
                    </div>

                    <div class="d-flex">
                        <label for="father-name">Father Name:</label> <br>
                        <input type="text" id="father-name" name="father-name" required><br>

                        <label for="father-occupation">Father Occupation:</label> <br>
                        <input type="text" id="father-occupation" name="father-occupation" required><br>
                    </div>
                    
                    <div class="d-flex">
                        <label for="guardian-name">Guardian Name:</label> <br>
                        <input type="text" id="guardian-name" name="guardian-name" required><br>

                        <label for="guardian-occupation">Guardian Occupation:</label> <br>
                        <input type="text" id="guardian-occupation" name="guardian-occupation" required><br>
                    </div>
                </div>
                <div class="rightApPt1">
                    <label for="photo">Photo:</label>
                    <input type="file" id="photo" name="photo"><br>
                </div>
            </div>

            <div class="aPt2 d-flex">
                <div class="leftApPt2">
                    <label for="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required><br>
                </div>
                <div class="rightApPt2 d-flex">
                    <label for="gender">Gender:</label>
                    <input type="radio" id="male" name="gender" value="male" required>
                    <label for="male">Male</label>
                    <input type="radio" id="female" name="gender" value="female" required>
                    <label for="female">Female</label><br>

                    <label for="religion">Religion:</label>
                    <input type="text" id="religion" name="religion" required><br>

                    <label for="nationality">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" required><br>
                </div>
            </div>

            <div class="aPt3 d-flex">
                <div>
                    <label for="contact-number">Contact Number:</label> <br>
                    <input type="tel" id="contact-number" name="contact-number" required>
                </div>
    
                <label for="email-address">Email Address:</label>
                <input type="email" id="email-address" name="email-address" required><br>
            </div>

            <label for="cnic-number">CNIC Number:</label>
            <input type="text" id="cnic-number" name="cnic-number" required><br>

            <label for="permanent-address">Permanent Address:</label>
            <textarea id="permanent-address" name="permanent-address" rows="4" cols="50" required></textarea><br>

            <label for="mailing-address">Mailing Address:</label>
            <textarea id="mailing-address" name="mailing-address" rows="4" cols="50" required></textarea><br>

            <h2>Person to Notify in Case of Emergency</h2>
            <label for="emergency-name">Name:</label>
            <input type="text" id="emergency-name" name="emergency-name" required><br>

            <label for="emergency-occupation">Occupation:</label>
            <input type="text" id="emergency-occupation" name="emergency-occupation" required><br>

            <label for="emergency-relationship">Relationship:</label>
            <input type="text" id="emergency-relationship" name="emergency-relationship" required><br>

            <label for="emergency-contact">Contact:</label>
            <input type="text" id="emergency-contact" name="emergency-contact" required><br>

            <label for="emergency-address">Address:</label>
            <input type="text" id="emergency-address" name="emergency-address" required><br>
        </form>
    </div>
</ApplyForm>

<style>
    .addmissionFormSection {
        overflow-y: scroll;
        max-height: 67vh;
    } .applicationHeader {
        width: fit-content;
        margin: 0 auto;
    }

    .thisApply {
        background-color: white;
    }
    .openFormBtn {
        width: 100%;
        background-color: orange;
        color: #FFF;
        border: none;
        border-radius: 7px;
        margin: 0 auto;
        font-weight: 700;
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
    .btnLearnMore {
        background-color: orange;
        padding: 10px;
        border: none;
        border-radius: 7px;
        color: white;
        text-decoration: none;
    }

</style>