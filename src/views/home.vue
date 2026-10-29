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
            You can sort them into categories to separate documentaries from music
            videos.
          </div>
          <hr />
          <p style="font-size:30px;">Free account</p>
          <p>Creating an account on VueTube is free and will always be.</p>
          <router-link to="/signUp"><b-button>Get started!</b-button></router-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {};
</script>

<style lang="css" scoped></style>
