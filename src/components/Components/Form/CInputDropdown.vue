<template>
  <div :style="containerStyle" class="full-width">
    <!-- outside click -->
    <div v-click-outside="hide"></div>

    <div :style="customDropdownWrapStyle">
      <!-- 레이블 -->
      <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

      <!-- 드롭다운 -->
      <!-- Selected -->
      <div class="dropdown position-relative unselect" ref="dropdown"
          :style="dropdownStyle"
          @click.stop.prevent="toggleList">
        <div class="flex-between full-width">
          <div class="flex-align">
            <i v-if="iconValue" class="material-icons" style="font-size: 20px; margin-right: 8px;">{{ iconValue }}</i>
            <span v-if="selectedValue" style="margin-right: 5px;">{{ selectedValue }}</span>
            <span v-else-if="placeholder" :style="placeholderStyle">{{ placeholder }}</span>
            <span v-else :style="placeholderStyle">{{ placeHolder }}</span>
          </div>

          <i :style="iconStyle" class="material-icons drop-icon">
            {{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
        </div>

        <!-- List -->
        <ul v-if="!disabled && isOpen && formType.dropdown !== 'modal'" class="list" :style="dropListCustomStyle">
          <li class="item unselect flex-between"
              v-for="(item, idx) in options"
              :key="idx"
              :style="[{color: isEnableOption(item) ? brandColor.main.color : brandColor.help.color}, brandBgColor.main, mouseOverStyle(idx), dropItemStyle]"
              @click.stop.prevent="clickItem(item)"
              @mouseover="mouseOverIndex=idx"
              @mouseleave="mouseOverIndex=undefined;">
            <div>
              <div v-if="optionType !== 'delivery'">{{ optionLabel(item) }} <span v-if="optionType !== '' && optionType === 'reservation' && limitType === 1">
                (+{{ computedOptionPrice(item) }}원)</span><span v-else-if="optionType !== '' && optionType !== 'reservation'">(+{{ calcOptionPrice(item) }}원)</span></div>
              <template v-if="optionType === 'reservation' && limitType === 1">
                <div v-if="item.enable_stock && !item.soldout" class="size-13 p-sub2"
                  style="margin-top: 2px">{{ item.stock }} 남음</div>
                <div v-else class="size-12 radius-4 p-bg-gray p-white flex-center"
                  style="width: 36px; height: 20px">마감</div>
              </template>
              <template v-if="optionType === 'reservation_add' && limitType === 1">
                <div v-if="item.value.enable_stock && !item.value.soldout" class="size-13 p-sub2"
                  style="margin-top: 2px">{{ item.value.stock }} 남음</div>
                <div v-else-if="item.value.enable_stock && item.value.stock === 0" class="size-12 radius-4 p-bg-gray p-white flex-center"
                  style="width: 36px; height: 20px">마감</div>
              </template>
              <template v-if="optionType === 'delivery'">
                <div v-if="!deliverySoldout(item)">{{ optionLabel(item) }} <span>(+{{ calcOptionPrice(item) }}원)</span></div>
                <div v-else class="p-sub3">[품절] {{ optionLabel(item) }} <span>(+{{ calcOptionPrice(item) }}원)</span></div>
              </template>
            </div>
            <div v-if="optionType === 'mart'">{{ item.price >= 0 ? '+' : '' }}{{ item.price | currency }}</div>
          </li>
        </ul>
      </div>

    </div>
    <!-- 모달 스타일 List -->
    <sweet-modal v-if="label" ref="listModal" overlay-theme="dark">
      <div class="text-center">
        <div class="label-modal"> {{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span> </div>
        <div class="item-modal unselect" @click.stop.prevent="clickItem(item)"
             v-for="(item, idx) in options"
             :key="idx"
             :style="itemModalStyle(item.label)">
          <div>{{ item.label }}</div>
          <i v-if="item.label === selectedValue" class="material-icons" :style="checkStyle">check</i>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
  import { SweetModal } from 'sweet-modal-vue';
  import FormMixin from '@/components/Mixins/FormMixin'
  import ClickOutside from 'vue-click-outside'
  import uuidv4 from "uuid/v4";

  export default {
    name: 'c-input-dropdown',

    directives: {
      ClickOutside
    },

    components: {
      SweetModal
    },

    mixins: [
      FormMixin
    ],

    props: {
      optionType: {
        type: String,
        default: ''
      },
      customDropdownWrapStyle: {
        type: Object,
        required: false
      },
      dropListCustomStyle: {
        type: Object,
        required: false
      },
      dropItemCustomStyle: {
        type: Object,
        required: false
      },
      placeholderCustomStyle: {
        type: Object,
        required: false
      },
      iconCustomStyle: {
        type: Object,
        required: false
      },
      iconValue: {
        type: String,
        required: false
      },
      fullState: {
        type: Boolean,
        required: false
      },
      fullLength: {
        type: Number,
        required: false
      },
      addState: {
        type: Boolean,
        required: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selectorStocks: {
        type: Array,
        required: false
      },
      limitType: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        isOpen: false,
        mouseOverIndex: undefined,
        selectedValue: '',
        popupItem: '',
        placeHolder: '선택',
        uid: undefined
      };
    },

    mounted() {
      this.popupItem = this.$el;
    },

    created() {
      this.uid = uuidv4();
      this.selectedValue = this.findLabel(this.value);
    },

    watch: {
      '$store.getters.dropdownUid'(n) {
        if (n !== this.uid) {
          this.isOpen = false;
        }
      },
      value(n) {
        this.selectedValue = this.findLabel(n);
      },
      selectedValue(n) {
        let value = undefined;
        if(typeof(n) === 'string') {
          let opt = find(this.options, 'label', n);
          if(opt) {
            value = opt.value;
          }
        } else {
          value = n.value;
        }

        // this.$emit('update:value', value);
      },
      fullState(n) {
        if(n) {
          if(this.options&&this.options[0].type===0) {
            this.selectedValue = '';
            if(this.options[0].index===this.fullLength) {
              this.$emit('empty', this.options[0].type);
            } else if (this.options[0].option_type === 0 && this.options.length === this.fullLength) {
              this.$emit('empty', this.options[0].option_type);
            }
          }
        }
      },
      addState(n) {
        if(n) {
          if(this.options) {
            this.options.forEach(item => {
              if(item.label===this.selectedValue) {
                this.selectedValue = '';
                this.$emit('empty', item.type, item.index);
              }
            })
          }

        }
      }
    },

    computed: {
      iconStyle() {
        if (this.iconCustomStyle) return this.iconCustomStyle;
        else return {
          color: this.brandColor.sub.color
        };
      },
      placeholderStyle() {
        if (this.placeholderCustomStyle) return this.placeholderCustomStyle;
        else return {
          color: '#777777',
          marginRight: '5px'
        }
      },
      dropItemStyle() {
        if (this.dropItemCustomStyle) return this.dropItemCustomStyle;
        else return {
          padding: '8px 16px',
          borderBottom: `1px solid ${this.getColor('기본 테두리선 색상')}`,
          fontSize: '14px'
        }
      },
      checkStyle() {
        return {
          padding: '2px',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          textAlign: 'center',
          color: 'white',
          backgroundColor: this.brandBgColor.brand.backgroundColor,
          fontSize: '15px'
        }
      }
    },

    methods: {
      computedOptionPrice(item) {
        return this.currencyNum(item.options.reduce((a, c) => a + c.price, 0))
      },
      calcOptionPrice(item) {
        return item.value.price ? this.currencyNum(item.value.price) : this.currencyNum(item.price)
      },
      optionLabel(item) {
        if (this.optionType === 'mart') {
          if (this.isEnableOption(item)) {
            return item.label;
          } else {
            return `${item.label} (품절)`
          }
        } else {
          return item.label;
        }
      },
      isEnableOption(item) {
        let isEnable = true;
        if (this.optionType === 'mart' || this.optionType === 'delivery') {
          if (this.selectorStocks.length !== 0) {
            let stockArray = []
            this.selectorStocks.forEach(stock => {
              let index = stock.options.findIndex(option => option === item.id);
              if (index !== -1) {
                stockArray.push(stock);
              }
            })
            let idx = stockArray.findIndex(stock => stock.enable_stock === false || (stock.enable_stock && stock.stock !== 0))
            if (idx === -1) {
              isEnable = false;
            } else {
              isEnable = true;
            }
          } else {
            isEnable = true;
          }
        } else {
          isEnable = true
        }
        return isEnable;
      },
      hide () {
        this.isOpen = false
        this.$emit('toggleList', this.isOpen, this.options.length)
      },

      itemModalStyle(label) {
        return label === this.selectedValue ? this.brandColor.brand : this.brandColor.main;
      },

      // 드롭다운 아이템 스타일 계산 (hover index 감지를 위해 메소드로 처리)

      mouseOverStyle(idx) {
        let deco = {};
        if ( this.mouseOverIndex === idx ) {
          deco.backgroundColor = '#eee';
        }
        return deco;
      },

      // 드롭다운 토글
      toggleList() {
        if ((this.optionType === 'booking' || this.optionType === 'reservation' || this.optionType === 'reservation_add') && this.$store.getters.selectedResv === undefined) {
          this.toast('일정을 먼저 선택해주세요.');
          return;
        } else {
          this.isOpen = !this.isOpen;
          // this.$store.commit('setDropdownUid', this.uid);
          this.$emit('toggleList', this.isOpen, this.options.length)
          if(this.formType.dropdown === 'modal') {
            this.$refs.listModal.open();
          }
        }
      },
      deliverySoldout(item) {
        let stock = this.selectorStocks.filter(stock => stock.options.findIndex(option => option === item.id) > -1)[0]
        if (stock.enable_stock && (stock.stock === 0 || item.minimum > stock.stock)) {
          return true;
        } else {
          return false;
        }
      },
      // 드롭다운 아이템 클릭
      clickItem(item) {
        if (this.optionType === 'mart' && !this.isEnableOption(item)) {
          this.selectedValue = '';
          this.isOpen = false;
          return;
        } else if (this.optionType === 'mart' && this.isEnableOption(item)) {
          this.selectedValue = item.label;
        } else if (this.optionType === 'delivery') {
          if (this.isEnableOption(item)) {
            let stock = this.selectorStocks.filter(stock => stock.options.findIndex(option => option === item.id) > -1)[0]
            // 최소 주문 수량보다 stock이 적은 경우, 구매 불가능
            if (stock.enable_stock && item.minimum > stock.stock) {
              this.selectedValue = '';
              this.isOpen = false;
              return;
            } else {
              this.selectedValue = item.label;
            }
          } else {
            this.selectedValue = '';
            this.isOpen = false;
            return;
          }
        } else {
          this.selectedValue = item.label;
        }
        this.isOpen = false;
        this.$emit('toggleList', this.isOpen, this.options.length)
        if(this.formType.dropdown === 'modal') {
          setTimeout(()=>{
            this.$refs.listModal.close();
            this.$emit('update:value', item.value);
            this.$emit('update:selectedValue', this.selectedValue);
          },500);
        } else {
          this.$emit('update:value', item.value);
          this.$emit('update:selectedValue', this.selectedValue);
        }
      },

      findLabel(val) {
        let result = '';
        if (this.options!==undefined) {
          this.options.forEach(opt => {
            if (opt.value === val) {
              result = opt.label;
            }
          });
        }
        return result;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .dropdown
    display flex
    align-items center
    justify-content space-between
    cursor pointer

  .list
    width 100%
    list-style none
    margin 0
    padding 0
    position absolute
    left 0
    z-index 100
    top 32px
    background white
    max-height 320px
    overflow-y auto
    box-shadow 0 2px 4px 0 rgba(0,0,0,0.1)

  .drop-icon
    font-size 17px

  .outer
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 99

  .label-modal
    border-bottom 1px solid #dddddd

  .item-modal
    display flex
    justify-content space-between

  .label-modal
  .item-modal
    padding 10px 24px
    font-size 14px

</style>
