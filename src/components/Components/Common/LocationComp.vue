<template>
<div class="flex-align unselect" :style="[brandBgColor.white, radius]"
  style="width:256px; height:48px; padding: 0 16px;" @click="$emit('clicked')" >
  <i class="material-icons size-18" :style="brandColor.primary" style="margin-right:4px;">room</i>
  <span class="ellipsis size-14 weight-500" style="width:100%"
    :style="[brandColor.main]">{{ address.full }}</span>
</div>
</template>
<script>

export default {
  name: 'LocationComp',
  components: {

  },
  mixins: [

  ],
  props: {
    type: {
      type: String,
      required: false,
    },
    currentStatus: {
      type: Boolean,
      required: false,
    },
    changePosition: {
      type: Object,
      required: false,
    },

  },
  data() {
    return {
      "address": {}
    }
  },
  created() {

  },
  mounted() {
    let current = this.$store.getters.currentPosition;
    if (current && current.lng && current.lat) this.getAddress(current);
    else this.getAddress();
  },
  
  methods: {
    getAddress(params) {
      /* 좌표 세팅 로직 시작 */
      if (params === undefined) {
        // navigator 로 현재 좌표 가져오기
        if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
          navigator.geolocation.getCurrentPosition(position => {
            this.address.latitude = position.coords.latitude;
            this.address.longitude = position.coords.longitude;
            
            let location = {lat: this.address.latitude, lng: this.address.longitude};
            this.$store.commit('setCurrentPosition', location);
            this.$store.commit('setCurrentAddress', this.address);
            this.$emit('currentAddress', this.address);
            
            // 다시 호출해서 좌표 업데이트하는 방식 - recursive
            this.getAddress(location);
          }, error => {}, {
            enableHighAccuracy: false,
            maximumAge:Infinity,
            timeout: 10000
          });
        } 
        else {
          console.log('GPS를 지원하지 않습니다');
        }
      } 
      else {
        this.address.latitude = params.lat;
        this.address.longitude = params.lng;
        
        let location = {lat: this.address.latitude, lng: this.address.longitude};
        this.$store.commit('setCurrentPosition', location);
        this.$store.commit('setCurrentAddress', this.address);
        this.$emit('currentAddress', this.address);
      }
      /* 좌표 세팅 로직 끝 */

      // 가져온 좌표로 주소 받아오기
      setTimeout(() => {
        this.$axios.get(`public/service/geocode?latitude=${this.address.latitude}&longitude=${this.address.longitude}`)
          .then(res => {
            if (res.status === 200) {
              if (res.data.address) {
                this.address = res.data.address;

                let location = {lat: this.address.latitude, lng: this.address.longitude};
                this.$store.commit('setCurrentPosition', location);                
                this.$store.commit('setCurrentAddress', this.address);
                this.$emit('currentAddress', this.address);
              }

              // API 키가 없을 경우 예외처리, (사용하지 않을 경우) 서비스명으로 처리하도록 인자값 false 전달
              // if (res.data.address === false) this.setFullAddress(false);
              // else this.setFullAddress(true);

              // 위치 업데이트 emit
              this.$emit('updatePosition');

              // this.setFullAddress();
            }
          })
          .catch(err => {
            console.log(err);
          })
      }, 200)
    },
    clickMenu() {
      this.$root.$emit('openDrawer')
    }
  },
  computed: {
    logo() {
      if (this.$store.getters.brand) return this.$store.getters.brand.logo;
    },
    searchPage() {
      if (this.$route.path.indexOf('search')>-1) return true;
      else return false;
    }
  },
  watch: {
    currentStatus(n) {
      if (n) {
        // 현재 위치로 지정
        this.getAddress();
        this.$emit('currentStatus');
      }
    },
    changePosition(n) {
      if (n) {
        // 설정된 위치로 지정
        this.getAddress(n);
        this.$emit('changePosition');
      }
    }
  }
}
</script>
<style scoped>
.location {
    height: 32px;
    width: 180px;
    padding: 6px;
  }
</style>

