
export default {
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
      setUserData(res) {
        if(res.user) {
          this.$store.commit('setUser', res.user);
        }
        // User 맞춤 DB 내용이 있을 경우 vuex 추가
        if (res.detail !== undefined && res.detail.user_params !== undefined && res.detail.user_params.length > 0) {
          this.$store.commit('setUserParam', res.detail.user_params);
  
        }
        // 회원 등급
          if (res.grade !== undefined) {
            this.$store.commit('setUserGrade', res.grade);
          }
          
        // 유저파트너 정보
        if (res.partner_id) {
          let user = this.$store.getters.user;
          user.partner_id = res.partner_id;
          if (res.partner_grade)
            user.partner_grade = res.partner_grade;
          this.$store.commit('setUserPartner', user);
        }
      }
    },
    computed: {
    
    },
    watch: {
    
    }
}
