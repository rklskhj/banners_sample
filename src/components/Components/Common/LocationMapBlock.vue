<template>
<div class="full-width">
  <div id="naver-map" :style="mapStyles" @click="showOverlay"></div>
</div>
</template>
<script>

export default {
  name: 'LocationMapBlock',
  components: {

  },
  mixins: [

  ],
  props: {
    address: {
      type: String,
      required: false,
    },
    latitude: {
      type: Number,
      required: true,
    },
    mapStyle: {
      type: Object,
      required: false,
    },
    longitude: {
      type: Number,
      required: true,
    },

  },
  data() {
    return {
      "map": undefined,
      "markers": []
    }
  },
  mounted() {
    setTimeout(()=> {
      this.setMap();
    }, 1000);
  },
  
  methods: {
    setMap() {
      this.map = new naver.maps.Map('naver-map', {mapTypeId: naver.maps.MapTypeId.NORMAL});
      this.map.setZoom(15);
      let mapOptions = {
        draggable: false,
        pinchZoom: false,
        scrollWheel: false,
        keyboardShortcuts: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
        disableTwoFingerTapZoom: true,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false
      }
      if (this.$store.getters.device === 'pc') {
        mapOptions.draggable = true;
        mapOptions.pinchZoom = true;
        mapOptions.scrollWheel = true;
      }
      this.map.setOptions(mapOptions);
      this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
      let marker = new naver.maps.Marker({
        map: this.map,
        position: new naver.maps.LatLng(this.latitude, this.longitude),
        icon: {
          content: `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i>`,
          size: new naver.maps.Size(36, 18),
        }
      });
      this.markers.push(marker);
    },
    showOverlay() {
      if (this.$store.getters.device === 'pc') {
        return;
      } else {
        this.$root.$emit('page_overlay', 'LocationMapOverlay', {prop: {
          address: this.address,
          latitude: this.latitude,
          longitude: this.longitude
        }})
      }
    }
  },
  computed: {
    mapStyles() {
      let stylObj = {
        outline: 'none',
        width: '100%',
        height: '130px'
      }

      if (this.mapStyle) {
        return Object.assign(stylObj, this.mapStyle)
      }
      else return stylObj;
    }
  },
  watch: {
    address() {
      if(this.map) {
        this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
        // 기존 마커 삭제 후 새로운 위치에 마커 생성
        this.markers.forEach(i => i.setMap(null));
        let marker = new naver.maps.Marker({
          map: this.map,
          position: new naver.maps.LatLng(this.latitude, this.longitude),
          icon: {
            content: `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i>`,
            size: new naver.maps.Size(36, 18),
          }
        });
        this.markers.push(marker);
      }
    }
  }
}
</script>


