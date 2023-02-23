<template>
<div :style="pagePadding" style="margin:25px 0" class="full-width">
  <div class="full-width p-bg-white">
    <e-editor :html="detail.info" style="padding:0"></e-editor>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockExhibitionEditorArea',
  components: {

  },
  mixins: [

  ],
  props: {
    detail: {
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
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


