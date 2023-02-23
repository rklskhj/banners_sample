<template>
  <div class="flex-center" :style="[shareContainStyle ? shareContainStyle : iconWrapStyle]" @click="clickBtn">
    <i class="material-icons unselect" :style="iconStyle">{{ icon }}</i>
    <div v-if="text" :style="[shareTextStyle ? shareTextStyle : letterStyle]">{{ text }}</div>
  </div>
</template>

<script>
  export default {
    name: "IconCircleShare",
    props: {
      size: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: 'sub'
      },
      icon: {
        type: String,
        default: 'share'
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
      shareContainStyle: {
        type: Object,
        required: false
      },
      shareTextStyle: {
        type: Object,
        required: false
      }
    },
    methods: {
      clickBtn() {
        this.$emit('share');
      }
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
