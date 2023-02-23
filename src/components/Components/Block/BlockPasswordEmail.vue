<template>
<div class="full-width position-relative"
  style="padding: 32px">
  <div>
    <div class="flex-between position-relative">
      <div class="flex-1 text-center size-18 weight-500 p-main">새 비밀번호 발급</div>
      <i @click="$emit('closePage')" class="position-absolute p-main material-icons unselect"
        style="right: 0; font-size: 32px">close</i>
      
    </div> 
    <div style="padding:40px 0">
      <div class="size-16 weight-500 p-main"
        style="text-align: left; margin-bottom: 8px">입력한 이메일 주소로 새 비밀번호를 발급 받습니다.</div>
      <c-input-text :formType="formType"
                    :placeholder="prop.placeholder"
                    :name="prop.name"
                    :type="prop.type"
                    :validate="prop.validate"
                    :inputCustomStyle="inputCustomStyle"
                    :value.sync="email"></c-input-text>
  
    </div>
    <div>
      <btn :color="brandColor.white"
        style="height: 56px"
        :backgroundColor="brandBgColor.brand"
        @clicked="send">새 비밀번호 전송하기</btn>
    </div>
  </div>
</div>
</template>
<script>
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"

export default {
  name: 'BlockPasswordEmail',
  components: {

  },
  mixins: [
    FormCustomMixin
  ],
  props: {

  },
  data() {
    return {
      "prop": {
        "name": "이메일",
        "type": "email",
        "validate": {
          "validate": true,
          "valid_required": true
        },
        "placeholder": "가입시 입력한 아이디(이메일)를 입력해주세요."
      },
      "email": "",
      "formType": {
        "box": "round",
        "list": "horizontal",
        "input": "round",
        "button": "round"
      }
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      for(let el of document.getElementsByClassName('sweet-box-actions')) { 
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    })
  },
  
  methods: {
    send() {
        if(!this.email) {
          this.toast('이메일을 입력하세요.');
          return;
        }

        this.$axios.post('auth/user/reset/password', {
          email: this.email
        }).then(res=>{
          if(res.status===200) {
            this.toast('이메일이 전송되었습니다.');
            this.$emit('Success');
          }
        })
      }
  },
  computed: {
    inputCustomStyle() {
      let deco = this.cloneItem(this.inputCustom);
      deco.borderRadius = '8px';
      deco.padding = '16px';
      deco.height = '56px';
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


