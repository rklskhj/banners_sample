<template>
<div :style="`height: ${mapHeight}`" class="position-relative">
    <div class="position-relative" :style="`height:${mapHeight}`">
      <div id="naver-map"></div>
      <div class="search-box-wrapper p-bg-white">
        <div class="search-box p-border-main p-bg-white radius-8 size-16"
          @click="clickSearch">
          <span v-if="searchData.keyword!==''" class="p-main">{{ searchData.keyword }}</span>
          <span v-else class="p-sub3">{{ placeholder }}</span>
          <i class="material-icons icon-back" @click.stop.prevent="clickBack">keyboard_arrow_left</i>
          <i class="material-icons icon-cancel p-sub" v-if="searchData.keyword!==''"
             @click.stop.prevent="clickCancel">close</i>
        </div>
        <div style="margin-top:12px" class="flex-align">
          <div class="box-filter flex-center radius-6 p-border-main" @click="clickFilter">
            <template v-if="filtered.length>0">
              <div class="p-brand">필터</div>
              <div class="filter-count radius-circle p-white size-10 p-bg-brand">
                {{ filtered.length }}</div>
            </template>
            <template v-else>
              <img src="/static/image/icon/icon_filter.svg">
              <div class="p-sub" style="margin-left:4px">필터</div>
            </template>
          </div>
          <div class="ellipsis p-sub2" style="width:calc(100% - 64px);margin-left:8px">{{ filteredData }}</div>
        </div>
      </div>
      <!-- 내위치 찾기 버튼 -->
      <div class="location-icon radius-circle p-bg-white unselect" :style="`bottom:${locationIconHeight}`" @click="setCurrentPosition">
        <i class="material-icons" :style="locationSearchStyle">{{ current ? 'my_location' : 'location_searching' }}</i>
      </div>
    </div>

    <!-- 해당 목록 -->
    <template>
      <div class="button-all size-12 radius-6 p-bg-brand3 p-white"
        :style="`bottom:${allBtnHeight}`" @click="clickAll">
        <i class="material-icons" style="font-size:17px;margin-right: 4px;vertical-align: bottom">format_list_bulleted</i><span>전체 목록</span>
      </div>
      <div class="action-sheet-container p-bg-white overflow-hidden">
        <div style="padding:16px">

          <!-- 필터, 정렬 -->
          <div class="flex-between full-width">
            <div>{{ currentAddress }}</div>
            <!--<dropdown-sort @onSort="onSort"></dropdown-sort>-->
          </div>

          <!--<div v-for="(item,idx) in list" :key="'card-'+idx">
            <a3-t-card-partner :idx="idx"  :card="item"
                               :style="`border-bottom:${brandBorder.sub.border};padding:16px 0`"></a3-t-card-partner>
          </div>-->
        </div>
      </div>
    </template>
    <div class="action-sheet-container p-bg-white overflow-hidden" style="height:242px" v-if="selectedCard">
      <div style="padding-top:20px">
        <card-map-partner :card="selectedCard"></card-map-partner>
      </div>
    </div>
    
    <div v-if="searchData.keyword && searchData.keyword !== '' && showSearchList"
      class="action-sheet-container p-bg-white overflow-hidden"
      style="height: 242px; overflow-y: auto" :style="pagePadding">
      <div style="padding: 16px 0">
        <div class="flex-between full-width">
          <div>{{ currentAddress }}</div>
        </div>
      </div>
      <h11-t-card-partner v-for="(item, idx) in list" :idx="idx"
        :style="`border-top:${brandBorder.sub.border};padding-top:16px;padding-bottom: 16px`"
        :key="`card-partner-${item.id}-${idx}`"
        :card="item" @clickCard="clickCard(item)"
        :cardProps="cardProps"></h11-t-card-partner>
    </div>

  <block-map-search-keyword v-if="vKeyword" :prop="keywordProp" @closePage="onCloseKeyword" @onKeyword="onKeyword"></block-map-search-keyword>
  </div>
