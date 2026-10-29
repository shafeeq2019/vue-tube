import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// The store only needs the Firebase handles, not a real Firebase project.
vi.mock("../src/firebase.js", () => ({ auth: {}, db: {} }));

const { useAppStore } = await import("../src/stores/app.js");

describe("app store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("maps categories to select options", () => {
    const store = useAppStore();
    store.categories = [
      { id: "a", data: { categoryName: "Music" } },
      { id: "b", data: { categoryName: "Docs" } },
    ];
    expect(store.categoryOptions).toEqual([
      { value: "a", text: "Music" },
      { value: "b", text: "Docs" },
    ]);
  });

  it("groups videos by category", () => {
    const store = useAppStore();
    store.videos = [
      { id: "1", data: { categoryID: "a" } },
      { id: "2", data: { categoryID: "b" } },
      { id: "3", data: { categoryID: "a" } },
    ];
    expect(store.videosByCategory.a.map((v) => v.id)).toEqual(["1", "3"]);
    expect(store.videosByCategory.b.map((v) => v.id)).toEqual(["2"]);
    expect(store.videosByCategory.c).toBeUndefined();
  });

  it("sets and clears the user", () => {
    const store = useAppStore();
    store.setUser({ uid: "u1", email: "a@b.c" });
    expect(store.isAuthenticated).toBe(true);
    expect(store.userID).toBe("u1");
    store.categories = [{ id: "a", data: {} }];
    store.activeModal = "addVideo";
    store.setUser(null);
    store.clearUserData();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userEmail).toBe("");
    expect(store.categories).toEqual([]);
    expect(store.activeModal).toBeNull();
  });
});
