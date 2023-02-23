<template>
  <div v-if="title && title !== ''">
    <div @click="clickTitle" class="flex-center unselect" :style="buttonStyle">
      <div>{{ title }}</div>
      <i class="material-icons" style="margin-left:4px">{{ $refs.locModal && $refs.locModal.is_open ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
    </div>
    <sweet-modal ref="locModal" overlay-theme="dark">
      <div style="padding:20px">
        <div class="p-card-title text-center" style="margin-bottom:20px" :style="brandColor.main">위치 지정</div>
        <div class="grid-box">
          <div class="col-6 unselect" style="padding-right:6px" @click="searchByLocation">
            <div class="box text-center">
              <i class="material-icons" :style="brandColor.brand">my_location</i>
              <div class="p-card-subtitleSmall" :style="brandColor.main">내 위치 지정</div>
            </div>
          </div>
          <div class="col-6 unselect" style="padding-left:6px" @click="clickMap">
            <div class="box text-center">
              <i class="material-icons" :style="brandColor.brand">pin_drop</i>
              <div class="p-card-subtitleSmall" :style="brandColor.main">지도로 위치지정</div>
            </div>
          </div>
        </div>
      </div>
    </sweet-modal>

    <!-- 지도에서 위치 찾기 -->
    <div :style="fullStyle" v-if="vMap">
      <search-map @close="closeSearchMap" @clickBtnCurrent="clickBtnCurrent"></search-map>
    </div>
  </div>
</template>

<script>
  import { SweetModal } from 'sweet-modal-vue';
  import SearchMap from "../Common/SearchMap.vue";
  export default {
    name: "BtnFindlocation",

    props: {
      styles: {
        type: Object,
        required: false,
        default: function() {
          return {
            container: {
              backgroundColor: '',
              color: '',
            }
          }
        }
      }
    },

    components: {
      SearchMap,
      SweetModal
    },

    data() {
      return {
        title: '',
        address: {
          latitude: 35.0,
          longitude: 128.0
        },
        vMap: false
      }
    },

    created() {
      this.updateAddress(this.$store.getters.currentPosition);
    },

    watch: {
      vMap(n) {
        this.$emit('vMap', n);
      }
    },

    computed: {
      fullStyle() {
        let deco = {
          position: 'fixed',
          width: '100%',
          height: '100%',
          maxWidth: this.$store.getters.deviceWidth+'px',
          zIndex: '10',
          backgroundColor: '#ffffff',
          top: 0,
          left: 0,
          right: 0
        }
        return deco;
      },
      buttonStyle() {
        let color = 'white';
        if(this.styles.container.color) color = this.styles.container.color;
        let deco = {
          color: color,
          padding: '4px 0'
        }

        if(this.styles.container.backgroundColor) {
          deco.backgroundColor = this.styles.container.backgroundColor;
        }

        return deco;
      }
    },

    methods: {
      clickTitle() {
        this.$refs.locModal.open();
      },
      searchByLocation() {
        this.$refs.locModal.close();
        this.updateAddress();
      },
      clickMap() {
        this.$refs.locModal.close();
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
        this.vMap = true;
      },
      clickBtnCurrent(center) {
        this.updateAddress({lat: center._lat, lng: center._lng});
        setTimeout(()=>{
          this.unlock(document.querySelector('html'));
          this.unlock(document.querySelector('body'));
          this.vMap = false;
        },500);
      },
      closeSearchMap() {
        this.unlock(document.querySelector('html'));
        this.unlock(document.querySelector('body'));
        this.vMap = false;
      },
      updateAddress(params) {
        /* 좌표 세팅 로직 시작 */
        if (params === undefined) {
          // navigator 로 현재 좌표 가져오기
          if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
            navigator.geolocation.getCurrentPosition(position => {
              this.address.latitude = position.coords.latitude;
              this.address.longitude = position.coords.longitude;
              let location = {lat: this.address.latitude, lng: this.address.longitude};
              this.$store.commit('setCurrentPosition', location);
              // 다시 호출해서 좌표 업데이트하는 방식 - recursive
              this.updateAddress(location);
            }, error => {
              //let location = {lat: this.address.latitude, lng: this.address.longitude};
              //this.updateProductList();
              // 다시 호출해서 좌표 업데이트하는 방식 - recursive
              //this.updateAddress(location);
            }, {
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
                // console.log(res.data.address);
                // if (res.data.address === false) this.setFullAddress(false);
                // else this.setFullAddress(true);

                // 위치 업데이트 emit
                this.$emit('updatePosition', this.address);

                this.setFullAddress();
              }
            })
            .catch(err => {
              console.log(err);
            })
        }, 200)
      },

      setFullAddress() {
        if(this.address.sido) {
          this.title = '%s %s %s'.format(
            this.address.sido.replace('특별시', '').replace('광역시', '').replace('특별자치도', '').replace('특별자치시', ''),
            this.address.sigungu, this.address.dong);
        }

        // 주소를 얻어오는 동안 서비스명으로 처리. 받아오는 sido, sigungu, dong 이 없을 경우 '  '(공백두칸) 상태
        if (this.title.trim() === '')
          this.title = this.$store.getters.service.title;
      },
      lock(element){
        element.style.overflow = 'hidden';
        element.style.touchAction = 'none';
      },
      unlock(element){
        element.style.removeProperty('overflow');
        element.style.removeProperty('touch-action');
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .box
    border 1px solid #ddd
    border-radius 4px
    padding 16px 0
  .box i
    margin-bottom 6px
</style>
