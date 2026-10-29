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
            @click="confirmRemove()"
          >
            <b-icon icon="trash" aria-label="delete"></b-icon>
          </b-button>
          <iframe
            :src="videoObj.data.video.url"
            :title="videoObj.data.video.title"
            height="100%"
            width="100%"
            loading="lazy"
            allowfullscreen
          ></iframe>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    videoObj: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions(["removeVideo"]),
    async confirmRemove() {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        `Do you really want to delete "${this.videoObj.data.video.title}"?`,
        {
          title: "Delete video",
          okVariant: "danger",
          okTitle: "Delete",
          centered: true,
          size: "sm",
        }
      );
      if (confirmed) {
        this.removeVideo(this.videoObj.id);
      }
    },
  },
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

/* Touch devices have no hover, so always show the delete button there */
@media (hover: none) {
  .iframe-button {
    display: initial;
  }
}
</style>
