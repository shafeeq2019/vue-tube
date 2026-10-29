<template>
  <b-container class="content">
    <b-row class="justify-content-center">
      <b-col lg="11">
        <b-alert show variant="danger" v-if="errorMessage">
          {{ errorMessage }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col lg="11">
        <h3 class="heading">Login</h3>
      </b-col>
    </b-row>
    <b-form @submit="signIn">
      <b-row class="justify-content-center">
        <b-col lg="11"><b-form-input type="email" size="large" placeholder="Enter your Email" v-model="email"
            class="inputs" /></b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col lg="11"><b-form-input type="password" size="large" placeholder="Enter your Password" class="inputs"
            v-model="password" /></b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col lg="11"><b-button class="submit-button" type="submit">Login</b-button></b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async signIn(event) {
      event.preventDefault();
      if (this.email != "" && this.password != "") {
        try {
          const auth = getAuth();
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push("/dashboard").catch(() => { });
        } catch (error) {
          let errorCode = error.code;
          if (
            errorCode == "auth/wrong-password" ||
            errorCode == "auth/user-not-found" ||
            errorCode == "auth/invalid-credential"
          ) {
            this.errorMessage = "Wrong email or password!";
          } else if (errorCode == "auth/invalid-email") {
            this.errorMessage = "Invalid email!";
          } else if (errorCode == "auth/too-many-requests") {
            this.errorMessage = "Too many attempts. Please try again later.";
          } else {
            this.errorMessage = error.message;
          }
        }
      } else {
        this.errorMessage = "All fields are required!";
      }
    },
  },
};
</script>

<style lang="css" scoped>
.input {
  margin-bottom: 20px;
}
</style>
