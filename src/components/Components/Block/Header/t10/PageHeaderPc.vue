<template>
<div class="page-header-relative flex-justify full-width"
  :style="containerBg">
  <div style="padding:24px 0">
    <div class="flex-align position-relative" :style="pcMaxWidth">
      <div class="col-3">
        <block-header-logo v-bind="headerLogo"></block-header-logo>
      </div>
      <div class="col-6 flex-center">
        <block-menuset v-bind="menusetList[0]"></block-menuset>
      </div>
      <div class="col-3 flex-end">
        <block-header-auth-text style="margin-right:24px"></block-header-auth-text>
        <block-menuset v-bind="menusetList[1]"
          :key="'menu-'+menusetList[1].index"></block-menuset>
      </div>
    </div>
    <div class="flex-between" :style="pcMaxWidth" style="margin-top: 32px">
      <div class="search-container position-relative" v-click-outside="onFocusout">
        <input class="search-box"
          :style="[brandBorder.main, {backgroundColor: isSearchbarHover ? brandBgColor.sub2.backgroundColor : '#fff'}]"
          @focus="onFocus" @mouseover="isSearchbarHover = true"
          @mouseleave="isSearchbarHover = false"
          type="text" maxlength="30" v-model.lazy="searchKeyword" @keyup="onKeyup"
          @keyup.enter="search" placeholder="검색어를 입력해주세요." />
        <i class="material-icons icon-search">search</i>
        <i class="material-icons icon-cancel unselect" @click="clickCancel"
          v-if="searchKeyword !== ''" :style="brandColor.sub3">cancel</i>
          
        <div v-if="$store.getters.recentSearch.length > 0 && searchKeyword === '' && isSearchbarActive"
          class="position-absolute" :style="[brandBorder.main, brandBgColor.white]"
          style="width: 100%; top: 64px; z-index: 10; border-radius: 8px; overflow: hidden">
          <div v-for="(item, idx) in $store.getters.recentSearch" :key="'recent-item'+idx"
            class="flex-align" style="width: 100%; padding: 10px 20px"
            @mouseover="hoveringIdx = idx" @mouseleave="hoveringIdx = undefined"
            :style="recentSearchBgStyle(idx)">
            <div class="flex-between unselect" style="width: calc(100% - 24px)"
              @click="clickRecentItem(item)">
              <div class="flex-align">
                <div class="flex-center" style="padding: 0 12px 0 0">
                  <i class="material-icons">access_time</i>
                </div>
                <div class="size-16" :style="brandColor.main">{{ item.keyword }}</div>
              </div>
              <div class="size-12" :style="brandColor.sub2">{{ dateFormat(item.date, 'date_11') }}</div>
            </div>
            <div class="flex-align">
              <i class="material-icons unselect" @click="deleteRecentItem(item)"
                style="font-size: 18px; padding: 6px 0px 6px 6px" :style="brandColor.sub3">close</i>
            </div>
          </div>
        </div>
        <div v-if="searchKeyword !== '' && filteredList.length > 0 && isSearchbarActive"
          class="position-absolute" :style="[brandBorder.main, brandBgColor.white]"
          style="width: 100%; top: 64px; z-index: 10; border-radius: 8px; padding: 8px 0">
          <div v-for="(filteredItem, idx) in filteredList" :key="'filtered-item-'+idx"
            :style="{width: '100%', padding: '8px 16px'}" class="filtered-item"
            @click="clickFilteredItem(filteredItem)">
            <div class="size-16" :style="brandColor.primary">{{ filteredItem.keyword }}</div>
          </div>
        </div>
      </div>
      <div class="flex-align">
        <template v-for="(menu, idx) in buttonMenu">
          <block-button-menu v-bind="menu" :key="'menu-'+idx"></block-button-menu>
        </template>
      </div>
    </div>
    <div v-if="$store.getters.service.package.indexOf('booking') > -1" class="flex-align"
      style="margin-top: 24px; gap: 0 8px">
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
  </div>
