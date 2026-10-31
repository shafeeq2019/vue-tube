import { describe, expect, it } from "vitest";
import { authErrorMessage } from "../../src/utils/authErrors.js";

describe("authErrorMessage", () => {
  it("maps known Firebase error codes", () => {
    expect(authErrorMessage({ code: "auth/invalid-email" })).toBe("Invalid email address!");
    expect(authErrorMessage({ code: "auth/too-many-requests" })).toBe("Too many attempts. Please try again later.");
  });

  it("does not reveal whether an account exists on login", () => {
    const wrongPassword = authErrorMessage({ code: "auth/wrong-password" });
    expect(authErrorMessage({ code: "auth/user-not-found" })).toBe(wrongPassword);
    expect(authErrorMessage({ code: "auth/invalid-credential" })).toBe(wrongPassword);
  });

  it("falls back to the original message, then to a generic one", () => {
    expect(authErrorMessage({ code: "auth/unknown", message: "Boom" })).toBe("Boom");
    expect(authErrorMessage({})).toBe("Something went wrong. Please try again.");
    expect(authErrorMessage(undefined)).toBe("Something went wrong. Please try again.");
  });
});
