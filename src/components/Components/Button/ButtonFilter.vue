<template>
<div class="flex-align unselect" style="padding: 0 12px" @click="clickButton">
  <div class="size-14 p-main" style="margin-right: 4px">필터</div>
  <div class="size-12 flex-center p-bg-white p-border-main radius-6"
    :class="{
      'p-brand': $store.getters.filtered.length > 0,
      'p-sub': $store.getters.filtered.length === 0
    }" style="padding:1px 4px">
    {{ $store.getters.filtered.length !== 0 ? 'ON' : 'OFF' }}</div>
</div>
</template>
<script>

export default {
  name: 'ButtonFilter',
  components: {

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
  mounted() {

  },
  
  methods: {
    clickButton() {
      if(this.$store.getters.device === 'pc')
        this.routerModal('FilterModal');
      else
        this.routerOverlay('FilterOverlay');
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


