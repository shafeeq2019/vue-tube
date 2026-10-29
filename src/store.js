import Vue from "vue";
import Vuex from "vuex";
import { db } from "./firebase.js";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
Vue.use(Vuex);

// Resolves once Firebase has reported the initial auth state.
let authReady = null;

const store = new Vuex.Store({
  state: {
    userID: "",
    userEmail: "",
    isAuthenticated: false,
    categories: [],
    videos: [],
    showSuccessAlert: false,
    showErrorAlert: false,
    selectedCategory: null,
    loading: true,
  },
  getters: {
    getCategoriesToSelect: (state) => {
      return state.categories.map((option) => {
        return {
          value: option.id,
          text: option.data.categoryName,
        };
      });
    },
    isLoggedIn: (state) => {
      return state.isAuthenticated;
    },
    videosByCategory: (state) => {
      const grouped = {};
      for (const video of state.videos) {
        const categoryID = video.data.categoryID;
        (grouped[categoryID] = grouped[categoryID] || []).push(video);
      }
      return grouped;
    },
  },
  mutations: {
    updateLoginStatus: (state, payload) => {
      state.userID = payload.user ? payload.user.uid : "";
      state.isAuthenticated = payload.isAuthenticated;
      state.userEmail = payload.user ? payload.user.email : "";
    },
    updateUserCategories: (state, payload) => {
      state.categories = payload.userCategories;
    },
    updateUserVideos: (state, payload) => {
      state.videos = payload.userVideos;
    },
    errorAlertMutation: (state, payload) => {
      state.showErrorAlert = true;
      console.error("Error writing document: ", payload.error);
    },
    successAlertMutation: (state) => {
      state.showSuccessAlert = true;
    },
    changeSelectedCategory: (state, payload) => {
      state.selectedCategory = payload;
    },
    clearAlerts: (state) => {
      state.showErrorAlert = false;
      state.showSuccessAlert = false;
    },
    clearUserDataStates: (state) => {
      state.categories = [];
      state.videos = [];
      state.selectedCategory = null;
    },
    updateLoadingState: (state, payload) => {
      state.loading = payload;
    },
  },
  actions: {
    logout: async ({ commit }) => {
      try {
        await signOut(getAuth());
      } catch (error) {
        console.error(error);
      }
      commit("updateLoginStatus", { isAuthenticated: false });
      commit("clearUserDataStates");
    },
    // Registers the auth listener exactly once and returns a promise that
    // resolves after the first auth state (and the user's data) is loaded.
    initAuth: ({ commit, dispatch }) => {
      if (authReady) {
        return authReady;
      }
      authReady = new Promise((resolve) => {
        onAuthStateChanged(getAuth(), async (user) => {
          commit("updateLoadingState", true);
          if (user) {
            commit("updateLoginStatus", {
              isAuthenticated: true,
              user: user,
            });
            try {
              await Promise.all([
                dispatch("fetchUserCategories"),
                dispatch("fetchUserVideos"),
              ]);
            } catch (error) {
              console.error(error);
            }
          } else {
            commit("updateLoginStatus", { isAuthenticated: false });
            commit("clearUserDataStates");
          }
          commit("updateLoadingState", false);
          resolve();
        });
      });
      return authReady;
    },
    fetchUserCategories: async ({ state, commit }) => {
      const q = query(
        collection(db, "categories"),
        where("userID", "==", state.userID)
      );
      const querySnapshot = await getDocs(q);
      const userCategories = querySnapshot.docs.map((d) => ({
        data: d.data(),
        id: d.id,
      }));
      commit("updateUserCategories", { userCategories });
    },
    fetchUserVideos: async ({ commit, state }) => {
      const q = query(
        collection(db, "videos"),
        where("userID", "==", state.userID)
      );
      const querySnapshot = await getDocs(q);
      const userVideos = querySnapshot.docs.map((d) => ({
        data: d.data(),
        id: d.id,
      }));
      commit("updateUserVideos", { userVideos });
    },
    addCategory: async ({ commit, state, dispatch }, categoryName) => {
      try {
        await setDoc(doc(collection(db, "categories")), {
          userID: state.userID,
          categoryName: categoryName,
          videos: [],
        });
        commit("successAlertMutation");
        await dispatch("fetchUserCategories");
      } catch (error) {
        commit("errorAlertMutation", { error: error.message });
      }
    },
    removeCategory: async ({ state, commit, dispatch }) => {
      const categoryID = state.selectedCategory;
      if (!categoryID) {
        return;
      }
      try {
        // The userID filter is required so the query passes the security rules.
        const q = query(
          collection(db, "videos"),
          where("userID", "==", state.userID),
          where("categoryID", "==", categoryID)
        );
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.forEach((v) => batch.delete(v.ref));
        batch.delete(doc(db, "categories", categoryID));
        await batch.commit();
        commit("changeSelectedCategory", null);
        await Promise.all([
          dispatch("fetchUserCategories"),
          dispatch("fetchUserVideos"),
        ]);
      } catch (error) {
        commit("errorAlertMutation", { error: error.message });
      }
    },
    addVideo: async ({ state, commit, dispatch }, payload) => {
      try {
        await setDoc(doc(collection(db, "videos")), {
          userID: state.userID,
          categoryID: state.selectedCategory,
          video: payload,
        });
        commit("successAlertMutation");
        await dispatch("fetchUserVideos");
      } catch (error) {
        commit("errorAlertMutation", { error: error.message });
      }
    },
    removeVideo: async ({ commit, dispatch }, videoID) => {
      try {
        await deleteDoc(doc(db, "videos", videoID));
        await dispatch("fetchUserVideos");
      } catch (error) {
        commit("errorAlertMutation", { error: error.message });
      }
    },
  },
});
export default store;
