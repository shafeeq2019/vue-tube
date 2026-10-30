import { defineStore } from "pinia";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase.js";

// Resolves once Firebase has reported the initial auth state.
let authReady = null;
// Unsubscribe functions of the active Firestore listeners.
let unsubscribers = [];

function toEntries(querySnapshot) {
  // "estimate" gives locally created documents a createdAt before the
  // server has confirmed the write, so they sort correctly right away.
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    data: d.data({ serverTimestamps: "estimate" }),
  }));
}

function createdAtMillis(entry) {
  const createdAt = entry.data.createdAt;
  return createdAt && typeof createdAt.toMillis === "function"
    ? createdAt.toMillis()
    : 0;
}

// Oldest first. Documents created before createdAt existed come first,
// ordered by id so their position is at least stable.
export function sortByCreation(entries) {
  return [...entries].sort(
    (a, b) =>
      createdAtMillis(a) - createdAtMillis(b) ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  );
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
    // Which modal is open: "addCategory" | "renameCategory" | "removeCategory"
    // | "addVideo" | "editVideo" | null
    activeModal: null,
    // The video being edited in the "editVideo" modal
    editingVideo: null,
    // A video shared to the app via the PWA share target: { title, url }
    pendingShare: null,
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
      this.editingVideo = null;
    },
    openModal(name) {
      this.activeModal = name;
    },
    closeModal() {
      this.activeModal = null;
    },
    editVideo(video) {
      this.editingVideo = video;
      this.activeModal = "editVideo";
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
          this.unsubscribe();
          this.setUser(user);
          if (user) {
            try {
              await this.subscribe();
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
    // Keeps categories and videos in sync with Firestore in real time.
    // Resolves once both collections have been loaded for the first time.
    subscribe() {
      const listen = (collectionName, key) =>
        new Promise((resolve, reject) => {
          const q = query(
            collection(db, collectionName),
            where("userID", "==", this.userID)
          );
          unsubscribers.push(
            onSnapshot(
              q,
              (snapshot) => {
                this[key] = sortByCreation(toEntries(snapshot));
                resolve();
              },
              (error) => {
                console.error(error);
                reject(error);
              }
            )
          );
        });
      return Promise.all([
        listen("categories", "categories"),
        listen("videos", "videos"),
      ]);
    },
    unsubscribe() {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribers = [];
    },
    async logout() {
      this.unsubscribe();
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
      this.setUser(null);
      this.clearUserData();
    },
    // The write actions throw on failure so the calling modal can show an
    // error. The listeners pick up the changes, so nothing is refetched.
    async addCategory(categoryName) {
      await setDoc(doc(collection(db, "categories")), {
        userID: this.userID,
        categoryName: categoryName,
        videos: [],
        createdAt: serverTimestamp(),
      });
    },
    async renameCategory(categoryID, categoryName) {
      await updateDoc(doc(db, "categories", categoryID), { categoryName });
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
    },
    async addVideo(categoryID, video) {
      await setDoc(doc(collection(db, "videos")), {
        userID: this.userID,
        categoryID: categoryID,
        video: video,
        createdAt: serverTimestamp(),
      });
    },
    async updateVideo(videoID, { title, categoryID }) {
      await updateDoc(doc(db, "videos", videoID), {
        "video.title": title,
        categoryID: categoryID,
      });
    },
    async removeVideo(videoID) {
      await deleteDoc(doc(db, "videos", videoID));
    },
  },
});
