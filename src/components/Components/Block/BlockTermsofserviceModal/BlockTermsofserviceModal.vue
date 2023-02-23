<template>
<div style="width:100%;max-height:70%;padding:24px 0 16px" :style="[brandBgColor.white, radius, pagePadding]">
  
  <div :style="[scrollStyle, pageBg, radius]">
    <div class="size-20 weight-500 margin-bottom-16" :style="brandColor.main">이용약관</div>
    <div class="full-width full-height">
      <e-editor v-if="limit" :html="limit" style="padding: 0 16px 16px"></e-editor>
    </div>
  </div>
  
  <div class="full-width flex-center">
    <div class="full-width unselect flex-center weight-500" 
      :style="[brandBgColor.primary, brandColor.white, radius]" style="height:48px"
      @click.stop.prevent="$emit('closePage')">닫기</div>
  </div>
  
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockTermsofserviceModal',
  components: {

  },
  mixins: [
    PageMixin,
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "limit": undefined
    }
  },
  created() {
      this.$axios.get(`public/policy`)
      .then(res => {
        this.limit = res.data.policy.limit;
      })
    },
  mounted() {
    this.$nextTick(() => {
      for(let el of document.getElementsByClassName('sweet-box-actions')) { 
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    })
  },
  
  methods: {
    
  },
  computed: {
    scrollStyle() {
      return {
        height: '280px',
        overflowY: 'auto',
        marginBottom: '32px'
      }
    },
    pageBg() {
      return this.brandBgColor.main;
    }
  },
  watch: {
    
  }
}
</script>


