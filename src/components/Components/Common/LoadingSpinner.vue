<template>
  <div class="lp-loading-bg">
    <!-- <div class="lp-loading-dim"></div> -->
    <div class="lp-loading">
      <div class="lp-spinner">
        <div v-for="idx in 12" :style="brandBgColor.primary" :key="'spn-'+idx"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LoadingSpinner"
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .lp-loading-bg
    z-index 999999999
    top 0
    left 0
    height 100vh
    position fixed
    width 100%

  .lp-loading
    position absolute
    top 45%
    left 50%
    transform translateX(-50%)

  .lp-loading-dim
    width 100%
    height 100%
    background-color rgba(0,0,0,0.18)


  @keyframes lp-spinner
    0%
      opacity 1
    100%
      opacity 0

  @-webkit-keyframes lp-spinner
    0%
      opacity 1
    100%
      opacity 0

  .lp-spinner
    position relative

  .lp-spinner div
    left 94px
    top 48px
    position absolute
    -webkit-animation lp-spinner linear 1s infinite
    animation lp-spinner linear 1s infinite
    width 12px
    height 24px
    border-radius 40%
    -webkit-transform-origin 6px 52px
    transform-origin 6px 52px

  .lp-spinner div:nth-child(1)
    -webkit-transform rotate(0deg)
    transform rotate(0deg)
    -webkit-animation-delay -0.916666666666667s
    animation-delay -0.916666666666667s

  .lp-spinner div:nth-child(2)
    -webkit-transform rotate(30deg)
    transform rotate(30deg)
    -webkit-animation-delay -0.833333333333333s
    animation-delay -0.833333333333333s

  .lp-spinner div:nth-child(3)
    -webkit-transform rotate(60deg)
    transform rotate(60deg)
    -webkit-animation-delay -0.75s
    animation-delay -0.75s

  .lp-spinner div:nth-child(4)
    -webkit-transform rotate(90deg)
    transform rotate(90deg)
    -webkit-animation-delay -0.666666666666667s
    animation-delay -0.666666666666667s

  .lp-spinner div:nth-child(5)
    -webkit-transform rotate(120deg)
    transform rotate(120deg)
    -webkit-animation-delay -0.583333333333333s
    animation-delay -0.583333333333333s

  .lp-spinner div:nth-child(6)
    -webkit-transform rotate(150deg)
    transform rotate(150deg)
    -webkit-animation-delay -0.5s
    animation-delay -0.5s

  .lp-spinner div:nth-child(7)
    -webkit-transform rotate(180deg)
    transform rotate(180deg)
    -webkit-animation-delay -0.416666666666667s
    animation-delay -0.416666666666667s

  .lp-spinner div:nth-child(8)
    -webkit-transform rotate(210deg)
    transform rotate(210deg)
    -webkit-animation-delay -0.333333333333333s
    animation-delay -0.333333333333333s

  .lp-spinner div:nth-child(9)
    -webkit-transform rotate(240deg)
    transform rotate(240deg)
    -webkit-animation-delay -0.25s
    animation-delay -0.25s

  .lp-spinner div:nth-child(10)
    -webkit-transform rotate(270deg)
    transform rotate(270deg)
    -webkit-animation-delay -0.166666666666667s
    animation-delay -0.166666666666667s

  .lp-spinner div:nth-child(11)
    -webkit-transform rotate(300deg)
    transform rotate(300deg)
    -webkit-animation-delay -0.083333333333333s
    animation-delay -0.083333333333333s

  .lp-spinner div:nth-child(12)
    -webkit-transform rotate(330deg)
    transform rotate(330deg)
    -webkit-animation-delay 0s
    animation-delay 0s

  .lp-spinner
    width 80px !important
    height 80px !important
    -webkit-transform translate(-40px, -40px) scale(0.4) translate(40px, 40px)
    transform translate(-40px, -40px) scale(0.4) translate(40px, 40px)



</style>
