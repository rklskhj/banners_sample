<template>
<page-header :full="true" :style="containerBg">
  <template v-slot:full>
    <div>
      <div class="flex-between"
        style="text-align: left; font-weight: normal; padding: 16px 0">
        <div class="search-container">
          <!--<input class="search-box" :style="brandBorder.main"-->
          <!--  type="text" maxlength="30" v-model.lazy="searchKeyword"-->
          <!--  placeholder="검색어를 입력해주세요."/>-->
          <div class="search-box unselect" @click="$root.$emit('page_overlay', 'SearchOverlay');"
            :style="[brandBorder.main, brandBgColor.white, brandColor.main]">{{ searchData.keyword }}</div>
          <i class="material-icons icon-search">search</i>
          <i class="material-icons icon-cancel unselect" @click="clickCancel"
            v-if="searchData.keyword !== ''" :style="brandColor.sub3">cancel</i>
        </div>
        <div class="unselect" @click="moveToPreviousPath" style="padding: 10px 0 10px 16px" :style="brandColor.main">취소</div>
      </div> 
      <div v-if="$store.getters.service.package.indexOf('booking') > -1" class="flex-align"
        style="padding: 0 0 20px; gap: 0 8px">
        <div class="unselect flex-center filter-box p-border-sub radius-8"
          @click="selectSchedule">
          <div class="flex-align p-sub" style="gap: 0 2px">
            <div class="size-13 weight-400">{{ computedSchedule }}</div>
            <i class="material-icons" style="font-size: 18px">keyboard_arrow_down</i>
          </div>
        </div>
        <div class="unselect position-relative flex-center filter-box p-border-sub radius-8" :style="brandBgColor.main"
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
    </div>
  </template>
  
</page-header>
</template>
<script>
import HeaderMixin from "@/components/Components/Mixins/HeaderMixin"

export default {
  name: 'PageHeaderMobile',
  components: {

  },
  mixins: [
    HeaderMixin
  ],
  props: {

  },
  data() {
    return {
      "bgColor": "brandBgColor.main",
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
      "searchData": {
        "keyword": ""
      },
      "searchKeyword": ""
    }
  },
  created() {
    if (this.$route.query.search && this.$route.query.search !== '') {
      this.searchData.keyword = this.$route.query.search;
    }

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
        if (this.$store.getters.bookingMinimum) {
          this.dropdown.selected = this.dropdown.options.find(i => i.value === this.$store.getters.bookingMinimum);
        }
      })
    }
  },
  
  methods: {
    setQuery() {
      let query = '';
      let delim = '?';
      let hasSearch = false;

      Object.keys(this.$route.query).forEach(key =>{
        delim = query === '' ? '?' : '&';
        if(key.indexOf('search')>-1) {
          if(this.searchData.keyword && this.searchData.keyword !== '') {
            query += `${delim}search=${this.searchData.keyword}`;
          }
          hasSearch = true;
        } else {
          query += `${delim}${key}=${this.$route.query[key]}`;
        }
      });
      if(!hasSearch) {
        delim = query.indexOf('?') === -1 ? '?' : '&';
        if(this.searchData.keyword && this.searchData.keyword!=='') {
          query += `${delim}search=${this.searchData.keyword}`;
        } else {
          query += `${delim}search=`;
        }
      }
      this.$router.replace(this.$route.path + query);
    },
    clickCancel() {
      this.searchData.keyword = '';
      this.$root.$emit('page_overlay', 'SearchOverlay');
    },
    moveToPreviousPath() {
      if (this.$store.getters.searchPreviousPath !== '') {
        this.routerPush(this.$store.getters.searchPreviousPath);
      } else {
        this.routerPush('/home');
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
      let deco = {
        color: this.brandColor.main.color
      };
      if (this.dropdown.mouseOverIndex === idx) {
        deco.backgroundColor = this.brandBgColor.sub.backgroundColor
      }
      return deco;
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        height: this.$store.getters.service.package.indexOf('booking') > -1 ? '136px' : '76px'
      }
    },
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
    '$store.getters.modalData'(n) {
      this.searchData = n.searchData;
      if (this.searchData.keyword !== '') {
        setTimeout(() => {
          this.setQuery();
        }, 100);
      } else {
        
      }
    },
    '$store.getters.bookingMinimum'(n) {
      this.dropdown.selected = this.dropdown.options.find(i => i.value === n);
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

