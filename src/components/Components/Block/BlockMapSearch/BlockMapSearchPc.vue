<template>
<div class="position-relative flex" style="width:100vw;height:100%">
    <!-- 목록 -->
    <div class="flex" style="width:432px;box-shadow: 4px 0 10px rgba(0,0,0,0.15);z-index: 1;flex-direction:column;">
      <div style="padding:24px 16px 16px 16px;box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);">
        <div class="position-relative">
          <input class="search-box p-bg-white radius-8 size-16"
            :style="inputBorder"
            type="text" maxlength="30" v-model.lazy="searchKeyword" @keyup="onKeyup" @keyup.enter="onEnter"
            ref="searchBox" @focus="setInputBorder(true)" @blur="setInputBorder(false)"
            placeholder="검색어를 입력하세요"/>
          <i class="search-icon material-icons-outlined">search</i>
          <i class="material-icons unselect icon-cancel p-sub" v-if="searchKeyword!==''" @click="clickCancel">close</i>

          <!-- 최근 검색 -->
          <div class="box-input-result p-bg-white radius-8 p-border-main" v-if="vRecent">
            <div class="p-border-bottom-main" style="padding:12px 16px">최근검색</div>
            <template v-if="$store.getters.recentMapSearch.length > 0">
              <div v-for="(item,idx) in $store.getters.recentMapSearch" :key="'recent-item-'+idx"
                   class="flex-between unselect item-result"
                   style="width:100%;padding:16px"
                   @click.stop.prevent="clickRecentItem(item)">
                <div class="flex-align">
                  <div class="flex-center" style="padding-right:16px">
                    <i class="material-icons">search</i>
                  </div>
                  <div class="size-16 p-sub2">{{ item.keyword }}</div>
                </div>
                <div class="flex-align">
                  <div class="size-12 p-sub2" style="margin-right:8px">{{ dateFormat(item.date, 'date_11') }}</div>
                  <i @click.stop.prevent="$store.commit('removeRecentMapSearch', item.keyword)"
                    class="unselect btn-close material-icons p-sub3">close</i>
                </div>
              </div>
            </template>
            <div v-else class="flex-center size-16 weight-400 p-sub2" style="padding: 12px 16px 20px">최근 검색어가 없습니다.</div>
          </div>

          <!-- 검색어 자동완성 -->
          <div v-if="vResult">
            <div v-for="(item,idx) in resultList" :key="'result-item-'+idx"
                 class="flex-align unselect p-border-bottom-sub" style="width: 100%; padding: 16px 0"
                 @click="clickSearchItem(item)">
              <div class="flex-center" style="padding: 0 16px 0 4px">
                <i class="material-icons-outlined">location_on</i>
              </div>
              <div>
                <div class="size-16 p-sub">{{ item.name }}</div>
                <div class="size-12 p-sub2">{{ item.address }}</div>
              </div>
            </div>
          </div>

          <!-- 필터 -->
          <div style="margin-top:12px" class="flex-align">
            <div class="box-filter flex-center radius-6 unselect p-border-main" @click="clickFilter">
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
      </div>
      <!-- 검색 결과 -->
      <div :style="pagePadding">
        <div class="flex-between" style="border-bottom:1px solid #f5f5f5;padding:16px 0">
          <div class="weight-500 size-16 p-sub">{{ currentAddress }}</div>
          <dropdown-sort :isPc="true" @onSort="onSort"
            model='partner'></dropdown-sort>
        </div>
      </div>
      <list-vertical style="padding-top:8px;flex:1;overflow-y:auto;" v-if="list && list.length > 0">
        <template v-slot:card>
          <div v-for="(item,idx) in list" :key="'card-'+idx" class="card-partner"
              :class="{
                'p-bg-sub': selectedCard && item.id === selectedCard.id
              }" @click="clickCard(item)" :style="cardStyle(item)">
            <h11-t-card-partner-pc :idx="idx"
              :class="{
                'p-border-top-sub': idx > 0
              }"
              :style="cardBorderStyle(item,idx)" :card="item"
              :cardProps="cardProps"></h11-t-card-partner-pc>
          </div>
        </template>
      </list-vertical>
      <div v-if="list && list.length===0" class="empty-view">검색된 파트너가 없습니다</div>
    </div>
    <!-- 파트너 상세 오버레이 -->
    <div v-if="vDetail && selectedCard" class="map-detail-overlay p-bg-white">
      <div class="handle p-bg-white unselect" @click="vDetail=!vDetail">
        <i class="material-icons size-26 p-sub">keyboard_arrow_left</i>
      </div>
      <block-partner-search-map-detail :partner="selectedCard"></block-partner-search-map-detail>
    </div>
    <div class="handle-fold p-bg-white unselect" v-if="!vDetail && selectedCard" @click="vDetail=!vDetail">
      <i class="material-icons size-26 p-sub">keyboard_arrow_right</i>
    </div>
    <div id="naver-map"></div>
    <!-- 내위치 찾기 버튼 -->
    <div class="location-icon p-bg-white radius-10 unselect" @click="setCurrentPosition">
      <i class="material-icons" :style="locationSearchStyle">{{ current ? 'my_location' : 'location_searching' }}</i>
    </div>
  </div>
