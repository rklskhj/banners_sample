<template>
  <div class="position-relative">
    <btn
      :color="brandColor.white"
      :backgroundColor="{backgroundColor: 'rgb(0, 196, 28)'}"
      @clicked="clickShare"
    >
      <div class="btn-txt">라인</div>

      <social-sharing
        :url="domain"
        :title="shareData.name"
        :description="shareData.desc"
        quote
        inline-template
      >
        <network network="line">
          <div style="position:absolute;width:100%;height:100%;top:0;left:0"></div>
        </network>
      </social-sharing>
    </btn>
  </div>
</template>

<script>
import Vue from "vue";

import SocialSharing from 'vue-social-sharing';
Vue.use(SocialSharing);

export default {
  name: "BtnShareLine",
  props: {
    shareData: {
      type: Object,
      required: false
    }
  },

  computed: {
    domain() {
      return this.shareData.link;
    }
  },

  methods: {
    clickShare() {
      if (this.shareData.isProduct)
        this.$axios.post(`public/product/${this.$route.query.id}/share`);
      if (this.shareData.isPartner)
        this.$axios.post(`public/partner/${this.$route.query.id}/share`);
      if (this.shareData.isPost)
        this.$axios.post(`public/board/0/post/${this.$route.query.id}/share`);
      this.$emit('onShare');
    }
  }
};
</script>

<style lang="stylus" scoped>
.btn-txt {
  color: rgb(255, 255, 255);
  font-size: 14.25px;
  width: 100%;
  text-align: center;
}
</style>
