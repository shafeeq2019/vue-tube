<template>
  <AuthLayout compact>
    <section class="vt-card form-card" aria-labelledby="login-title">
      <h2 id="login-title" class="vt-display h3 mb-1">Welcome back</h2>
      <p class="vt-muted mb-4">Sign in to open your library.</p>
      <BAlert :model-value="!!errorMessage" variant="danger">{{ errorMessage }}</BAlert>
      <form @submit.prevent="signIn()">
        <label class="vt-label">
          Email
          <input v-model="email" class="vt-input" type="email" placeholder="you@example.com" autocomplete="email" />
        </label>
        <label class="vt-label">
          Password
          <input v-model="password" class="vt-input" type="password" autocomplete="current-password" />
        </label>
        <p class="forgot-link">
          <RouterLink :to="{ name: 'forgotPassword', query: email ? { email } : {} }">Forgot password?</RouterLink>
        </p>
        <button class="vt-btn vt-btn-primary vt-btn-lg w-100 mt-2" type="submit" :disabled="busy">Sign in</button>
      </form>
      <p class="vt-muted text-center mt-4 mb-0">New here? <RouterLink to="/signUp">Create an account</RouterLink></p>
    </section>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import AuthLayout from "../components/AuthLayout.vue";
import { authErrorMessage } from "../utils/authErrors.js";

const route = useRoute();
const router = useRouter();

// Only follow app-internal redirects ("/share?…"), never "//evil.example".
function redirectTarget() {
  const target = route.query.redirect;
  return typeof target === "string" && target.startsWith("/") && !target.startsWith("//")
    ? target
    : "/dashboard";
}
// Prefilled when coming back from the password reset
const email = ref(typeof route.query.email === "string" ? route.query.email : "");
const password = ref("");
const errorMessage = ref("");
const busy = ref(false);

async function signIn() {
  if (!email.value || !password.value) {
    errorMessage.value = "All fields are required!";
    return;
  }
  busy.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push(redirectTarget());
  } catch (error) {
    errorMessage.value = authErrorMessage(error);
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.form-card {
  flex: 1 1 360px;
  max-width: 440px;
  padding: clamp(24px, 4vw, 36px);
}

.forgot-link {
  margin: -8px 0 18px;
  font-size: 13px;
  text-align: right;
}
</style>
