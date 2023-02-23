<template>
<div class="full-width" style="margin-top:50px; padding-top: 16px">
    <div class="p-bg-sub2 flex-justify radius-8" style="padding: 20px 0 16px">
      <div>
        <rating :rateSize="42" :value="rate" rateColor="#F8D053" defaultColor="#DDDDDD"
          :isNew="true" :roundShape="true" :useBorder="false"></rating>
        <!--<span class="star-rating">-->
        <!--  <span :style="ratingStyle"></span>-->
        <!--</span>-->
        <div class="size-18 bold p-main text-center"
          style="margin-top: 8px">{{ rate }}<span class="p-sub3"> / 5</span></div>
      </div>
    </div>
    <div v-if="list && list.length > 0" style="margin-top: 32px">
      <div class="flex-between" style="padding-bottom: 20px">
        <div class="size-14 weight-400 p-sub">전체 후기 {{ totalCount }}개</div>
        <!-- 정렬 드롭다운 -->
        <div class="size-14 position-relative" style="z-index: 1; margin-right: 14px;"
          v-click-outside="closeDropdown">
          <!-- 선택된 값 -->
          <div class="flex-align unselect" style="padding-left: 12px" @click="toggleList">
            <img src="/static/image/icon/ic_compare_arrows.svg" style="width:16px;height:14px;margin-right: 4px">
            <div v-if="dropdown.selected" class="size-14 p-sub">{{ dropdown.selected.label }}</div>
          </div>
          <!-- 리스트 -->
          <ul v-if="dropdown.isOpen" class="dropdown-ul position-absolute" :style="brandBgColor.white">
            <li class="dropdown-item unselect" style="padding: 7px 20px; color: #1e1e1e"
                v-for="(item, idx) in dropdown.options" :key="idx"
                :style="itemStyle(idx)"
                @click.stop.prevent="clickItem(item)"
                @mouseover.stop.prevent="dropdown.mouseOverIndex=idx"
                @mouseleave.stop.prevent="dropdown.mouseOverIndex=-1">
              {{ item.label }}
            </li>
          </ul>
        </div>
      </div>
      <list-vertical>
        <div slot="card">
          <div v-for="(item,idx) in list" :key="'item-'+idx" :id="'review-'+item.id">
            <card-review :card="item" 
              @delete="onDelete(idx)" @close="$emit('close')" style="padding: 0 16px 16px"></card-review>
          </div>
        </div>
      </list-vertical>
    </div>
    <div v-if="list&&list.length===0" class="empty-view p-sub" style="margin-top: 32px">후기가 없습니다.</div>
  </div>
</template>
<script>
import CardReview from "@/components/Components/Card/CardReview.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockReview',
  components: {
    CardReview
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "rate": 0,
      "sort": "-created_time",
      "intRate": 0,
      "dropdown": {
        "isOpen": false,
        "options": [],
        "selected": {
          "label": "",
          "value": ""
        },
        "mouseOverIndex": -1
      }
    }
  },
  created() {
    this.pageLoadType = 'infinite';
    this.setDropdownOptions();
    this.getRate();
    this.getData();
  },
  mounted() {
    
  },
  
  methods: {
    getAbsoluteTop(el) {
      return window.pageYOffset + el.getBoundingClientRect().top;
    },
    setDropdownOptions() {
      this.dropdown.options = [
        {"label":"최신순","value":"-created_time","is_active":true},
        {"label":"별평점순","value":"-rate","is_active":true}
      ]

      // 최신등록 순으로 초기값 설정
      this.dropdown.options.forEach(option => {
        if (option.value === '-created_time') {
          this.dropdown.selected = option;
          this.sort = option.value;
        }
      })
    },
    onDelete(idx) {
      let res = confirm('상품평을 삭제하시면 재작성이 불가능합니다. 삭제하시겠습니까?');
      if(res) {
        this.$axios.delete(`user/${this.user.user_id}/product/${this.list[idx].product_id}/review/${this.list[idx].id}`).then(res=>{
          this.list.remove(idx);
        });
      }
    },
    getRate() {
      let id = this.$route.query.id;
      let key = 'product';
      if(this.$route.path.indexOf('partner_detail')>-1) {
        key = 'partner';
      }
      
      this.$axios.get(`user/0/mapping/${key}/${id}?fields=rate`).then(res=>{
        this.rate = res.data.rate;
        this.intRate = parseInt(this.rate);
      });
    },
    getData() {
      if(this.$route.path.indexOf('partner_detail')>-1) {
       this.url = `public/partner/${this.$route.query.id}/review?page_num=1&page_length=10`; 
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/review?secret=true&page_num=1&page_length=8`;
        if(this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/review?secret=true&page_num=1&page_length=10`;
      }
      this.url += `&ordering=${this.sort}`
      this.currentPage = 1;
      this.$axios.get(this.url).then(res => {
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.$emit('totalCount', this.totalCount);
        this.currentPage = 2;
        this.list = res.data.data;
      })
    },
    clickItem(item) {
      this.dropdown.selected = item;
      this.dropdown.isOpen = false;
      this.onSelectSorted(item.value);
    },
    onSelectSorted(val) {
      this.sort = val;
      this.getData();
    },
    closeDropdown() {
      this.dropdown.isOpen = false;
    },
    toggleList() {
      this.dropdown.isOpen = !this.dropdown.isOpen;
    },
    itemStyle(idx) {
      if (this.dropdown.mouseOverIndex==idx) {
        return {
          backgroundColor: this.brandBgColor.sub.backgroundColor
        }
      }
      else {
        return {
          color: this.brandColor.main.color
        }
      }
    }
  },
  computed: {
    ratingStyle() {
      let deco = {}
      let splitedNum = [];
      if (this.rate) {
        splitedNum = String(this.rate).split('.');
        if (splitedNum.length !== 1) {
          deco.width = Number(splitedNum[0] * 20) + Number(String(parseFloat('0.' + splitedNum[1])).split('.')[1] * 2) + '%';
        } else {
          deco.width = Number(splitedNum[0] * 20) + '%'
        }
      } else {
        deco.width = '0%'
      }
      return deco;
    }
  },
  watch: {
    '$store.getters.reviewId'(n) {
      this.$nextTick(() => {
      let reviewWrap = document.getElementById('block-all-review');
        if (n !== undefined) {
          let review = document.getElementById(`review-${n}`);
          let parentTop = this.getAbsoluteTop(review.parentElement)
          let absoluteTop = this.getAbsoluteTop(review);

          reviewWrap.scrollTop = absoluteTop - parentTop;
        }
      })
    }
  }
}
</script>
<style scoped>
.star-rating {
  width:244px;
}

.star-rating,.star-rating span {
  display:inline-block;
  height:38px;
  overflow:hidden;
  background:url('https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/15831993.png') no-repeat;
} 

.star-rating span {
  background-position:left bottom;
  line-height:0;
  vertical-align:top;
}

.dropdown {
  width: 260px;
  height: 40px;
  border: 1px solid #d6d6d6;
  justify-content: space-between;
  padding: 9px 9px 9px 15px;
}
.dropdown-ul {
  background-color: white;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
  border: 1px solid #c7c7c7;
  border-radius: 4px;
  top: 26px;
  padding: 7px 0;
  right: 0;
  width: 116px;
}

.empty-view {
  padding: 40px 0;
  font-size: 14px;
}
</style>

