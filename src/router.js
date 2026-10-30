import { createRouter, createWebHistory } from "vue-router";
import { auth } from "./firebase.js";
import { useAppStore } from "./stores/app.js";
import HomeView from "./views/HomeView.vue";
import { findYouTubeUrl } from "./utils/video.js";

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
      // PWA share target (see the manifest in vite.config.js): opens the
      // "Add video" dialog with the shared link prefilled.
      path: "/share",
      name: "share",
      meta: { requiresAuth: true },
      // Never rendered: beforeEnter always redirects. It runs after the
      // global auth guard, so the share survives a detour via the login.
      component: () => import("./views/DashboardView.vue"),
      beforeEnter: (to) => {
        const { title = "", text = "", url = "" } = to.query;
        const sharedUrl = findYouTubeUrl(String(url)) || findYouTubeUrl(String(text));
        if (sharedUrl) {
          const store = useAppStore();
          store.pendingShare = { title: String(title).trim(), url: sharedUrl };
          store.openModal("addVideo");
        }
        return { name: "dashboard", query: {} };
      },
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
    // Come back here after logging in (e.g. to finish a share).
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (to.matched.some((record) => record.meta.hideForAuth) && loggedIn) {
    return { name: "dashboard" };
  }
});

export default router;
