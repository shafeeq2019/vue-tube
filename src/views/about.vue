<template lang="html">
  <b-container class="content text-center">
    <b-row>
      <b-col>
        <h2 style="heading">About VueTube</h2>
        <p>
          At VueTube you can sign up for free and start adding your favourite
          YouTube videos right away.
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["users"]),
  },
};
</script>

<style lang="css" scoped></style>
