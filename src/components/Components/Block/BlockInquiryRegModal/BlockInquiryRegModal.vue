<template>
<div class="full-width flex-justify"
  style="padding: 20px 32px 32px; text-align:left">
    <!-- 후기 작성 -->
    <div class="full-width">
      <div class="position-relative flex-align">
        <div class="flex-center flex-1 size-18 weight-500 p-main">문의 등록</div>
        <i class="position-absolute material-icons flex-end unselect p-main"
          style="font-size: 24px; right: 0"
          @click="$emit('closePage')">close</i>
      </div>
      <div style="margin-top:32px">
        <card-review-reg
            style="margin-bottom:20px"
            slot="card"
            v-for="item in list_product"
            :key="`card-${item.id}`"
            :card="item"></card-review-reg>
      </div>
      <component :is="form.elType" v-for="(form,idx) in formData"
                 :key="'review-form-'+idx"
                 v-bind="form"
                 :value.sync="form.value"
         :formType="formTypeCustomLabel"
         :containerCustomStyle="form.containerCustom"
         :labelCustomStyle="labelCustom"
         :inputCustomStyle="form.inputCustom"
         :boxCustomStyle="form.boxCustom"
         :checkCustomStyle="form.checkCustom"
         :buttonCustomStyle="buttonCustom"></component>
         

    <div class="unselect" :style="buttonCustom" style="margin-top: 20px" @click="save">등록하기</div>         
    <!--<div class="unselect" :style="buttonCustomCancel" style="margin: 12px 0 20px;" @click="$emit('closePage')">취소</div>         -->
         

      <!--<div class="flex-end" style="margin:80px 0 12px">-->
      <!--  <btn :color="brandColor.white"-->
      <!--       :backgroundColor="brandBgColor.brand"-->
      <!--       @clicked="save">문의 작성</btn>-->
      <!--</div>-->
      <!--<div>-->
      <!--  <btn :backgroundColor="btnColor" :color="brandColor.white"-->
      <!--    @clicked="clickBack">취소</btn>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
import CardReviewReg from "@/components/Components/Card/CardReviewReg.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import FormMixin from "@/components/Components/Mixins/FormMixin"
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"
import FormCustomMixin from "@/components/Components/Mixins/FormCustomMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockInquiryRegModal',
  components: {
    CardReviewReg
  },
  mixins: [
    BlockMixin,
    FormMixin,
    HeaderMixin,
    FormCustomMixin,
    PageMixin
  ],
  props: {
    prop: {
      type: Object,
    },

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
          "placeholder": "내용을 입력하세요"
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
      "list_product": []
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
      
      this.getInquiryDetail();
      this.initForm();
      this.getProductDetail();
    })
  },
  
  methods: {
    initForm() {
      this.formData.forEach(item => {
        item.boxCustom = {
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          border: '2px solid #dddddd'
        };
        item.checkCustom = {
          width: '32px',
          height: '32px',
          fontSize: '32px',
          backgroundColor: this.getColor('Primary Color'),
          borderRadius: '8px',
          color: 'white'
        }
      })
      this.formData = this.setForm(this.formData);
      
      let inputStyle = this.cloneItem(this.inputCustom)
      inputStyle.border = this.brandBorder.main.border;
      
      let title = find(this.formData, 'field', 'title');
      title.inputCustom = inputStyle;
      title.containerCustom = {
        marginTop: '0px'
      }
      
      let content = find(this.formData, 'field', 'question_content');
      content.inputCustom = this.inputCustomTextarea;
      content.containerCustom = {
        marginTop: '20px'
      }
    },
    async getProductDetail() {
      this.list_product =[];
        let url = `user/${this.user.user_id}/mapping/product/${this.prop.product_id}?fields=id,img,name,partner.name,order_conversion_type,price,simple_desc,rate,reviews_count,address,tags,has_download_coupon&hit=false`;
        await this.$axios.get(url).then(res => {
          this.list_product.push(res.data);
        });
        /*if(!this.$route.query.author_id && this.user.user_id !== Number(this.$route.query.author_id)) this.getMyreview();*/
      },
    save() {
        let result = this.getParamData(this.formData);
        if(result.enable) {
          if(this.prop && this.prop.inquiry_id===undefined) {
            this.$axios.post(`user/${this.user.user_id}/product/${this.prop.product_id}/inquiry`, result.params)
              .then(res => {
                if (res.status === 200) {
                  this.toast('문의글이 작성되었습니다.');
                  this.$emit('closePage');
                  this.eventBus.$emit('closeInquiryRegModal');
                  this.$router.replace(`/product_detail?id=${this.prop.product_id}`);
                }
              }).catch(err => {
              if (!err.response.data.message)
                this.toast(err.response.data.detail);
              else
                this.toast(err.response.data.message);
            })
          }
          else {
            this.$axios.patch(`user/${this.user.user_id}/product/${this.prop.product_id}/inquiry/${this.prop.inquiry_id}`, result.params)
              .then(res => {
                if (res.status === 200) {
                  this.toast('문의글이 수정되었습니다.');
                  this.$emit('closePage');
                  this.eventBus.$emit('closeInquiryRegModal');
                  this.$router.replace(`/product_detail?id=${this.prop.product_id}`);
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
        if(this.prop && this.prop.inquiry_id!==undefined) {
          let url = `user/${this.user.user_id}/product/${this.prop.product_id}/inquiry/${this.prop.inquiry_id}?secret=true`;
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
      styles.height = '180px';
      styles.border = this.brandBorder.main.border;
      return styles;
    }
  },
  watch: {
    
  }
}
</script>


