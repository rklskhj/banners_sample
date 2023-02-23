<template>
  <div class="modal-wrapper">
    <!-- Header -->
    <div class="modal-header">
      <slot name="header"></slot>
    </div>

    <!-- Content -->
    <div class="modal-content">
      <slot name="content"></slot>
    </div>

    <!-- Bottom -->
    <div class="modal-bottom">
      <div v-if="cancel" class="unselect" :style="cancelStyle" @click="$emit('cancel')">{{ cancelName }}</div>
      <div class="unselect" :style="confirmStyle" @click="$emit('confirm')">{{ confirmName }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "modal",
    props: {
      cancel: {
        type: Boolean,
        default: true
      },
      cancelName: {
        type: String,
        default: '취소'
      },
      confirmName: {
        type: String,
        default: '확인'
      }
    },
    computed: {
      cancelStyle() {
        let deco = {
          color: '#393e46',
          backgroundColor: '#f7f7f7',
          padding: '12px 24px',
          margin: '0 4px',
          borderRadius: this.radius.borderRadius,
          cursor: 'pointer',
          textAlign: 'center'
        };
        return deco;
      },
      confirmStyle() {
        let deco = {
          color: 'white',
          backgroundColor: this.getColor('브랜드 강조 색상'),
          padding: '12px 24px',
          margin: '0 4px',
          borderRadius: this.radius.borderRadius,
          cursor: 'pointer',
          textAlign: 'center'
        };
        if(!this.cancel)
          deco.width = '100%';
        return deco;
      }
    }
  }
</script>

<style type="stylus" lang="stylus" scoped>
  .modal-wrapper
    padding 0

  .modal-header
    color #777
    font-size 20px !important

  .modal-content
    color: #555
    font-size 15px !important
    margin 24px 0

  .modal-bottom
    margin-top 56px
    display flex
    justify-content flex-end
</style>