<template>
<div>
  <!--<div class="flex-between full-width" style="margin-bottom:8px">-->
  <div class="flex-between full-width wrap">
    <div class="full-width">
      <slot name="title"></slot>
    </div>
    <div class="full-width">
      <search-list v-if="search"
        @getSearch="(type, word) => getSearch(type, word)"></search-list>
    </div>
    <div class="full-width">
      <slot name="head"></slot>
    </div>

    <!-- 순서대로 display block으로 나열되는 가운데 삽입하고 있을 경우 사용 가능 -->
    <slot name="above-sort"></slot>

    <div v-if="sortStraight" class="full-width flex-end"
      style="margin-top:24px">
      <div v-for="(item,idx) in sortStraight" :key="'key'+idx"
        :style="labelStyle(idx)" class="unselect"
        v-show="item.is_active || item.is_active === undefined"
        @click="clickSort(item)">
        {{ item.label }}
      </div>
    </div>

    <!-- 리스트 정렬 드롭 다운 -->
    <div v-if="sortOptions"
        v-click-outside="closeDropdown"
        style="margin:12px 0" :style="sortOptionsStyle">
      <!-- 드롭다운 -->
      <div class="dropdown unselect" @click.stop.prevent="toggleList">
        <div :style="selItemStyle" v-if="dropdown.selected">{{ dropdown.selected.label }}</div>
        <i class="material-icons drop-icon" :style="arrowStyle">{{ dropdown.isOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
        <!-- Dropdown Item -->
        <ul v-if="dropdown.isOpen" class="dropdown-list">
          <li class="dropdown-item"
              v-for="(item, idx) in dropdown.options"
              :key="idx"
              v-show="item.is_active || item.is_active === undefined"
              :style="[itemStyle, mouseOverStyle(idx)]"
              @click.stop.prevent="clickItem(item)"
              @mouseover="dropdown.mouseOverIndex=idx"
              @mouseleave="dropdown.mouseOverIndex=-1">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 한 요소에서 flex시켜 나열하고 싶을 때 위의 slot 대신 사용 가능 -->
  <slot name="middle-content"></slot>

  <!-- middle-content slot 밑에 flex 아닌 block으로 나열하고 싶을 때 사용 가능 -->
  <slot name="middle-content-second"></slot>

  <slot name="card" v-if="!hideList"></slot>

  <div class="grid-box" v-if="!hideList">
    <slot name="card-grid"></slot>
  </div>

  <slot name="more"></slot>

  <pagination :pageNum="pageNum" :pagingData="pagingData" v-if="pagingData"
      @curPaginationNum="num => getPaginationNum(num)"
      :arrowEnd="true"></pagination>
</div>
</template>

<script>
  import SearchList from "@/components/Components/Common/SearchList.vue"
  import Pagination from "@/components/Components/Common/Pagination.vue"
  import ClickOutside from 'vue-click-outside'
  export default {
    name: "ListVertical",
    components: {
      Pagination,
      SearchList
    },
    directives: {
      ClickOutside
    },
    props: {
      sortOptions: {
        type: Array,
        required: false
      },
      sortStraight: {
        type: Array,
        required: false
      },
      pagingData: {
        type: Object,
        required: false
      },
      pageNum: {
        type: Number,
        required: false,
        default: 10
      },
      search: {
        type: Boolean,
        required: false
      },
      sortOptionsStyle: {
        type: Object,
        required: false
      },
      selectedLabelStyle: {
        type: Object,
        required: false
      },
      unselectedLabelStyle: {
        type: Object,
        required: false
      },
      hideList: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    created() {
      this.init();
    },
    data() {
      return {
        PrimaryColor: '',
        borderRadius: '12px',
        dropdown: {
          selected: {
            label: '',
            value: ''
          },
          options: [],
          isOpen: false,
          mouseOverIndex: -1
        },
        selectedSort: {
          label: '',
          value: ''
        }
      }
    },
    computed: {
      arrowStyle() {
        return {
          color: this.getColor('브랜드 강조 색상')
        }
      },
      selItemStyle() {
        return {
          fontSize: '13px',
          padding: '6px 8px',
          color: this.getColor('보조 내용 색상')
        }
      },
      itemStyle() {
        return {
          fontSize: '13px',
          padding: '6px 8px',
          backgroundColor: this.getColor('기본 배경 색상'),
          color: this.getColor('보조 내용 색상')
        }
      },
    },
    methods: {
      init() {
        if(this.sortOptions && this.sortOptions.length>0) {
          this.dropdown.selected =this.sortOptions[0];
          this.dropdown.options =this.sortOptions;
        }
        if(this.sortStraight) {
          this.selectedSort = this.sortStraight[0];
        }
      },
      mouseOverStyle(idx) {
        let deco = {};
        if ( this.dropdown.mouseOverIndex === idx ) {
          deco.backgroundColor = this.getColor('보조 배경 색상');
        }
        return deco;
      },
      toggleList() {
        this.dropdown.isOpen = !this.dropdown.isOpen;
      },
      closeDropdown() {
        this.dropdown.isOpen = false;
      },
      clickItem(item) {
        this.dropdown.selected = item;
        this.dropdown.isOpen = false;
        this.$emit('selectSorted', item.value);
      },
      clickSort(item) {
        this.selectedSort = item;
        this.$emit('selectSorted', item.value);
      },
      getPaginationNum(num) {
        this.$emit('curPaginationNum', num)
      },
      getSearch(type, word) {
        this.$emit('getSearch', type, word);
      },
      labelStyle(idx) {
        let deco = {
          padding: '8px',
          fontSize: '16px',

        };

        if(idx===this.sortStraight.indexOf(this.selectedSort)) {
          deco.fontFamily = 'Arita Dotum SemiBold';
          deco.color = `${this.getColor('기본 내용 색상')}`
          if (this.selectedLabelStyle) return this.selectedLabelStyle;
        }
        else {
          deco.fontFamily = 'Arita Dotum Medium';
          deco.color = `${this.getColor('도움말 및 비활성내용 색상')}`
          if (this.unselectedLabelStyle) return this.unselectedLabelStyle;
        }

        return deco;
      },
    },
    watch: {
      sortOptions() {
        this.dropdown.selected =this.sortOptions[0];
        this.dropdown.options =this.sortOptions;
      },
      sortStraight(n) {
        this.selectedSort = this.sortStraight[0];
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .dropdown
    display flex
    position relative
    align-items center
  .drop-icon
    font-size 17px
  .dropdown-list
    box-shadow 0 6px 12px 1px #f0f0f096
    position absolute
    top 28px
    left 0
    right 0
    z-index 1
</style>
