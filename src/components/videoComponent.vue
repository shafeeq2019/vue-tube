<template lang="html">
  <div>
    <b-container>
      <b-row style="margin-bottom:10px;margin-top:10px">
        <b-col
          ><h5>
            {{ videoObj.data.video.title }}
          </h5>
        </b-col>
      </b-row>
      <b-row class="frame-container">
        <b-col>
          <b-button
            size="sm"
            variant="danger"
            class="mb-2 iframe-button"
            @click="removeVideo(videoObj.id)"
          >
            <b-icon icon="trash" aria-label="delete"></b-icon>
          </b-button>
          <iframe
            :src="videoObj.data.video.url"
            height="100%"
            width="100%"
            allowfullscreen
          ></iframe>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  components: {},
  props: {
    videoObj: Object,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "userID",
      "response",
      "isAuthonticated",
      "showSuccessAlert",
      "showErrorAlert",
      "selectedCategory",
      "videos",
    ]),
  },
  methods: {
    ...mapActions(["removeVideo"]),
  },
  created() {},
};
</script>

<style lang="css" scoped>
.frame-container {
  position: relative;
  height: 250px;
  margin-bottom: 10px;
}
.iframe-button {
  display: none;
  position: absolute;
  top: 10px;
  left: 25px;
}

.frame-container:hover .iframe-button {
  display: initial;
}
</style>
