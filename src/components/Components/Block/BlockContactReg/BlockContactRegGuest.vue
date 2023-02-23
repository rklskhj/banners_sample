<template>
<div style="padding:16px 0 100px" :style="pagePadding">
  
    <div>
      <div class="p-bg-sub2 radius-8 flex-align" style="padding: 16px; gap: 0 16px">
        <div class="flex-1 size-14 weight-400 p-sub">회원으로 이용하실 분은<br> 로그인해주세요.</div>
        <div class="unselect flex-center size-14 weight-400 p-border-primary p-primary p-bg-white radius-8"
          style="width: 78px; height: 44px" @click="clickLogin">로그인</div>
      </div>
      <div style="margin-top: 16px">
        <template v-for="(form, idx) in formData">
          <component 
                :key="'form-'+idx"
                :is="form.elType" 
                v-bind="form"
                :value.sync="form.value"
                :options="form.options"
                :formType="formTypeCustomLabel"
                :boxCustomStyle="form.boxCustom"
                :checkCustomStyle="form.checkCustom"
                :containerCustomStyle="form.containerCustom"
                :labelCustomStyle="labelCustom"
                :dropdownCustomStyle="form.dropdownCustom"
                :dropListCustomStyle="dropListCustomStyle"
                :dropItemCustomStyle="inputCustom"
                :inputCustomStyle="form.inputCustom"
                :buttonCustomStyle="buttonCustom"
                :iconCustomStyle="iconCustomStyle"
              ></component>
        </template>
      </div>
    </div>
    
    <div v-if="$store.getters.device === 'mobile'">
      <div :style="buttonCustom" style="margin-top: 36px" @click="register">문의 작성</div>         
      <!--<div :style="buttonCustomCancel" style="margin: 12px 0 20px;" @click="clickBack">취소</div>      -->
    </div>
    <div v-else class="flex-align" style="margin-top:48px">
      <div :style="buttonCustomCancel" style="margin-right:16px;" class="pc-style" @click="clickBack">취소</div>
      <div :style="buttonCustom" class="pc-style" @click="register">문의 작성</div>         
    </div>
    

    <!--<div>-->
    <!--  <btn :color="brandColor.white"-->
    <!--    :backgroundColor="brandBgColor.brand"-->
    <!--    @clicked="register"-->
    <!--    style="margin: 48px 0 12px;">문의 작성</btn>  -->
    <!--</div>-->
    <!--<div>-->
    <!--    <btn :backgroundColor="btnColor" :color="brandColor.white"-->
    <!--      @clicked="clickBack">취소</btn>-->
    <!--  </div>-->
  </div>
