<script>
import axios from 'axios';
export default {
    data() {
        return {
            roleName: '',
            roleDesc: '',
            department: '',
            tasks: '',
            role_img: '',
            Course_Name: '',
            reg_status: '',
            complete_status: '',
            courseDesc: '',
            //default information
            LJ_ID: '',
            Staff_ID: '',
            SubmittedLJRole_ID: '',
            LatestLJ_ID: '',
            //AllXX_dict means retrieve from Role Details
            Allskill_dict: [],
            Allcourse_dict: [],
            new_selected_course: [],
            //retrieve data from getLJ.php
            SubmittedCourse_dict: [],
            submittedCourseID: '',
            checked: false,
            courseRegStatus_dict: []
            

        };
    },
    created() {
        //hardcode method-- wait for kw to pass the data LJRole_ID,LJ_ID,Staff_ID
        const urlParams = new URLSearchParams(window.location.search);
        const indexValue = urlParams.get('roleID');


        //dynamic method
        const dataValue = localStorage.getItem('createLJ');
        console.log(localStorage)
        console.log(dataValue)
        // // console.log(dataValue[0],dataValue[2],dataValue[4]);  
        // const datalist = dataValue.split(',');
        // console.log(datalist);
        // this.LJ_ID = parseInt(datalist[0]);
        // this.Staff_ID = parseInt(datalist[1]);
        // this.SubmittedLJRole_ID = parseInt(datalist[2]);
        
        var LJRole_ID = indexValue
        // var LJ_ID = 00006
        var Staff_ID = parseInt(dataValue)
        // var Staff_ID = 150208

        //relevant php file
        const RoleDetailsUrl = 'http://localhost/CopySPM/db/getLJRoleDetails.php'
        const RegCourseurl = 'http://localhost/CopySPM/db/getRegCourse.php'
        const LjDetailsurl = 'http://localhost/CopySPM/db/getSubmittedLJRoleDetails.php'
        //hardcode method
        const RoleDetaildata = { LJRole_ID: LJRole_ID }
        // const LJDetaildata = { LJ_ID:LJ_ID }
        const RegCourseData = { Staff_ID: Staff_ID}
        
        //dynamic method
        // const RoleDetaildata = { LJRole_ID: this.SubmittedLJRole_ID }
        // const LJDetaildata = { LJ_ID: this.LJ_ID  }
        // const RegCourseData = { Staff_ID: this.Staff_ID }


        ////hardcode method=get the default information 
        // this.LJ_ID = LJ_ID;
        // this.Staff_ID = Staff_ID;
        // this.SubmittedLJRole_ID = LJRole_ID;

        //retrieve data from the php 
        axios.get(RoleDetailsUrl, {
            params: RoleDetaildata
        })
            .then(response => {
                // var LJDetails = response.data;
                // // console.log('LJDetails', LJDetails)
                // this.getSubmittedCourse_ID(LJDetails);
                // axios.get(RoleDetailsUrl, {
                //     params: RoleDetaildata
                // })
                //     .then(response => {
                        var RoleDetails = response.data;
                        console.log(RoleDetails);
                        this.getRoleDetails(RoleDetails);
                        this.getSkillDetails(RoleDetails);
                        this.getCourseDetails(RoleDetails);
                
                        axios.get(RegCourseurl, {
                            params: RegCourseData
                        })
                            .then(response => {
                                var RegCourse = response.data;
                                console.log('reg course', RegCourse)
                                this.getRegStatus(RegCourse)
                                this.checkCompletion()
                                // console.log('course status', this.courseRegStatus_dict)
                                // this.matchStatusWithCourse()
                            })
                    })

        axios.get("http://localhost/CopySPM/db/getLatestLJ_ID.php")
        .then(response =>{
            console.log(response.data)
            this.LatestLJ_ID = response.data
        })
        .catch(error=>{
            console.log(error.message)
        })

        this.Staff_ID = Staff_ID
        this.SubmittedLJRole_ID = LJRole_ID
            // })
    },
    methods: {
        getRoleDetails(RoleDetails) {
            this.roleName = RoleDetails[0].LJRole_Name
            this.department = RoleDetails[0].Department
            this.roleDesc = RoleDetails[0].LJRole_Description
            var keyTasks = RoleDetails[0].Key_Task
            this.tasks = keyTasks.split('.')
            // console.log(this.tasks)
            //console.log(RoleDetails)
        },
        getSkillDetails(RoleDetails) {
            var temp_skill_dict = [];
            //for loop to get (multiple) skill's info 
            for (let i = 0; i < RoleDetails.length; i++) {
                var SkillID = RoleDetails[i].Skill_ID;
                var SkillName = RoleDetails[i].Skill_Name;
                var Type_of_Skills = RoleDetails[i].Type_of_Skills;
                var Level_of_Competencies = RoleDetails[i].Level_of_Competencies;
                var Skill_img = RoleDetails[i].Skill_img;

                //check if the skill has already appeared in the temp dict
                //if no, add the skill to the Allskill_dict
                if (!temp_skill_dict[SkillID]) {
                    temp_skill_dict[SkillID] = { SkillName: SkillName, Type_of_Skills: Type_of_Skills, Level_of_Competencies: Level_of_Competencies, Skill_img: Skill_img }

                    //e.g. of Allskill_dict = {SkillName:Python, Type of Skills: Technical, LOC: Beginner}
                    this.Allskill_dict.push({ Skill_ID: SkillID, SkillName: SkillName, Type_of_Skills: Type_of_Skills, Level_of_Competencies: Level_of_Competencies, Skill_img: Skill_img })

                }
            }

            return this.Allskill_dict;
        },
        // getSubmittedCourse_ID(LJDetails) {
        //     for (i = 0; i < LJDetails.length; i++) {
        //         var SubmittedC_ID = LJDetails[i].Course_ID;
        //         this.SubmittedCourse_dict.push({ SubmittedC_ID: SubmittedC_ID })
        //     }
        //     return this.SubmittedCourse_dict;
        // },
        getCourseDetails(RoleDetails) {
            //for each skillID
            for (var j = 0; j < this.Allskill_dict.length; j++) {
                var Skill_ID = this.Allskill_dict[j].Skill_ID

                //for each skill in ljroles
                for (let i = 0; i < RoleDetails.length; i++) {
                    var SkillID = RoleDetails[i].Skill_ID;
                    var courseID = RoleDetails[i].Course_ID;
                    var courseName = RoleDetails[i].Course_Name;
                    var courseDesc = RoleDetails[i].Course_Desc;
                    var coursetype = RoleDetails[i].Course_Type;
                    var coursecat = RoleDetails[i].Course_Category;
                    // console.log(this.SubmittedCourse_dict);
                    // check if the passed skill_ID = the skill id in the role details
                    // if yes == under same skill, will put the course info in one dict
                    if (Skill_ID == SkillID) {
                        var index = '';

                        // find the index of ljcourseid in the submittedcourse_dict
                        index = this.SubmittedCourse_dict.map(object => object.SubmittedC_ID).indexOf(courseID);
                        console.log(courseID);
                        console.log(index);

                        //if index == -1 means the course has not been submitted before, checkbox checked = false (not selected)
                        if (index != -1) {
                            this.Allcourse_dict.push({ Skill_ID: SkillID, Course_ID: courseID, Course_Name: courseName, Course_Desc: courseDesc, Course_Type: coursetype, Course_Category: coursecat, checked: true })
                        } else {
                            this.Allcourse_dict.push({ Skill_ID: SkillID, Course_ID: courseID, Course_Name: courseName, Course_Desc: courseDesc, Course_Type: coursetype, Course_Category: coursecat, checked: this.checked })
                        }
                    }
                }
            }
            console.log('allCourse_dict', this.Allcourse_dict);
            return this.Allcourse_dict;
        },
        getCoursePopUp(Course_Name, Course_Desc, Course_Type, Course_Category) {
            Swal.fire({
                title: '<span style="color: #6A79F3">' + Course_Name + '</span>',
                html: `<div class="row" style="overflow-x: hidden;">
                        <div class="col-6"><strong> Course_Type: </strong>`+ Course_Type + `</div>
                        <div class="col-6"> <strong> Course_Category: </strong>`+ Course_Category + `</div> 
                        <div class="col" style="overflow-x: hidden;word-wrap:break-word"> <strong> Course Description: </strong>`+ Course_Desc + `</div></div>`,
                width: '40rem',
                focusConfirm: true,
                confirmButtonText: 'Back!',
                confirmButtonColor: '#6A79F3'
            })
        },
        submitLJ() {
            let completed_check = false
            console.log(this.Allcourse_dict)
            console.log(this.Allskill_dict)
            console.log(this.LatestLJ_ID)
            console.log(this.Staff_ID)

            for (let i = 0; i < this.Allcourse_dict.length; i++){
                if (document.getElementById(this.Allcourse_dict[i].Course_ID).checked){
                    if ("CompletionStatus" in this.Allcourse_dict[i]){
                        if (this.Allcourse_dict[i].CompletionStatus != "Completed"){
                            completed_check = true
                        }
                    }
                    else{
                        completed_check = true
                    }
                }
            }
            if (completed_check == false){
                Swal.fire({
                    title: 'No courses selected',
                    text: "You must pick at least 1 course",
                    icon: 'warning',
                    focusConfirm: true,
                    confirmButtonText: 'Back',
                    confirmButtonColor: '#6A79F3',
                    cancelButtonColor: '#d33',
                })
            }
            else{
                Swal.fire({
                    title: 'Submit your Learning Journey?',
                    text: "Please check information before submitting!",
                    icon: "warning",
                    showCancelButton: true,
                    cancelButtonColor: '#c7c6c5',
                    confirmButtonColor: '#6A79F3',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'No, Cancel',
                    width: 'auto',
                }).then((result) => {
                    if (result.isConfirmed) {

                        const url = "http://localhost/CopySPM/db/addRole.php"
                        var LJ_ID = this.LatestLJ_ID + 1

                        for (let x in this.Allcourse_dict){
                            if (document.getElementById(this.Allcourse_dict[x].Course_ID).checked){
                                if ("CompletionStatus" in this.Allcourse_dict[x]){
                                    if (this.Allcourse_dict[x].CompletionStatus != "Completed"){
                                        var Submitted_Skill_ID = this.Allcourse_dict[x].Skill_ID
                                        var Submitted_CourseID = this.Allcourse_dict[x].Course_ID
                                        const data = {
                                            LJ_ID: LJ_ID,
                                            Staff_ID: this.Staff_ID,
                                            SubmittedLJRole_ID: this.SubmittedLJRole_ID,
                                            Submitted_Skill_ID: Submitted_Skill_ID,
                                            Submitted_CourseID: Submitted_CourseID
                                        }
                                        axios.get(url, {
                                            params: data
                                        })
                                        .then(response=>{
                                            console.log(response.data)
                                            if (response.data["status"] == "Course(s) was not added"){
                                                Swal.fire({
                                                        title: response.data["status"],
                                                        text: 'Please refresh the page and try again.',
                                                        icon: 'warning',
                                                        focusConfirm: true,
                                                        confirmButtonText: 'Back',
                                                        confirmButtonColor: '#6A79F3',
                                                        cancelButtonColor: '#d33',
                                                    })
                                            }
                                            else{
                                                Swal.fire({
                                                icon:  'success',
                                                title: 'Your learning journey has been successfully created!',
                                                showConfirmButton: true,
                                                confirmButtonColor: '#6A79F3',
                                                }).then(function() {
                                                    window.location.href = "LJhome";
                                                })
                                            }
                                        })
                                    }
                                }
                                else{
                                    var Submitted_Skill_ID = this.Allcourse_dict[x].Skill_ID
                                    var Submitted_CourseID = this.Allcourse_dict[x].Course_ID
                                    const data = {
                                        LJ_ID: LJ_ID,
                                        Staff_ID: this.Staff_ID,
                                        SubmittedLJRole_ID: this.SubmittedLJRole_ID,
                                        Submitted_Skill_ID: Submitted_Skill_ID,
                                        Submitted_CourseID: Submitted_CourseID
                                    }
                                    axios.get(url, {
                                        params: data
                                    })
                                    .then(response=>{
                                        console.log(response.data)
                                        if (response.data["status"] == "Course(s) was not added"){
                                            Swal.fire({
                                                    title: response.data["status"],
                                                    text: 'Please refresh the page and try again.',
                                                    icon: 'warning',
                                                    focusConfirm: true,
                                                    confirmButtonText: 'Back',
                                                    confirmButtonColor: '#6A79F3',
                                                    cancelButtonColor: '#d33',
                                                })
                                        }
                                        else{
                                            Swal.fire({
                                            icon:  'success',
                                            title: 'Your learning journey has been successfully created!',
                                            showConfirmButton: true,
                                            confirmButtonColor: '#6A79F3',
                                            }).then(function() {
                                                window.location.href = "LJhome";
                                            })
                                        }
                                    })
                                }
                            }
                        }
                    }
                }) 
            }
        }/*
        checkCompletion(){
            for (let i = 0; i < this.Allcourse_dict.length; i++){
                if (this.Allcourse_dict[i].CompletionStatus == "Completed"){
                    console.log("completed")
                }
            }
        }    */                    
                        
                        /*
                        //check the latest selected courses
                        this.getNewSelectedCourse();
                        console.log(this.new_selected_course);
                        //if learner select >1 courses -> confirmation pop up
                        if (this.new_selected_course.length > 0) {
                            const Surl = 'http://localhost/CopySPM/db/deleteLJ.php'
                            const data = {
                                LJ_ID: this.LJ_ID, Staff_ID: this.Staff_ID
                            }
                            axios.get(Surl, {
                                params: data
                            })
                                .then(response => {
                                    for (let i = 0; i < this.new_selected_course.length; i++) {
                                        //save the latest selected courses to the database
                                        const Surl = 'http://localhost/CopySPM/db/saveEditedLJ.php'
                                        var Submitted_Skill_ID = parseInt(this.new_selected_course[i].skill)
                                        var Submitted_CourseID = this.new_selected_course[i].selectedCourse
                                        const data = {
                                            LJ_ID: this.LJ_ID, Staff_ID: this.Staff_ID,
                                            SubmittedLJRole_ID: this.SubmittedLJRole_ID,
                                            Submitted_Skill_ID: Submitted_Skill_ID,
                                            Submitted_CourseID: Submitted_CourseID,
                                        }
                                        axios.get(Surl, {
                                            params: data
                                        })
            
                                            .then(response => {
                                                // console.log(response);
                                                Swal.fire(
                                                    'Congratulations!',
                                                    'Your changes have been successfully saved!',
                                                    'success',
                                                ).then(function() {
                                                    window.location.href = "LJhome";
                                                })
                                            })
            
                                            .catch(error => {
                                                console.log(error);
                                                alert('Error: ${error}. <br/> Please Try Again Later')
                                            })
                                    }
                                    
                            })
                        } else {
                            Swal.fire(
                                'Cancelled',
                                'Oops, you must pick a least 1 course :(',
                                'error',
                            )
                        }
                        */

        ,    
        // getNewSelectedCourse() {
        //     //reset the new_selected_course
        //     this.new_selected_course = [];

        //     //find the latest selected courses by learner
        //     for (var i = 0; i < this.Allcourse_dict.length; i++) {
        //         var selectedCourse = this.Allcourse_dict[i].Course_ID
        //         var selected = this.Allcourse_dict[i].checked
        //         var skill = this.Allcourse_dict[i].Skill_ID

        //         //if checkbox is checked(selected by the learner), add the skillID, courseID to the new_selected_course list
        //         if (selected == true) {
        //             this.new_selected_course.push({ skill, selectedCourse })
        //         }
        //     }
        //     return this.new_selected_course;
        // },

        getRegStatus(RegCourse) {
            for (let i = 0; i < RegCourse.length; i++) {
                var Course_ID = RegCourse[i].Course_ID;
                var Reg_Status = RegCourse[i].Reg_Status;
                var Completion_Status = RegCourse[i].Completion_Status;

                for (let j = 0; j < this.Allcourse_dict.length; j++) {
                    if (this.Allcourse_dict[j].Course_ID == Course_ID) {
                        this.Allcourse_dict[j]['RegStatus'] = Reg_Status
                        this.Allcourse_dict[j]['CompletionStatus'] = Completion_Status
                    }
                }
            }
            console.log('testing',this.Allcourse_dict)
            return this.Allcourse_dict
        },
        checkCompletion(){
            console.log(this.Allcourse_dict)
            //allcoursedict is undefined dk why
            for (let i = 0; i < this.Allcourse_dict.length; i++){
                if (this.Allcourse_dict[i].CompletionStatus == "Completed"){
                    document.getElementById(this.Allcourse_dict[i].Course_ID).checked = true
                    document.getElementById(this.Allcourse_dict[i].Course_ID).disabled = true
                }
            }
            
        }

    }
}
</script>

