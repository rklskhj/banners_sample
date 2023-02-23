<template>
<div :style="pagePadding" style="padding-top:20px">
  <div class="size-20 weight-500 margin-bottom-16 text-center" :style="brandColor.main">개인정보 처리방침</div>
  <e-editor v-if="term" :html="term" style="padding:0"></e-editor>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockPrivacy',
  components: {

  },
  mixins: [
    BlockMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "term": undefined
    }
  },
  created() {
    this.getData();
  },
  
  methods: {
    getData() {
      this.$axios.get('public/policy')
      .then(res => {
        this.term = res.data.policy.term;
      })
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


