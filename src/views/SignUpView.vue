<template>
  <BContainer class="content">
    <BRow class="justify-content-center">
      <BCol lg="11">
        <BAlert :model-value="!!errorMessage" variant="danger">{{ errorMessage }}</BAlert>
        <h3 class="heading">Sign Up</h3>
        <BForm @submit.prevent="signUp()">
          <BFormInput v-model="name" type="text" placeholder="Enter your name" autocomplete="name" />
          <BFormInput v-model="email" type="email" placeholder="Enter your Email" autocomplete="email" />
          <BFormInput v-model="password" type="password" placeholder="Enter your Password" autocomplete="new-password" />
          <BButton type="submit" class="submit-button" :disabled="busy">Sign Up</BButton>
        </BForm>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const busy = ref(false);

const errorMessages = {
  "auth/weak-password": "Your password should be at least 6 characters!",
  "auth/email-already-in-use":
    "This email address is already in use. Please enter a different email address",
  "auth/invalid-email": "Invalid email address!",
};

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
    errorMessage.value = errorMessages[error.code] || error.message;
  } finally {
    busy.value = false;
  }
}
</script>
