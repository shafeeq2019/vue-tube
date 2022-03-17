<template>
  <div style="margin-top:60px;">
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><h3 style="margin-bottom:20px;text-align:left">Sign Up</h3></b-col
        >
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-form-input
            type="text"
            placeholder="Enter your name"
            class="inputs"
            v-model="name"
        /></b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-form-input
            type="email"
            placeholder="Enter your Email"
            class="inputs"
            v-model="email"
        /></b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11"
          ><b-form-input
            type="password"
            placeholder="Enter your Password"
            class="inputs"
            v-model="password"
        /></b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col lg="11">
          <b-button @click="signUp()" style="margin-top:10px;"
            >Sign Up</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </div>
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
    };
  },
  computed: {
    ...mapState(["userID", "response", "isAuthonticated"]),
  },
  methods: {
    ...mapActions(["fetchAllData"]),
    async signUp() {
      if (this.name != null && this.email != null && this.password != null) {
        try {
          console.log("signUp");
          const auth = getAuth();
          let signUp = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );
          console.log(signUp);
          const user = signUp.user;
          await setDoc(doc(collection(db, "users")), {
            userName: this.name,
            userEMail: user.email,
            uid: user.uid,
          });
          this.$router.push("/dashboard");
        } catch (error) {
          console.log
          const errorCode = error.code;
          const errorMessage = error.message;
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
      } else {
        console.log("eeeee");
      }
    },
  },
  created() {},
};
</script>

<style lang="css">
.inputs{
  margin-bottom: 10px;
}
</style>
