<template>
<div>
  <div class="flex-between" style="margin-top: 16px; padding-bottom: 16px"
    :style="{marginLeft: pagePadding.paddingLeft, marginRight: pagePadding.paddingRight}">
    <div class="search-container">
      <input class="search-box" :style="brandBorder.main"
        type="text" maxlength="30" v-model.lazy="searchKeyword" @keyup="onKeyup"
        @keyup.enter="clickBack"
        placeholder="검색어를 입력해주세요."/>
      <i class="material-icons icon-search">search</i>
      <i class="material-icons icon-cancel" @click="clickCancel"
        v-if="searchKeyword !== ''" :style="brandColor.sub3">cancel</i>
    </div>
    <div class="unselect" @click="$emit('closePage')" style="padding: 10px 0 10px 16px">취소</div>
  </div>
  <div v-if="$store.getters.service.package.indexOf('booking') > -1" class="flex-align"
    style="padding: 0 16px 20px; gap: 0 8px">
    <div class="unselect flex-center filter-box p-border-sub radius-8"
      @click="selectSchedule">
      <div class="flex-align p-sub" style="gap: 0 2px">
        <div class="size-13 weight-400">{{ computedSchedule }}</div>
        <i class="material-icons" style="font-size: 18px">keyboard_arrow_down</i>
      </div>
    </div>
    <div class="unselect position-relative flex-center filter-box p-border-sub radius-8"
      v-click-outside="closeDropdown">
      <div class="flex-align p-sub" style="gap: 0 2px" @click="toggleList">
        <div class="size-13 weight-400">{{ dropdown.selected.label ? dropdown.selected.label : '인원' }}</div>
        <i class="material-icons" style="font-size: 18px">{{ dropdown.isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
      </div>
      <ul v-if="dropdown.isOpen" class="dropdown-ul position-absolute" :style="brandBgColor.white">
        <li class="dropdown-item unselect size-12 weight-400" style="padding: 7px 20px; color: #1e1e1e"
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
  <!-- result -->
  <div :style="pagePadding" style="margin-top: 8px">
    <div v-if="$store.getters.recentSearch.length > 0 && searchKeyword === ''">
      <div v-for="(item, idx) in $store.getters.recentSearch" :key="'recent-item-'+idx"
        class="flex-align"
        :style="{borderBottom: brandBorder.sub.border, width: '100%', padding: '16px 0'}">
        <div class="flex-between unselect" style="width: calc(100% - 24px)"
          @click="clickRecentItem(item)">
          <div class="flex-align">
            <div class="flex-center" style="padding: 0 16px 0 4px">
              <i class="material-icons">access_time</i>
            </div>
            <div class="size-16" :style="brandColor.sub2">{{ item.keyword }}</div>
          </div>
          <div class="size-12" :style="brandColor.sub2">{{ dateFormat(item.date, 'date_11') }}</div>
        </div>
        <div class="flex-align">
          <i class="material-icons unselect" @click="deleteRecentItem(item)"
            style="font-size: 18px; padding: 6px 0px 6px 6px" :style="brandColor.sub3">close</i>
        </div>
      </div>
    </div>
    <div v-if="searchKeyword !== '' && filteredList.length > 0">
      <div v-for="(filteredItem, idx) in filteredList" :key="'filtered-item-'+idx"
        :style="{borderBottom: brandBorder.sub.border, width: '100%', padding: '16px 0'}"
        @click="clickFilteredItem(filteredItem)">
        <div class="size-16" :style="brandColor.primary">{{ filteredItem.keyword }}</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockSearchOverlay',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "dropdown": {
        "isOpen": false,
        "options": [],
        "selected": {
          "label": "",
          "value": ""
        },
        "mouseOverIndex": -1
      },
      "max_period": 0,
      "filteredList": [],
      "searchKeyword": ""
    }
  },
  created() {
    if (this.$store.getters.service.package.indexOf('booking') > -1) {
      this.$axios.get('public/booking/policy_common').then(res => {
        this.max_period = res.data.max_period;
        for (let i = 0; i < res.data.maximum; i++) {
          this.dropdown.options.push({
            "label": `${i + 1}명`,
            "value": i + 1,
            "is_active": true
          })
        }
      })
    }
  },
  mounted() {

  },
  
  methods: {
    onKeyup(e) {
      this.searchKeyword = e.target.value;
    },
    clickBack() {
      if (this.searchKeyword.trim() !== '') {
        this.$store.commit('addRecentSearch', {
          keyword: this.searchKeyword.trim(),
          date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
        })
        this.$store.commit('setModalData', {searchData: {
            keyword: this.searchKeyword.trim()
          }
        })
        this.searchKeyword = '';
        this.$emit('closePage')
      } else {
        return;
      }
    },
    clickCancel() {
      this.searchKeyword = '';
      this.filteredList = [];
    },
    getFilteredList() {
      let array = [];
      if (this.$store.getters.recentSearch.length > 0 && this.searchKeyword !== '') {
        this.$store.getters.recentSearch.forEach(item => {
          if (item.keyword.indexOf(this.searchKeyword) > -1) {
            array.push(item);
          }
        })
        this.filteredList = array;
      } else {
        this.filteredList = array;
      }
    },
    clickRecentItem(item) {
      console.log('clicked_test2')
      this.$store.commit('addRecentSearch', {
        keyword: item.keyword,
        date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
      this.$store.commit('setModalData', {searchData: {
          keyword: item.keyword
        }
      });
      this.filteredList = [];
      this.$emit('closePage');
    },
    clickFilteredItem(item) {
      this.$store.commit('addRecentSearch', {
        keyword: item.keyword,
        date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
      this.$store.commit('setModalData', {searchData: {
          keyword: item.keyword
        }
      });
      this.filteredList = [];
      this.$emit('closePage');
    },
    deleteRecentItem(item) {
      console.log('clicked')
      this.$store.commit('removeRecentSearchItem', item);
      if (this.$store.getters.recentSearch.length === 0) {
        this.$emit('closePage');
      }
    },
    selectSchedule() {
      this.$root.$emit('page_modal', 'SchedulePeriodBookingModal', {prop: {
        'max_period': this.max_period
      }})
    },
    clickItem(item) {
      this.dropdown.selected = item;
      this.dropdown.isOpen = false;
      this.onSelectSorted(item.value);
    },
    onSelectSorted(val) {
      this.$store.commit('setBookingMinimum', val);
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
    computedSchedule() {
      if (this.$store.getters.selectedResv !== undefined) {
        let start_date = this.dateFormat(this.$store.getters.selectedResv.resv_date, 'date_6');
        let end_date = this.dateFormat(this.$store.getters.selectedResv.resv_end_date, 'date_6');
        return `${start_date} ~ ${end_date}`;
      } else {
        return '날짜 선택';
      }
    }
  },
  watch: {
    searchKeyword() {
      this.getFilteredList();
    }
  }
}
</script>
<style scoped>
.search-container {
    width: calc(100% - 46px);
    height: 44px;
    position: relative;
  }
  .search-box {
    background: #ffffff;
    border-radius: 8px;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    padding: 0 12px 0 34px;
  }
  .icon-search {
    position: absolute;
    top: 11px;
    left: 6px;
    font-size: 24px;
  }
  
  .icon-cancel {
    position: absolute;
    top: 0;
    right: 0;
    padding: 14px 18px 14px 0;
    font-size: 18px;
  }

  .filter-box {
    height: 40px;
    padding: 10px 12px;
  }
  
  .dropdown-ul {
    background-color: white;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
    border: 1px solid #c7c7c7;
    border-radius: 4px;
    overflow-y: auto;
    height: 120px;
    top: 38px;
    padding: 7px 0;
    right: 0;
    width: 116px;
  }
</style>