</div>
</template>
<script>
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue"
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue"
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue"
import BlockHamburger from "@/components/LaunchPack_Common/Header/Blocks/BlockHamburger.vue"
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue"
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'PageHeaderPc',
  components: {
    BlockMenuset,
    BlockHeaderLogo,
    BlockButtonMenu,
    BlockHamburger,
    BlockHeaderAuthText
  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
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
      "showMenu": false,
      "buttonMenu": [
        {
          "list": [
            {
              "icon": "shopping_cart",
              "link": "cart",
              "visible": false,
              "img_type": "icon",
              "linkType": "link",
              "useOutline": true
            },
            {
              "icon": "favorite_border",
              "link": "like",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            },
            {
              "icon": "person_outline",
              "link": "mypage",
              "visible": true,
              "img_type": "icon",
              "linkType": "link"
            }
          ],
          "index": 1,
          "visible": true,
          "buttonStyle": {
            "color": "brandColor.main"
          }
        }
      ],
      "headerLogo": {
        "link": "home",
        "type": "header_pc",
        "visible": true,
        "imgStyle": {
          "height": "32px",
          "maxWidth": "400px"
        },
        "linkType": "link",
        "containStyle": {
          "height": "24px"
        }
      },
      "max_period": 0,
      "searchData": {
        "keyword": ""
      },
      "hoveringIdx": undefined,
      "menusetList": [
        {
          "id": 1,
          "key": "header",
          "list": [],
          "index": 1,
          "depth2": {
            "width": "100%",
            "colorSet": {
              "sub": "brandColor.brand",
              "main": "brandColor.main",
              "backgroundColor": "brandBgColor.sub"
            },
            "maxLength": 10,
            "limitIndex": 10
          },
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 10,
          "hoverDepth": true,
          "limitIndex": 10,
          "selectState": true,
          "visibleLimit": 10,
          "menuItemStyle": {
            "padding": "0 20px",
            "fontSize": "16px",
            "fontWeight": "500"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        },
        {
          "key": "header_top_right1",
          "list": [],
          "index": 2,
          "moreBtn": false,
          "visible": true,
          "colorSet": {
            "sub": "brandColor.brand",
            "main": "brandColor.main",
            "indicator": "brandBgColor.brand"
          },
          "maxLength": 4,
          "limitIndex": 4,
          "selectState": false,
          "visibleLimit": 4,
          "menuItemStyle": {
            "padding": "12px 12px",
            "fontSize": "12px",
            "fontWeight": "400"
          },
          "containerStyle": {
            "fontSize": "15px"
          }
        }
      ],
      "searchValue": "",
      "filteredList": [],
      "searchKeyword": "",
      "isSearchbarHover": false,
      "isSearchbarActive": false
    }
  },
  created() {
    this.$emit('headerChange',true);
    this.getMenusetInit();
    if (this.$route.query.search && this.$route.query.search !== '') {
      this.searchKeyword = this.$route.query.search;
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
          this.dropdown.selected = this.dropdown.options.filter(i => i.value === this.$store.getters.bookingMinimum)[0]
        }
      })
      
    }
    let pack = this.$store.getters.service.package;
    this.buttonMenu.forEach(menu => {
      menu.list.forEach(item => {
        if (item.icon === 'shopping_cart') {
        item.visible = pack.some(i => ['mart','delivery'].indexOf(i) > -1);
      }
      });
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$store.getters.service.package.indexOf('booking') > -1) {
        let header = document.getElementsByClassName('page-header-relative')[0]
        header.style.height = '235px';
      }
    })
  },
  updated() {

  },
  
  methods: {
    async getMenusetInit() {
      let index = 0;
      for(let item of this.menusetList) {
        item.index = index++;
        await this.getMenuset(item);
      }
    },
    async getMenuset(item) {
      // style 수정
      item.colorSet.sub = this.brandColor.primary.color;
      item.colorSet.indicator = this.brandBgColor.primary.backgroundColor;
      if(this.isLogin) {
        item.key = item.key.replace('guest', 'member');
      } else {
        item.key = item.key.replace('member', 'guest');
      }
      let res = await this.$axios.get(`public/ui/menuset/style/${item.key}?activated=true`, {
        cancelToken: null
      });
      let res_menu = res.data[0].menu;
      let list = [];
      res_menu.forEach(async menu => {
        if(menu.is_category) {
          list = list.concat(this.getCategory());
        }
        else if(menu.is_board_category) {
          let board_categories = await this.getBoardCategory();
          list = list.concat(board_categories);
        }
        else {
          list.push(menu);
        }
        
        if(menu.children && menu.children.length>0) {
          let child_list = [];
          for(let child of menu.children) {
            if(child.is_category) {
              child_list = child_list.concat(this.getCategory());
            }
            else if(child.is_board_category) {
              let board_categories = await this.getBoardCategory();
              child_list = child_list.concat(board_categories);
            }
            else {
              child_list.push(child);
            }
          }
          console.log('child_list1', child_list)
          menu.children = child_list;
        }
      });
      
      item.list = list.slice(0, item.maxLength);
    },
    getCategory() {
      return this.$store.getters.category.map(cat => {
        return {
          link: `product?gnb=${cat.id}`,
          linkType: 'link',
          name: cat.name,
          id: cat.id,
          icon: cat.img_before
        }
      });
    },
    async getBoardCategory() {
      let boardRes = await this.$axios.get('public/board/category');
      return boardRes.data.map(item=>{
        return {
          link: `board?category=${item.id}`,
          linkType: 'link',
          name: item.name,
          id: item.id,
          icon: item.img_before
        }
      })
    },
    currentCategory(id) {
      if (this.$route.path.indexOf('category')>-1) {
        let tab = "";
        if (this.$route.query.tab===undefined || this.$route.query.tab==="") tab = "";
        else tab = parseInt(this.$route.query.tab);
        return tab===id;
      }
      else return false;
    },
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
    closeMenu() {
      this.showMenu = false;
    },
    onKeyup(e) {
      this.searchKeyword = e.target.value;
    },
    onFocus() {
      this.isSearchbarActive = true;
    },
    onFocusout() {
      this.isSearchbarActive = false;
      this.hoveringIdx = undefined
    },
    clickCancel() {
      this.searchKeyword = '';
      this.$router.replace(`/search?tab_id=0`);
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
    clickFilteredItem(item) {
      this.$store.commit('addRecentSearch', {
        keyword: item.keyword,
        date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
      this.$store.commit('setModalData', {searchData: {
          keyword: item.keyword
        }
      });
      this.searchKeyword = item.keyword;
      this.filteredList = [];
    },
    search() {
      if (this.searchKeyword.trim() !== '') {
        this.$store.commit('addRecentSearch', {
          keyword: this.searchKeyword.trim(),
          date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
        })
        this.$store.commit('setModalData', {searchData: {
            keyword: this.searchKeyword.trim()
          }
        })
      } else {
        return;
      }
    },
    clickRecentItem(item) {
      this.$store.commit('addRecentSearch', {
        keyword: item.keyword,
        date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
      this.$store.commit('setModalData', {searchData: {
          keyword: item.keyword
        }
      });
      this.searchKeyword = item.keyword;
      this.filteredList = [];
    },
    deleteRecentItem(item) {
      this.$store.commit('removeRecentSearchItem', item);
    },
    recentSearchBgStyle(idx) {
      let deco = {
        backgroundColor: this.brandBgColor.white.backgroundColor
      }
      if (idx === this.hoveringIdx) {
        deco.backgroundColor = this.brandBgColor.sub2.backgroundColor;
      }
      return deco;
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
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        borderBottom: this.brandBorder.main.border
      }
    },
    categoryList() {
      return this.$store.getters.category;
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
    searchKeyword() {
      this.getFilteredList();
    },
    '$store.getters.modalData'(n) {
      this.searchData = n.searchData;
      this.isSearchbarActive = false;
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
input[type=text]::-ms-clear {
  display:none;
}

.page-header-relative {
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 100;*/
  height: 171px;
}

  .search-container {
    width: 100%;
    margin-right: 92px;
    height: 48px;
    position: relative;
  }
  
  .search-box {
    background: #ffffff;
    border-radius: 8px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: rgba(34, 34, 34, 1);
    font-size: 16px;
    padding: 0 12px 0 44px;
  }
  .icon-search {
    position: absolute;
    top: 0;
    left: 0;
    padding: 13px 8px 11px 16px;
  }
  
  .icon-cancel {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px 18px 15px 0;
    font-size: 18px;
  }
  
  .filtered-item:hover {
    background-color: rgba(248, 248, 248, 1);
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
    z-index: 100;
  }
</style>

