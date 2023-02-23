<template>
<div v-show="visible" class="flex-align size-11 weight-500" :style="wrapStyle" @click="clickRegion"
  id="block-header-region-tag">
  <i class="material-icons size-18" style="margin-right:4px;">gps_fixed</i>
  <span class="ellipsis" v-if="$store.getters.device==='pc'">{{ address.full }}</span>
  <span class="ellipsis" v-else>{{ address.sido }} {{ address.sigungu }}</span>
</div>
</template>
<script>

export default {
  name: 'BlockHeaderRegion',
  components: {

  },
  mixins: [

  ],
  props: {
    bgColor: {
    },
    visible: {
      type: Boolean,
    },
    textColor: {
    },
    borderColor: {
    },
    containStyle: {
      type: Object,
    },

  },
  data() {
    return {
      "count": 0,
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
      if(this.count > 10) {
        return;
      }
      this.count++;
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
        console.log(location)
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
    clickRegion() {
      this.$root.$emit('page_overlay', 'RegionOverlay')
    }
  },
  computed: {
    wrapStyle() {
      let deco = {};
      
      if(this.containStyle&&Object.keys(this.containStyle).length>0) {
        deco = this.containStyle;
      }
      else {
        deco.height = '32px';
        deco.lineHeight = '32px';
        deco.width = '140px';
        deco.padding = '0 8px';
        deco.backgroundColor = 'white';
        deco.border = '1px solid #DDDDDD';
        deco.color = '#515151';
        deco.borderRadius = '8px';
      }
      
      if(this.textColor) {
        deco.color = this.parseColor(this.textColor);
      }
      if(this.borderColor) {
        deco.border = `1px solid ${this.parseColor(this.borderColor)}`;
      }
      if(this.bgColor) {
        deco.backgroundColor = this.parseColor(this.bgColor);
      }
      
      return deco;
    }
  },
  watch: {
    '$store.getters.currentPosition'(n, o) {
      let current = this.$store.getters.currentPosition;
      if (current && current.lng && current.lat) this.getAddress(current);
    }
  }
}
</script>