</template>
<script>
import FormMixin from "@/components/Components/Mixins/FormMixin"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockContactRegGuest',
  components: {

  },
  mixins: [
    FormMixin,
    BlockMixin,
    HeaderMixin,
    FormCustomMixin,
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "formData": [
        {
          "name": "문의 유형",
          "field": "title",
          "label": "",
          "value": "",
          "format": "CDropdown",
          "options": [
            {
              "label": "문의 유형 1",
              "value": "type1"
            },
            {
              "label": "문의 유형 2",
              "value": "type2"
            },
            {
              "label": "문의 유형 3",
              "value": "type3"
            }
          ],
          "validate": {
            "required": false,
            "valid_required": false
          },
          "placeholder": "문의 유형 선택"
        },
        {
          "name": "문의 제목",
          "field": "title",
          "label": "",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "required": true,
            "valid_required": false
          },
          "placeholder": "문의제목을 입력해주세요"
        },
        {
          "name": "문의 내용",
          "field": "content",
          "label": "",
          "value": "",
          "format": "CInput_textarea",
          "validate": {
            "required": true,
            "valid_required": false
          },
          "placeholder": "문의내용을 입력해주세요"
        },
        {
          "name": "첨부파일",
          "field": "file",
          "label": "",
          "value": "",
          "format": "CFileUploader",
          "validate": {
            "required": false,
            "valid_required": false
          },
          "placeholder": ""
        },
        {
          "name": "이름",
          "field": "name",
          "label": "",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "required": true,
            "valid_required": false
          },
          "placeholder": "이름"
        },
        {
          "name": "연락처",
          "field": "name",
          "label": "",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "required": true,
            "valid_required": false
          },
          "placeholder": "연락처"
        },
        {
          "name": "이메일",
          "field": "name",
          "label": "",
          "value": "",
          "format": "CInput_text",
          "validate": {
            "required": true,
            "valid_required": false
          },
          "placeholder": "이메일"
        },
        {
          "name": "이용약관 및 개인정보처리방침 동의",
          "items": [
            {
              "link": "termsofservice_overlay",
              "text": "이용약관",
              "styles": {
                "container": {
                  "fontWeight": "bold"
                }
              },
              "linkType": "overlay"
            },
            {
              "text": " 및 ",
              "styles": {
                "container": {
                  "padding": "0 4px"
                }
              }
            },
            {
              "link": "privacy_overlay",
              "text": "개인정보처리방침",
              "styles": {
                "container": {
                  "fontWeight": "bold"
                }
              },
              "linkType": "overlay"
            },
            {
              "text": "에 동의합니다."
            }
          ],
          "label": "",
          "value": false,
          "format": "CgCheckboxArray",
          "validate": {
            "valid_required": true
          }
        }
      ]
    }
  },
  created() {
      // this.formData = this.setForm(this.formData);
      this.getForm();
    },
  
  methods: {
    clickLogin() {
      this.$store.commit('setPreviousPath', this.$route.fullPath);
      this.routerPush('/signin');
    },
    getForm() {
        this.$axios.get('public/inquiry/personal/category')
        .then(res => {
          let categories = res.data;
          this.$axios.get('public/inquiry/personal/formdata')
          .then(res2 => {
            let result = [];
            res2.data.forEach(item => {
              if (item.field==='type_id') {
                item.options = categories;
                item.label = ''
              }

              if (
                (!this.isLogin && item.name.indexOf('개인정보') === -1) ||
                (this.isLogin && ['name','phone','email'].indexOf(item.field)===-1 && item.name.indexOf('개인정보')===-1)
              ) {
                result.push(item);
              }
            })
            result.forEach(item => {
              if (item.field === 'type_id') {
                item.containerCustom = {
                  marginTop: '0px'
                }
              } else if (item.field === 'content') {
                item.inputCustom = this.inputCustomTextarea;
                item.containerCustom = {
                  marginTop: '16px'
                }
              } else {
                item.containerCustom = {
                  marginTop: '16px'
                }
              }
            });
            result.push(
            {
              name: '이용약관 및 개인정보처리방침 동의',
              label: '',
              format: 'CgCheckboxArray',
              items: [
                {
                  text: '이용약관',
                  link: 'TermsofserviceModal',
                  linkType: 'modal',
                  styles: {
                    container: {
                      color: this.brandColor.primary.color,
                      fontWeight: 500,
                      textDecoration: 'underline'
                    }
                  }
                },
                {
                  text: ' 및 ',
                  styles: {
                    container: {
                      padding: '0 4px'
                    }
                  }
                },
                {
                  text: '개인정보처리방침',
                  link: 'PrivacyModal',
                  linkType: 'modal',
                  styles: {
                    container: {
                      color: this.brandColor.primary.color,
                      fontWeight: 500,
                      textDecoration: 'underline'
                    }
                  }
                },
                {
                  text: '에 동의합니다.'
                }
              ],
              validate: {
                valid_required: true,     // validation 필수 여부
              },
              value: false,
              containerCustom: {marginTop: '18px'} ,
              boxCustom: {
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '2px solid #dddddd'
              },
              checkCustom: {
                fontSize: '32px',
                backgroundColor: this.getColor('Primary Color'),
                borderRadius: '8px',
                color: 'white'
              }
            }
          )
            this.formData = this.setForm(result);
            
            

            let dropdown = find(this.formData, 'format', 'CDropdown');
            let dropStyle = this.cloneItem(this.inputCustom);
            dropStyle.color = this.brandColor.primary.color;
            dropStyle.fontWeight = '500';
            dropStyle.border = this.brandBorder.main.border;
            dropdown.dropdownCustom = dropStyle;
            
            let title = find(this.formData, 'field', 'title');
            title.inputCustom = this.inputCustomStyles;
            
            let name = find(this.formData, 'field', 'name');
            name.inputCustom = this.inputCustomStyles;
            
            let phone = find(this.formData, 'field', 'phone');
            phone.inputCustom = this.inputCustomStyles;
            
            let email = find(this.formData, 'field', 'email');
            email.inputCustom = this.inputCustomStyles;
          })
        })
      },
    register() {
        let result = this.getParamData(this.formData);
        if (result.enable) {
          let user_id = this.$store.getters.user.user_id;
          if (user_id)
            result.params.user_id = user_id;
          this.$axios.post('public/inquiry/personal', result.params)
          .then(res => {
            if (res.status === 200) {
              this.toast('문의글이 작성되었습니다.');
              this.$router.replace('contact');
            }
          })
          .catch(err => {
            if(!err.response.data.message)
              this.toast(err.response.data.detail);
            else
              this.toast(err.response.data.message);
          })
        }
      }
  },
  computed: {
    btnColor() {
      return {
        backgroundColor: '#9b9b9b'
      }
    },
    buttonCustomCancel() {
      let styles = this.cloneItem(this.buttonCustom);
      styles.backgroundColor = this.brandColor.help.color;
      return styles;
    },
    inputCustomStyles() {
      let styles = this.cloneItem(this.inputCustom);
      styles.border = this.brandBorder.main.border;
      return styles;
    },
    inputCustomTextarea() {
      let styles = this.cloneItem(this.inputCustom);
      styles.height = '160px';
      styles.border = this.brandBorder.main.border;
      return styles;
    },
    dropListCustomStyle() {
      return {
        top: '48px'
      }
    },
    dropItemCustomStyle() {
      return {
        backgroundColor: '#fff'
      }
    },
    iconCustomStyle() {
      return {
        fontSize: '22px',
        position: 'absolute',
        right: '16px',
        color: this.brandColor.sub.color
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.pc-style {
  width: 192px !important;
}
</style>

