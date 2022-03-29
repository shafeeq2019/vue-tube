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
      <b-col lg="11"><h3 class="heading">Sign Up</h3></b-col>
    </b-row>
    <b-form @submit="signUp">
      <b-row class="justify-content-center">
        <b-col lg="11"
          ><b-form-input
            type="text"
            placeholder="Enter your name"
            class="inputs"
            v-model="name"
        /></b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col lg="11"
          ><b-form-input
            type="email"
            placeholder="Enter your Email"
            class="inputs"
            v-model="email"
        /></b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col lg="11"
          ><b-form-input
            type="password"
            placeholder="Enter your Password"
            class="inputs"
            v-model="password"
        /></b-col>
      </b-row>

      <b-row class="justify-content-center">
        <b-col lg="11">
          <b-button type="submit" class="submit-button"
            >Sign Up</b-button
          ></b-col
        >
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { db } from "../firebase.js";
import { mapState, mapActions } from "vuex";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["userID", "response", "isAuthonticated"]),
  },
  methods: {
    ...mapActions(["fetchAllData"]),
    async signUp(event) {
      event.preventDefault();
      if (this.name != "" && this.email != "" && this.password != "") {
        try {
          const auth = getAuth();
          let signUp = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
          const user = signUp.user;
          await setDoc(doc(collection(db, "users")), {
            userName: this.name,
            userEMail: user.email,
            uid: user.uid,
          });
          this.$router.push("/dashboard");
        } catch (error) {
          const errorCode = error.code;
          if (errorCode == "auth/wrong-password") {
            this.errorMessage = "Wrong password !";
          } else if (errorCode == "auth/user-not-found") {
            this.errorMessage = "User not found !";
          } else if (errorCode == "auth/invalid-email") {
            this.errorMessage = "Invalid email !";
          } else if (errorCode == "auth/weak-password") {
            this.errorMessage =
              "Your password should be at least 6 characters !";
          } else {
            this.errorMessage = error.errorMessage;
          }
        }
      } else {
        this.errorMessage = "All fields are required !";
      }
    },
  },
  created() {},
};
</script>

<style lang="css"></style>
