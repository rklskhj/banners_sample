<template>
<div class="block-container p-bg-white">
    <div class="search-container"
         :style="{marginLeft: pagePadding.paddingLeft, marginRight: pagePadding.paddingRight }">
      <input class="search-box p-bg-white radius-8 size-16 p-border-main"
        :class="{'search-box-pc': isPc}"
        type="text" maxlength="30" v-model.lazy="searchKeyword" @keyup="onKeyup"
        @keyup.enter="keyupEnter" ref="searchBox" autocapitalize="none"
        placeholder="검색어를 입력하세요"/>
      <i class="material-icons icon-back" v-if="!isPc" @click="$emit('closePage')">keyboard_arrow_left</i>
      <i class="material-icons icon-cancel p-sub3" v-if="searchKeyword!==''" @click="clickCancel">cancel</i>
    </div>
    <div class="flex-align" :style="pagePadding" style="padding-top:16px;padding-bottom:16px" v-if="!result">
      <div class="size-14 p-main" style="margin-right:16px">최근검색</div>
    </div>
    <div v-if="!result" class="p-border-bottom-main" style="width: 100%"></div>
    <!-- result -->
    <div :style="pagePadding" style="height:calc(100vh - 140px);overflow-y:auto;padding-bottom:40px">
      <!-- search result -->
      <div v-if="result">
        <div v-for="(item,idx) in resultList" :key="'result-item-'+idx"
             class="flex-align unselect p-border-bottom-sub" style="width: 100%; padding: 16px 0"
             @click="clickCard(item)">
          <div class="flex-center" style="padding: 0 16px 0 4px">
            <i class="material-icons-outlined">location_on</i>
          </div>
          <div>
            <div class="size-16 p-sub">{{ item.name }}</div>
            <div class="size-12 p-sub2">{{ item.address }}</div>
          </div>
        </div>
        <div v-if="resultList && resultList.length===0" class="empty-result size-12 p-sub2">검색결과가 없습니다</div>
      </div>
      <div v-else-if="check === 'recent'">
        <div v-for="(item,idx) in $store.getters.recentMapSearch" :key="'recent-item-'+idx"
             class="flex-between unselect p-border-bottom-sub"
             style="width: 100%; padding: 16px 0"
             @click="clickRecentItem(item)">
          <div class="flex-align">
            <div class="flex-center" style="padding: 0 16px 0 4px">
              <i class="material-icons">search</i>
            </div>
            <div class="size-16 p-sub2">{{ item.keyword }}</div>
          </div>
          <div class="flex-align">
            <div class="size-12 p-sub2" style="margin-right:8px">
              {{ dateFormat(item.date, 'date_11') }}
            </div>
            <i @click.stop.prevent="$store.commit('removeRecentMapSearch', item.keyword)"
              class="unselect material-icons p-sub3"
              style="padding: 2px; font-size: 18px">close</i>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMapSearchKeyword',
  components: {

  },
  mixins: [
    ListMixin
  ],
  props: {
    isPc: {
      type: Boolean,
      default: false,
    },
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "to": undefined,
      "list": [],
      "check": "recent",
      "result": false,
      "resultList": [],
      "searchKeyword": ""
    }
  },
  created() {
      if (this.prop.keyword) {
        this.searchKeyword = this.prop.keyword;
        this.search();
      }
    },
  mounted() {
      this.$nextTick(()=>{
        this.$refs.searchBox.focus();
      })
    },
  
  methods: {
    clickBack() {
        this.$router.back();
      },
    keyupEnter() {
        let searchData = {
          searchData: {
            keyword: this.searchKeyword
          },
          cancel: false
        };
        setTimeout(() => {
          if (this.resultList.length >= 1) {
            this.$emit('onKeyword', searchData);
            this.$emit('closePage');
          }
        }, 500)
      },
    clickCancel() {
        this.searchKeyword = '';
        this.resultList = [];
        this.result = false;
      },
    onCheck(value) {
        this.check = value;
        this.result = false;
      },
    onKeyup(e) {
        this.searchKeyword = e.target.value;
      },
    search() {
        if (this.searchKeyword === '') {
          if(!this.isPc) {
            this.clickCancel();
          } else {
            this.result = false;
          }
        } else {
          let url = `/user/${this.user.user_id}/mapping/partner?fields=id,name,address,location,tags,reviews_count,phone,rate,imgs,img&search_keyword=${this.searchKeyword}`;
          url += `&location=${this.prop.location.x},${this.prop.location.y}&ordering=distance`;
          this.$axios.get(url, {cancelToken: null}).then(res => {
            this.resultList = res.data.data;
            this.result = true;
            // 최근 검색어에 저장
            if (this.resultList.length > 0) {
              this.$store.commit('addRecentMapSearch', {
                keyword: this.searchKeyword,
                location: this.resultList[0].location,
                date: this.dayjs().format('YYYY-MM-DD hh:mm:ss')
              });
            }
          });
        }
      },
    clickRecentItem(item) {
        let searchData = {
          searchData: {
            keyword: item.keyword
          }
        };
        this.$emit('onKeyword', searchData);
        this.$emit('closePage');
      },
    clickCard(item) {
        let searchData = {
          searchData: {
            item: item,
            keyword: item.name,
            location: `${item.location.latitude},${item.location.longitude}`
          }
        };
        this.$emit('onKeyword', searchData);
        this.$emit('closePage');
      }
  },
  computed: {
    
  },
  watch: {
    searchKeyword() {
        clearTimeout(this.to);
        this.to = setTimeout(() => {
          this.search();
        }, 300);
      }
  }
}
</script>
<style scoped>
.block-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }
  .search-container {
    margin-top: 16px;
    position: relative;
  }

  .search-box, .search-box-pc {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 12px 0 38px;
  }

  .search-box-pc {
    padding: 0 12px;
  }

  .icon-back {
    position: absolute;
    left: 0;
    top: 5px;
    padding: 8px 2px 8px 4px;
    font-size: 30px;
  }

  .icon-cancel {
    position: absolute;
    right: 4px;
    top: 8px;
    padding: 8px 4px;
    font-size: 24px;
  }
  .empty-result {
    text-align: center;
    margin-top: 40px;
  }
</style>

