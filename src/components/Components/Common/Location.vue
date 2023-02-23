<template>
  <div class="location"></div>
</template>

<script>
  export default {
    name: 'Location',
    data() {
      return {
        location: {
          latitude: undefined,
          longitude: undefined,
        }
      }
    },
    created() {
      if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
        navigator.geolocation.getCurrentPosition(position => {
          this.location.latitude = position.coords.latitude;
          this.location.longitude = position.coords.longitude;
          let current_position = {lat: this.location.latitude, lng: this.location.longitude};
          this.$store.commit('setCurrentPosition', current_position);
        }, error => {
          console.log(error);
        }, {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity
        });
      } 
      else {
        console.log('GPS를 지원하지 않습니다');
      }
    },
    destroyed() {
      this.$store.commit('setCurrentPosition', undefined);
    },
  }
</script>
