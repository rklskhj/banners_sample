<template>
<div class="full-width">
  <div id="naver-map" :style="mapStyles"></div>
</div>
</template>

<script>
export default {
  name: 'LocationMap',

  props: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    mapStyle: {
      type: Object,
      required: false
    }
  },

  mounted() {
    setTimeout(()=> {
      this.setMap();
    }, 1000);
  },

  computed: {
    mapStyles() {
      let stylObj = {
        width: '100%',
        height: '200px'
      }

      if (this.mapStyle) {
        return Object.assign(stylObj, this.mapStyle)
      }
      else return stylObj;
    }
  },

  methods: {
    setMap() {
      this.map = new naver.maps.Map('naver-map', {mapTypeId: naver.maps.MapTypeId.NORMAL});
      this.map.setZoom(15);
      this.map.setOptions({zoomControl: false});
      this.map.setCenter(new naver.maps.LatLng(this.latitude, this.longitude));
      new naver.maps.Marker({
        map: this.map,
        position: new naver.maps.LatLng(this.latitude, this.longitude)
      });
    },
  }
}
</script>
