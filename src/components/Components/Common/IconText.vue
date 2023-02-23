<template>
  <div class="flex-align">
    <i class="material-icons" style="font-size:18px" :style="brandColor.brand">{{ name }}</i>
    <div  style="margin-left:4px;font-size:18px" :style="brandColor.brand"><slot></slot></div>
  </div>
</template>

<script>
  export default {
    name: "IconText",
    props: {
      name: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>