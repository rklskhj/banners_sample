<template>
<div class="flex-align">
  <div class="flex-align position-relative" style="margin-right: 34px">
    <i class="material-icons size-16" style="margin-right: 4px" :style="brandColor.primary">location_on</i>
    <div class="size-14" :style="brandColor.primary">{{ partner.name }}</div>
    <i v-if="partner.name && partner.name !== '서비스 가능한 지역이 아닙니다' && partner.phone !== ''"
      @click="showPartnerPhone = true"
      class="unselect material-icons size-16"
      style="margin-left: 4px" :style="brandColor.primary">phone_enabled</i>
    <div v-if="showPartnerPhone" :style="brandBgColor.white" class="position-absolute flex-between"
      style="top: 25px; right: 0px; padding: 16px; width: 222px; border-radius: 6px; border: 1px solid #f5f5f5; box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16); z-index: 101">
      <div class="size-14" :style="brandColor.main">
        <div>문의전화: <span style="margin-left: 4px">{{ partner.phone }}</span></div>
      </div>
      <i class="material-icons unselect" @click="showPartnerPhone = false"
        style="font-size: 18px">close</i>
    </div>
  </div>
  <div @click="selectDeliveryBase" class="size-14 flex-center unselect"
    :style="[brandColor.main, brandBorder.main]"
    style="border-radius: 5px;padding:6px 12px">기본 배송지 선택</div>
  <!--<sweet-modal ref="warningModal" overlay-theme="dark">-->
  <!--  <div class="flex-center" style="width: 343px; height: 200px">-->
  <!--    <div>-->
  <!--      <div>기본배송지 변경은 주문서 이외 화면에서 <br/>진행해 주세요.</div>-->
  <!--      <div>확인</div>-->
  <!--    </div>-->
  <!--  </div>-->
  <!--</sweet-modal>-->
  <transition>
    <div v-if="modalOpen" class="modal-bg" @click="e => closeModal(e)">
      <div class="modal">
        <div class="full-width position-relative" style="height: 100%">
          <div style="text-align: center">
            <div class="size-14"
              style="padding-top: 60px" :style="brandColor.main">기본배송지 변경은 주문서 이외 화면에서 <br>진행해 주세요.</div>
            <div class="flex-center">
              
              <div class="size-14 bold unselect flex-center"
                style="width: 152px; height: 48px; margin-top: 32px; border-radius: 8px"
                :style="[{border: `1px solid ${brandColor.primary.color}`}, brandColor.primary]"
                @click="modalOpen = false">확인</div>
            </div>
          </div>
          <i class="unselect material-icons" style="position: absolute; top: 10px; right: 10px"
          :style="brandColor.main" @click="modalOpen = false">close</i>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>

export default {
  name: 'BlockSelectDeliveryBasePc',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "partner": {},
      "modalOpen": false,
      "showPartnerPhone": false
    }
  },
  created() {
    this.setPartner();
  },
  mounted() {

  },
  
  methods: {
    closeModal(e) {
      if (e.target.className === 'modal-bg') {
        this.modalOpen = false;
      } else {
        return false;
      }
    },
    setPartner() {
      if (!this.isLogin) {
        let url = `user/${this.user.user_id}/mapping/partner?fields=id,name,able_address,location,phone&page_length=1000&hit=false`
        this.$axios.get(url).then(res => {
          res.data.data.forEach((item, idx) => {
            if (item.name === '하남우산점') {
              this.partner = item;
              this.$store.commit('setDefaultPartner', this.partner);
            }
          })
        })
      } else {
        this.$axios.get(`/user/${this.user.user_id}/mart/delivery`).then(res => {
          let url = `user/${this.user.user_id}/mapping/partner?fields=id,name,able_address,location,phone&page_length=1000&hit=false`
          if (res.data.data.find(item => item.is_base === true) === undefined) {
            this.$axios.get(url).then(res => {
              res.data.data.forEach((item, idx) => {
                if (item.name === '하남우산점') {
                  this.partner = item;
                  this.$store.commit('setDefaultPartner', this.partner);
                }
              })
            })
          } else {
            let is_base = res.data.data.find(item => item.is_base === true);
            let base_location = {lat: is_base.address.latitude, lng: is_base.address.longitude}
            let _this = this;
            this.$axios.get(url).then(res => {
              let items = res.data.data.filter(item => item.able_address.find(addr => _this.compareAddrFullText(addr, is_base)));
              if (items.length > 1) {
                let distanceArray = [];
                items.forEach(item => {
                  distanceArray.push(this.getDistance(item.location, base_location))
                });
                let index = distanceArray.findIndex(distance => distance === Math.min(...distanceArray));
                this.partner = items[index];
              } else if (items.length === 1) {
                this.partner = items[0];
              } else {
                this.partner = res.data.data.find(item => item.name === '하남우산점');
              }
              this.$store.commit('setDefaultPartner', this.partner);
            })
          }
        })
      }
    },
    getDistance(partnerLocation, base_location) {
      let lat1 = partnerLocation.latitude;
      let lng1 = partnerLocation.longitude;
      let lat2 = base_location.lat;
      let lng2 = base_location.lng;
        
      let r = 6371; //지구의 반지름(km)
      let dLat = this.deg2rad(lat2-lat1);
      let dLon = this.deg2rad(lng2-lng1);
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = r * c; // Distance in km
      let distance = `${Math.round(d*1000)}`;
      
      return Number(distance);
      
    },
    deg2rad(deg) {
      return deg * (Math.PI/180)
    },
    compareAddrFullText(addr, is_base) {
      if (addr.sigungu_id === null) {
        return addr.full_text.indexOf(`${is_base.address.sido}`) > -1
      } else if (addr.sigungu_id !== null && addr.dong_id === null) {
        return addr.full_text.indexOf(`${is_base.address.sido} ${is_base.address.sigungu}`) > -1
      } else if (addr.sigungu_id !== null && addr.dong_id !== null) {
        return addr.full_text.indexOf(`${is_base.address.sido} ${is_base.address.sigungu} ${is_base.address.dong}`) > -1
      }
    },
    selectDeliveryBase() {
      if (!this.isLogin) {
        this.toast('로그인 후 이용가능합니다.');
        this.routerPush('/signin')
      } else {
        if (this.$route.path === '/order') {
          this.modalOpen = true;
        } else {
          this.openDeliveryList();
        }
      }
    },
    openDeliveryList() {
      let routeData = this.$router.resolve({path: '/default_delivery'});
      let a = document.createElement("a");
      // a.href = routeData.href;
      a.style.display = 'none';
      // a.setAttribute('target', '_blank');
      a.onclick = this.clickLink(routeData.href);
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
    },
    clickLink(href) {
      window.open(href, '', 'width=440,height=768');
      return false;
    }
  },
  computed: {
    
  },
  watch: {
    '$store.getters.selectedDelivery'(n) {
      this.setPartner();
    },
    'isLogin'(n) {
      this.setPartner();
    }
  }
}
</script>
<style scoped>
.modal-bg {
  background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  width: 343px;
  height: 200px;
  /*height: 80%;*/
  overflow-y: auto;
  border-radius: 8px;
}
</style>

