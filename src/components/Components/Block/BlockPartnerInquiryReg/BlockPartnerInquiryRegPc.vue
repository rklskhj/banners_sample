<template>
<div class="partner-inquiry-container" :style="pcMaxWidth" style="padding: 40px 0 100px 0">
  <div class="size-24 weight-700" :style="brandColor.main" style="margin-bottom: 26px">{{ partnerName }} 입점문의</div>
  <div class="size-16" :style="brandColor.sub" style="margin-bottom: 12px">아래 입점 문의를 남겨주시면 담당자가 연락을 드립니다.</div>
  <div style="width:100%;height:1px" :style="{backgroundColor: `${brandBorder.main.border.split('1px solid')[1]}`}"></div>
  <component :is="form.elType" v-for="(form,idx) in formData"
         :key="'inquiry-form-'+idx"
         v-bind="form"
         :value.sync="form.value"
         :formType="formTypeCustomLabel"
         :containerCustomStyle="form.containerCustom"
         :labelCustomStyle="labelCustom"
         :fileListLabelCustomStyle="fileListLabelCustomStyle"
         fileListLabelIcon="link"
         :fileDescCustomStyle="fileDescCustomStyle"
         :attachmentTextCustomStyle="attachmentTextCustomStyle"
         :dropdownCustomStyle="form.dropdownCustom"
         :dropListCustomStyle="dropListCustomStyle"
         :dropItemCustomStyle="dropItemCustomStyle(form)"
         :inputCustomStyle="form.inputCustom"
         :boxCustomStyle="form.boxCustom"
         :checkCustomStyle="form.checkCustom"
         :buttonCustomStyle="buttonCustom"></component>
         
  <div class="flex-center" style="margin-top:40px">
    <button class="unselect" :style="[brandBorder.main,brandColor.sub2,brandBgColor.white]" style="margin-right: 8px" @click="$router.back()">취소</button>
    <button class="unselect" :style="[brandBgColor.primary, brandBorder.primary, brandColor.white]" style="margin-left: 8px" @click="save">완료</button>
  </div>
  
  <sweet-modal ref="modal" overlay-theme="dark" hideCloseButton>
    <div class="text-center" style="margin:60px 0 8px 0">
      <div class="size-20 weight-500 p-main">입점문의가 등록되었습니다.</div>
      <div class="size-18 p-sub" style="margin:8px 0 60px 0">담당자가 확인 후 연락을 드립니다.</div>
      <button class="unselect button p-bg-white p-border-main p-sub weight-700" style="width:100%" @click="clickDone">확인</button>
    </div>
  </sweet-modal>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockPartnerInquiryRegPc',
  components: {

  },
  mixins: [
    BlockMixin,
    FormMixin,
    FormCustomMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "formData": [
        {
          "name": "서비스 카테고리",
          "field": "category_id",
          "label": "서비스 카테고리",
          "value": "",
          "format": "CDropdown",
          "options": [],
          "validate": {
            "required": true,
            "valid_required": true
          },
          "placeholder": "서비스 카테고리 선택"
        },
        {
          "name": "상호명",
          "field": "company",
          "label": "상호명",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "num": true,
            "alpha_g": true,
            "alpha_s": true,
            "special": true,
            "required": true,
            "max_length": 30,
            "min_length": 1,
            "valid_required": true
          },
          "placeholder": "상호명을 입력하세요."
        },
        {
          "name": "대표자",
          "field": "name",
          "label": "대표자",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "num": true,
            "alpha_g": true,
            "alpha_s": true,
            "special": true,
            "required": true,
            "max_length": 30,
            "min_length": 1,
            "valid_required": true
          },
          "placeholder": "대표자 이름을 입력하세요."
        },
        {
          "name": "사업자 등록번호",
          "field": "business_num",
          "label": "사업자 등록번호",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "num": true,
            "alpha_g": true,
            "alpha_s": true,
            "special": true,
            "required": true,
            "max_length": 30,
            "min_length": 1,
            "valid_required": true
          },
          "placeholder": "사업자 등록번호를 입력하세요."
        },
        {
          "name": "연락처",
          "field": "phone",
          "label": "연락처",
          "value": "",
          "format": "CInput_phone",
          "validate": {
            "required": true,
            "valid_required": true
          },
          "placeholder": "연락처를 입력하세요."
        },
        {
          "name": "참고 자료",
          "field": "imgs",
          "label": "참고 자료",
          "value": "",
          "format": "CFileUploader",
          "validate": {
            "required": false,
            "valid_required": false
          },
          "placeholder": "예) 소개서, 사업자 등록증 등등"
        },
        {
          "name": "시설, 서비스 소개 및 관련 내용",
          "field": "content",
          "label": "시설, 서비스 소개 및 관련 내용",
          "value": "",
          "format": "CInput_textarea",
          "validate": {
            "num": true,
            "alpha_g": true,
            "alpha_s": true,
            "special": true,
            "required": true,
            "max_length": 500,
            "min_length": 1,
            "valid_required": true
          },
          "placeholder": "내용을 입력해주세요."
        }
      ],
      "partnerName": "파트너"
    }
  },
  created() {
    this.getSetting();
    this.initForm();
  },
  mounted() {

  },
  
  methods: {
    getSetting() {
      this.$axios.get('public/partner/setting').then(res => {
        this.partnerName = res.data.partner_name;
      });
    },
    initForm() {
      this.formData.forEach(item => {
        if (item.field === 'category_id') {
          this.$axios.get('/public/inquiry/partner/category').then(res => {
            item.options = res.data;
          })
        }
        
        if (item.field === 'content') {
          item.inputCustom = this.inputCustomTextarea;
          item.containerCustom = {
            marginTop: '14px',
          };
        }
      })
      this.formData.push(
        {
          "name": "개인정보처리방침 동의",
          "items": [
            {
              "link": "PrivacyModal",
              "text": "개인정보처리방침",
              "styles": {
                "container": {
                  color: this.brandColor.sub.color,
                  fontWeight: 'normal',
                  textDecoration: 'underline'
                }
              },
              "linkType": "modal"
            },
            {
              "text": "에 동의하기"
            }
          ],
          "label": "이용약관",
          "value": false,
          "format": "CgCheckboxArray",
          "validate": {
            "valid_required": true
          },
          containerCustom: {marginTop: '14px'} ,
          boxCustom: {
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: '1px solid #dddddd'
          },
          checkCustom: {
            fontSize: '20px',
            backgroundColor: this.getColor('Primary Color'),
            borderRadius: '4px',
            color: 'white'
          }
        }
      )
      this.formData = this.setForm(this.formData);
      
      let dropdown = find(this.formData, 'format', 'CDropdown');
      let dropStyle = this.cloneItem(this.inputCustom);
      dropStyle.backgroundColor = this.brandBgColor.white.backgroundColor;
      dropStyle.color = this.brandColor.sub.color;
      dropStyle.height = '48px';
      dropStyle.padding = '12px 16px';
      dropStyle.fontSize = '14px';
      dropStyle.fontWeight = '500';
      dropStyle.border = this.brandBorder.main.border;
      dropdown.dropdownCustom = dropStyle;
      
      let inputStyle = this.cloneItem(this.inputCustom)
      inputStyle.border = this.brandBorder.main.border;
      inputStyle.borderRadius = '8px';
      
      let company = find(this.formData, 'field', 'company');
      company.inputCustom = inputStyle;
      let name = find(this.formData, 'field', 'name');
      name.inputCustom = inputStyle;
      let businessNum = find(this.formData, 'field', 'business_num');
      businessNum.inputCustom = inputStyle;
      let phone = find(this.formData, 'field', 'phone');
      phone.inputCustom = inputStyle;
      
    },
    save() {
      let result = this.getParamData(this.formData);
      if (result.enable) {
        let isBusinessNum = this.checkBusinessNum(result.params.business_num)
        if (!isBusinessNum) {
          this.toast('사업자 등록번호 양식에 맞춰서 입력해주세요.\n' + '예) 000-00-00000');
          return;
        }
        let category_id = find(this.formData, 'field', 'category_id');
        category_id.options.forEach(option => {
          if (result.params.category_id === option.value) {
            result.params.category = option.label;
          }
        })
        this.$axios.post(`public/inquiry/partner`, result.params).then(res => {
          if (res.status === 200) {
            this.$refs.modal.open();
            
          }
        }).catch(err => {
          this.toast('입점 문의가 등록되지 않았습니다. 서비스 관리자에게 문의해주세요.');
        })
      }
    },
    clickDone() {
      this.$refs.modal.close();
      this.$router.back();
    },
    checkBusinessNum(number) {
      let numberMap = number.replace(/-/gi, '').split('').map(function (d){
    		return parseInt(d, 10);
    	});
    	
    	if(numberMap.length == 10){
    		let keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    		let chk = 0;
    		
    		keyArr.forEach(function(d, i){
    			chk += d * numberMap[i];
    		});
    		
    		chk += parseInt((keyArr[8] * numberMap[8])/ 10, 10);
    		return Math.floor(numberMap[9]) === ( (10 - (chk % 10) ) % 10);
    	}
    	
    	return false;
    },
    dropItemCustomStyle(option) {
      let deco = {
        backgroundColor: this.brandBgColor.white.backgroundColor,
        color: this.brandColor.sub.color,
        padding: '12px 16px',
        borderBottom: this.brandBorder.main.border,
        fontWeight: '400'
      }
      
      if (option.options && option.options.length > 0) {
        option.options.forEach((idx, item) => {
          if (idx === option.options.length - 1) {
            deco.borderBottom = 'none';
          } else {
            deco.borderBottom = this.brandBorder.main.border;
          }
        })
      }
      return deco;
    }
  },
  computed: {
    inputCustomTextarea() {
      let styles = this.cloneItem(this.inputCustom);
      styles.height = '200px';
      styles.border = this.brandBorder.main.border;
      return styles;
    },
    dropListCustomStyle() {
      return {
        top: '48px',
        borderRadius: '8px',
        border: this.brandBorder.main.border
      }
    },
    fileListLabelCustomStyle() {
      return {
        border: this.brandBorder.main.border,
        borderRadius: '8px',
        overflow: 'hidden'
      }
    },
    attachmentTextCustomStyle() {
      return {
        paddingLeft: '12px',
        lineHeight: '46px',
        fontSize: '0.9rem',
        color: this.brandColor.help.color
      }
    },
    fileDescCustomStyle() {
      return {
        fontSize: '13px',
        color: this.brandColor.help.color,
        whiteSpace: 'pre-line',
        padding: '8px 0',
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
button {
    border-radius: 8px;
    height: 56px;
    line-height: 56px;
    width: 240px;
    font-size: 16px;
    cursor: pointer;
  }
</style>
<style>
.partner-inquiry-container .sweet-modal {
    width: 560px;
    border-radius: 12px;
  }
</style>
