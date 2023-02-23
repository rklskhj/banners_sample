<template>
  <div v-if="visible" class="text-center" style="margin-top:150px">
    <div>
      <i class="material-icons" style="color:#a0a0a0;font-size:80px">warning</i>
    </div>
    <div style="margin:20px auto;width:300px">
      <h2>페이지를 찾을수 없습니다</h2>
      <p  style="color:#787878">페이지의 주소가 잘못 입력되거나,<br>삭제되어 요청하신 페이지를 찾을 수 없습니다.<br>입력하신 페이지 주소를 다시 확인해주세요.</p>
    </div>
    <button style="margin-top:20px;background: #333;border:0;padding:8px 12px;color:white" @click="clickHome">홈으로 가기</button>
  </div>
</template>

<script>
  export default {
    name: "NotFound",
    methods: {
      clickHome() {
        this.$router.replace('/home');
      }
    },
    data() {
      return {
        visible: false
      }
    },
    mounted() {
      if(location.pathname !== '/') {
        this.visible = true;
      }
    }
  }
</script>

<style scoped>

</style>