<template>
<a v-if="center.enable_kakao" class="flex-center p-border-main p-bg-white radius-6"
    style="width: 138px; height: 32px; gap: 0 2px;text-decoration:none" :href="center.kakao_url" target="_blank">
    <i class="material-icons p-sub" style="font-size: 16px">sms</i>
    <div class="size-12 weight-400 p-sub">카카오톡 플러스</div>
  </a>
</template>
<script>
import HeaderFooterMixin from "@/components/Components/Mixins/HeaderFooterMixin"

export default {
  name: 'ButtonKakaoPlus',
  components: {

  },
  mixins: [
    HeaderFooterMixin
  ],
  props: {

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
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


