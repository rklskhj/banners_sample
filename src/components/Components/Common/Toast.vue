<template>
  <transition name="fade">
    <div class="lp-toast" v-show="vToast"><span v-if="icon!==''"><i class="material-icons">{{ icon }}</i><br></span>{{ msg }}</div>
  </transition>
</template>

<script>
  export default {
    name: 'Toast',
    created() {
      this.$root.$on('toast', res => {
        if(res === undefined) return;

        this.msg = res;
        this.icon = '';
        if(res.indexOf('_icon_')>-1) {
          let msgs = res.split('_icon_');
          this.icon = msgs[1];
          this.msg = msgs[0];
        }
        this.vToast = true;
        setTimeout(() => {
          this.vToast = false;
        },1500);
      });
    },

    data() {
      return {
        vToast: false,
        msg: '',
        icon: ''
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .lp-toast
    position fixed
    z-index 10000
    top 50%
    left calc(50% - 7px)
    width 60%
    max-width 380px
    padding 12px
    font-size 0.9rem
    color white
    background-color rgba(0,0,0,0.8)
    text-align center
    border-radius 4px
    transform translate(-50%, -50%)
    white-space pre-line

  .fade-enter-active
  .fade-leave-active
    transition opacity .2s
  .fade-enter
  .fade-leave-to
    opacity 0

  i
    color white
    font-size 24px
</style>
