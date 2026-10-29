import { defineStore } from "pinia";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
import { auth, db } from "../firebase.js";

// Resolves once Firebase has reported the initial auth state.
let authReady = null;

function toEntries(querySnapshot) {
  return querySnapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
}

export const useAppStore = defineStore("app", {
  state: () => ({
    userID: "",
    userEmail: "",
    isAuthenticated: false,
    categories: [],
    videos: [],
    selectedCategory: null,
    loading: true,
    // Which modal is open: "addCategory" | "addVideo" | "removeCategory" | null
    activeModal: null,
  }),
  getters: {
    categoryOptions: (state) =>
      state.categories.map((category) => ({
        value: category.id,
        text: category.data.categoryName,
      })),
    videosByCategory: (state) => {
      const grouped = {};
      for (const video of state.videos) {
        const categoryID = video.data.categoryID;
        (grouped[categoryID] = grouped[categoryID] || []).push(video);
      }
      return grouped;
    },
  },
  actions: {
    setUser(user) {
      this.userID = user ? user.uid : "";
      this.userEmail = user ? user.email : "";
      this.isAuthenticated = !!user;
    },
    clearUserData() {
      this.categories = [];
      this.videos = [];
      this.selectedCategory = null;
      this.activeModal = null;
    },
    openModal(name) {
      this.activeModal = name;
    },
    closeModal() {
      this.activeModal = null;
    },
    // Registers the auth listener exactly once and returns a promise that
    // resolves after the first auth state (and the user's data) is loaded.
    initAuth() {
      if (authReady) {
        return authReady;
      }
      authReady = new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          this.loading = true;
          this.setUser(user);
          if (user) {
            try {
              await Promise.all([this.fetchCategories(), this.fetchVideos()]);
            } catch (error) {
              console.error(error);
            }
          } else {
            this.clearUserData();
          }
          this.loading = false;
          resolve();
        });
      });
      return authReady;
    },
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
      this.setUser(null);
      this.clearUserData();
    },
    async fetchCategories() {
      const q = query(
        collection(db, "categories"),
        where("userID", "==", this.userID)
      );
      this.categories = toEntries(await getDocs(q));
    },
    async fetchVideos() {
      const q = query(
        collection(db, "videos"),
        where("userID", "==", this.userID)
      );
      this.videos = toEntries(await getDocs(q));
    },
    // The write actions throw on failure so the calling modal can show an error.
    async addCategory(categoryName) {
      await setDoc(doc(collection(db, "categories")), {
        userID: this.userID,
        categoryName: categoryName,
        videos: [],
      });
      await this.fetchCategories();
    },
    async removeCategory(categoryID) {
      // The userID filter is required so the query passes the security rules.
      const q = query(
        collection(db, "videos"),
        where("userID", "==", this.userID),
        where("categoryID", "==", categoryID)
      );
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((v) => batch.delete(v.ref));
      batch.delete(doc(db, "categories", categoryID));
      await batch.commit();
      if (this.selectedCategory === categoryID) {
        this.selectedCategory = null;
      }
      await Promise.all([this.fetchCategories(), this.fetchVideos()]);
    },
    async addVideo(categoryID, video) {
      await setDoc(doc(collection(db, "videos")), {
        userID: this.userID,
        categoryID: categoryID,
        video: video,
      });
      await this.fetchVideos();
    },
    async removeVideo(videoID) {
      await deleteDoc(doc(db, "videos", videoID));
      await this.fetchVideos();
    },
  },
});