<template>
    <div class="row">
        <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-5"><img id='logo' src="../Icons/Component 1.png"></div>
            <div class="col-lg-9 col-md-8 col-sm-7">
                <button type="button" class="btn btn-light float-end me-5 px-4 d-lg-inline-block " style="border-radius: 30px; margin-top: 27px; padding: 10px 25px 10px 25px" id="backBtn" onclick="history.back()">Back</button>
                <button type="button" class= "btn btn-light float-end mx-3 px-4 d-lg-inline-block" style="border-radius: 30px; margin-top: 27px; padding: 10px 25px 10px 25px" id="saveBtn" @click="submitLJ()">Submit</button>
            </div>
        </div>
        <img src="../Icons/Vector 1.png" alt="Nature" class="responsive">
        <!-- Role name -->
        <p id="Header">
            <span id="roleName">{{roleName}}</span> <br>
            <span><strong>Dept: </strong> {{department}}</span>
        </p>
    </div>
      

    <!-- Role Description -->
    <div>
        <div class="row mt-5 mx-5">
            <div class="col">
                <div class="accordion" id="accordionPanelsStayOpenExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne">
                                <img src="../Icons/Role Description.png"
                                    style="display: inline-block; width: 31px; height: 31px; margin-right: 15px;">
                                <h1>Role Description</h1>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show"
                            aria-labelledby="panelsStayOpen-headingOne">
                            <div class="accordion-body" id="roleContent">
                                {{roleDesc}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    <!-- Key Tasks -->
    <div class="row m-5">
        <div class="col accordion" id="accordionPanelsStayOpen2">
            <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="True" aria-controls="panelsStayOpen-collapseTwo">
                        <img src="../Icons/Keytask.png"
                            style="display: inline-block; width: 31px; height: 31px; margin-right: 15px;">
                        <h1>Key Tasks</h1>
                    </button>
                </h2>
                <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body" id="taskContent">
                        <ul>
                            <li v-for='task in tasks' style="list-style: none;">{{task}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Skills and Courses -->
    <div class="row m-5">
        <div class="col accordion" id="accordionPanelsStayOpen3">
            <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="True" aria-controls="panelsStayOpen-collapseThree">
                        <img src="../Icons/skillsandcourses.png"
                            style="display: inline-block; width: 31px; height: 31px; margin-right: 15px;">
                        <h1>Skills & Courses</h1>
                    </button>
                </h2>
                <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingThree"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body" id="skillContent" v-for="skill in Allskill_dict">
                        <div class="card mb-3 border-0">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="../Icons/sampleImg.jpg" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title" id="skillName">{{skill.SkillName}}</h5>
                                        <div class="row">
                                            <div class="col fw-bold">Type of skills: <span class="fw-normal"
                                                    id="skillCat">{{skill.Type_of_Skills}}</span></div>
                                            <div class="col fw-bold">Competency level: <span class="fw-normal"
                                                    id="skillLvl"> {{skill.Level_of_Competencies}}</span></div>
                                        </div>
                                        <h5 class="card-title mt-4 mb-2">Courses</h5>
                                        <div class="row">
                                            <ul>
                                                <!-- show courses -->
                                                <li class="list-group-item m-2" v-for='course in Allcourse_dict'>
                                                    <div v-if="skill.Skill_ID == course.Skill_ID">
                                                        <!-- <div>Checked names: {{ new_selected_course }}</div> -->

                                                        <input class="form-check-input me-1" type="checkbox"
                                                            :checked="course.checked" :id="course.Course_ID"
                                                            :value="course.Course_ID" :aria-label="course.Course_ID"
                                                            v-model='course.checked'>
                                                        <!-- {{course.checked}} -->
                                                        <!-- show course details -->
                                                        <span
                                                            @click="getCoursePopUp(course.Course_Name,course.Course_Desc,course.Course_Type,course.Course_Category)">
                                                            {{course.Course_Name}}
                                                        
                                                            <i class="bi bi-info-circle mx-2" type="button"
                                                            style="color:#919CF8"
                                                            @click="getCoursePopUp(course.Course_Name,course.Course_Desc,course.Course_Type,course.Course_Category)"></i>

                                                        <!-- show completion status of the course -->
                                                        <span class="badge rounded-pill"
                                                        style="background-color: #5EE1AA"
                                                        v-if="course.CompletionStatus =='Completed'"> {{course.CompletionStatus}}</span>&nbsp&nbsp
                                                            <!-- <span class="badge rounded-pill"
                                                            style="background-color:gold"
                                                            v-else-if="course.CompletionStatus =='Not Complete'"> {{course.CompletionStatus}}</span> -->
                                                        <span class="badge rounded-pill"
                                                        style="background-color: skyblue"
                                                        v-else-if="course.CompletionStatus=='OnGoing'"> {{course.CompletionStatus}}</span>&nbsp&nbsp
                                                        <span class="badge rounded-pill"
                                                        style="background-color: #919CF8 "
                                                        v-else-if="course.RegStatus=='Registered'"> {{course.RegStatus}} </span>&nbsp&nbsp
                                                        <span class="badge rounded-pill"
                                                        style="background-color:orange "
                                                        v-else-if="course.RegStatus=='Waitlist'"> {{course.RegStatus}} </span>&nbsp&nbsp
                                                        <span class="badge rounded-pill"
                                                        style="background-color: red"
                                                        v-else-if="course.RegStatus=='Rejected'"> {{course.RegStatus}}</span>&nbsp&nbsp

                                                        <!-- <span class="badge rounded-pill"
                                                            style="background-color: #919CF8"
                                                            v-else>Registered</span>&nbsp&nbsp -->
                                                        
                                                        
                                                        </span>

                                                        
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
