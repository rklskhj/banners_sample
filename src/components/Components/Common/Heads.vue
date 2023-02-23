<template>
  <div></div>
</template>
<script>
  export default {
    name: "Heads",
    props: {
      serviceName: {
        type: String
      },
      pageName: {
        type: String,
        default: ''
      },
      scripts: {
        type: Array
      },
      links: {
        type: Array
      },
      headStyles: {
        type: String
      },
    },
    head: {
      script() {
        return this.scripts;
      }
    }
  }
</script>
