<template>
  <a :href="href" target="_blank" @click="clickBtn" style="text-decoration: none">
    <div class="flex-center" :style="[reqContainStyle ? reqContainStyle : iconWrapStyle]">
      <i class="material-icons unselect" :style="iconStyle">{{ icon }}</i>
      <div v-if="text" :style="[reqTextStyle ? reqTextStyle : letterStyle]">{{ text }}</div>
    </div>
  </a>
</template>

<script>
  export default {
    name: "IconCircleRequest",
    props: {
      size: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: 'main'
      },
      icon: {
        type: String,
        default: 'home'
      },
      width: {
        type: Number,
        default: 48,
      },
      height: {
        type: Number,
        default: 48,
      },
      borderRadius: {
        type: Number,
        default: 8,
      },
      text: {
        type: String,
        required: false
      },
      reqContainStyle: {
        type: Object,
        required: false
      },
      reqTextStyle: {
        type: Object,
        required: false
      },
      product: {
        type: Object
      }
    },
    head: {
      script() {
        return [
          {type: 'text/javascript', src: 'https:////developers.kakao.com/sdk/js/kakao.min.js', head: true}
        ];
      }
    },
    data() {
      return {
        href: ''
      }
    },
    created() {
      Kakao.init(this.$store.getters.social_key.kakao.javascript_key);
    },
    mounted() {
      this.$nextTick(() => {
        this.getHref(this.product.inquiry_conversion_type);
      })
    },
    methods: {
      getHref(inquiry_conversion_type) {
        switch (inquiry_conversion_type) {
          case 1:
            this.getCallNum();
            break;
          case 2:
            this.href = `mailto:${this.product.partner.email}`;
            break;
          case 3:
            this.href = `#`;
            break;
          case 4:
            this.href = `${this.product.partner.homepage}`;
            break;
        } 
      },
      clickBtn() {
        if (this.product.inquiry_conversion_type === 3) {
          Kakao.Channel.chat({
            channelPublicId: this.product.partner.kakao_channel_id
          });
        } else {
          return;
        }
      },
      getCallNum() {
        let user_id = this.$store.getters.user.user_id;
        let url = `user/${user_id}/product/${this.$route.query.id}/call`;
        this.$axios.get(url).then(res=>{
          return this.href = `tel:${res.data.call}`;
        })
      },
    },
    computed: {
      iconStyle() {
        let deco = this.brandColor[this.color];
        deco.fontSize = this.size+'px';
        deco.height = deco.fontSize;
        return deco;
      },
      iconWrapStyle() {
        let deco = {
          backgroundColor: `${this.getColor('기본 배경 색상')}`
        }

        if(this.width) deco.width = `${this.width}px`;
        if(this.height) deco.height = `${this.height}px`;
        if(this.borderRadius) deco.borderRadius = `${this.borderRadius}px`;

        return deco;
      },
      letterStyle() {
        return {
          marginLeft: '6px',
          whiteSpace: 'pre',
          color: this.getColor('보조 내용 색상')
        }
      }
    }
  }
</script>

<style lang="stylus">
  a
    text-decoration unset
</style>