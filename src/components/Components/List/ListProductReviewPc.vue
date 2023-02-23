<template>
  <div>
    <div class="flex-between">
      <div class="size-24 weight-700 margin-bottom-24 p-main">후기</div>
      <div
        v-if="order_conversion_type === 1"
        class="size-12 unselect flex-center p-bg-primary p-white radius-6"
        style="width: 98px; height: 32px"
        @click="clickReg"
      >
        후기작성
      </div>
    </div>
    <div class="flex-center rating-box radius-8 p-bg-sub2">
      <div class="text-center">
        <div class="size-18 weight-500 margin-bottom-12">구매 만족도</div>
        <rating
          :rateSize="42"
          :value="rate"
          rateColor="#F8D053"
          defaultColor="#DDDDDD"
          :isNew="true"
          :roundShape="true"
          :useBorder="false"
        ></rating>
        <!--<span class="star-rating">-->
        <!--  <span :style="ratingStyle"></span>-->
        <!--</span>-->

        <div class="size-18" style="margin-top: 12px">
          {{ rate }}<span class="p-sub3"> / 5</span>
        </div>
      </div>

      <!--<i v-for="star in intRate" :key="'rate-'+star" 
      style="color:#F8D053;font-size:42px"
      class="material-icons-round">star</i>
      <i v-for="star in (5-intRate)" :key="'un-rate-'+star" 
      style="color:#dddddd;font-size:42px"
      class="material-icons-round">star</i>-->
    </div>

    <list-vertical v-if="list && list.length > 0">
      <card-review
        slot="card"
        v-for="(item, idx) in list"
        :card="item"
        :key="item.id"
        :class="{ 'p-border-bottom-sub': idx === list.length - 1 }"
        @delete="onDelete(idx)"
      ></card-review>
    </list-vertical>
    <div v-if="list && list.length === 0" class="empty-view p-sub2 size-16">
      후기가 없습니다.
    </div>
  </div>
</template>
<script>
import CardReview from "@/components/Components/Card/CardReview.vue";
import ListMixin from "@/components/Components/Mixins/ListMixin";

export default {
  name: "ListProductReviewPc",
  components: {
    CardReview,
  },
  mixins: [ListMixin],
  props: {
    isProd: {
      type: Boolean,
      default: true,
    },
    order_conversion_type: {
      type: Number,
    },
  },
  data() {
    return {
      list: undefined,
      rate: 0,
      intRate: 0,
      totalCount: 0,
    };
  },
  created() {
    this.pageLoadType = "infinite";
    this.getRate();
    this.getData();
  },
  mounted() {},

  methods: {
    clickReg() {
      if (this.isLogin) {
        this.$root.$emit("page_modal", "ReviewRegModal", {
          prop: {
            product_id: this.$route.query.id,
          },
        });
      } else {
        this.toast("로그인 후 후기 작성이 가능합니다.");
        this.routerPush("/signin");
      }
    },
    onDelete(idx) {
      let res = confirm(
        "상품평을 삭제하시면 재작성이 불가능합니다. 삭제하시겠습니까?"
      );
      if (res) {
        this.$axios
          .delete(
            `user/${this.user.user_id}/product/${this.list[idx].product_id}/review/${this.list[idx].id}`
          )
          .then((res) => {
            this.list.remove(idx);
          });
      }
    },
    getRate() {
      let id = this.$route.query.id;
      let key = "product";
      if (this.$route.path.indexOf("partner_detail") > -1) {
        key = "partner";
      }

      this.$axios.get(`user/0/mapping/${key}/${id}?fields=rate`).then((res) => {
        this.rate = res.data.rate;
        this.intRate = parseInt(this.rate);
      });
    },
    getData() {
      if (!this.isProd) {
        this.url = `public/partner/${this.$route.query.id}/review?page_num=1&page_length=10&hit=false`;
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/review?secret=true&page_num=1&page_length=8&hit=false`;
        if (this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=1&page_length=10&hit=false`;
      }
      this.currentPage = 1;
      this.$axios.get(this.url).then((res) => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.$emit("totalCount", this.totalCount);
        this.currentPage = 2;
        this.list = res.data.data;
      });
    },
  },
  computed: {
    wrapStyle() {
      return {
        borderTop: this.brandBorder.main.border,
      };
    },
    ratingStyle() {
      let deco = {};
      let splitedNum = [];
      if (this.rate) {
        splitedNum = String(this.rate).split(".");
        if (splitedNum.length !== 1) {
          deco.width =
            Number(splitedNum[0] * 20) +
            Number(String(parseFloat("0." + splitedNum[1])).split(".")[1] * 2) +
            "%";
        } else {
          deco.width = Number(splitedNum[0] * 20) + "%";
        }
      } else {
        deco.width = "0%";
      }
      return deco;
    },
  },
  watch: {},
};
</script>
<style scoped>
.rating-box {
  padding: 24px 0;
  margin-bottom: 32px;
}

.star-rating {
  text-align: left;
  width: 240px;
}

.star-rating,
.star-rating span {
  display: inline-block;
  height: 38px;
  overflow: hidden;
  background: url("https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/15831993.png")
    no-repeat;
}

.star-rating span {
  background-position: left bottom;
  line-height: 0;
  vertical-align: top;
}

.empty-view {
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  padding: 60px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

