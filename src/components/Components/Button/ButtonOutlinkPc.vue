<template>
<div>
    <btn
        @clicked="clickBtn"
        class="p-white p-bg-brand"
        :customStyle="customStyle"
        :ga="ga"
    >{{ name }}</btn>
  </div>
</template>
<script>

export default {
  name: 'ButtonOutlinkPc',
  components: {

  },
  mixins: [

  ],
  props: {
    ga: {
      type: Object,
      required: false,
    },
    name: {
      type: String,
      default: "구매 바로가기",
    },
    customStyle: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

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
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


