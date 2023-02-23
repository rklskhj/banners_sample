<template>
  <div v-if="detail" :style="pcMaxWidth">
    <div style="width: 100%" ref="wrapper">
      <div>
        <div
          class="flex"
          :style="[fixedStyle, brandBgColor.white]"
          ref="tabMenu"
          id="tabMenu"
        >
          <div
            v-for="(item, idx) in menu"
            :key="'tab-' + idx"
            class="unselect flex-center"
            :style="tabMenuStyle(item, idx)"
            @click.stop.prevent="clickMenuItem(item, idx)"
          >
            <div>{{ item.name }}</div>
            <div v-if="item.count >= 0" :style="countStyle(item)">
              {{ item.count }}
            </div>
          </div>
        </div>
        <div
          id="tabMenuCopy"
          style="width: 100%; height: 54px"
          v-show="fixedState"
        ></div>

        <div id="item1" :style="[brandBgColor.white, radius]">
          <e-editor :html="detail.info" v-if="detail"></e-editor>
        </div>
        <div
          id="item2"
          style="margin-top: 80px"
          :style="[brandBgColor.white, radius]"
        >
          <div class="size-24 weight-700 p-sub">기본정보</div>
          <div
            v-if="
              detail.order_conversion_type === 11 &&
              detail.booking_policy !== undefined &&
              detail.booking_policy !== null
            "
            style="margin-bottom: 48px"
          >
            <div class="size-18 weight-500 p-sub" style="margin-top: 48px">
              정책
            </div>
            <div
              class="flex p-bg-sub2"
              style="border-radius: 4px; gap: 0 8px; margin-top: 16px"
            >
              <div class="text-center" style="flex: 1; padding: 16px">
                <div class="size-16 weight-400 p-sub2">체크인</div>
                <div class="size-18 weight-400 p-sub" style="margin-top: 4px">
                  {{
                    detail.booking_policy.check_in !== null
                      ? detail.booking_policy.check_in.substring(0, 5)
                      : ""
                  }}
                </div>
              </div>
              <div class="divider"></div>
              <div class="text-center" style="flex: 1; padding: 16px">
                <div class="size-16 weight-400 p-sub2">체크아웃</div>
                <div class="size-18 weight-400 p-sub" style="margin-top: 4px">
                  {{
                    detail.booking_policy.check_out !== null
                      ? detail.booking_policy.check_out.substring(0, 5)
                      : ""
                  }}
                </div>
              </div>
            </div>
            <div
              class="flex-align p-sub size-16 weight-400"
              style="margin-top: 12px; gap: 0 12px; align-items: flex-start"
            >
              <div>·</div>
              <div
                class="flex-align"
                style="gap: 0 4px; align-items: flex-start"
              >
                <span class="p-sub2">인원</span>
                <div style="flex: 1">
                  {{ detail.booking_policy.minimum }}명 기준 (최대
                  {{ detail.booking_policy.maximum }}명) 인원 추가
                  {{
                    currencyNum(detail.booking_policy.over_price)
                  }}원(현장결제)
                </div>
              </div>
            </div>
            <div
              v-if="
                detail.booking_policy.bed &&
                detail.booking_policy.bed.length > 0
              "
              class="flex-align size-16 p-sub"
              style="margin-top: 12px; gap: 0 12px; align-items: flex-start"
            >
              <div>·</div>
              <div class="flex wrap" style="gap: 12px">
                <div
                  v-for="(bed, idx) in detail.booking_policy.bed"
                  :key="'bed-' + idx"
                  class="flex-align"
                  style="gap: 0 4px"
                >
                  <span class="p-sub2">{{ bed.type }}</span>
                  <div>
                    {{ bed.num }}개<span
                      v-if="idx !== detail.booking_policy.bed.length - 1"
                      class="p-sub2"
                      >,</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <template
              v-if="
                detail.booking_policy.convenience &&
                detail.booking_policy.convenience.length > 0 &&
                detail.booking_policy.convenience.filter((item) => item.checked)
                  .length > 0
              "
            >
              <div class="size-18 weight-500 p-sub" style="margin-top: 48px">
                편의시설
              </div>
              <div
                class="p-border-sub"
                style="
                  border-radius: 4px;
                  margin-top: 16px;
                  padding: 28px 36px;
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 20px 12px;
                "
              >
                <div
                  v-for="(
                    convenience, idx
                  ) in detail.booking_policy.convenience.filter(
                    (item) => item.checked
                  )"
                  :key="'convenience-' + idx"
                  class="flex-align p-sub"
                  style="gap: 0 12px"
                >
                  <div>·</div>
                  <div class="size-16 weight-400">{{ convenience.name }}</div>
                </div>
              </div>
            </template>
          </div>
          <template v-if="detail.common_info.use_info">
            <div
              class="size-18 weight-500 p-sub"
              style="margin-top: 40px; margin-bottom: 8px"
            >
              {{
                detail.order_conversion_type === 10
                  ? "유의사항"
                  : "상품 정보 제공 고시"
              }}
            </div>
            <e-editor :html="detail.common_info.use_info"></e-editor>
          </template>
          <div
            v-if="
              (detail.order_conversion_type === 3 ||
                detail.order_conversion_type === 12) &&
              detail.common_info.delivery_info
            "
            style="margin-top: 48px"
          >
            <div class="size-18 weight-500 p-sub" style="margin-bottom: 8px">
              배송 안내
            </div>
            <e-editor :html="detail.common_info.delivery_info"></e-editor>
          </div>
          <div v-if="detail.common_info.refund_info" style="margin-top: 48px">
            <div class="size-18 weight-500 p-sub" style="margin-bottom: 8px">
              취소/환불 안내
            </div>
            <e-editor :html="detail.common_info.refund_info"></e-editor>
          </div>
        </div>

        <div id="item3" style="margin-top: 80px">
          <!--<card-review-total-reg-pc :product="detail" :count="menu[2].count"></card-review-total-reg-pc>-->
          <!--  <list-vertical v-if="review_list&&review_list.length>0"-->
          <!--    style="margin-bottom:60px">-->
          <!--    <card-review-pc-->
          <!--        slot="card"-->
          <!--        v-for="(item, idx) in review_list"-->
          <!--        :key="'review-'+idx"-->
          <!--        :card="item"-->
          <!--        @del="getProductReview"-->
          <!--        :style="reviewCardStyle(idx)"></card-review-pc>-->
          <!--  </list-vertical>-->
          <!--  <div v-if="review_list&&review_list.length===0" -->
          <!--    class="empty-view" :style="brandColor.sub"-->
          <!--    style="font-size:18px">후기가 없습니다.</div>-->
          <list-product-review-pc
            :order_conversion_type="detail.order_conversion_type"
            @totalCount="(res) => (menu[2].count = res)"
          ></list-product-review-pc>
        </div>

        <div id="item4" style="margin-top: 80px">
          <!--<card-inquiry-total-reg-pc :product="detail"-->
          <!--  :count="menu[3].count"></card-inquiry-total-reg-pc>-->
          <!--<list-vertical v-if="inquiry_list&&inquiry_list.length>0"-->
          <!--  style="margin-bottom:60px">-->
          <!--  <card-inquiry-pc-->
          <!--      slot="card"-->
          <!--      v-for="(item,idx) in inquiry_list"-->
          <!--      :key="'inquiry-'+idx"-->
          <!--      :card="item"-->
          <!--      @del="getProductInquiry"-->
          <!--      :style="inquiryCardStyle(idx)"></card-inquiry-pc>-->
          <!--</list-vertical>-->
          <!--<div v-if="inquiry_list&&inquiry_list.length===0" -->
          <!--  class="empty-view" :style="brandColor.sub"-->
          <!--  style="font-size:18px">문의가 없습니다.</div>-->
          <list-product-inquiry-pc
            ref="inquiry"
            @totalCount="(res) => (menu[3].count = res)"
          ></list-product-inquiry-pc>
        </div>
      </div>
      <div v-if="detail.address" style="margin-top: 50px">
        <div
          class="size-22 weight-700 margin-bottom-24"
          :style="brandColor.main"
        >
          위치
        </div>
        <div class="flex-align margin-bottom-16" :style="brandColor.sub">
          <div class="flex-align">
            <!--<i class="material-icons-outlined" style="font-size:24px">location_on</i>-->
            <div style="margin-right: 16px" class="size-16">
              {{ detail.address }}
            </div>
          </div>
          <div class="flex-align size-10 unselect" @click="clickAddress">
            <!--<i class="material-icons-outlined" style="font-size:13px">content_copy</i>-->
            <div>주소복사</div>
          </div>
        </div>
        <location-map-block
          v-if="$store.getters.social_key.naver.map.client_id !== ''"
          :latitude="detail.location.latitude"
          :longitude="detail.location.longitude"
          :address="detail.address"
          :mapStyle="mapStyle"
        ></location-map-block>
      </div>

      <block-related-product-pc
        style="margin-top: 80px"
        :product="childProduct"
      ></block-related-product-pc>
      <block-partners-product-pc
        style="margin-top: 80px"
        :partnerId="detail.partner.id"
      ></block-partners-product-pc>
    </div>
  </div>
