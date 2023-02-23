<template>
  <div class="lp-base-input base-dropdown-input" :style="containerStyle">
    <div style="position:relative; display:inline-block"
         :class="{'full-width': true }">
      <div class="prop-drop-down-select-wrapper"
           :class="{'full-width': true}"
           @click.stop.prevent="openList">
        <div class="prop-drop-down-select-item"
             :style="valueLabelStyle">{{ (value_data === '') ? (placeholder || '') : valueLabel }}</div>
      </div>
      <div v-if="isOpen"
           class="prop-drop-down-list-outsider"
           @click="isOpen=false">
      </div>
      <ul v-if="isOpen" class="prop-drop-down-list" :style="listStyle">
        <li v-for="(opt,idx) in options" :key="'sort-list'+idx"
            class="prop-drop-down-item selectable-list-item"
            :style="opt.styles"
            @click="clickTargetItem(opt)">{{ opt.label }}</li>
      </ul>
    </div>
    <i class="material-icons prop-drop-down-arrow-icon">{{ isOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: [String, Number, Boolean, Object, Array]
      },

      options: {
        type: Array,
        required: true
      },

      placeholder: {
        type: String,
        required: false
      },

      width: {
        type: String,
        required: false
      },

      disabled: {
        type: Boolean
      }
    },

    data() {
      return {
        isOpen: false,
        value_data: this.value,
        oldValue: this.value
      }
    },

    computed: {
      containerStyle() {
        let deco = {
          width: '100%'
        };

        if(this.width)
          deco.width = this.width;

        return deco;
      },
      valueLabel() {
        let found = this.options.find(opt => {
          return opt.val === this.value;
        });
        if (found)
          return found.label;
        else
          return '';
      },

      valueLabelStyle() {
        let found = this.options.find(opt => {
          return opt.val === this.value;
        });
        if (found && found.styles)
          return found.styles;
        return {};
      },

      listStyle() {
        if(this.width)
          return "width: " + this.width;
      }
    },

    watch: {
      value_data(n) {
        this.$emit('update:val', n);
      },
      val(n) {
        this.value_data = n;
      }
    },

    created() {
    },

    methods: {
      openList() {
        if(this.disabled) return;

        if (!this.isOpen) {
          this.isOpen = true;
          this.onInputStart(this.value_data);
        } else {
          this.isOpen = false;
        }
      },
      clickTargetItem(item) {
        this.value_data = item.val;
        // setLog가 val 변경 전에 실행되는 문제가 있어서 추가함.
        this.$emit('input', this.value_data);
        this.$emit('selected', item);
        this.onInputDone(item.val);
        this.isOpen = false;
      },

      onInputStart(val) {
        this.oldValue = val;
      },

      onInputDone(val) {
        // this.value_data = val;
        if (this.oldValue !== this.value_data) {
          this.$emit('change');
        }
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .prop-item
    font-size .8rem
    position relative

  .base-dropdown-input
    border 1px solid #eee
    border-radius 3px
    position relative

  .prop-drop-down-select-wrapper
    display flex
    align-items center
    background #fff
    justify-content space-between
    font-size .8rem
    height 32px
    cursor pointer
    padding 0 6px 0 10px
  // border 1px solid #EEEEEE
  // padding 0 2px
  // border-radius 3px

  .prop-drop-down-select-item
    display flex
    align-items center
    cursor pointer
  // width 24px

  .prop-drop-down-arrow-icon
    font-size 18px
    width 18px
    color #999
    cursor pointer
    margin-left 8px
    flex 0
    position absolute
    right 4px
    top 7px

  .prop-drop-down-list
    position absolute
    // box-shadow 3px 4px 8px 0px #999
    background-color #fff
    // border-radius 3px
    z-index 12
    // border 1px solid #ddd
    bottom 32px
    left 0
    width 100%
    cursor pointer
    box-shadow 0 1px 4px rgba(204,204,204,0.5)
    max-height 600px
    overflow auto
  // border-top none

  .prop-drop-down-item
    background-color #fff
    padding 4px
    font-size .8rem
  .prop-drop-down-item:hover
    background-color #ddd


</style>
