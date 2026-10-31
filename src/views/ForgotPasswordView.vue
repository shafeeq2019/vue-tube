<template>
  <AuthLayout compact>
    <section class="vt-card form-card" aria-labelledby="forgot-title">
      <h2 id="forgot-title" class="vt-display h3 mb-1">Reset your password</h2>
      <template v-if="!sentTo">
        <p class="vt-muted mb-4">Enter the email of your account and we'll send you a link to choose a new password.</p>
        <BAlert :model-value="!!errorMessage" variant="danger" role="alert">{{ errorMessage }}</BAlert>
        <form @submit.prevent="sendResetLink()">
          <label class="vt-label">
            Email
            <input
              ref="emailInput"
              v-model="email"
              class="vt-input"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
            />
          </label>
          <button class="vt-btn vt-btn-primary vt-btn-lg w-100 mt-2" type="submit" :disabled="busy">
            Send reset link
          </button>
        </form>
      </template>
      <template v-else>
        <div role="status">
          <p class="vt-muted mb-3">
            If an account exists for <strong class="sent-to">{{ sentTo }}</strong>, you'll get an email with a link to
            reset your password in a few minutes.
          </p>
          <p class="vt-muted mb-4">Don't see it? Check your spam folder.</p>
        </div>
        <BAlert :model-value="!!errorMessage" variant="danger" role="alert">{{ errorMessage }}</BAlert>
        <RouterLink class="vt-btn vt-btn-primary vt-btn-lg w-100" :to="{ name: 'login', query: { email: sentTo } }">
          Back to sign in
        </RouterLink>
        <button class="vt-btn vt-btn-ghost w-100 mt-2" type="button" :disabled="busy || cooldown > 0" @click="sendResetLink()">
          {{ cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email" }}
        </button>
        <button class="vt-btn vt-btn-ghost w-100 mt-2" type="button" @click="useOtherEmail()">Use a different email</button>
      </template>
      <p v-if="!sentTo" class="vt-muted text-center mt-4 mb-0">
        Remembered it? <RouterLink :to="{ name: 'login', query: email ? { email } : {} }">Sign in</RouterLink>
      </p>
    </section>
  </AuthLayout>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.js";
import AuthLayout from "../components/AuthLayout.vue";
import { authErrorMessage } from "../utils/authErrors.js";

// Seconds before the email can be sent again
const RESEND_COOLDOWN = 30;

const route = useRoute();
const router = useRouter();
const emailInput = useTemplateRef("emailInput");

const email = ref(typeof route.query.email === "string" ? route.query.email : "");
const sentTo = ref("");
const errorMessage = ref("");
const busy = ref(false);
const cooldown = ref(0);
let cooldownTimer = null;

onMounted(() => emailInput.value?.focus());
onBeforeUnmount(stopCooldown);

function startCooldown() {
  stopCooldown();
  cooldown.value = RESEND_COOLDOWN;
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0) {
      stopCooldown();
    }
  }, 1000);
}

function stopCooldown() {
  clearInterval(cooldownTimer);
  cooldownTimer = null;
  cooldown.value = 0;
}

// After the reset, Firebase's page offers a "Continue" button back to the
// login with the email prefilled.
function continueUrl(address) {
  const { href } = router.resolve({ name: "login", query: { email: address } });
  return new URL(href, window.location.origin).href;
}

async function sendResetLink() {
  const address = email.value.trim();
  errorMessage.value = "";
  if (!address) {
    errorMessage.value = "Please enter your email address!";
    return;
  }
  busy.value = true;
  try {
    try {
      await sendPasswordResetEmail(auth, address, { url: continueUrl(address) });
    } catch (error) {
      // The current domain is not in Firebase's authorized domains:
      // still send the email, just without the way back to the app.
      if (error.code !== "auth/unauthorized-continue-uri") {
        throw error;
      }
      await sendPasswordResetEmail(auth, address);
    }
    // Same message whether or not an account exists, so the form can't be
    // used to find out which email addresses are registered.
    sentTo.value = address;
    startCooldown();
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // Only reported when email enumeration protection is off
      sentTo.value = address;
      startCooldown();
    } else {
      errorMessage.value = authErrorMessage(error);
    }
  } finally {
    busy.value = false;
  }
}

async function useOtherEmail() {
  sentTo.value = "";
  errorMessage.value = "";
  stopCooldown();
  await nextTick();
  emailInput.value?.focus();
}
</script>

<style scoped>
.form-card {
  flex: 1 1 360px;
  max-width: 440px;
  padding: clamp(24px, 4vw, 36px);
}

.sent-to {
  color: var(--vt-text);
  word-break: break-all;
}
</style>
