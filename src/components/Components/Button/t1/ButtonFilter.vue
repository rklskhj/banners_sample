<template>
<div class="flex-align unselect p-bg-sub radius-6" style="padding: 12px"
  :class="{
    'p-brand': $store.getters.filtered.length > 0,
    'p-main': $store.getters.filtered.length === 0
  }" @click="clickButton">
  <i class="material-icons" style="margin-right:4px">tune</i>
  <div class="size-14">필터</div>
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
      this.routerModal('FilterModal');
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