</template>
<script>
import CardReviewTotalRegPc from "@/components/Components/Card/CardReviewTotalRegPc.vue";
import CardReviewPc from "@/components/Components/Card/CardReviewPc.vue";
import CardInquiryTotalRegPc from "@/components/Components/Card/CardInquiryTotalRegPc.vue";
import CardInquiryPc from "@/components/Components/Card/CardInquiryPc.vue";
import CardRelatedProductPc from "@/components/Components/Card/CardRelatedProductPc.vue";
import BlockRelatedProductPc from "@/components/Components/Block/BlockRelatedProduct/BlockRelatedProductPc.vue";
import BlockPartnersProductPc from "@/components/Components/Block/BlockPartnersProduct/BlockPartnersProductPc.vue";
import ListProductReviewPc from "@/components/Components/List/ListProductReviewPc.vue";
import ListProductInquiryPc from "@/components/Components/List/ListProductInquiryPc.vue";
import LocationMapBlock from "@/components/Components/Common/LocationMapBlock.vue";
import BlockMixin from "@/components/Components/Mixins/BlockMixin";
import PageMixin from "@/components/Components/Mixins/PageMixin";

export default {
  name: "BlockProductDetailTabPc",
  components: {
    CardReviewTotalRegPc,
    CardReviewPc,
    CardInquiryTotalRegPc,
    CardInquiryPc,
    CardRelatedProductPc,
    BlockRelatedProductPc,
    BlockPartnersProductPc,
    ListProductReviewPc,
    ListProductInquiryPc,
    LocationMapBlock,
  },
  mixins: [BlockMixin, PageMixin],
  props: {},
  data() {
    return {
      top: 0,
      menu: [
        {
          id: 0,
          name: "소개",
        },
        {
          id: 1,
          name: "기본정보",
        },
        {
          id: 2,
          name: "후기",
          count: 0,
        },
        {
          id: 3,
          name: "문의",
          count: 0,
        },
      ],
      detail: undefined,
      vDelay: false,
      mapStyle: {
        width: "100%",
        height: "480px",
      },
      fixedState: false,
      review_list: [],
      selectedTab: 0,
      childProduct: [],
      inquiry_list: [],
      review_list_self: [],
      inquiry_list_self: [],
      review_list_other: [],
      inquiry_list_other: [],
    };
  },
  created() {
    this.getData();
    // this.getProductReview();
    // this.getProductInquiry();
    // this.setUid();
  },
  mounted() {
    let ob = new this.ResizeObserver((e) => {
      this.top = e[0].contentRect.height + this.$store.getters.headerHeight;
    });
    ob.observe(document.getElementById("tap-bar-wrapper"));
    if (document.getElementsByClassName("header-container")[0] !== undefined) {
      let ob2 = new this.ResizeObserver((e) => {
        this.top = e[0].contentRect.height + this.$store.getters.headerHeight;
      });
      ob2.observe(document.getElementsByClassName("header-container")[0]);
    }
    document.addEventListener("scroll", this.detectClientHeight);
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.detectClientHeight);
  },

  methods: {
    clickMenuItem(item, idx) {
      this.selectedTab = item.id;
      console.log("===>", this.selectedTab);
      let element = document.getElementById(`item${idx + 1}`);
      // let tabHeight = ((!this.fixedState && idx === 0) || idx === 0) ? 204 : 312;
      let offset =
        window.pageYOffset + element.getBoundingClientRect().top - 70;
      if (!this.fixedState) {
        offset -= this.top + this.$refs.tabMenu.clientHeight;
      } else {
        offset -= this.top;
      }
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    },
    detectClientHeight() {
      let scrollTop = document.documentElement.scrollTop;
      this.$nextTick(() => {
        if (this.$refs.tabMenu) {
          if (scrollTop > 700) {
            this.fixedState = true;
          } else {
            this.fixedState = false;
          }
        }
        let item1 =
          document.getElementById("item1").getBoundingClientRect().top +
          window.pageYOffset;
        let item2 =
          document.getElementById("item2").getBoundingClientRect().top +
          window.pageYOffset;
        let item3 =
          document.getElementById("item3").getBoundingClientRect().top +
          window.pageYOffset;
        let item4 =
          document.getElementById("item4").getBoundingClientRect().top +
          window.pageYOffset;
        if (this.fixedState && this.$refs.tabMenu) {
          item1 -= this.$refs.tabMenu.clientHeight;
          item2 -=
            this.$refs.tabMenu.clientHeight + this.$store.getters.headerHeight;
          item3 -=
            this.$refs.tabMenu.clientHeight + this.$store.getters.headerHeight;
          item4 -=
            this.$refs.tabMenu.clientHeight + this.$store.getters.headerHeight;
        }
        if (scrollTop > item1) {
          this.selectedTab = 0;
        }
        if (scrollTop > item2) {
          this.selectedTab = 1;
        }
        if (scrollTop > item3) {
          this.selectedTab = 2;
        }
        if (scrollTop > item4) {
          this.selectedTab = 3;
        }
      });
    },
    getData() {
      let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}?fields=id,img,name,simple_desc,tags,form,address,has_download_coupon,`;
      url += `location,order_conversion_type,category1,category2,category3,rate,stock,input,like_count,reviews_count,visit,price,partner,related_products,`;
      url += `address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,booking_policy&hit=false`;
      this.$axios.get(url).then((res) => {
        this.detail = res.data;
      });
    },
    getChildProduct() {
      let id = this.detail.related_products;
      for (let i = 0; i < id.length; i++) {
        this.$axios
          .get(
            `user/${this.user.user_id}/mapping/product/${id[i]}?fields=id,params,img,name,partner,price,discount_time,like_count&hit=false`
          )
          .then((res) => {
            this.childProduct.push(res.data);
          });
      }
    },
    getProductReview() {
      this.review_list = [];
      let product_id = this.$route.query.id;
      this.url = `public/product/${product_id}/review?secret=true&page_num=1&page_length=8`;
      if (this.isLogin)
        this.url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=1&page_length=8`;
      this.$axios.get(this.url).then((res) => {
        res.data.data.forEach((item) => {
          if (Number(item.author_id) === this.user.user_id) {
            item.self = true;
          }
        });
        this.review_list = res.data.data;
        this.menu[2].count = res.data.count;
      });
    },
    getProductInquiry() {
      this.inquiry_list = [];
      let product_id = this.$route.query.id;
      this.url = `public/product/${product_id}/inquiry?secret=true&page_num=1&page_length=8`;
      if (this.isLogin)
        this.url = `user/${this.user.user_id}/product/${product_id}/inquiry?secret=true&page_num=1&page_length=8`;
      this.$axios.get(this.url).then((res) => {
        res.data.data.forEach((item) => {
          if (Number(item.author_id) === this.user.user_id) {
            item.self = true;
          }
          item.isOpen = false;
        });
        this.inquiry_list = res.data.data;
        this.menu[3].count = res.data.count;
      });
    },
    setUid() {
      let self_list = [];
      let other_list = [];
      if (this.$route.query.tab === 1) {
        this.review_list_self.forEach((item) => {
          item.uid = this.uuidv4();
          self_list.push(item);
        });
        this.review_list_other.forEach((item) => {
          item.uid = this.uuidv4();
          other_list.push(item);
        });
        this.review_list_self = self_list;
        this.review_list_other = other_list;
      } else if (this.$route.query.tab === 2) {
        this.inquiry_list_self.forEach((item) => {
          item.uid = this.uuidv4();
          self_list.push(item);
        });
        this.inquiry_list_other.forEach((item) => {
          item.uid = this.uuidv4();
          other_list.push(item);
        });
        this.inquiry_list_self = self_list;
        this.inquiry_list_other = other_list;
      }
    },
    clickAddress() {
      this.$copyText(this.detail.address).then(
        (e) => {
          this.toast("주소가 복사되었습니다.");
        },
        (e) => {
          this.toast("주소복사에 실패했습니다.");
        }
      );
    },
    reviewCardStyle(idx) {
      // let deco = {
      //   borderTop: this.brandBorder.sub.border
      // };
      // if (idx === this.review_list.length - 1) {
      //   deco.borderBottom = this.brandBorder.sub.border;
      // }
      let deco = {
        borderBottom: this.brandBorder.sub.border,
      };
      return deco;
    },
    inquiryCardStyle(idx) {
      // let deco = {
      //   borderTop: this.brandBorder.sub.border
      // };
      // if (idx === this.inquiry_list.length - 1) {
      //   deco.borderBottom = this.brandBorder.sub.border;
      // }
      let deco = {
        borderBottom: this.brandBorder.sub.border,
      };
      return deco;
    },
    cardStyle(idx) {
      let obj = {
        width: "162px",
        padding: "0 8px",
      };

      return obj;
    },
    tabMenuStyle(item, idx) {
      let deco = {
        padding: "12px 8px",
        textAlign: "center",
        fontSize: "14px",
      };
      if (this.$store.getters.device === "pc") {
        deco.padding = "20px";
        deco.fontSize = "15px";
      }

      if (this.selectedTab === item.id) {
        if (this.selectedTabStyle !== undefined) {
          deco = this.selectedTabStyle;
        }
      } else {
        deco.color = this.getColor("기본 내용 색상");
        if (this.unselectedTabStyle !== undefined) {
          deco = this.unselectedTabStyle;
        }
      }
      console.log("ID", item.id);
      return deco;
    },
    countStyle(item) {
      let deco = {};
      if (this.unselectedCountStyle) {
        deco = this.unselectedCountStyle;
      } else {
        deco = {
          fontSize: "12px",
          color: `${this.getColor("Primary Color")}`,
        };
      }
      deco.marginLeft = "6px";

      if (this.selectedTab === item.id) {
        if (this.selectedCountStyle) {
          deco = this.selectedCountStyle;
        }
      }

      return deco;
    },
    unselectedCountStyle() {
      return {
        color: this.brandColor.main.color,
        marginLeft: "6px",
      };
    },
    childStyle(idx) {
      let deco = {};
      deco.padding = "0 4px";
      return deco;
    },
  },
  computed: {
    fixedStyle() {
      let deco = {
        padding: "12px 0",
      };
      if (this.fixedState) {
        deco = {
          width: this.pcMaxWidth.width,
          position: "fixed",
          top: `${this.top}px`,
          zIndex: 2,
        };
      }
      return deco;
    },
    selectedTabStyle() {
      return {
        color: this.brandColor.primary.color,
        padding: "14px 0",
        width: `calc(100% / ${this.menu.length})`,
        fontSize: "18px",
        fontWeight: "700",
        backgroundColor: "white",
        // marginRight: '8px',
        borderBottom: `4px solid ${this.brandColor.primary.color}`,
      };
    },
    unselectedTabStyle() {
      return {
        color: this.brandColor.sub.color,
        padding: "14px 0",
        width: `calc(100% / ${this.menu.length})`,
        fontSize: "18px",
        borderBottom: `1px solid ${this.brandColor.sub3.color}`,
        // marginRight: '8px',
      };
    },
  },
  watch: {
    $route(n) {
      this.getData();
      // this.getProductReview();
      // this.getProductInquiry();
      // this.setUid();
    },
    detail(n) {
      this.childProduct = [];
      this.getChildProduct();
    },
  },
};
</script>
<style scoped>
.slide-arrow {
  font-size: 24px;
  color: #000;
  background-color: #fff;
  border-radius: 4px;
  width: 48px;
  height: 24px;
}
.slide-arrow:hover {
  font-size: 24px;
  color: #bbb;
  background-color: #eee;
  border-radius: 4px;
  width: 48px;
  height: 24px;
}

.divider {
  width: 0.5px;
  background-color: #e3e3e3;
}
</style>

