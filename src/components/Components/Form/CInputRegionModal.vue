<template>
  <div :style="containerStyle" class="position-relative full-width">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label }}</div>

    <!-- input 영역 -->
    <div :style="inputStyle" class="flex-between position-relative unselect" @click="openOverlay">
      <div class="flex-align">
        <i v-if="iconVisible" class="material-icons" style="font-size: 20px; margin-right: 8px; color: #d6d6d6">location_on</i>
        <span v-if="filterOptions.selectedValue && filterOptions.selectedValue !== ''">
          {{ filterOptions.selectedValue }}</span>
        <span v-else-if="placeholder" :style="brandColor.sub2">{{ placeholder }}</span>
      </div>
      <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
    </div>

    <!-- Modal -->
    <div v-if="vRegion" class="modal-region">
      <block-region-overlay :filterOptions="filterOptions"
                            @selectedRegion="selectedRegion"
                            @closeModal="vRegion=false"></block-region-overlay>
    </div>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin';
  import BlockRegionOverlay from "../Block/BlockRegionOverlay.vue";

  export default {
    name: 'c-input-regionModal',
    components: {
      BlockRegionOverlay
    },
    mixins: [
      FormMixin
    ],
    props: {
      filterOptions: {
        type: Object
      },
      iconVisible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        vRegion: false,
        placeHolder: '지역명',
      }
    },

    created() {

    },
    mounted() {
      window.addEventListener('popstate', this.popState);
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.popState);
    },
    computed: {
      iconStyle() {
        if (this.iconCustomStyle) return this.iconCustomStyle;
        else return {
          color: this.brandColor.sub.color
        };
      },
    },
    methods: {
      popState() {
        if(this.$store.getters.popstate[0]==='region_overlay') {
          this.$store.commit('removePopstate');
          this.vRegion = false;
        }
      },
      openOverlay() {
        this.vRegion=true;
        history.pushState('region_overlay','');
        this.$store.commit('setPopstate', 'region_overlay');
      },
      selectedRegion(res) {
        let selectedValue = `${res.sido.name} ${res.sigungu.name}`;
        this.filterOptions.selectedValue = selectedValue;
        this.$emit('update:filterOptions', this.filterOptions);
        this.$emit('update:value', res);
        this.vRegion = false;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .modal-region
    position fixed
    top 0
    left 0
    width 100%
    background #fff
    height 100%
    z-index 1000
</style>
