<template>
<div class="p-bg-sub" style="padding:16px 0 100px" :style="pagePadding">
  <c-input-dropdown :options="categoryNames"
    :gutter="0"
    :value="categoryId"
    @update:value="selectCategory"
    placeholder="선택"
    :iconCustomStyle="iconStyle"
    :dropdownCustomStyle="dropdownStyle"
    :dropListCustomStyle="{top: '56px'}"
    class="margin-bottom-16 radius-6 p-bg-white p-primary"></c-input-dropdown>
  <transition-group name="fade" tag="div">
    <t1-t-card-faq :card="item" v-for="item in list" :key="item.id"
      class="margin-bottom-16"></t1-t-card-faq>
  </transition-group>
  <div v-if="list.length===0" class="empty-view p-sub">
    목록이 없습니다.
  </div>
</div>
</template>
<script>
import t1TCardFaq from "@/components/Components/Card/t1/CardFaq.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"
import PageMixin from "@/components/Components/Mixins/PageMixin"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockFaq',
  components: {
    t1TCardFaq
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
      "categoryId": undefined,
      "categoryNames": []
    }
  },
  created() {
    this.getCategoryName();
  },
  mounted() {

  },
  
  methods: {
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
      this.pageLoadType = 'infinite';
      this.currentPage = 1;
      this.url = `public/board/faq?category_id=${this.categoryId}&page_num=1&page_length=10`;
      this.$axios.get(this.url)
      .then(res => {
        res.data.data.forEach(item=> { item.toggle = false; });
        this.totalPages = res.data.total_page;
        this.totalCount = res.data.count;
        this.currentPage = 2;
        res.data.data.sort(function (a, b) { return a.priority - b.priority });
        this.list = res.data.data;
      })
    },
    selectCategory(item) {
      this.categoryNames.forEach(category=> {
        if(category.value === item) {
          category.selected = true;
          this.categoryId = item;
        } else {
          category.selected = false;
        }
      });
      this.getData();
    }
  },
  computed: {
    iconStyle() {
      return {
        position: 'absolute',
        right: '6px',
        color: this.brandColor.main.color,
        fontSize: '24px'
      }
    },
    dropdownStyle() {
      return {
        padding: '16px',
        height: '56px',
        fontSize: '16px',
        borderRadius: '8px',
        border: this.brandBorder.main.border
      }
    }
  },
  watch: {
    
  }
}
</script>


