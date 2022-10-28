//declare route & path to be used internally
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    }, 
    {
      path: "/LJhome",
      name: "LJhome",
      component: () => import("../components/LJhome.vue"),
    }, 
    {
      path: "/editLJ",
      name: "editLJ",
      component: () => import("../components/editLJ.vue"),
    },
    {
      //wth is this
      path: "/createLJ",
      name: "createLJ",
      component: () => import("../components/createLJ.vue"),
    },{
      path: "/LJrole",
      name: "LJrole",
      component: () => import("../components/LJrole.vue"),
    },
    {
      path: "/hrHome",
      name: "hrHome",
      component: () => import("../views/hrHome.vue"),
    },
    {
      path: "/hrRole",
      name: "hrRole",
      component: () => import("../components/hrRole.vue"),
    },
    {
      path: "/hrCreateRole",
      name: "hrCreateRole",
      component: () => import("../components/hrCreateRole.vue"),
    },
    {
      path: "/hrEditRole",
      name: "hrEditRole",
      component: () => import("../components/hrEditRole.vue"),
    }
  ],
});

export default router;
