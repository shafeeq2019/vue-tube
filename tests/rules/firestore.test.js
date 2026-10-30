import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const URL_OK = "https://www.youtube.com/embed/dQw4w9WgXcQ";
let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-vuetube",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(() => env.cleanup());

// alice owns category "music" with video "v1"; bob owns category "bobcat".
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "categories/music"), { userID: "alice", categoryName: "Music", videos: [] });
    await setDoc(doc(db, "categories/docs"), { userID: "alice", categoryName: "Docs", videos: [] });
    await setDoc(doc(db, "categories/bobcat"), { userID: "bob", categoryName: "Bob", videos: [] });
    await setDoc(doc(db, "videos/v1"), { userID: "alice", categoryID: "music", video: { title: "Song", url: URL_OK } });
    await setDoc(doc(db, "users/alice"), { uid: "alice", userName: "Alice", userEMail: "a@x.dev" });
  });
});

const as = (uid) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();
const newVideo = (overrides = {}) => ({
  userID: "alice",
  categoryID: "music",
  video: { title: "New", url: URL_OK },
  createdAt: serverTimestamp(),
  ...overrides,
});

describe("categories", () => {
  it("owner can query, read, create, rename and delete", async () => {
    const db = as("alice");
    await assertSucceeds(getDocs(query(collection(db, "categories"), where("userID", "==", "alice"))));
    await assertSucceeds(getDoc(doc(db, "categories/music")));
    await assertSucceeds(
      setDoc(doc(db, "categories/new"), { userID: "alice", categoryName: "New", videos: [], createdAt: serverTimestamp() })
    );
    await assertSucceeds(updateDoc(doc(db, "categories/music"), { categoryName: "Songs" }));
    await assertSucceeds(deleteDoc(doc(db, "categories/docs")));
  });

  it("rejects invalid names and client-chosen timestamps", async () => {
    const db = as("alice");
    await assertFails(setDoc(doc(db, "categories/x"), { userID: "alice", categoryName: "", createdAt: serverTimestamp() }));
    await assertFails(
      setDoc(doc(db, "categories/x"), { userID: "alice", categoryName: "a".repeat(101), createdAt: serverTimestamp() })
    );
    await assertFails(setDoc(doc(db, "categories/x"), { userID: "alice", categoryName: "X", createdAt: new Date(0) }));
    await assertFails(updateDoc(doc(db, "categories/music"), { categoryName: "" }));
  });

  it("only the name can be changed", async () => {
    const db = as("alice");
    await assertFails(updateDoc(doc(db, "categories/music"), { userID: "bob" }));
    await assertFails(updateDoc(doc(db, "categories/music"), { categoryName: "X", extra: true }));
  });

  it("other users and guests have no access", async () => {
    for (const db of [as("bob"), as(null)]) {
      await assertFails(getDocs(collection(db, "categories")));
      await assertFails(getDocs(query(collection(db, "categories"), where("userID", "==", "alice"))));
      await assertFails(getDoc(doc(db, "categories/music")));
      await assertFails(updateDoc(doc(db, "categories/music"), { categoryName: "Mine" }));
      await assertFails(deleteDoc(doc(db, "categories/music")));
      await assertFails(
        setDoc(doc(db, "categories/x"), { userID: "alice", categoryName: "X", videos: [], createdAt: serverTimestamp() })
      );
    }
  });
});

describe("videos", () => {
  it("owner can create a video in an own category", async () => {
    await assertSucceeds(setDoc(doc(as("alice"), "videos/v2"), newVideo()));
  });

  it("rejects bad URLs, titles, foreign or missing categories", async () => {
    const db = as("alice");
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ video: { title: "X", url: "javascript:alert(1)" } })));
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ video: { title: "", url: URL_OK } })));
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ video: { title: "a".repeat(201), url: URL_OK } })));
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ categoryID: "bobcat" })));
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ categoryID: "missing" })));
    await assertFails(setDoc(doc(db, "videos/x"), newVideo({ createdAt: new Date(0) })));
  });

  it("owner can rename and move a video, but not change its URL or owner", async () => {
    const db = as("alice");
    await assertSucceeds(updateDoc(doc(db, "videos/v1"), { "video.title": "Renamed", categoryID: "docs" }));
    await assertFails(updateDoc(doc(db, "videos/v1"), { categoryID: "bobcat" }));
    await assertFails(updateDoc(doc(db, "videos/v1"), { "video.url": "https://www.youtube.com/embed/other" }));
    await assertFails(updateDoc(doc(db, "videos/v1"), { userID: "bob" }));
    await assertFails(updateDoc(doc(db, "videos/v1"), { "video.title": "" }));
  });

  it("owner can delete a category together with its videos in a batch", async () => {
    const db = as("alice");
    const batch = writeBatch(db);
    batch.delete(doc(db, "videos/v1"));
    batch.delete(doc(db, "categories/music"));
    await assertSucceeds(batch.commit());
  });

  it("other users and guests have no access", async () => {
    for (const db of [as("bob"), as(null)]) {
      await assertFails(getDocs(collection(db, "videos")));
      await assertFails(getDoc(doc(db, "videos/v1")));
      await assertFails(updateDoc(doc(db, "videos/v1"), { "video.title": "Mine" }));
      await assertFails(deleteDoc(doc(db, "videos/v1")));
    }
    // bob can't sneak a video into alice's category, even as himself
    await assertFails(setDoc(doc(as("bob"), "videos/x"), newVideo({ userID: "bob" })));
  });
});

describe("users", () => {
  it("users can only access their own profile", async () => {
    await assertSucceeds(getDoc(doc(as("alice"), "users/alice")));
    await assertSucceeds(setDoc(doc(as("bob"), "users/bob"), { uid: "bob", userName: "Bob" }));
    await assertFails(getDoc(doc(as("bob"), "users/alice")));
    await assertFails(setDoc(doc(as("bob"), "users/fake"), { uid: "alice" }));
  });
});
