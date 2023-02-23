<template>
  <div style="width: 100%; height: 100%">
    <!-- 헤더 -->
    <div :style="headerStyle">
      <div class="header-empty-div"></div>
      <div class="header-title">지역선택</div>
      <div class="header-close"
           @click="$emit('close')">
        <i class="material-icons unselect" :style="brandColor.main">close</i>
      </div>
    </div>

    <!-- 검색 입력창 -->
    <div class="searchInput-wrapper">
      <c-input-text :value.sync="searchValue"
                    :containStyle="{}"
                    @update:value="searchLocal"
                    @onEnter="searchLocal"
                    placeholder="검색할 동 이름을 입력해주세요"></c-input-text>
      <!-- 검색결과 있을 경우 리스트 보여주기 -->
      <div class="search-result-list"  v-if="searchResult.length > 0">
        <div v-for="(item, idx) in searchResult"
             :key="'item'+idx">
          <div class="search-result-list-item"
               @click="onClickListItem(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="cg-g-section-searchLocation-map-container position-relative" ref="map" id="naver-map">

      <!-- 현재위치 아이콘 -->
      <i class="material-icons my-location unselect"
        @click="clickMyLocation"
        :style="myLocationStyle">my_location</i>
      <!-- 위치표시 아이콘 -->
      <div class="location-icon"><i class="material-icons" style="font-size: 36px;">location_on</i></div>

      <!-- 검색 버튼 -->
      <div class="position-absolute full-width" style="z-index:9;bottom:28px;padding:20px">
        <btn :style="[brandColor.white, brandBgColor.brand]" @clicked="clickBtn">이 위치로 검색</btn>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "SearchMap",
    head: {
      script() {
        return [
          {
            type: 'text/javascript',
            src: `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${this.naverClientId}&submodules=geocoder`,
            head: true
          }
        ];
      },
    },

    created() {
      this.setMap();
    },

    data() {
      return {
        searchValue: '',
        searchResult: [],
        map: undefined,
        delay: false,
        to: undefined
      }
    },
    computed: {
      naverClientId() {
        return this.$store.getters.social_key.naver.map.client_id;
      },
      headerStyle() {
        return {
          zIndex: 10,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          height: '48px',
          color: this.brandColor.primary,
          justifyContent: 'space-between'
        };
      },
      myLocationStyle() {
        let deco = this.brandColor.primary;
        return deco;
      }
    },
    methods: {
      searchLocal() {
        if(this.delay) {
          this.delay = false;
          if(this.to)
            clearTimeout(this.to);
        }
        this.to = setTimeout(this.search, 200);
        this.delay = true;
      },
      search() {
        this.$axios.get(`public/service/local?search_text=${this.searchValue}`)
          .then(res => {
            if(res.data.local_list) {
              if(res.data.local_list.error) {
                this.searchResult = [];
              }
              else {
                this.searchResult = res.data.local_list;
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      setMap() {
        // 네이버 지도 불러오기
        if (this.$store.getters.social_key.naver.enable.map === true) {
          setTimeout(() => {
            this.map = new naver.maps.Map('naver-map', {
              mapTypeId: naver.maps.MapTypeId.NORMAL
            });

            this.clickMyLocation();
            this.map.setZoom(10);
            this.map.setOptions({
              zoomControl: false
            })
          }, 1000);
        } else {
          alert('연동 계정 관리-지도 확인이 필요합니다')
        }
      },
      clickMyLocation() {
        navigator.geolocation.getCurrentPosition(position => {
          let currentLatLng = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(currentLatLng);
        }, error => {
          console.error(error);
        }, {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity
        });
      },
      onClickListItem(item) {
        this.moveCenter(item);
        this.searchResult = [];
      },
      moveCenter(item) {
        let current = new naver.maps.LatLng(item.y, item.x);
        this.map.setCenter(current);
      },
      clickBtn() {
        this.$emit('clickBtnCurrent', this.map.getCenter());
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .cg-g-section-searchLocation-map-container
    width 100%
    height calc(100% - 114px)

  .header-title
    text-align center
    font-size 1rem
    color black
  .header-empty-div
  .header-close
    display flex
    align-items center
    justify-content center
    width 44px
    height 100%

  .headerClose i
    font-size 21px

  .searchInput-wrapper
    top 25px
    z-index 9
    box-shadow 0 4px 4px rgba(0, 0, 0, 0.08)
    padding 12px
    width 100%
    background white

  .searchButton
    z-index 999

  .search-result-list
    position absolute
    z-index 999
    background-color white
    width 100%
    color #555555
    left 0
    max-height 300px
    overflow-y auto

  .search-result-list-item
    padding 12px 20px
    font-size 13px
    text-align left

  .search-result-list-item:hover
    background-color #f0f0f0

  .search-result-list-item-address
    margin 2px 0 4px 0
    font-size 12px
    color #787878

  .location-icon
    position absolute
    margin-left auto
    margin-right auto
    top 45%
    right 0
    left 0
    color #F00
    width 36px
    height 36px
    z-index 9

  .my-location
    position absolute
    top 20px
    left 16px
    background #fff
    padding 6px
    border-radius 4px
    z-index 8

</style>