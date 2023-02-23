<template>
<div class="full-width" style="margin-top:50px; padding-top: 16px">
    <div v-if="list && list.length > 0">
      <div class="flex-between" style="padding-bottom: 20px">
        <div class="size-14 weight-400 p-sub">전체 문의 {{ totalCount }}개</div>
        <div class="size-14 weight-500 p-primary" @click="clickInquiry">
          문의하기
        </div>
      </div>
      <list-vertical>
        <div slot="card">
          <div v-for="(item,idx) in list" :key="'item-'+idx">
            <card-inquiry :card="item" :style="inquiryCardStyle(idx)"
              @del="delInquiry" @close="$emit('close')"></card-inquiry>
          </div>
        </div>
      </list-vertical>
    </div>
    <div v-if="list&&list.length===0" class="empty-view p-sub" style="margin-top: 32px">문의가 없습니다.</div>
  </div>
</template>
<script>
import CardInquiry from "@/components/Components/Card/CardInquiry.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockInquiry',
  components: {
    CardInquiry
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
    this.getData();
  },
  mounted() {
    
  },
  
  methods: {
    delInquiry() {
      this.list = [];
      this.getData();
    },
    clickInquiry() {
      if (this.isLogin) {
        this.routerPush(`inquiry_reg?product_id=${this.$route.query.id}`)
        this.$emit('close')
      } else {
        this.toast('로그인 후 문의 작성이 가능합니다.');
        this.routerPush('/signin');
        this.$emit('close')
      }
    },
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
    getData() {
      if(this.$route.path.indexOf('partner_detail')>-1) {
       this.url = `public/partner/${this.$route.query.id}/inquiry?page_num=1&page_length=10`; 
      } else {
        let product_id = this.$route.query.id;
        this.url = `public/product/${product_id}/inquiry?secret=true&page_num=1&page_length=8`;
        if(this.isLogin)
          this.url = `user/${this.user.user_id}/product/${product_id}/inquiry?secret=true&page_num=1&page_length=10`;
      }
      this.url += `&ordering=${this.sort}`
      this.currentPage = 1;
      this.$axios.get(this.url).then(res => {
        res.data.data.forEach(item => {
          if(Number(item.author_id) === this.user.user_id) {
            item.self = true;
          }
          item.isOpen = false;
        })
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
    },
    inquiryCardStyle(idx) {
      let deco = {}
      if (idx !== 0) {
        deco.borderTop = this.brandBorder.sub.border
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
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

