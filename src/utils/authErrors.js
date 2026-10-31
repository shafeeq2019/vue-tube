// User-facing messages for Firebase Auth error codes, shared by the
// login, sign-up and password reset forms.
const messages = {
  "auth/wrong-password": "Wrong email or password!",
  "auth/user-not-found": "Wrong email or password!",
  "auth/invalid-credential": "Wrong email or password!",
  "auth/invalid-email": "Invalid email address!",
  "auth/missing-email": "Please enter your email address!",
  "auth/weak-password": "Your password should be at least 6 characters!",
  "auth/email-already-in-use": "This email address is already in use. Please enter a different email address",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection and try again.",
};

export function authErrorMessage(error) {
  return messages[error?.code] || error?.message || "Something went wrong. Please try again.";
}
