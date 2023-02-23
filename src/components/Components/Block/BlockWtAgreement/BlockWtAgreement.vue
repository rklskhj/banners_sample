<template>
<div :style="containerStyle">
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 32px 0">이용 약관 및 개인 정보 처리 방침</div>
    <div class="flex-align unselect" :style="valid.all ? brandBorder.brand : brandBorder.main"
         style="border-radius: 8px;height:48px;line-height:48px;padding:0 16px" @click="clickValidAll">
      <i class="material-icons" :style="valid.all ? brandColor.brand : brandColor.sub3"
         style="margin-right:4px">check</i><div class="size-14"
                                                :style="valid.all ? brandColor.brand : brandColor.sub">모두 동의하기</div>
    </div>
    <div style="margin-top:24px">
      <div class="flex-align" style="margin-bottom:12px">
        <div class="flex-align unselect" @click="clickValid('limit')">
          <i class="material-icons"
             :style="valid.limit ? brandColor.brand : brandColor.sub3"
             style="margin-right:4px">check</i>
          <div class="size-14" :style="brandColor.main">이용약관 (필수)</div>
        </div>
        <div class="size-12 unselect" :style="brandColor.sub2"
          style="text-decoration: underline;margin-left:8px" @click="clickTerms">자세히 보기</div>
      </div>
      <e-editor :style="[brandColor.sub2, brandBgColor.sub]"
                style="padding:16px;border-radius: 10px;height:96px;overflow-y:auto"
                :html="policy.limit"></e-editor>
    </div>

    <div style="margin-top:24px">
      <div class="flex-align" style="margin-bottom:12px">
        <div class="flex-align unselect" @click="clickValid('term')">
          <i class="material-icons"
             :style="valid.term ? brandColor.brand : brandColor.sub3"
             style="margin-right:4px">check</i>
          <div class="size-14" :style="brandColor.main">개인 정보 처리 방침 (필수)</div>
        </div>
        <div class="size-12 unselect" :style="brandColor.sub2"
          style="text-decoration: underline;margin-left:8px" @click="clickPrivacy">자세히 보기</div>
      </div>
      <e-editor :style="[brandColor.sub2, brandBgColor.sub]"
                style="padding:16px;border-radius: 10px;height:96px;overflow-y:auto"
                :html="policy.term"></e-editor>
    </div>

    <div :class="{'unselect': valid.all}" :style="[valid.all ? brandBgColor.brand : brandBtn.bg.gray, brandColor.white]"
         style="text-align:center;border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="apply">동의</div>
  </div>
</template>
<script>

export default {
  name: 'BlockWtAgreement',
  components: {

  },
  mixins: [

  ],
  props: {
    value: {
      type: Object,
    },

  },
  data() {
    return {
      "valid": {
        "all": false,
        "term": false,
        "limit": false
      },
      "policy": {
        "term": "",
        "limit": ""
      }
    }
  },
  created() {
      this.getData();
    },
  
  methods: {
    clickTerms() {
      if(this.$store.getters.device === 'pc') {
       this.routerModal('TermsofserviceModal') ;
      } else {
       this.routerOverlay('TermsofserviceOverlay') 
      }
    },
    clickPrivacy() {
      if(this.$store.getters.device === 'pc') {
       this.routerModal('PrivacyModal') ; 
      } else {
        this.routerOverlay('PrivacyOverlay')
      }
    },
    getData() {
        this.$axios.get('public/policy').then(res=>{
          this.policy = res.data.policy;
        });
      },
    apply() {
        if(this.valid.all) {
          this.$emit('next');
        }
      },
    clickValidAll() {
        this.valid.all = !this.valid.all;

        this.valid.limit = this.valid.all ;
        this.valid.term = this.valid.all;
      },
    clickValid(key) {
        this.valid[key] = !this.valid[key];
        if(!this.valid[key]) {
          this.valid.all = false;
        }
        if(this.valid.limit && this.valid.term) {
          this.valid.all = true;
        }
      }
  },
  computed: {
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
    }
  },
  watch: {
    
  }
}
</script>


