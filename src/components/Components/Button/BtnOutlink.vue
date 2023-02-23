<template>
  <div>
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="brandBgColor.brand"
        :customStyle="customStyle"
        :ga="ga"
    >{{ name }}</btn>
  </div>
</template>

<script>
  export default {
    name: "BtnOutlink",

    props: {
      name: {
        type: String,
        default: '구매 바로가기'
      },
      customStyle: {
        type: Object,
        required: false
      },
      // Google Analytics 세팅할 경우
      ga: {
        type: Object,
        required: false
      }
    },
    methods: {
      clickBtn() {
        let openLink = window.open('', '_blank');
        if(this.user.user_id) {
          this.$axios.get(`user/${this.user.user_id}/outlink/product/${this.$route.query.id}`).then(res => {
            if(res.status === 200) {
              if (res.data.link !== '') {
                openLink.location.href = res.data.link;
              } else {
                openLink.close();
                this.toast('바로가기 링크가 없습니다.');
              }
            }
          });
        }
        else {
          this.$axios.get('public/outlink/product/'+this.$route.query.id).then(res => {
            if(res.status === 200) {
              if (res.data.link !== '') {
                openLink.location.href = res.data.link;
              } else {
                openLink.close();
                this.toast('바로가기 링크가 없습니다.');
              }
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>