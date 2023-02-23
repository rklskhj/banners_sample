<template>
<div :style="pcMaxWidth" style="padding-top:40px">
  <div class="size-24 weight-700 p-main" style="margin-bottom: 24px">문의 작성</div>
  <!-- 문의 작성 -->
  <div >
    <div class="p-border-top-sub" style="padding:16px 0 12px 0">
      <h11-t-card-product-pc
          slot="card"
          v-for="item in list_product"
          :key="`card-${item.id}`"
          :card="item"
          :showSoldout="false"
          :cardProps="cardProps"></h11-t-card-product-pc>
    </div>
    <div class="p-bg-sub" style="width:100%;height:1px"></div>
    <component :is="form.elType" v-for="(form,idx) in formData"
                 :key="'inquiry-form-'+idx"
                 v-bind="form"
                 :value.sync="form.value"
         :formType="formTypeCustomLabel"
         :containerCustomStyle="form.containerCustom"
         :labelCustomStyle="labelCustom"
         :inputCustomStyle="form.inputCustom"
         :boxCustomStyle="form.boxCustom"
         :checkCustomStyle="form.checkCustom"
         :buttonCustomStyle="buttonCustom"></component>
    <div class="flex-center" style="margin-top:100px">
      <button class="p-border-main p-sub2 p-bg-white" style="margin-right: 8px" @click="$router.back()">취소</button>
      <button class="p-bg-primary p-border-primary p-white" style="margin-left: 8px" @click="save">완료</button>
    </div>
  </div>
</div>
</template>
<script>
import h11TCardProductPc from "@/components/Components/Card/h11/CardProductPc.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockInquiryRegPc',
  components: {
    h11TCardProductPc
  },
  mixins: [
    BlockMixin,
    FormMixin,
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
          "name": "제목",
          "field": "title",
          "label": "제목",
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
          "placeholder": "제목을 입력하세요"
        },
        {
          "name": "내용",
          "field": "question_content",
          "label": "내용",
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
          "placeholder": "내용을 작성해주세요."
        },
        {
          "name": "비밀글 ",
          "field": "is_secret",
          "label": "비밀글로 작성합니다.",
          "value": false,
          "format": "CInput_checkbox",
          "validate": {
            "num": true,
            "alpha_g": true,
            "alpha_s": true,
            "special": true,
            "required": false,
            "valid_required": false
          },
          "placeholder": ""
        }
      ],
      "cardProps": {
        "type": "product",
        "visible": {
          "partner": {
            "name": true,
            "address": false,
            "simple_desc": false
          },
          "product": {
            "cart": false,
            "like": false,
            "name": true,
            "rate": false,
            "tags": false,
            "price": {
              "price": false,
              "org_price": false,
              "discount_price": false
            },
            "coupon": false,
            "review": false,
            "address": false,
            "simple_desc": false
          }
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "inquiry_id": undefined,
      "product_id": undefined,
      "list_product": []
    }
  },
  created() {
      this.inquiry_id = this.$route.query.inquiry_id;
      this.product_id = this.$route.query.product_id;
      this.getInquiryDetail();
      this.initForm();
      this.getProductDetail();
    },
  
  methods: {
    initForm() {
      this.formData.forEach(item => {
        item.boxCustom = {
          width: '24px',
          height: '24px',
          borderRadius: '8px',
          border: this.brandBorder.main.border
        };
        item.checkCustom = {
          width: '24px',
          height: '24px',
          fontSize: '24px',
          backgroundColor: this.getColor('Primary Color'),
          borderRadius: '8px',
          color: 'white'
        }
      })
      this.formData = this.setForm(this.formData);
      
      let inputStyle = this.cloneItem(this.inputCustom)
      inputStyle.border = this.brandBorder.main.border;
      inputStyle.borderRadius = '8px';
      
      let title = find(this.formData, 'field', 'title');
      title.inputCustom = inputStyle;
      
      let content = find(this.formData, 'field', 'question_content');
      content.inputCustom = this.inputCustomTextarea;
      content.containerCustom = {
        marginTop: '14px'
      }
    },
    async getProductDetail() {
      this.list_product =[];
        let url = `user/${this.user.user_id}/mapping/product/${this.product_id}?fields=id,img,name,partner.name,simple_desc,order_conversion_type,price,rate,reviews_count,address,tags,has_download_coupon&hit=false`;
        await this.$axios.get(url).then(res => {
          this.list_product.push(res.data);
        });
        /*if(!this.$route.query.author_id && this.user.user_id !== Number(this.$route.query.author_id)) this.getMyreview();*/
      },
    save() {
        let result = this.getParamData(this.formData);
        if(result.enable) {
          if(this.inquiry_id===undefined) {
            this.$axios.post(`user/${this.user.user_id}/product/${this.product_id}/inquiry`, result.params)
              .then(res => {
                if (res.status === 200) {
                  this.toast('문의글이 작성되었습니다.');
                  // this.$router.replace(`/product_detail?id=${this.product_id}&tab=3`);
                  this.$router.back();
                }
              }).catch(err => {
              if (!err.response.data.message)
                this.toast(err.response.data.detail);
              else
                this.toast(err.response.data.message);
            })
          }
          else {
            this.$axios.patch(`user/${this.user.user_id}/product/${this.product_id}/inquiry/${this.inquiry_id}`, result.params)
              .then(res => {
                if (res.status === 200) {
                  this.toast('문의글이 수정되었습니다.');
                  // this.$router.replace(`/product_detail?id=${this.product_id}&tab=3`);
                  this.$router.back();
                }
              }).catch(err => {
              if (!err.response.data.message)
                this.toast(err.response.data.detail);
              else
                this.toast(err.response.data.message);
            })
          }
        }
      },
    getInquiryDetail() {
        if(this.inquiry_id!==undefined) {
          let url = `user/${this.user.user_id}/product/${this.product_id}/inquiry/${this.inquiry_id}?secret=true`;
          this.$axios.get(url).then(res=>{
            let data = res.data;
            this.formData.forEach(item=>{
              item.value = data[item.field];
            })
          })
        }
      }
  },
  computed: {
    containerStyle() {
        let deco = this.brandBgColor.white;
        return deco;
      },
    buttonCustomCancel() {
      let styles = this.cloneItem(this.buttonCustom);
      styles.backgroundColor = this.brandColor.help.color;
      return styles;
    },
    inputCustomTextarea() {
      let styles = this.cloneItem(this.inputCustom);
      styles.height = '160px';
      styles.border = this.brandBorder.main.border;
      return styles;
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
  }
</style>

