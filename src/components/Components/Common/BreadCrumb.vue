<template>
<div class="flex-align container">
  <div @click="clickMenu" :style="menu[0].route ? selectStyle : {}"
    class="medium">{{ menu[0].name }} ></div>
  <div @click="clickMenu1" :style="menu[1].route ? selectStyle : {}"
    class="medium" style="margin-left:4px">{{ menu[1].name }} ></div>
  <div @click="clickMenu2" :style="menu[2].route ? selectStyle : {}"
    class="bold" style="margin-left:4px">{{ menu[2].name }}</div>
</div>
</template>

<script>
export default {
  name: "BreadCrumb",
  created() {
    this.menu = this.$store.getters.breadCrumb;
  },
  data() {
    return {
      menu: []
    }
  },
  methods: {
    clickMenu() {
      if(this.menu[0].route) {
        this.routerPush(`${this.menu[0].route}`)
      }
    },
    clickMenu1() {
      if(this.menu[1].route) {
        this.routerPush(`${this.menu[1].route}`)
      }
    },
    clickMenu2() {
      if(this.menu[2].route) {
        this.routerPush(`${this.menu[2].route}`)
      }
    }
  },
  computed: {
    selectStyle() {
      return {
        cursor: 'pointer'
      }
    },
  }
}
</script>

<style scoped>
.container {
  padding: 15px 0;
  margin-bottom: 34px;
  border-bottom: 1px solid #d9d9d9;
}
.medium {
  font-size: 18px;
  font-family: 'Arita Dotum Medium';
  color: #707070;
}
.bold {
  font-size: 18px;
  font-family: 'Arita Dotum SemiBold';
  color: #464749;
}
</style>