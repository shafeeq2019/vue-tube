<template>
  <div style="margin-top:60px;">
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col lg="11">
          <b-alert show variant="danger" v-if="errorMessage">
            {{ errorMessage }}
          </b-alert>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11">
          <h3 style="margin-bottom:20px;text-align:left">Login</h3>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-form-input
            type="email"
            size="large"
            placeholder="Enter your Email"
            v-model="email"
            class="inputs"
        /></b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-form-input
            type="password"
            size="large"
            placeholder="Enter your Password"
            class="inputs"
            v-model="password"
        /></b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-button @click="signIn()" style="margin-top:10px;"
            >Login</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
export default {
  data() {
    return {
      isAuthonticated: false,
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {},
  methods: {
    async signIn() {
      try {
        const auth = getAuth();
        let singIn = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = singIn.user;
        console.log(user);
        this.$router.push("/dashboard");
      } catch (error) {
        let errorCode = error.code;
        if (errorCode == "auth/wrong-password") {
          this.errorMessage = "wrong password!";
        } else if (errorCode == "auth/user-not-found") {
          this.errorMessage = "user not found!";
        } else if (errorCode == "auth/invalid-email") {
          this.errorMessage = "invalid email!";
        } else {
          this.errorMessage = error.errorMessage;
        }
      }
    },
    created() {},
  },
};
</script>

<style lang="css" scoped>
.input{
  margin-bottom: 20px;
}
</style>
