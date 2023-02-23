<template>
  <div class="lp-base-input base-switch-input">
    <div class="range-bar"
         :style="barStyle"
         @click.stop.prevent="toggleVal">
      <div class="range-pointer"
           :style="pointerStyle">
      </div>
      <!-- On label -->
      <div class="on-text"
           v-if="val"
           v-show="showLabel">
        <span v-if="onLabel"
              class="on-text">{{ onLabel }}</span>
        <i class="material-icons on-text"
           v-if="!onLabel"
           style="line-height: 30px;">check</i>
      </div>
      <!-- Off label -->
      <div class="off-text"
           v-if="!val"
           v-show="showLabel">
        <span v-if="offLabel"
              class="off-text">{{ offLabel }}</span>
        <i class="material-icons off-text"
           v-if="!offLabel"
           style="line-height: 30px;">close</i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CInputToggle',

    props: {
      val: {
        type: Boolean,
        required: true
      },

      showLabel: {
        type: Boolean,
        default: false
      },

      onLabel: {
        type: String,
        default: null
      },

      offLabel: {
        type: String,
        default: null
      }
    },

    created() {
      this.value = this.val;
    },

    data() {
      return {
        value: this.val
      };
    },

    computed: {
      barStyle() {
        let style = {};

        if ( this.value ) {
          style.backgroundColor = this.brandColor.brand.color;
          style.justifyContent = 'flex-start';
          style.paddingLeft = '6px';
        }
        else if ( !this.value ) {
          style.backgroundColor = '#D5D5D5';
          style.justifyContent = 'flex-end';
          style.paddingRight = '6px';
        }

        return style;
      },
      pointerStyle() {
        let style = {};

        if ( this.value ) {
          style.right = '1px';
        }
        else if ( !this.value ) {
          style.right = '1px';
          style.left = '1px';
        }

        return style;
      }
    },

    watch: {
      val(n) {
        this.value = n;
      },
      value(n) {
        this.$emit('update:val', n);
      }
    },

    methods: {
      toggleVal() {
        this.value = !this.value;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .base-switch-input
    display inline-flex
    align-items center
    justify-content center

  .range-bar
    position relative
    border-radius 23px
    cursor pointer
    width 40px
    height 20px
    display flex
    align-items center

  .range-pointer
    position absolute
    top 1px
    cursor pointer
    background #fff
    width 18px
    height 18px
    border-radius 25px

  .on-text
  .off-text
    font-size 12px
    font-weight bold
  .on-text
    color #fff
  .off-text
    color #8E8E8E
</style>
