<template lang="html">
  <b-container>
    <b-row align-v="center">
      <b-col>
        <div id="content">
          <div>
            <h2 style="margin-bottom:20px">About VueTube</h2>
            <p>
              At VueTube you can sign up for free and start adding your
              favourite YouTube videos right away.
            </p>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["users"])
  }
};
</script>

<style lang="css" scoped></style>
