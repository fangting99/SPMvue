<script>
import axios from 'axios';
export default {
    data() {
        return {
            skillDict: [],
            skillId : '',
            status : '',
            course : '',
            courseList:[]
        }
    },

    created() {
        this.getAllSkill()
        this.getAllCourse()
        // console.log('testing')
    },

    methods: {
        
        getAllSkill() {
            const allSkillUrl = 'http://localhost/CopySPM/db/getSkills.php'
            axios.get(allSkillUrl).then(response => {
                var allSkill = response.data
                // console.log(allSkill)

                const map = new Map();

                // get the distinct skill from allSkill
                for (const skill of allSkill) {
                    var skillId=skill.Skill_ID
                    var skillName= skill.Skill_Name
                    var skillType=skill.Type_of_Skills
                    var level=skill.Level_of_Competencies
                    var status=skill.Skill_Status
                    var course=skill.Course_ID

                    if (!map.has(skillId)) {
                        map.set(skillId, true);
                        this.skillDict.push({ skillId:skillId,skillName:skillName,skillType:skillType,level:level,status:status,course:course,courses:[],noOfCourse:0 })
                    }
                }

                // get the courses of each skill
                for (let i = 0; i < allSkill.length; i++) {
                    skillId = allSkill[i].Skill_ID
                    course= allSkill[i].Course_ID

                    for (let j = 0; j < this.skillDict.length; j++) {
                        if (this.skillDict[j].skillId == skillId) {
                            this.skillDict[j]['courses'].push(course)
                            this.skillDict[j]['noOfCourse']+=1
                        }
                    }
                }

                console.log('final result', this.skillDict)

            })
            
            // console.log(this.skillDict)
            return this.skillDict;
        },
        getAllCourse(){
            const courseUrl = 'http://localhost/CopySPM/db/getAllCourses.php'
            axios.get(courseUrl).then(response => {
                var allCourse = response.data
                console.log(allCourse)

                const map = new Map();
               
                for (const course of allCourse) {
                    var courseId = course.Course_ID
                    var courseName = course.Course_Name

                    if (!map.has(courseId)) {
                        map.set(courseId, true);
                        this.courseList.push({courseId: courseId, courseName: courseName})
                    }
                }
                console.log(this.courseList)
            })

            return this.courseList

        },

        getDataSend(skillId,status,course){
            this.skillId = skillId;
            this.status = status;
            this.course = course;
            localStorage.setItem('data', [this.skillId,this.status ,this.course ])

            window.location.href = "hrEditSkill";
            this.skillId = '';
            this.status = '';
            this.course = '';
        } ,
        SoftDeleteSkill(id) {
            console.log(id)

            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to see this skill!",
                icon: "warning",
                cancelButtonColor: '#c7c6c5',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Yes',
                showCancelButton: true,
        
              })
              .then((result) => {
                if (result.isConfirmed) {
                    var url = "http://localhost/CopySPM/db/SoftDeleteSkill.php"
                    const data = {Skill_ID: id}
                    axios.get(url , {
                        params: data
                    })
                    .then(response => {
                        console.log(response.data)
                        Swal.fire({
                            title:"Success!",
                            text: "Skill has been soft deleted.",
                            icon: "success"
                        }).then(function() {
                            window.location.href = "hrSkill";
                        })
                    })
                    
                    .catch(error => {
                        console.log(error.message)
                    })
                } else {
                    Swal.fire({
                        title: "Cancelled",
                        text: "Skill has not been soft deleted!",
                        icon: "info"});
                }
              });
        }


    }


}
</script>

<template>
    <div class="row" style="background:#6A79F3;">
        <div class="row position-relative">
            <div class="row my-5">
                <div class="col-lg-2 col-md-3"><img id='logo' src="../Icons/Component 1.png"></div>
                <!-- nav bar start -->
                <nav class="col-lg-8 col-md-6 navbar navbar-expand-lg navbar-expand-md navbar-light">
                    <div class="container-fluid">
                        <div class="navbar" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="navbar-brand" href="hrHome" style="color:white">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="hrRole" style="color:white">Role</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="hrSkill"
                                        style="color:white">Skill</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <!-- nav bar end -->
                <span class="col-lg col-md fs-5 fw-bold" style="color:white">Welcome, Jack </span>
            </div>
            <img src="../Icons/Vector 1.png" alt="background">
            <div class="row">
                <p class="h1 position-absolute top-50 start-50 translate-middle" id="Header">
                    Let's keep the information <br> up-to-date for skills
                </p>
                <!-- search bar start -->
                <form class="d-inline-flex mt-3 position-absolute translate-middle w-50" style="top:70%; left:55%">
                    <input class="form-control me-3" type="search" placeholder="For E.g. Leadership, Communication"
                        aria-label="Search" id="skillSearchBar">
                    <!-- add new role btn Fang Ting -->
                    <button class="btn btn-light" type="submit" style="border-radius: 40px;"><a class="nav-link"
                            href="hrCreateSkill">Add New Skill</a> </button>
                </form>


            </div>

        </div>
    </div>

    <!-- All skill cards-->
    <div class="row mt-4 ">
        <div class="col-lg-5 col-md-8 col-sm-6 mt-3 ms-lg-5 mx-md-auto" v-for="skill in skillDict">
            <div class="card p-2">
                <div class="row card-body">
                    <div class="row my-2">
                        <h5 class="col-lg-7 col-md-7 col-sm-1 card-title">{{skill.skillName}}</h5>
                        <!-- Edit Button-->
                        <span class="col-lg-2 col-md col-sm-2"><button id="editButton"
                                @click="getDataSend(skill.skillId, skill.status, skill.course)">Edit</button></span>
                        <!-- Jing Wen your delete button is here -->
                        <span class="col-lg col-md col-sm-2"><button id="deleteButton"
                                @click="SoftDeleteSkill(skill.skillId)">Delete</button></span>
                    </div>
                    <div class="row my-2">
                        <!-- <div class="col-lg-3 col-md-3 col-sm-3 badge rounded-pill badges ms-2 pe-3" id="courseBadge">
                            {{skill.noOfCourse}} courses</div> -->
                            <div class="col-lg-3 col-md-3 col-sm badge rounded-pill badges ms-2 pe-3">
                                {{skill.skillType}}</div>
                            <div class="col-xl-3 col-lg-4 col-md-3 col-sm badge rounded-pill badges ms-2 pe-3">
                                {{skill.level}}
                            </div>

                    </div>
                    <!-- <div class="row my-2">
                        <div class="col"> <strong>Skill Type: </strong> <span> {{skill.skillType}}</span></div>
                        <div class="col"> <strong>Competency Level:</strong> <span>{{skill.level}}</span></div>
                    </div> -->
                    <div class="row my-2">
                            <!-- display course names of the skill -->
                            <h6> Courses </h6>
                            <div v-for="course in skill.courses" style="margin:0px" id="courseNames">
                            <ul v-for="c in courseList" style="margin:0px">
                                <li v-if="course == c.courseId" style="margin:0px"> {{c.courseName}} </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }


    a:hover {
        color: gray;
    }

    a:active {
        font-size: 1em;
    }

    a {
        text-decoration: none;
        color: black;
    }

    #skillSearchBar {
        background: #4C5BDD;
        border-radius: 40px;
        border-color: #4C5BDD;
        color: white
    }

    #skillSearchBar::placeholder {
        color: #FFFFFF;
    }

    .badges {
        background-color: #919CF8;
        font-size: 16px;
    }

    #deleteButton,
    #editButton {
        background: none;
        border: none;
        color: gray;
    }

</style>
