<template>
<div v-if="item">
    <a v-if="item.linkType === 'outlink'" :href="item.link" target="_blank"><slot></slot></a>
    <div v-else @click="clickButton"
      class="container"><slot></slot></div>
  </div>
</template>
<script>

export default {
  name: 'LpLink',
  components: {

  },
  mixins: [

  ],
  props: {
    item: {
      type: Object,
    },

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
      if(this.item.linkType === 'link' || this.item.linkType === 'page') {
        this.routerPush(this.item.link);
      } else if(this.item.linkType === 'overlay') {
        this.routerOverlay(this.item.link);
      } else if(this.item.linkType === 'modal') {
        this.routerModal(this.item.link);
      } else if(this.item.linkType === 'drawer_left') {
        this.routerDrawerLeft(this.item.link);
      } else if(this.item.linkType === 'drawer_right') {
        this.routerDrawerRight(this.item.link);
      } else if(this.item.linkType === 'emit') {
        this.$emit(this.item.link);
      }
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

