<template lang="html">
  <b-container class="content text-center">
    <b-row>
      <b-col>
        <div id="content">
          <h2 id="title" class="heading">Welcome to VueTube</h2>
          <div>
            VueTube is a Website where you can add your favourite YouTube
            videos.
          </div>
          <div>
            You can add them into categories to sperate documentries form music
            videos
          </div>
          <hr />
          <p style="font-size:30px;">Free account</p>
          <p>Createing an account on VueTube is free and will be</p>
          <router-link to="/signUp"><b-button>Get started!</b-button></router-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import appHeader from "../components/header.vue";
export default {
  components: {
    appHeader,
  },
};
</script>

<style lang="css" scoped></style>
