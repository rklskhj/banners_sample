<template>
<div>
  <page-header style="width: 100%">
    <span class="header-title" slot="center">전체 후기</span>
    <div slot="right">
      <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
    </div>
  </page-header>
  <div id="block-all-review" style="padding: 0 16px; overflow-y:auto" :style="heightStyle">
    <block-review @close="$emit('closePage')"></block-review>
  </div>
</div>
</template>
<script>
import BlockReview from "@/components/Components/Block/BlockReview/BlockReview.vue"

export default {
  name: 'BlockAllReview',
  components: {
    BlockReview
  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "height": 0
    }
  },
  created() {
    this.height = window.innerHeight;

  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.height = window.innerHeight;
      })
      for(let el of document.getElementsByClassName('sweet-box-actions')) {
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    })
  },
  
  methods: {
    clickClose() {
      this.$emit('closePage');
    }
  },
  computed: {
    heightStyle() {
      let deco = {
        height: '100vh'
      }
      if (this.$store.getters.showAddrBar) {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
          if (navigator.userAgent.split('iPhone OS ')[1].substring(0,2) >= 15) {
            deco.height = `${this.height}px`
          } else {
            deco.height = 'calc(100vh - 120px)'
          }
        } else if (this.$store.getters.browserType !== 'pc') {
          if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
            if (navigator.userAgent.split('SamsungBrowser/')[1].substring(0,2) >= 16) {
              deco.height = `${this.height}px`;
            } else {
              deco.height = '100vh'
            }
          } else {
            deco.height = '100vh'
          }
        }
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


