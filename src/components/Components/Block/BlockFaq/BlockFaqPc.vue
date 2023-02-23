<template>
<div class="full-width flex-justify" style="min-height:100vh">
  <div style="margin:25px 0" :style="pcMaxWidth">
    <div class="size-24 weight-700 margin-bottom-24 p-main">자주 묻는 질문</div>
    
    <div class="flex wrap full-width margin-bottom-30">
      <div v-for="(item, idx) in categoryNames" :key="'categoryName'+idx" @click="selectCategory(item)"
        class="unselect size-16 weight-500 p-border-bottom-main p-border-right-main"
        :class="{
          'p-border-top-main': idx < 4,
          'p-border-left-main': idx % 4 === 0,
          'p-bg-primary': item.selected,
          'p-white': item.selected,
          'p-bg-white': !item.selected,
          'p-sub': !item.selected
        }"
        style="width: 25%; height: 60px; line-height: 60px; text-align: center">{{ item.label }}</div>
    </div>
    
    <card-faq-pc :card="item" v-for="item in list" 
      :key="item.id" class="margin-bottom-16"></card-faq-pc>
  
    <div v-if="list.length===0" class="empty-view size-16 p-sub">
      목록이 없습니다.
    </div>
    
    <pagination-default :pagingData="pagingData" :pageNum="3" :arrowEnd="true"
      @curPaginationNum="(val) => curNum(val)" :arrow="true"
      :selectedStyle="selectedStyle" :unselectedStyle="unselectedStyle"
      v-if="pagingData"></pagination-default>
  </div>
</div>
</template>
<script>
import CardFaqPc from "@/components/Components/Card/CardFaqPc.vue"
import PaginationDefault from "@/components/Components/Common/PaginationDefault.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockFaqPc',
  components: {
    CardFaqPc,
    PaginationDefault
  },
  mixins: [
    BlockMixin,
    PageMixin,
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
      "styles": {
        "backgroundColor": "brandBgColor.sub"
      },
      "categoryId": undefined,
      "pagingData": undefined,
      "categoryNames": [],
      "curPaginationNum": undefined
    }
  },
  created() {
    this.getCategoryName();
  },
  mounted() {
    this.setBg();
  },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.styles.backgroundColor);
    },
    getCategoryName() {
      this.$axios.get('/public/board/faq/category').then(res=> {
        res.data.sort(function (a, b) {
          return a.value - b.value;
        });
        res.data.forEach((item, idx)=> {
          if(idx === 0) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });
        this.categoryNames = res.data;
        this.categoryId = res.data[0].value;
        this.getData();
      });
    },
    getData() {
      let num = 1;
      if(this.curPaginationNum) {
        num = this.curPaginationNum;
      }
      this.url = `public/board/faq?category_id=${this.categoryId}&page_num=${num}&page_length=5`;
      this.$axios.get(this.url)
      .then(res => {
        res.data.data.forEach(item=> { item.toggle = false; });
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        res.data.data.sort(function (a, b) { return a.priority - b.priority });
        this.list = res.data.data;
        this.pagingData = res.data;
      })
    },
    curNum(num) {
      this.curPaginationNum = num;
      this.getData();
    },
    selectCategory(item) {
      this.categoryNames.forEach(category=> {
        if(category.label === item.label) {
          category.selected = true;
          this.categoryId = item.value;
        } else {
          category.selected = false;
        }
      });
      this.curPaginationNum = 1;
      this.getData();
    }
  },
  computed: {
    selectedStyle() {
      return {
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        color: this.brandColor.primary.color,
        borderRadius: '3px',
        backgroundColor: 'white'
      }
    },
    unselectedStyle() {
      return {
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '16px',
        color: `${this.getColor('보조 내용 색상 02')}`
      }
    }
  },
  watch: {
    
  }
}
</script>


