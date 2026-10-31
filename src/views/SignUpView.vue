<template>
  <AuthLayout compact>
    <section class="vt-card form-card" aria-labelledby="signup-title">
      <h2 id="signup-title" class="vt-display h3 mb-1">Create your account</h2>
      <p class="vt-muted mb-4">Free, and it will always be.</p>
      <BAlert :model-value="!!errorMessage" variant="danger">{{ errorMessage }}</BAlert>
      <form @submit.prevent="signUp()">
        <label class="vt-label">
          Name
          <input v-model="name" class="vt-input" type="text" autocomplete="name" />
        </label>
        <label class="vt-label">
          Email
          <input v-model="email" class="vt-input" type="email" placeholder="you@example.com" autocomplete="email" />
        </label>
        <label class="vt-label">
          Password
          <input v-model="password" class="vt-input" type="password" placeholder="At least 6 characters" autocomplete="new-password" />
        </label>
        <button type="submit" class="vt-btn vt-btn-primary vt-btn-lg w-100 mt-2" :disabled="busy">Create account</button>
      </form>
      <p class="vt-muted text-center mt-4 mb-0">Already have an account? <RouterLink to="/login">Log in</RouterLink></p>
    </section>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import AuthLayout from "../components/AuthLayout.vue";
import { authErrorMessage } from "../utils/authErrors.js";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const busy = ref(false);

async function signUp() {
  if (!name.value.trim() || !email.value || !password.value) {
    errorMessage.value = "All fields are required!";
    return;
  }
  busy.value = true;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await setDoc(doc(db, "users", user.uid), {
      userName: name.value.trim(),
      userEMail: user.email,
      uid: user.uid,
    });
    router.push("/dashboard");
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
</style>
