<template>
<div>
    <page-header>
      <div slot="left">
        <i class="material-icons header-icon" @click="$emit('closePage')" style="margin: 0 10px;">close</i>
      </div>
      <span class="header-title" slot="center">필터</span>
      <span slot="right" class="weight-400 p-sub" style="margin:12px" @click="clickReset">초기화</span>
    </page-header>
  <div style="padding-top:50px;height:100vh">
    <block-filter ref="filter" :vBottom="true" @closePage="$emit('closePage')"></block-filter>
  </div>
  </div>
</template>
<script>
import BlockFilter from "@/components/Components/Block/BlockFilter/BlockFilter.vue"

export default {
  name: 'BlockFilterOverlay',
  components: {
    BlockFilter
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {

    }
  },
  created() {

  },
  
  methods: {
    clickReset() {
      this.$store.commit('setFilter', []);
      this.$refs.filter.setFilters();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


