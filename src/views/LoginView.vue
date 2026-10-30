<template>
  <BContainer class="content">
    <BRow class="justify-content-center">
      <BCol lg="11">
        <BAlert :model-value="!!errorMessage" variant="danger">{{ errorMessage }}</BAlert>
        <h3 class="heading">Login</h3>
        <BForm @submit.prevent="signIn()">
          <BFormInput v-model="email" type="email" size="lg" placeholder="Enter your Email" autocomplete="email" />
          <BFormInput
            v-model="password"
            type="password"
            size="lg"
            placeholder="Enter your Password"
            autocomplete="current-password"
          />
          <BButton class="submit-button" type="submit" :disabled="busy">Login</BButton>
        </BForm>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

const route = useRoute();
const router = useRouter();

// Only follow app-internal redirects ("/share?…"), never "//evil.example".
function redirectTarget() {
  const target = route.query.redirect;
  return typeof target === "string" && target.startsWith("/") && !target.startsWith("//")
    ? target
    : "/dashboard";
}
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const busy = ref(false);

const errorMessages = {
  "auth/wrong-password": "Wrong email or password!",
  "auth/user-not-found": "Wrong email or password!",
  "auth/invalid-credential": "Wrong email or password!",
  "auth/invalid-email": "Invalid email!",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

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
    errorMessage.value = errorMessages[error.code] || error.message;
  } finally {
    busy.value = false;
  }
}
</script>
