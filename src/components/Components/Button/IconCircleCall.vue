<template>
<div>
  <div class="flex-center" :style="[iconWrapStyle]" @click="clickBtn">
    <i class="material-icons unselect" :style="iconStyle">{{ icon }}</i>
  </div>
  <div class="page-modal">
    <sweet-modal ref="callModal" overlay-theme="dark" @close="onCloseModal">
      <modal @confirm="clickCall" @cancel="$refs.callModal.close()" style="padding:20px">
        <div slot="header">전화연결</div>
        <div slot="content">확인 버튼을 누르시면 전화연결이 진행됩니다. 진행하시겠습니까?</div>
      </modal>
    </sweet-modal>
  </div>
</div>
</template>

<script>
  export default {
    name: "IconCircleCall",
    props: {
      size: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: 'sub'
      },
      icon: {
        type: String,
        default: 'call'
      },
      width: {
        type: Number,
        default: 48,
      },
      height: {
        type: Number,
        default: 48,
      },
      borderRadius: {
        type: Number,
        default: 8,
      },
      call: {
        type: String,
        required: true
      }
    },
    methods: {
      onCloseModal(){
        setTimeout(()=>{
          let body = document.getElementsByTagName('body')[0];
          body.removeAttribute('style');
        },500);
      },
      clickBtn() {
        this.$refs.callModal.open();
      },
      clickCall() {
        location.href = `tel:${this.call}`;
        this.$refs.callModal.close();
      },
    },
    computed: {
      iconStyle() {
        let deco = this.brandColor[this.color];
        deco.fontSize = this.size+'px';
        deco.height = deco.fontSize;
        return deco;
      },
      iconWrapStyle() {
        let deco = {
          backgroundColor: `${this.getColor('기본 배경 색상')}`
        }

        if(this.width) deco.width = `${this.width}px`;
        if(this.height) deco.height = `${this.height}px`;
        if(this.borderRadius) deco.borderRadius = `${this.borderRadius}px`;

        return deco;
      },
      letterStyle() {
        return {
          marginLeft: '6px',
          whiteSpace: 'pre',
          color: this.getColor('보조 내용 색상')
        }
      }
    }
  }
</script>