</template>
<script>
import BlockMapSearchKeyword from "@/components/Components/Block/BlockMapSearchKeyword/BlockMapSearchKeyword.vue"
import h11TCardPartner from "@/components/Components/Card/h11/CardPartner.vue"
import CardMapPartner from "@/components/Components/Card/CardMapPartner.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMapSearch',
  components: {
    BlockMapSearchKeyword,
    h11TCardPartner,
    CardMapPartner
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "map": undefined,
      "list": [],
      "sort": "-created_time",
      "filter": "map",
      "height": 0,
      "cluster": undefined,
      "current": false,
      "loading": false,
      "markers": [],
      "vAsList": false,
      "listener": {},
      "position": undefined,
      "vKeyword": false,
      "cardProps": {
        "type": "partner",
        "visible": {
          "cart": false,
          "like": false,
          "name": true,
          "rate": true,
          "tags": true,
          "phone": true,
          "review": true,
          "address": false,
          "distance": false,
          "simple_desc": false
        },
        "imageRates": {
          "ratio": "1:1"
        }
      },
      "searchData": {
        "keyword": ""
      },
      "keywordProp": {
        "keyword": ""
      },
      "placeholder": "검색어를 입력하세요",
      "selectedCard": undefined,
      "currentMarker": undefined,
      "searchKeyword": "",
      "currentAddress": "",
      "showSearchList": false
    }
  },
  created() {
    this.setCurrentPosition();
    this.height = window.innerHeight;
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.height = window.innerHeight;
      })
    })
    this.init();
    window.onpopstate =  () => {
      this.vKeyword = false;
      if (this.$store.getters.popstate[0] === 'map_search') {
        this.$store.commit('removePopstate');
      }
    }
    // window.addEventListener('popstate', this.popState);
    // history.pushState('map_search','');
    // this.$store.commit('setPopstate', 'map_search');
  },
  beforeDestroy() {
      Object.keys(this.listener).forEach(key=>{
        naver.maps.Event.removeListener(this.listener[key]);
      });
    this.vKeyword = false;
  },
  
  methods: {
    setMapCenter(position) {
      this.current = true;
      this.selectedCard = undefined;
      this.showSearchList = false;
      this.list = [];
      this.vAsList = false;
      // this.mapResize(true, false);

      this.map.setCenter(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
      this.setCurrentAddress();
      this.getPartnerList(false);
      this.$store.commit('setCurrentPosition', {lat: position.coords.latitude, lng: position.coords.longitude});

      // 마커 설정
      if(this.currentMarker) {
        this.currentMarker.setMap(null);
      }
      this.currentMarker = new naver.maps.Marker({
        position: {x: position.coords.longitude, y: position.coords.latitude},
        map: this.map,
        icon: {
          content: `<img src="static/image/icon/ic_current_position.svg">`,
          size: new naver.maps.Size(48, 48),
          scaledSize: new naver.maps.Size(48, 48),
        }
      });
    },
    init() {
      this.$store.commit('clearFilter');
      this.$nextTick(()=>{
        this.setMap();
      })
    },
    popState() {
      if(this.$store.getters.popstate.length === 0 && this.vKeyword) {
        this.$router.back();
        this.vKeyword = false;
      }
      else if(this.$store.getters.popstate[0]==='map_search') {
        this.$store.commit('removePopstate');

        if(this.searchData.keyword === '' || this.vKeyword) {
          // this.$router.back();
          this.vKeyword = false;
        } else {
          history.pushState('map_search','');
          this.$store.commit('setPopstate', 'map_search');
          this.clickSearch();
        }
      }
    },
    clickFilter() {
      this.routerOverlay('FilterOverlay');
    },
    onSort(res) {
        this.sort = res;
        this.getPartnerList(true);
      },
    onKeyword(n) {
      this.current = false;
      this.searchData = n.searchData;
      if(this.searchData.keyword!=='') {

        if(this.searchData.item) {
          this.clearMarker();
          this.selectedItem = this.searchData.item;
          this.setMarker(this.selectedItem);
          this.clickMarker(0)();

          this.map.setCenter(new naver.maps.LatLng(this.searchData.item.location.latitude, this.searchData.item.location.longitude));
          this.setCurrentAddress();
          this.map.setZoom(16);
          // this.mapResize(false, true);
          setTimeout(()=>{
            this.setQuery();
          },100);
        } else {
          this.getPartnerList(true);
        }
      } else {
        this.getPartnerList(false);
      }
    },
    onCloseKeyword() {
      history.back();
    },
    clickAll() {
        this.$root.$emit('page_overlay', 'PartnerSearchMapOverlay',
          {
            prop: {
              filter: this.filter,
              sort: this.sort,
              search: this.searchData.keyword,
              address : this.currentAddress,
              location: `${this.map.getCenter().x},${this.map.getCenter().y},${this.getDistanceFromLatLonInKm()}`
            }
          }
        );
      },
    clickBack() {
      if(this.searchData.keyword === '') {
        if (window.history.length > 2) {
          this.$router.back();
        } else {
          this.routerPush('/home');
        }
      } else {
        this.clickSearch();
      }
    },
    setMap() {
        this.map = new naver.maps.Map('naver-map', {
          mapTypeId: naver.maps.MapTypeId.NORMAL
        });
        this.map.setZoom(14);
        this.map.setOptions({
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: false,
          mapTypeControl: false
        });
        ['touchmove','drag'].forEach(key=>{
          this.listener[key] = naver.maps.Event.addListener(this.map, key, () => {
            this.current = false;
            // this.showSearchList = false;
          });
        });
        ['tab','click'].forEach(key=>{
            this.listener[key] = naver.maps.Event.addListener(this.map, key, () => {
              this.selectedCard = undefined;
              this.showSearchList = false;
              this.searchData.keyword = '';
            });
        });
        ['touchend','dragend', 'zoom_changed'].forEach(key=>{
          this.listener[key] = naver.maps.Event.addListener(this.map, key, () => {
            // this.showSearchList = false;
            if(key === 'zoom_changed') {
              if(!this.selectedCard) {
                this.getPartnerList(false);
              }
              this.setCurrentAddress();
            }
            else if(!this.searchData.item) {
              this.getPartnerList(false);
              this.setCurrentAddress();
            }
          });
        });
        this.setMapCenter(this.position);
      },
    clickMarker(idx) {
        return (e)=> {
          this.markers.forEach((marker, i)=>{
            let icon = marker.icon;
            if(i === idx) {
              icon.content = icon.content.replace('36','48').replace(this.brandColor.brand.color, this.brandColor.brand3.color);
              this.map.panTo(new naver.maps.LatLng(marker.position.y, marker.position.x));
              this.selectedCard = marker.card;
              this.showSearchList = false;
              this.vAsList = false;
              // this.mapResize(false, true);
              //this.searchData.keyword = marker.card.name;
            } else {
              icon.content = icon.content.replace('48','36').replace(this.brandColor.brand3.color, this.brandColor.brand.color);
            }
            marker.setIcon(icon);
          });
        }
      },
    setMarker(card) {
        let pos = {x: card.location.longitude, y: card.location.latitude};

        let style = 'text-shadow: -2px 0 1px #fff, 0 2px 1px #fff, 2px 0 1px #fff, 0 -2px 1px #fff;font-weight: 600;font-size: 14px;';
        let content = `<div style="${style};text-align: center"><i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i>`;
        content += `<div style="width:100px">${card.name}</div></div>`;

        // 마커 설정
        let marker = new naver.maps.Marker({
          card: card,
          position: pos,
          map: this.map,
          icon: {
            content: content,
            size: new naver.maps.Size(100, 60),
            scaledSize: new naver.maps.Size(100, 60),
          }
        });
        this.markers.push(marker);
        naver.maps.Event.addListener(marker, 'click', this.clickMarker(this.markers.length-1));
      },
    setCurrentAddress() {
      this.$axios.get(`public/service/geocode?latitude=${this.map.getCenter().y}&longitude=${this.map.getCenter().x}`)
        .then(res => {
          if (res.status === 200) {
            if (res.data.address) {
              this.currentAddress = `${res.data.address.sigungu} ${res.data.address.dong}`;
            }
          }
        });
    },
    setCurrentPosition() {
        // 현재 위치 가져오기
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.position = position;
          }, error => {
            console.error(error);
          }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          });
        }
      },
    clickSearch() {
      this.keywordProp = {
        keyword: this.searchData.keyword,
        location: this.map.getCenter()
      };
      history.pushState('map_search', '');
      this.$store.commit('setPopstate', 'map_search');
      this.vKeyword = true;
    },
    clearMarker() {
      if(this.cluster) {
        this.cluster.markers.forEach(marker=>{
          marker.setMap(null);
        });
        this.cluster.markers = [];
        this.cluster._clearClusters();
        this.cluster._redraw();
        //this.cluster = undefined;
      }

      this.markers.forEach(marker=>{
        marker.setMap(null);
      });
      this.markers = [];
    },
    getPartnerList(resize) {
        if(this.loading) return;
        let location = null;
        /*if(this.filter === 'locate') {
          let current = this.$store.getters.currentPosition;
          // 반경 필터링
          location = `${current.lng},${current.lat},${this.getDistanceFromLatLonInKm()}`;
          //location = `${current.lng},${current.lat}`;
        } else {
          // 반경 필터링
          location = `${this.map.getCenter().x},${this.map.getCenter().y},${this.getDistanceFromLatLonInKm()}`;
          //location = `${this.map.getCenter().x},${this.map.getCenter().y}`;
        }*/

        // 반경 필터링
        if(!resize) {
          location = `${this.map.getCenter().x},${this.map.getCenter().y},${this.getDistanceFromLatLonInKm()}`;
        } else {
          location = `${this.map.getCenter().x},${this.map.getCenter().y}`;
        }
        if(resize && this.searchData.location) {
          location = `${this.searchData.location}`;
        }
        let fields = 'id,name,address,location,tags,review_count,phone,rate,imgs,img';
        this.url = `/user/${this.user.user_id}/mapping/partner?fields=${fields}&search_keyword=${this.searchData.keyword}`;
        this.url += `&location=${location}&ordering=distance,${this.sort}`;
        this.url += '&page_length=100';

        if(this.filtered.length>0) {
          this.url = this.urlAppendFilter(this.filtered, {}, this.url);
        }
        this.loading=true;
        this.$axios.get(this.url).then(res=>{
          this.loading=false;
          this.setQuery();
          // this.selectedCard = undefined;
          this.list = res.data.data;
          if (this.searchData.keyword !== '') {
            this.showSearchList = true;
          }
          this.clearMarker();
          this.list.forEach(item=>{
            this.setMarker(item);
          })
          if(this.list.length>0){
            /*if(this.vAsList || this.selectedCard) {
              // this.mapResize(false, false);
            }*/
            // this.mapResize(!resize, false);
            if(resize) {
              this.vAsList = true;
              this.selectedCard = undefined;
            }
            let minLat = this.list[0].location.latitude - 0.003;
            let minLng = this.list[0].location.longitude - 0.003;
            let maxLat = this.list[0].location.latitude + 0.003;
            let maxLng = this.list[0].location.longitude + 0.003;

            for (let i = 1; i < this.list.length; i++) {
              let lat = this.list[i].location.latitude;
              let lng = this.list[i].location.longitude;
              minLat = (lat < minLat) ? lat : minLat;
              minLng = (lng < minLng) ? lng : minLng;
              maxLat = (lat > maxLat) ? lat : maxLat;
              maxLng = (lng > maxLng) ? lng : maxLng;
            }

            /*if(resize) {
              this.map.setCenter(new naver.maps.LatLng(minLat, minLng));
              this.map.setZoom(16);
              this.setCurrentAddress();
            }*/
            if(resize) {
              // 가져온 항목들의 중심점으로 이동
              if (this.list.length === 1) {
                this.map.setCenter(new naver.maps.LatLng(this.list[0].location.latitude, this.list[0].location.longitude));
                this.map.setZoom(16);
              } else {
                let bounds = new naver.maps.LatLngBounds(
                  new naver.maps.LatLng(minLat, minLng),
                  new naver.maps.LatLng(maxLat, maxLng)
                )
                this.map.fitBounds(bounds);
              }
              this.setCurrentAddress();
            }
            this.setCluster();
          }
        }).catch(()=>{
          this.loading=false;
        });
      },
    setCluster() {
      // 클러스터 설정
      let bg = this.brandBgColor.brand.backgroundColor.replace(',1)', ',0.8)');

      let markers = [10, 100, 1000].map(value => {
        let size = 50;
        switch (value) {
          case 10:
            size = 50;
            break;
          case 100:
            size = 70;
            break;
          case 1000:
            size = 100;
            break;
        }
        let style = `cursor:pointer;width:${size}px;height:${size}px;line-height:${size}px;font-size:18px;` +
          "border-radius:50%;color:white;text-align:center;";
        let content = `<div style="${style}background-color:${bg}"></div>`;
        return {
          index: value,
          marker: {
            content: content,
            size: N.Size(size, size),
            anchor: N.Point(size/2, size/2)
          }
        }
      });


      this.cluster = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 17,
        map: this.map,
        markers: this.markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: markers.map(marker => { return marker.marker }),
        indexGenerator: markers.map(marker => { return marker.index }),
        stylingFunction: function(clusterMarker, count) {
          clusterMarker.getElement().firstElementChild.innerText = count;
        }
      });
      this.cluster.setMarkers(this.markers);
    },
    clickCancel() {
        this.searchData.keyword = '';
        this.list = [];
        this.vAsList = false;
        this.selectedCard = undefined;
        this.showSearchList = false;
        // this.mapResize(true, false);
        this.clearMarker();
        setTimeout(()=>{
          this.setQuery();
          this.getPartnerList(false);
        },100);
      },
    mapResize(isFull, isCard) {
        let size = this.map.getSize();
        if(isFull) {
          size.height = window.innerHeight;
        } else if(isCard) {
          size.height = (window.innerHeight - 242);
        } else {
          size.height = parseInt(window.innerHeight * 0.6);
        }
        // this.mapHeight = size.height + 'px';
        this.map.setSize(size);
      },
    deg2rad(deg) {
        return deg * (Math.PI / 180)
      },
    getDistanceFromLatLonInKm() {
        let lat1 = this.map.getBounds().getMin()._lat;
        let lng1 = this.map.getBounds().getMin()._lng;
        let lat2 = this.map.getBounds().getMax()._lat;
        let lng2 = this.map.getBounds().getMax()._lng;
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(lat2-lat1);
        let dLon = this.deg2rad(lng2-lng1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(2);
      },
    setQuery() {
        let query = '';
        let delim = '?';
        let hasSearch = false;

        Object.keys(this.$route.query).forEach(key =>{
          delim = query === '' ? '?' : '&';
          if(key.indexOf('search')>-1) {
            if(this.searchData.keyword !== '') {
              query += `${delim}search=${this.searchData.keyword}`;
            }
            hasSearch = true;
          } else {
            query += `${delim}${key}=${this.$route.query[key]}`;
          }
        });
        if(!hasSearch) {
          delim = query.indexOf('?') === -1 ? '?' : '&';
          if(this.searchData.keyword!=='') {
            query += `${delim}search=${this.searchData.keyword}`;
          }
        }
        if (this.$route.path + query !== this.$route.fullPath) {
          this.$router.replace(this.$route.path + query);
        }
      }
  },
  computed: {
    mapHeight() {
      let height = '100vh';
      if (this.$store.getters.showAddrBar) {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
          if (navigator.userAgent.split('iPhone OS ')[1].substring(0,2) >= 15) {
            height = `${this.height}px`
          } else {
            height = 'calc(100vh - 120px)'
          }
        } else if (this.$store.getters.browserType !== 'pc') {
          if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
            if (navigator.userAgent.split('SamsungBrowser/')[1].substring(0,2) >= 16) {
              height = `${this.height}px`;
            } else {
              height = 'calc(100vh - 50px)'
            }
          } else {
            height = 'calc(100vh - 50px)'
          }
        }
      }
      return height;
    },
    filtered() {
      let filtered = this.cloneItem(this.$store.getters.filtered);
      filtered.forEach((item, idx) => {
        if (item.type.indexOf('number_range') > -1) {
          if(item.value[0] === Number(item.min) && item.value[1] === Number(item.max)) {
            filtered.splice(idx, 1)
          } else if (item.value[0] === '' && item.value[1] === '') {
            filtered.splice(idx, 1)
          }
        }
      })
      return filtered;
    },
    filteredData() {
      let result = '';
      this.filtered.forEach(item=>{
        if (item.type === 'number_range') {
          if (!(item.value[0] === Number(item.min) && item.value[1] === Number(item.max))) {
            if(result !== '') result += '·';
            result += `${this.$options.filters.currencyKor(item.value[0])}~${this.$options.filters.currencyKor(item.value[1])}`;
          }
        } else if(item.selectedValue && item.selectedValue !== '') {
          if(result !== '') result += ' · ';
          result += item.selectedValue;
        }
      });
      return result === '' ? '검색조건을 설정해주세요.' : result;
    },
    locationIconHeight() {
      let deco = '66px';
      if(this.selectedCard || this.showSearchList) {
        deco = '270px';
      }
      return deco;
    },
    allBtnHeight() {
      let deco = '70px';
      if(this.selectedCard || this.showSearchList) {
        deco = '266px';
      }
      return deco;
    },
    locationSearchStyle() {
        return {color: this.current ? this.brandColor.brand.color : '#787878'};
      }
  },
  watch: {
    position(n) {
      this.setMapCenter(n);
    },
    filtered() {
      if(this.map) {
        this.getPartnerList(false);
      }
    },
    showSearchList(n) {
      if (n) {
        let app = document.getElementById('app');
        let lpPage = document.getElementById('lp-page')
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
          if (navigator.userAgent.split('iPhone OS ')[1].substring(0,2) >= 15) {
            app.style.minHeight = 'auto'
            lpPage.style.minHeight = 'calc(100vh - 120px)'
          }
        }
      }
    }
  }
}
</script>
<style scoped>
#naver-map {
    width: 100%;
    height: 100%;
  }
  .location-icon {
    position: absolute;
    left: 16px;
    padding: 8px;
    box-shadow: 0 1px 2px 1px rgba(0,0,0,0.2);
    height: 38px;
  }
  .location-icon i {
    font-size: 22px;
  }
  .search-box-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .search-box {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 16px 0 38px;
    position: relative;
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
    right: 8px;
    top: 8px;
    padding: 8px 4px;
    font-size: 24px;
  }
  .action-sheet-container {
    position: absolute;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.15);
    width: 100%;
    bottom: 0;
    z-index: 100;
  }
  .button-all {
    position: absolute;
    left: calc(50% - 50px);
    padding: 12px 16px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
  .box-filter {
    width: 65px;
    height: 34px;
  }
  .filter-count {
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    margin-left: 4px;
  }
</style>

