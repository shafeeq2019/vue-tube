import Vue from "vue";
import VueRouter from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import home from "./views/home.vue";
import about from "./views/about.vue";
import signUp from "./views/signUp.vue";
import login from "./views/login.vue";
import dashboard from "./views/dashboard.vue";
import test from "./views/test.vue";
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
      component: about,
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
    // {
    //   path: "/test",
    //   name: "test",
    //   component: test,
    //   meta: {},
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, function(user) {
    if (user) {
      store.commit("updateLoginStatus", {
        user: user,
        isAuthonticated: true,
      });
    } else {
      store.commit("updateLoginStatus", { isAuthonticated: false });
    }
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!user) {
        next({ path: "/login" });
      } else {
        next();
      }
    } else {
      next();
    }
    if (to.matched.some((record) => record.meta.hideForAuth)) {
      if (user) {
        next({ path: "/dashboard" });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
