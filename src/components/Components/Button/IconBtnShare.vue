<template>
  <div class="flex" :style="iconStyle">
    <i class="material-icons unselect" :style="iconStyle" @click="clickBtn">{{ icon }}</i>
  </div>
</template>

<script>
  export default {
    name: "IconBtnShare",
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
        default: 'open_in_new'
      }
    },
    methods: {
      isHex(h) {
        let a = parseInt(h, 16);
        return (a.toString(16) === h.toLowerCase());
      },
      clickBtn() {
        this.$emit('share');
      }
    },
    computed: {
      iconStyle() {
        let deco = {};
        if (this.isHex(this.color)) {
          deco.color = `#${this.color}`
        } else {
          deco.color = this.brandColor[this.color].color;
        }
        deco.fontSize = this.size+'px';
        deco.height = deco.fontSize;
        return deco;
      }
    }
  }
</script>
