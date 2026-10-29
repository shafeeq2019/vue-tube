import Vue from "vue";
import VueRouter from "vue-router";
import { getAuth } from "firebase/auth";
import home from "./views/home.vue";
import about from "./views/about.vue";
import signUp from "./views/signUp.vue";
import login from "./views/login.vue";
import pageNotFound from "./views/pageNotFound.vue";
import dashboard from "./views/dashboard.vue";
import store from "./store.js";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
      meta: {
        hideForAuth: true,
      }
    },
    {
      path: "/about",
      name: "about",
      component: about
    },
    {
      path: "/signUp",
      name: "signUp",
      component: signUp,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "*",
      name: "pageNotFound",
      component: pageNotFound
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("initAuth");
  const loggedIn = !!getAuth().currentUser;
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    return next({ path: "/login" });
  }
  if (to.matched.some((record) => record.meta.hideForAuth) && loggedIn) {
    return next({ path: "/dashboard" });
  }
  next();
});

export default router;
