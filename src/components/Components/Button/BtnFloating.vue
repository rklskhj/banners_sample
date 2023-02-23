<template>
  <div :style="containerStyle"
       class="unselect flex-center wrap"
       style="align-content:center;"
       @click="clickButton">
    <i class="material-icons"
       :class="[ $store.getters.device === 'mobile' ? 'mobile-icon' : 'pc-icon' ]">
      {{ icon }}
    </i>
    <div :class="[ $store.getters.device === 'mobile' ? 'mobile-text' : 'pc-text' ]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BtnFloating",
    props: {
      align: {
        type: String,
        default: 'right'
      },
      icon: {
        type: String,
        required: false
      },
      type: {
        type: String,
        default: 'circle'
      },
      link: {
        type: String,
        required: true
      },
      linkType: {
        type: String,
        default: 'page'
      },
      backgroundColor: {
        type: String,
        default: '#ffffff'
      }
    },
    computed: {
      containerStyle() {
        let deco = {
          position: 'fixed',
          bottom: '24px',
          textAlign: 'center',
          color: 'white',
          padding: '6px',
          zIndex: 1000,
          backgroundColor: this.backgroundColor
        }

        if(this.$store.getters.device === 'pc') {
          deco.bottom = '48px';
        }

        deco.height = '60px';
        if(this.type === 'circle') {
          deco.width = '60px';
          deco.borderRadius = '100%';
        }
        else if(this.type === 'pill') {
          deco.minWidth = '120px';
          deco.borderRadius = '36px';
        }

        deco.boxShadow = '0 5px 20px 0 rgba(44, 39, 39, 0.16)';

        if(this.align !== 'center') {
          if (this.$store.getters.device === 'mobile') {
            deco[this.align] = '24px';
          } else {
            deco[this.align] = `calc(50% - ${this.$store.getters.deviceWidth/2 - 24}px)`;
          }
        } else {
          deco.left = 'calc(50% - 30px)';
        }

        return deco;
      }
    },
    methods: {
      clickButton() {
        if(this.linkType !== 'page') {
          this.$emit('clicked');
        }
        else
          this.routerPush(this.link);
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .mobile-icon
    font-size 22px
    height 22px
    margin-bottom 3px

  .mobile-text
    font-size 11px
    margin-top -2px
    font-weight 500

  .pc-icon
    font-size 22px
    height 22px

  .pc-text
    font-size 12px
    line-height 22px
    font-weight 500
    margin-top -2px
    margin-left 2px

</style>