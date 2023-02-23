<template>
<div :style="containerStyle">
    <div class="size-18" :style="brandColor.main" style="margin:56px 0 24px 0">{{ nameLabel }} 입력해주세요.</div>
    <c-input-text ref="name"
      :placeholder="`${nameLabel} 입력`"
      :validate="valid"
      :inputCustomStyle="inputCustomStyle"
      :value.sync="name"></c-input-text>

    <div :class="{'unselect': valid.validate}" :style="[valid.validate ? brandBgColor.brand : brandBtn.bg.gray, brandColor.white]"
         style="text-align:center;border-radius: 8px;height:56px;line-height:56px;margin-top:56px" @click="apply">다음</div>
  </div>
</template>
<script>

export default {
  name: 'BlockWtPutName',
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
      "name": "",
      "valid": {
        "num": true,
        "alpha_g": true,
        "alpha_s": true,
        "special": true,
        "required": true,
        "validate": false,
        "error_msg": "",
        "max_length": 20,
        "min_length": 2,
        "valid_required": true
      },
      "partnerName": ""
    }
  },
  created() {
    this.getSetting();
    if(!this.value.name) {
      this.value.name = '';
    } else {
      this.name = this.value.name;
    }
    
  },
  
  methods: {
    getSetting() {
      this.$axios.get('public/partner/setting').then(res => {
        this.partnerName = res.data.partner_name;
      });
    },
    apply() {
      if (this.valid.validate && this.valid.error_msg === '') {
        this.value.name = this.name;
        this.$emit('next');
      }
    }
  },
  computed: {
    nameLabel() {
      let name = this.$route.path.indexOf('partner_signup') > -1 ? this.partnerName + '명' : '이름';
      return name + this.josa.c(name, '을/를');
    },
    containerStyle() {
      return this.$store.getters.device === 'mobile' ? this.pagePadding : {width: '500px'};
    },
    inputCustomStyle() {
      return {
        padding: '0 12px',
        fontSize: '16px',
        height: '54px',
        lineHeight: '54px',
        borderRadius: '8px',
        border: this.brandBorder.main.border
      }
    }
  },
  watch: {
    name(n) {
      this.valid.validate = n.length > 0;
    },
    'valid.error_msg'(n) {
      if (n === '') {
        this.valid.validate = true;
        this.$refs.name.$refs.input.style.border = this.brandBorder.main.border;
      } else {
        if (n.indexOf('입력해주세요') > -1) {
          this.$refs.name.$refs.input.style.border = this.brandBorder.highlight.border;
        } else {
          this.$refs.name.$refs.input.style.border = this.brandBorder.main.border;
        }
        this.valid.validate = false;
      }
    }
  }
}
</script>


