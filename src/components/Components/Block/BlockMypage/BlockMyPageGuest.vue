<template>
<div :style="pagePadding" style="width:100%;padding:20px 0" class="flex-between unselect" @click="clickLogin">
  <div class="flex-align">
    <img :src="dummyImage.person" class="profile-img object-fit-cover radius-half" />
    <div>
      <div class="size-16 weight-500 margin-bottom-4 p-main">로그인 & 가입하기</div>
      <div class="size-12 p-sub2">로그인 후 더 많은 서비스를 만나보세요.</div>
    </div>
  </div>
  
  <i class="material-icons p-main">keyboard_arrow_right</i>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockMyPageGuest',
  components: {

  },
  mixins: [
    PageMixin
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
    clickLogin() {
      this.$emit('closePage');
      this.routerPush('signin');
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.profile-img {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}
</style>

