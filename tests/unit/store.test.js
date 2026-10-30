import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// The store only needs the Firebase handles, not a real Firebase project.
vi.mock("../../src/firebase.js", () => ({ auth: {}, db: {} }));

const { useAppStore, sortByCreation } = await import("../../src/stores/app.js");

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
    store.editingVideo = { id: "v" };
    store.setUser(null);
    store.clearUserData();
    expect(store.isAuthenticated).toBe(false);
    expect(store.userEmail).toBe("");
    expect(store.categories).toEqual([]);
    expect(store.activeModal).toBeNull();
    expect(store.editingVideo).toBeNull();
  });

  it("opens the edit modal for a video", () => {
    const store = useAppStore();
    const video = { id: "v1", data: {} };
    store.editVideo(video);
    expect(store.editingVideo).toStrictEqual(video);
    expect(store.activeModal).toBe("editVideo");
  });
});

describe("sortByCreation", () => {
  const ts = (ms) => ({ toMillis: () => ms });

  it("sorts oldest first and puts entries without createdAt first, by id", () => {
    const sorted = sortByCreation([
      { id: "c", data: { createdAt: ts(300) } },
      { id: "z", data: {} },
      { id: "a", data: { createdAt: ts(100) } },
      { id: "b", data: { createdAt: null } },
    ]);
    expect(sorted.map((e) => e.id)).toEqual(["b", "z", "a", "c"]);
  });

  it("does not mutate the input", () => {
    const input = [
      { id: "b", data: {} },
      { id: "a", data: {} },
    ];
    sortByCreation(input);
    expect(input.map((e) => e.id)).toEqual(["b", "a"]);
  });
});
