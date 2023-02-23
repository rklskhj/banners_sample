<template>
  <div class="container full-width flex-justify p-main p-bg-white">
    <div :style="pcMaxWidth">
      <div class="list-wrap-grid">
        <div class="flex-align">
          <div v-if="type === 'exhibition'">
            <div class="full-width margin-bottom-16" :style="menuTitle">
              {{ exhibition.title }}
            </div>
            <div
              class="full-width"
              :style="menuSubtitle"
              style="margin-bottom: 56px"
            >
              {{ exhibition.subtitle }}
            </div>
            <div
              v-if="list && list.length > 0"
              class="
                size-16
                unselect
                btn-more
                text-center
                radius-8
                p-border-primary p-primary
              "
              @click="goExhibition"
            >
              기획전 더보기
            </div>
          </div>

          <div v-else>
            <div class="full-width margin-bottom-16" :style="menuTitle">
              {{ title }}
            </div>
            <div class="full-width" :style="menuSubtitle">{{ subtitle }}</div>
          </div>
        </div>

        <div class="overflow-hidden">
          <div
            v-if="useCategory && categories && categories.length > 0"
            style="
              margin-top: 24px;
              padding-top: 10px;
              margin-bottom: 32px;
              height: 60px;
            "
            class="overflow-hidden full-width p-border-bottom-main"
            v-dragscroll.x="true"
            @dragscrollmove.prevent.self="onDrag"
          >
            <div class="grab-bing flex-align full-width">
              <div
                v-for="(category, idx) in categories"
                :key="'category-' + idx"
                class="unselect list-item p-main size-16"
                :class="{
                  bold: category.id === selectedCategory.id,
                }"
                style="height: 50px; padding: 14px 0"
                :style="categoryStyle(category, idx)"
                @click.stop.prevent="clickCat(category, idx)"
              >
                {{ category.name }}
              </div>
            </div>
          </div>
          <div v-if="list && list.length > 0" class="list-grid">
            <v1-t-card-product-pc
              v-for="(item, idx) in list"
              :key="`card-prod-${item.id}-${idx}`"
              :card="item"
              :cardProps="cardProps"
            ></v1-t-card-product-pc>
          </div>
          <div
            v-else-if="list && list.length === 0"
            class="flex-justify size-16 weight-500 p-sub2"
            style="align-items: center; height: 20vh"
          >
            {{ noListText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import v1TCardProductPc from "@/components/Components/Card/v1/CardProductPc.vue";
import BlockMixin from "@/components/Components/Mixins/BlockMixin";

export default {
  name: "BlockHomeProductPc",
  components: {
    v1TCardProductPc,
  },
  mixins: [BlockMixin],
  props: {},
  data() {
    return {
      list: undefined,
      type: "exhibition",
      title: "오늘의 베스트 상품",
      visible: true,
      dragging: false,
      filtered: {
        price: {
          max: 0,
          min: 0,
        },
        address: [],
        category: [],
        ordering: {
          label: "",
          value: "",
        },
      },
      subtitle: "오늘 가장 잘나간 상품",
      cardProps: {
        type: "product",
        visible: {
          partner: {
            name: true,
            address: false,
            simple_desc: false,
          },
          product: {
            cart: false,
            like: true,
            name: true,
            rate: true,
            tags: false,
            price: {
              price: true,
              org_price: false,
              discount_price: true,
            },
            coupon: true,
            review: true,
            address: false,
            simple_desc: false,
          },
        },
        imageRates: {
          ratio: "1:1",
        },
      },
      isShowing: false,
      cardColumn: 3,
      categories: [],
      exhibition: {
        id: 3,
        title: "청소 기획전",
        subtitle: "청소가 필요하신가요? 전문가를 알아보세요",
      },
      titleStyle: {
        size: 28,
        align: "left",
        color: "brandColor.main",
        weight: "700",
      },
      visibleNum: 3,
      useCategory: false,
      subtitleStyle: {
        size: 16,
        align: "left",
        color: "brandColor.sub",
        weight: "400",
      },
      selectedCategory: undefined,
    };
  },
  created() {
    if (!this.list || this.list.length === 0) {
      this.init();
    }
  },
  mounted() {
    this.setBg();
  },

  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(
        this.bgColor
      );
    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    clickCat(item, idx) {
      // 드래그앤드 시 클릭방지
      if (this.dragging) {
        this.dragging = false;
        return;
      } else {
        this.selectedCategory = item;
      }
    },
    init() {
      this.getData();
    },
    getData() {
      if (this.type === "exhibition") {
        this.getExhibition();
      } else {
        this.getProducts();
      }
    },
    getExhibition() {
      let field = "&fields=title,start_date,end_date,display_type,desc,img,id,";
      field +=
        "products.id,products.name,products.img,products.simple_desc,products.discount_time,products.rate,products.review_count,products.reviews_count,";
      field +=
        "products.is_like,products.address,products.price,products.partner.name,products.partners,products.location,products.has_download_coupon,products.tags,";
      field +=
        "products.order_conversion_type,products.possible_reservation_resv,products.possible_booking_resv,products.soldout,";
      field += "products.stock_type,products.stock,category_type,category";
      this.$axios
        .get(
          `user/${this.user.user_id}/mapping/exhibition/${this.exhibition.id}?ordering=id${field}`
        )
        .then((res) => {
          this.useCategory = res.data.category_type;
          // 기획전 노출여부 노출안함일때
          if (res.data.display_type === 2) {
            this.isShowing = false;
          } else if (res.data.display_type === 1) {
            // 기획전 노출여부 기간노출일때
            let date = new Date().getTime();
            let start_date = new Date(res.data.start_date).getTime();
            let end_date = new Date(res.data.end_date).getTime();

            if (date > start_date && date < end_date) {
              this.isShowing = true;
            } else {
              this.isShowing = false;
            }
          } else {
            // 기획전 노출여부 노출일때
            this.isShowing = true;
          }
          if (this.isShowing) {
            if (res.data.category_type) {
              this.categories = res.data.category;
              this.selectedCategory = this.categories[0];
              this.getCategoryProductList(this.selectedCategory);
            } else {
              let arr = [];
              res.data.products.forEach((item) => {
                if (item.hasOwnProperty("partners")) {
                  item.partner = item.partners;
                  delete item.partners;
                }

                if (
                  item.order_conversion_type !== 10 &&
                  item.order_conversion_type !== 11 &&
                  (item.stock_type !== 0 || item.stock !== 0)
                ) {
                  arr.push(item);
                } else if (
                  item.order_conversion_type === 10 &&
                  item.possible_reservation_resv
                ) {
                  arr.push(item);
                } else if (
                  item.order_conversion_type === 11 &&
                  item.possible_booking_resv
                ) {
                  arr.push(item);
                }
              });
              this.list = arr.slice(0, this.visibleNum);
            }
          } else {
            this.list = [];
          }
          this.exhibition.title = res.data.title;
          if (res.data.desc) {
            this.exhibition.subtitle = res.data.desc;
          }
        });
    },
    getCategoryProductList(category) {
      let arr = [];
      category.product_list.forEach((item) => {
        if (
          item.order_conversion_type !== 10 &&
          item.order_conversion_type !== 11 &&
          (item.stock_type !== 0 || item.stock !== 0)
        ) {
          arr.push(item);
        } else if (
          item.order_conversion_type === 10 &&
          item.possible_reservation_resv
        ) {
          arr.push(item);
        } else if (
          item.order_conversion_type === 11 &&
          item.possible_booking_resv
        ) {
          arr.push(item);
        }
      });
      this.list = arr.slice(0, this.visibleNum);
    },
    getProducts() {
      let fields =
        "?fields=id,name,img,is_like,like_count,shared_count,visit,simple_desc,price,discount_time,tags";
      fields +=
        ",order_conversion_type,possible_reservation_resv,possible_booking_resv,stock_type,stock,soldout";
      fields +=
        ",partner.id,partner.name,location,address,rate,review_count,reviews_count,has_download_coupon";
      let url = `user/${this.user.user_id}/mapping/product${fields}`;
      let category = this.filtered.category;
      let price = this.filtered.price;
      let address = this.filtered.address;
      let ordering = this.filtered.ordering;

      if (category && category.length > 0) {
        let str = "";
        for (let i = 0; i < category.length; i++) {
          if (i === 0) {
            str = category[i].value;
          } else {
            str += "," + category[i].value;
          }
        }

        url += "&category=" + str;
      }

      if (price.min > 0) {
        url += "&min_sale_price=" + price.min;
      }
      if (price.max > 0) {
        url += "&max_sale_price=" + price.max;
      }

      if (address && address.length > 0) {
        let str = "";
        for (let i = 0; i < address.length; i++) {
          if (i === 0) {
            str = address[i].value;
          } else {
            str += "," + address[i].value;
          }
        }
        url += "&able_address=" + str;
      }

      if (ordering.value) {
        url += "&ordering=" + ordering.value;
      }

      // let sorting = '';
      // if(this.filtered.length>0) {
      //   url = this.urlAppendFilter(this.filtered, sorting, url)
      // }
      console.log("getData", url);

      this.$axios.get(url).then((res) => {
        let arr = [];
        res.data.data.forEach((item) => {
          if (
            item.order_conversion_type !== 10 &&
            item.order_conversion_type !== 11 &&
            (item.stock_type !== 0 || item.stock !== 0)
          ) {
            arr.push(item);
          } else if (
            item.order_conversion_type === 10 &&
            item.possible_reservation_resv
          ) {
            arr.push(item);
          } else if (
            item.order_conversion_type === 11 &&
            item.possible_booking_resv
          ) {
            arr.push(item);
          }
        });
        this.list = arr.slice(0, this.visibleNum);
      });
    },
    goExhibition() {
      this.routerPush(`exhibition_detail?id=${this.exhibition.id}`);
    },
    categoryStyle(item, idx) {
      let deco = {
        marginRight: "36px",
      };
      if (item.id === this.selectedCategory.id) {
        deco.borderBottom = `2px solid ${this.brandColor.main.color}`;
      }
      if (idx === this.categories.length - 1) {
        deco.marginRight = "0px";
      }
      return deco;
    },
  },
  computed: {
    noListText() {
      if (this.type === "exhibition") {
        return "기획전 기간이 종료되었거나, 기획전 상품 목록이 없습니다.";
      } else {
        return "상품 목록이 없습니다.";
      }
    },
    menuTitle() {
      return {
        fontSize: this.titleStyle.size + "px",
        fontWeight: this.titleStyle.weight,
        color: this.parseColor(this.titleStyle.color),
        textAlign: this.titleStyle.align,
        wordBreak: "keep-all",
      };
    },
    menuSubtitle() {
      return {
        fontSize: this.subtitleStyle.size + "px",
        fontWeight: this.subtitleStyle.weight,
        color: this.parseColor(this.subtitleStyle.color),
        textAlign: this.subtitleStyle.align,
      };
    },
  },
  watch: {
    bgColor() {
      this.setBg();
    },
    selectedCategory(n) {
      this.getCategoryProductList(n);
    },
  },
};
</script>
<style scoped>
.grab-bing {
  white-space: nowrap;
  position: relative;
}
.list-item {
  display: inline-block;
}
.container {
  padding: 40px 0;
  min-height: 200px;
}
.btn-more {
  width: 190px;
  height: 48px;
  line-height: 48px;
}
.list-wrap-grid {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-column-gap: 56px;
}
.list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 24px;
}
</style>

