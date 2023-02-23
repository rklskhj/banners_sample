<template>
  <div class="text-center" style="margin-top:150px">
    <div>
      <i class="material-icons" style="color:#a0a0a0;font-size:80px">lock</i>
    </div>
    <div style="margin:20px auto;width:300px">
      <h2>페이지 접근권한이 없습니다</h2>
      <p  style="color:#787878">파트너 등급이 {{ grade }} 이상인 파트너만 접근할 수 있습니다.</p>
    </div>
    <p>
      <button :style="[brandBgColor.brand, radius]" style="margin-top:20px;border:0;padding:8px 12px;color:white" @click="clickBtn">파트너 등급 승인 요청하러 가기</button>
    </p>
      <button :style="radius" style="background: #333;border:0;padding:8px 12px;color:white" @click="clickHome">홈으로 가기</button>
  </div>
</template>

<script>
  export default {
    name: "WrongPartnerGrade",
    created() {
      this.$axios.get('public/service/partner_grade').then(res=>{
        this.grade = res.data.filter(item=> { return item.order === parseInt(this.$route.query.order) })[0].name;
      });
    },
    methods: {
      clickBtn() {
        this.$router.replace('/verify');
      },
      clickHome() {
        this.$router.replace('/home');
      }
    },
    data() {
      return {
        grade: ''
      }
    }
  }
</script>

<style lang="stylus" scoped>
  button:hover
    box-shadow 0 2px 4px 1px rgba(0,0,0,0.5)
</style>