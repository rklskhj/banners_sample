<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label"
         :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 컨텐츠 -->
    <div class="c-input-date-content unselect position-relative"
         @click.stop.prevent="openPicker">
      <div class="full-width flex-between"
           :style="inputStyle">{{ !date || date === ''  ? '날짜 선택' : date }}
        <i :style="iconStyle" class="material-icons">keyboard_arrow_down</i>
      </div>
    </div>

    <!-- Picker -->
    <transition name="fade">
      <date-picker v-if="vPicker" :value.sync="date" @close="vPicker=false"></date-picker>
    </transition>

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import DatePicker from "../Common/DatePicker.vue";

  export default {
    name: 'c-input-date-spin',
    components: {
      DatePicker
    },
    mixins: [
      FormMixin
    ],

    data() {
      return {
        vPicker: false,
        date: ''
      };
    },
    created() {
      this.date = this.value;
    },
    watch: {
      value() {
        this.date = this.value;
      },
      date() {
        this.$emit('update:value', this.date);
      }
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
      openPicker() {
        if(this.disabled) return;
        this.vPicker = true;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .c-input-date-content
    display flex

  .fade-enter-active
    transition all .3s

  .fade-leave-active
    transition all 3s reverse

  .fade-enter, .fade-leave
    opacity 0

</style>
