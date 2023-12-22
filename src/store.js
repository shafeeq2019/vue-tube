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
} from "firebase/firestore";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userID: "",
    userName: "",
    userEmail: "",
    isAuthonticated: false,
    categories: [],
    videos: [],
    showSuccessAlert: false,
    showErrorAlert: false,
    selectedCategory: null,
    correntCategory: "",
    loading: false
  },
  getters: {
    getCategoriesToSelect: (state) => {
      var options = state.categories.map((option) => {
        return {
          value: option.id,
          text: option.data.categoryName,
        };
      });
      return options;
    },
    isLoggedIn: (state) => {
      return state.isAuthonticated;
    },
  },
  mutations: {
    updateLoginStatus: (state, payload) => {
      state.userID = payload.user ? payload.user.uid : "";
      state.isAuthonticated = payload.isAuthonticated;
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
    },
    updateLoadingState: (state, payload) => {
      state.loading = payload
    },
  },
  actions: {
    logout: ({ commit }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        commit("updateLoginStatus", {
          isAuthonticated: false,
        });
        commit("clearUserDataStates");
      });
    },
    fetchAllData: async ({ commit, state }) => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        commit('updateLoadingState', true);
        if (user) {
          commit("updateLoginStatus", {
            isAuthonticated: true,
            user: user,
          });
          await store.dispatch("fetchUserCategories");
          await store.dispatch("fetchUserVideos");
          commit('updateLoadingState', false);
        } else {
          commit("updateLoginStatus", {
            isAuthonticated: false,
          });
          commit('updateLoadingState', false);
        }
      });
    },
    fetchUserCategories: async ({ state, commit }) => {
      let userCategories = [];
      const q = query(
        collection(db, "categories"),
        where("userID", "==", state.userID)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userCategories.push({
          data: doc.data(),
          id: doc.id,
        });
      });
      commit("updateUserCategories", {
        userCategories: userCategories,
      });
    },
    fetchUserVideos: async ({ commit, state }) => {
      let videos = [];
      const q = query(
        collection(db, "videos"),
        where("userID", "==", state.userID)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        videos.push({
          data: doc.data(),
          id: doc.id,
        });
      });
      commit("updateUserVideos", {
        userVideos: videos,
      });
    },
    addCategory: async ({ commit, state }, categoryName) => {
      try {
        if (!categoryName || !categoryName.replace(/\s/g, "").length) {
          return;
        }
        await setDoc(doc(collection(db, "categories")), {
          userID: state.userID,
          categoryName: categoryName,
          videos: [],
        });
        commit("successAlertMutation");
        await store.dispatch("fetchUserCategories");
      } catch (error) {
        console.log(error);
        commit("errorAlertMutation", {
          error: error.message,
        });
      }
    },
    removeCategory: async ({ state }) => {
      if (!state.selectedCategory) {
        return;
      }
      try {
        await deleteDoc(doc(db, "categories", state.selectedCategory));
        const q = query(
          collection(db, "videos"),
          where("categoryID", "==", state.selectedCategory)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (v) => {
          let video = doc(db, "videos", v.id);
          await deleteDoc(video);
        });
        await store.dispatch("fetchUserCategories");
      } catch (error) {
        console.log(error);
      }
    },
    addVideo: async ({ state, commit }, payload) => {
      try {
        await setDoc(doc(collection(db, "videos")), {
          userID: state.userID,
          categoryID: state.selectedCategory,
          video: payload,
        });
        commit("successAlertMutation");
        await store.dispatch("fetchUserVideos");
      } catch (error) {
        console.log(error);
        commit("errorAlertMutation", {
          error: error.message,
        });
      }
    },
    removeVideo: async ({ state, commit }, payload) => {
      try {
        await deleteDoc(doc(db, "videos", payload));
        await store.dispatch("fetchUserVideos");
      } catch (error) {
        console.log(error);
      }
    },
  },
});
export default store;