</template>
<script>
import DropdownSort from "@/components/Components/Common/DropdownSort.vue"
import BlockPartnerSearchMapDetail from "@/components/Components/Block/BlockPartnerSearchMapDetail/BlockPartnerSearchMapDetail.vue"
import h11TCardPartnerPc from "@/components/Components/Card/h11/CardPartnerPc.vue"
import ListMixin from "@/components/Components/Mixins/ListMixin"

export default {
  name: 'BlockMapSearchPc',
  components: {
    DropdownSort,
    BlockPartnerSearchMapDetail,
    h11TCardPartnerPc
  },
  mixins: [
    ListMixin
  ],
  props: {

  },
  data() {
    return {
      "el": undefined,
      "to": undefined,
      "map": undefined,
      "list": undefined,
      "sort": "-created_time",
      "filter": "map",
      "cluster": undefined,
      "current": false,
      "loading": false,
      "markers": [],
      "vDetail": false,
      "vRecent": false,
      "vResult": false,
      "listener": {},
      "position": undefined,
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
      "resultList": [],
      "inputBorder": "",
      "selectedCard": undefined,
      "currentMarker": undefined,
      "searchKeyword": "",
      "currentAddress": "",
      "selectedMarker": undefined,
      "tryNaverMapLoad": 0
    }
  },
  created() {
    this.setCurrentPosition();
  },
  mounted() {
      this.$nextTick(() => {
        this.$el.parentElement.style.height = '100%';
        this.$el.parentElement.parentElement.style.height = '100vh';
        this.$el.parentElement.parentElement.parentElement.style.height = this.$el.parentElement.parentElement.parentElement.style.minHeight;
        this.el = this.$el.parentElement.parentElement.parentElement.style;
        this.toNaverMap();
        this.setInputBorder(false);
      });
    },
  beforeDestroy() {
    this.el.height = '';
    this.el = undefined;
  },
  
  methods: {
    setMapCenter(position) {
      this.current = true;
      this.map.setCenter(new naver.maps.LatLng(position.coords.latitude, position.coords.longitude));
      this.setCurrentAddress();
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
    toNaverMap() {
      setTimeout(() => {
        if (naver.maps === null && this.tryNaverMapLoad !== 10) {
          this.toNaverMap()
          this.tryNaverMapLoad += 1;
        } else {
          this.setMap();
        }
      }, 50)
    },
    onSort(res) {
        this.sort = res;
        this.getPartnerList(false);
      },
    clickFilter() {
        this.routerOverlay('FilterModal');
      },
    clickCard(item) {
        this.selectedCard = item;
        let index = this.markers.findIndex(marker=> { return marker.card.id === item.id });
        this.clickMarker(index)();
        this.vDetail = true;
      },
    search() {
        if (this.searchKeyword === '') {
          this.vResult = false;
        } else {
          let url = `/user/${this.user.user_id}/mapping/partner?fields=id,name,address,location,tags,review_count,phone,rate,imgs,img&search_keyword=${this.searchKeyword}`;
          url += `&ordering=name`;
          this.$axios.get(url, {cancelToken: null}).then(res => {
            this.resultList = res.data.data;
            this.vResult = true;
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
    clickSearchItem(item) {
        this.searchKeyword = item.name;
        this.resultList = [];
        this.vResult = false;
        this.vDetail = false;
        this.getPartnerList(true);
        this.selectedCard = item;
      },
    clickCancel() {
        this.searchKeyword = '';
        this.vDetail = false;
        this.resultList = [];
        this.list = [];
        this.getPartnerList(false);
      },
    clickRecentItem(item) {
        this.searchKeyword = item.keyword;
        this.vRecent = false;
        this.vDetail = false;
        this.getPartnerList(true);
      },
    setInputBorder(isFocus) {
        let key = isFocus ? 'brand' : 'main';
        this.inputBorder = { border: this.brandBorder[key].border };
        if(isFocus && this.searchKeyword === '') {
          this.vRecent = true;
        } else if(!isFocus) {
          setTimeout(()=>{
            this.vRecent = false;
          },300);
        }
      },
    onEnter() {
        this.vRecent = false;
        this.vDetail = false;
        this.vResult = false;
        clearTimeout(this.to);
        this.getPartnerList(true);
      },
    onKeyup(e) {
        this.searchKeyword = e.target.value;
        this.vRecent = this.searchKeyword==='';
        clearTimeout(this.to);
        this.to = setTimeout(() => {
          this.search();
        }, 300);
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
    setMap() {
        this.map = new naver.maps.Map('naver-map', {
          mapTypeId: naver.maps.MapTypeId.NORMAL
        });
        this.map.setZoom(14);
        this.map.setOptions({
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
          },
          mapTypeControl: false
        });
        ['touch','drag'].forEach(key => {
          this.listener[key] = naver.maps.Event.addListener(this.map, key, () => {
            this.current = false;
          });
        });
        ['touchend','dragend','zoom_changed'].forEach(key=>{
          this.listener[key] = naver.maps.Event.addListener(this.map, key, () => {
            if (this.$store.getters.social_key.naver.enable.map && this.$store.getters.social_key.naver.map.client_id !== '') {
              this.getPartnerList(false);
            } else {
              this.list = [];
            }
          });
        });
        this.setMapCenter(this.position);
        if (this.$store.getters.social_key.naver.enable.map && this.$store.getters.social_key.naver.map.client_id !== '') {
          this.getPartnerList(false);
        } else {
          this.list = [];
        }
      },
    setCurrentPosition() {
        // 현재 위치 가져오기
        if (navigator.geolocation) {
          let options = {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          };
          if (this.isIE) {
            options.maximumAge = 50000;
          }
          navigator.geolocation.getCurrentPosition(position => {
            this.position = position;
          }, error => {
            console.error(error);
          }, options);
        }
      },
    setQuery() {
        let query = '';
        let delim = '?';
        let hasSearch = false;

        Object.keys(this.$route.query).forEach(key =>{
          delim = query === '' ? '?' : '&';
          if(key.indexOf('search')>-1) {
            if(this.searchKeyword !== '') {
              query += `${delim}search=${this.searchKeyword}`;
            }
            hasSearch = true;
          } else {
            query += `${delim}${key}=${this.$route.query[key]}`;
          }
        });
        if(!hasSearch) {
          delim = query.indexOf('?') === -1 ? '?' : '&';
          if(this.searchKeyword!=='') {
            query += `${delim}search=${this.searchKeyword}`;
          }
        }
        this.$router.replace(this.$route.path + query);
      },
    clickMarker(idx) {
        return (e)=> {
          if(this.selectedMarker) {
            this.setLeaveMarker(this.selectedMarker);
          }
          let marker = this.markers[idx];
          let icon = marker.icon;
          let card = marker.card;
          icon.content = `<div style="width:100%;text-align: center"><div class="box-marker-title ellipsis size-14"` +
            `style="border:${this.brandBorder.brand.border};color:white;background-color:${this.brandBgColor.brand.backgroundColor}">${card.name}</div>`;
          icon.content += `<i class="material-icons" style="font-size:48px;color: ${this.brandColor.brand3.color}">location_on</i></div>`;

          this.map.panTo(new naver.maps.LatLng(marker.position.y, marker.position.x));
          this.selectedCard = marker.card;
          this.selectedMarker = marker;
          this.vDetail = true;
          marker.setIcon(icon);
        }
      },
    hoverMarker(idx) {
        return ()=> {
          let marker = this.markers[idx];
          if(this.selectedCard === undefined || this.selectedCard.id !== marker.card.id){
            let card = marker.card;
            let icon = marker.icon;
            icon.content = `<div style="width:100%;text-align: center"><div class="box-marker-title ellipsis size-14"`+
                            `style="border:${this.brandBorder.brand.border};color:${this.brandColor.brand.color}">${card.name}</div>`;
            icon.content += `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i></div>`;
            marker.setIcon(icon);
          }
        }
      },
    leaveMarker(idx) {
        return ()=> {
          let marker = this.markers[idx];
          if(!this.selectedCard || this.selectedCard.id !== marker.card.id) {
            this.setLeaveMarker(this.markers[idx]);
          }
        }
      },
    setLeaveMarker(marker) {
        let card = marker.card;
        let icon = marker.icon;
        icon.content = `<div style="width:100%;text-align: center"><div class="box-marker-title ellipsis size-14" style="border:1px solid #4f4f4f">${card.name}</div>`;
        icon.content += `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i></div>`;
        marker.setIcon(icon);
      },
    getPartnerList(resize) {
        if(this.loading) return;
        let location = null;
        let ordering = '';
        // 반경 필터링
        if(!resize) {
          location = `${this.map.getCenter().x},${this.map.getCenter().y},${this.getDistanceFromLatLonInKm()}`;
          ordering = this.sort;
        } else {
          location = `${this.map.getCenter().x},${this.map.getCenter().y}`;
          ordering = `distance,${this.sort}`;
        }
        let fields = 'id,name,address,location,tags,review_count,phone,rate,imgs,img,simple_desc';
        this.url = `/user/${this.user.user_id}/mapping/partner?fields=${fields}&search_keyword=${this.searchKeyword}`;
        this.url += `&location=${location}&ordering=${ordering}`;
        this.url += '&page_length=100';
        if(this.filtered.length>0) {
          let filtered = this.cloneItem(this.filtered);
          filtered.forEach(filter=>{
            if(['price__price', 'category'].indexOf(filter.keyword)>-1) {
              filter.keyword = `products__${filter.keyword}`;
              filter.set.forEach(item=>{
                item.keyword = `products__${item.keyword}`;
              });
            }
          });
          this.url = this.urlAppendFilter(filtered, {}, this.url);
        }
        this.loading=true;
        this.$axios.get(this.url).then(res=>{
          this.loading=false;
          this.setQuery();
          this.clearMarker();
          this.list = res.data.data;
          this.list.forEach(item=>{
            this.setMarker(item);
          })
          if(this.list.length>0){
            if(resize) {
              this.selectedCard = undefined;
            }
            let minLat = this.list[0].location.latitude;
            let minLng = this.list[0].location.longitude;
            let maxLat = this.list[0].location.latitude;
            let maxLng = this.list[0].location.longitude;

            for (let i = 1; i < this.list.length; i++) {
              let lat = this.list[i].location.latitude;
              let lng = this.list[i].location.longitude;
              minLat = (lat < minLat) ? lat : minLat - 0.00006;
              minLng = (lng < minLng) ? lng : minLng - 0.00006;
              maxLat = (lat > maxLat) ? lat : maxLat + 0.00006;
              maxLng = (lng > maxLng) ? lng : maxLng + 0.00006;
            }

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
            }
            this.setCurrentAddress();
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


      if(this.cluster === undefined) {
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
      } else {
        this.$nextTick(() => {
          this.cluster.setMarkers(this.markers);
          this.cluster._redraw();
        })
      }
    },
    setMarker(card) {
        let pos = {x: card.location.longitude, y: card.location.latitude};

        let content = `<div style="width:100%;text-align: center"><div class="box-marker-title ellipsis size-14" style="border:1px solid #4f4f4f">${card.name}</div>`;
        content += `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i></div>`;

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
        naver.maps.Event.addListener(marker, 'mouseover', this.hoverMarker(this.markers.length-1));
        naver.maps.Event.addListener(marker, 'mouseout', this.leaveMarker(this.markers.length-1));
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
    clearMarker() {
        this.selectedCard = undefined;
        for(let i=0; i< this.markers.length; i++) {
          let marker = this.markers[i];
          marker.setMap(null);
        }
        this.markers = [];
      },
    deg2rad(deg) {
        return deg * (Math.PI / 180)
      },
    cardStyle(item) {
        let deco = {};
        Object.assign(deco, this.pagePadding);
        return deco;
      },
    cardBorderStyle(item, idx) {
        let deco = {
          paddingTop: '16px',
          paddingBottom: '16px'
        }
        return deco;
      }
  },
  computed: {
    locationSearchStyle() {
        return {color: this.current ? this.brandColor.brand.color : '#787878'};
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
      }
  },
  watch: {
    position(n) {
      this.setMapCenter(n);
      if (this.$store.getters.social_key.naver.enable.map && this.$store.getters.social_key.naver.map.client_id !== '') {
        this.getPartnerList(false);
      } else {
        this.list = [];
      }
    },
    filtered() {
        this.getPartnerList(false);
      }
  }
}
</script>
<style scoped>
input[type=text]::-ms-clear {
  display:none;
}
#naver-map {
    width: calc(100% - 432px);
    height: 100%;
    outline: none;
  }

  .location-icon {
    position: absolute;
    top: 256px;
    right: 8px;
    padding: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    height: 38px;
  }

  .location-icon i {
    font-size: 22px;
  }

  .map-detail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 423px;
    height: 100%;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.15);
    z-index: 1;
  }
  .map-detail-overlay {
    left: 432px;
  }
  .handle, .handle-fold {
    z-index: 100;
    top: calc(50% - 45px);
    position: absolute;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    box-shadow: 4px 0 4px rgba(0,0,0,0.25);
    height: 90px;
    line-height: 101px;
  }
  .handle {
    right: -24px;
  }
  .handle-fold {
    left: 432px;
  }
  .search-box {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 12px 0 50px;
  }
  .search-icon {
    position: absolute;
    top: 16px;
    left: 16px;
  }
  .box-input-result {
    position: absolute;
    width: 100%;
    max-height: 302px;
    overflow-y: auto;
    z-index: 100;
    left: 0;
    top: 56px;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  .btn-close {
    padding: 2px;
    font-size: 18px;
  }
  .item-result:hover {
    background-color: #F8F8F8;
  }
  .icon-cancel {
    position: absolute;
    right: 4px;
    top: 8px;
    padding: 8px 4px;
    font-size: 24px;
  }
  .card-partner:hover {
    background-color: #F8F8F8 !important;
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
<style>
.box-marker-title {
    background: white;
    padding: 4px 8px;
    width: 100px;
    word-break: break-all;
    text-align: center;
    border-radius: 6px;
  }
</style>
