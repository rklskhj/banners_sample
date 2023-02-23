<template>
<div class="full-width flex-justify" style="padding: 20px 32px 32px; text-align: left">


        <!-- 후기 작성 -->
        <div class="full-width">
          <div class="position-relative flex-align">
            <div class="flex-center flex-1 size-18 weight-500 p-main">후기작성</div>
            <i class="position-absolute material-icons flex-end unselect"
              style="font-size: 24px; right: 0"
              @click="$emit('closePage')">close</i>
          </div>
            <div style="margin-top:32px">
                <card-review-reg
                  :showSoldout="false"
                  style="margin-bottom:20px"
                  v-for="item in list_product"
                  :key="`card-h-${item.id}`"
                  :card="item"
                  slot="card"></card-review-reg>
            </div>
            <!-- 후기 폼 -->
            <component :is="form.elType"
                       v-for="(form,idx) in formData"
                       :key="'review-form-'+idx"
                       v-bind="form"
                       :value.sync="form.value"
                       :formType="formTypeCustomLabel"
                       :containerCustomStyle="form.containerCustom"
                       :labelCustomStyle="labelCustom"
                       :inputCustomStyle="form.inputCustom"
                       :boxCustomStyle="form.boxCustom"
                       :checkCustomStyle="form.checkCustom"
                       :index="idx" :ratePadding="12"
                       :isNew="true" :rateSize="36"
                       @delImg="res => form.value = []"
                       :buttonCustomStyle="buttonCustom"></component>


            <div class="unselect" :style="buttonCustom" style="margin-top: 20px" @click="save">저장하기</div>
            <!--<div class="unselect" :style="buttonCustomCancel" style="margin: 12px 0 20px;" @click="$emit('closePage')">취소</div>-->

            <!--<div class="flex-end" style="margin:48px 0 12px">-->
            <!--  <btn :color="brandColor.white"-->
            <!--       :backgroundColor="brandBgColor.brand"-->
            <!--       @clicked="save">리뷰 작성</btn>-->
            <!--</div>-->
            <!--<div>-->
            <!--  <btn :backgroundColor="brandColor.sub" :color="brandColor.white"-->
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
  name: 'BlockReviewRegModal',
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
          "name": "평점",
          "field": "rate",
          "label": "평점",
          "value": 5,
          "format": "CRating",
          "validate": {
            "required": false,
            "valid_required": false
          }
        },
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
          "field": "content",
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
          "name": "비밀글",
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
          "boxCustom": {
            "width": "32px",
            "border": "2px solid #dddddd",
            "height": "32px",
            "borderRadius": "8px"
          },
          "checkCustom": {
            "color": "white",
            "fontSize": "32px",
            "borderRadius": "8px",
            "backgroundColor": ""
          },
          "placeholder": ""
        },
        {
          "name": "첨부파일 추가",
          "field": "imgs",
          "label": "사진 업로드",
          "format": "CImgUploaderArray",
          "validate": {
            "required": false,
            "valid_required": false
          },
          "placeholder": "+첨부파일 추가"
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
      "list_product": [],
      "delivery_order_id": undefined,
      "order_conversion_type": 0,
      "list_product_my_review": []
    }
  },
  created() {
    this.formData = this.formData.filter(i => i.field !== 'is_secret')
  },
  mounted() {
    this.$nextTick(() => {
      for(let el of document.getElementsByClassName('sweet-box-actions')) { 
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
      this.getReviewDetail();
      this.getProductDetail();
      this.initForm();
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
          item.containerCustom = this.cloneItem(this.containerStyle);
          item.containerCustom.marginTop = '20px'
        })
        this.formData = this.setForm(this.formData);

        let inputStyle = this.cloneItem(this.inputCustom);
        inputStyle.border = this.brandBorder.main.border;

        let title = find(this.formData, 'field', 'title');
        title.inputCustom = inputStyle;

        let content = find(this.formData, 'field', 'content');
        content.inputCustom = this.inputCustomTextarea;
      },
    async getProductDetail() {
        this.list_product =[];
        let url = `user/${this.user.user_id}/mapping/product/${this.prop.product_id}?fields=id,price,img,name,partner.name,order_conversion_type,simple_desc,rate,reviews_count,address,tags,has_download_coupon&hit=false`;
        await this.$axios.get(url).then(res => {
          this.list_product.push(res.data);
          this.order_conversion_type = this.list_product[0].order_conversion_type;
        });
        if(!this.$route.query.author_id && this.user.user_id !== Number(this.$route.query.author_id) &&
          this.order_conversion_type===12) this.getMyreview();
      },
    async getMyreview() {
        this.list_product_my_review = [];
        this.delivery_order_id = undefined;

        let id = this.list_product[0].id;
        let type = this.order_conversion_type;
        let list = [];
        await this.$axios.get(`user/${this.$store.getters.user.user_id}/delivery/orderproduct/review/${id}`)
          .then(res => {
            list = res.data.data;
          })
        this.list_product_my_review = list.filter(item => { return item.status===302});
        if(this.list_product_my_review.length>0) {
          if(type===3) this.delivery_order_id = this.list_product_my_review[0].id;
        }
        else {
          this.toast('구매후 1회 후기 작성 가능합니다.')
          this.$router.back();
        }
      },
    save() {
        let result = this.getParamData(this.formData);
        this.appendParamData(result.params);
        // if(this.list_product[0].order_conversion_type===3) {
        //   if(this.delivery_order_id) result.params.order_product_id = this.delivery_order_id;
        // }
        // // 주문상품의 후기일 경우
        // if (this.$route.query.order_product!==undefined) result.params.order_product_id = this.$route.query.order_product;

        if(result.enable) {

          if(this.prop.review_id===undefined) {
            console.log('200')
            this.$axios.post(`user/${this.user.user_id}/product/${this.prop.product_id}/review`, result.params)
              .then(res => {

                if(res.status===200) {

                  this.toast('후기글이 작성되었습니다.');
                  this.$emit('closePage');
                  this.eventBus.$emit('closeReviewRegModal')
                  // this.$router.replace(`/product_detail?id=${this.prop.product_id}&tab=2`);
                }
              }).catch(err=> {
              if(!err.response.data.message)
                this.toast(err.response.data.detail);
              else
                this.toast(err.response.data.message);
            })
          }
          else {
            this.$axios.patch(`user/${this.user.user_id}/product/${this.prop.product_id}/review/${this.prop.review_id}`, result.params)
              .then(res => {
                if(res.status===200) {
                  this.toast('후기글이 수정되었습니다.');
                  // if (this.$route.query&&this.$route.query.partner_id!==undefined&&this.$route.query.partner_id!=='null') {
                  //   this.$router.replace(`/product_detail?id=${this.$route.query.partner_id}&tab=2`);
                  // }
                  // if (this.$route.query&&this.$route.query.product_id) {
                  //   this.$router.replace(`/product_detail?id=${this.$route.query.product_id}`);
                  // }
                  // else
                  this.$emit('closePage');
                  this.eventBus.$emit('closeReviewRegModal')
                  // this.$router.replace(`/product_detail?id=${this.prop.product_id}&tab=2`);
                }
              }).catch(err=> {
              if(!err.response.data.message)
                this.toast(err.response.data.detail);
              else
                this.toast(err.response.data.message);
            })
          }
        }
      },
    getReviewDetail() {
        if(this.prop.review_id!==undefined) {
          this.$axios.get(`user/${this.user.user_id}/product/${this.prop.product_id}/review/${this.prop.review_id}`).then(res=>{
            let data = res.data;
            this.formData.forEach(item=>{
              if (item.field === 'imgs') {
                item.value = data[item.field][0];
              } else {
                item.value = data[item.field];
              }
            })
          })
        }
      },
    appendParamData(params) {
        let c_type = this.order_conversion_type;
        if (c_type===3) {
          // delivery
          params.order_product_id = this.prop.order_product_id;
        } else if (c_type===4) {
          // meet
          params.meet_order_id = this.prop.order_product_id;
        } else if (c_type===8) {
          // commerce
          params.commerce_order_product_id = this.prop.order_product_id;
        } else if (c_type===10) {
          // reservation
          params.reservation_order_id = this.prop.order_product_id;
        } else if (c_type===11) {
          // booking
          params.booking_order_id = this.prop.order_product_id;
        } else if (c_type===12) {
          // mart
          params.mart_order_product_id = this.prop.order_product_id;
        }
      }
  },
  computed: {
    buttonCustomCancel() {
        let styles = this.cloneItem(this.buttonCustom);
        styles.backgroundColor = this.brandColor.help.color;
        return styles;
      },
    inputCustomTextarea() {
        let styles = this.cloneItem(this.inputCustom);
        styles.border = this.brandBorder.main.border;
        styles.height = '180px';
        return styles;
      }
  },
  watch: {
    
  }
}
</script>


