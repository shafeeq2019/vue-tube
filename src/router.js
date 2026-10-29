import { createRouter, createWebHistory } from "vue-router";
import { auth } from "./firebase.js";
import { useAppStore } from "./stores/app.js";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { hideForAuth: true },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/AboutView.vue"),
    },
    {
      path: "/signUp",
      name: "signUp",
      component: () => import("./views/SignUpView.vue"),
      meta: { hideForAuth: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/LoginView.vue"),
      meta: { hideForAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "pageNotFound",
      component: () => import("./views/PageNotFoundView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  await useAppStore().initAuth();
  // Firebase's currentUser is updated before signIn/signOut resolve,
  // so it is always up to date when navigating right after them.
  const loggedIn = !!auth.currentUser;
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    return { name: "login" };
  }
  if (to.matched.some((record) => record.meta.hideForAuth) && loggedIn) {
    return { name: "dashboard" };
  }
});

export default router;
