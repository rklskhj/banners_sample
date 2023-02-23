<template>
<div class="full-width position-relative"
  :style="`height: ${mapHeight}`">
  <div id="naver-map-overlay" :style="mapStyles"></div>
  <div class="unselect position-absolute flex-center radius-4 p-bg-white"
    @click="clickClose" :style="closeBtnStyle">
    <i class="material-icons" style="font-size: 20px; color: #8e8e8e">close</i></div>
  <div class="full-width position-absolute flex-between p-bg-white"
    style="padding: 16px; height: 50px; bottom: 0; left: 0; z-index: 999">
    <div class="flex-align p-sub">
      <i class="material-icons-outlined">location_on</i>
      <div class="size-12">{{ prop.address }}</div>
    </div>
    <div @click="clickAddress" class="unselect size-10">주소복사</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockLocationMapOverlay',
  components: {

  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "map": undefined,
      "height": 0
    }
  },
  created() {
    this.height = window.innerHeight;
    this.lock(document.querySelector('html'));
    this.lock(document.querySelector('body'));
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.height = window.innerHeight;
      })
    })
    setTimeout(() => {
      this.setMap();
    }, 1000);
  },
  beforeDestroy() {
    this.unlock(document.querySelector('html'));
    this.unlock(document.querySelector('body'));
  },
  
  methods: {
    lock(element) {
      element.style.overflow = 'hidden';
      element.style.touchAction = 'none';
    },
    unlock(element) {
      element.style.removeProperty('overflow');
      element.style.removeProperty('touch-action');
    },
    clickClose() {
      this.$emit('closePage')
      this.unlock(document.querySelector('html'));
      this.unlock(document.querySelector('body'));
    },
    setMap() {
      this.map = new naver.maps.Map('naver-map-overlay', {mapTypeId: naver.maps.MapTypeId.NORMAL});
      this.map.setZoom(15);
      let mapOptions = {
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
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
      this.map.setOptions(mapOptions);
      this.map.setCenter(new naver.maps.LatLng(this.prop.latitude, this.prop.longitude));
      new naver.maps.Marker({
        map: this.map,
        position: new naver.maps.LatLng(this.prop.latitude, this.prop.longitude),
        icon: {
          content: `<i class="material-icons" style="font-size:36px;color: ${this.brandColor.brand.color}">location_on</i>`,
          size: new naver.maps.Size(36, 18),
        }
      });
    },
    clickAddress() {
      this.$copyText(this.prop.address).then(e => {
        this.toast('주소가 복사되었습니다.')
      }, e => {
        this.toast('주소복사에 실패했습니다.')
      })
    }
  },
  computed: {
    closeBtnStyle() {
      return {
        top: '32px',
        left: '24px',
        width: '38px',
        height: '38px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
      }
    },
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
              deco.height = `${this.height}px`;
            } else {
              deco.height = 'calc(100vh - 50px)'
            }
          } else {
            deco.height = 'calc(100vh - 50px)'
          }
        }
      }
      return height;
    },
    mapStyles() {
      let deco = {
        width: '100%',
        height: this.mapHeight
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


