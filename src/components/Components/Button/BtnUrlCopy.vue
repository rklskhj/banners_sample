<template>
  <div class="flex-align unselect" @click="doCopy">
    <div :style="elStyle" class="ellipsis" style="width:85%">{{ url }}</div>
    <div class="size-14" style="width:15%;background-color:red"
      :style="copyIcon">복사</div>
    <!-- <div :style="brandColor.sub" style="font-size:11px;text-align:center;margin-top:4px">URL을 누르시면 복사할 수 있습니다</div> -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard);

  export default {
    name: "BtnUrlCopy",
    props: {
      url: {
        type: String,
        default: location.href
      }
    },

    computed: {
      elStyle() {
        return {
          border: this.brandBorder.main.border,
          height: '44px',
          lineHeight: '44px',
          fontSize: '13px',
          borderRadius: '8px 0 0 8px',
          backgroundColor: this.getColor('보조 배경 색상 02'),
          color: this.getColor('보조 내용 색상 02'),
          padding: '0 8px'
        };
      },
      copyIcon() {
        return {
          height: '44px',
          lineHeight: '44px',
          color: 'white',
          borderRadius: '0 8px 8px 0',
          border: this.brandBorder.primary.border,
          backgroundColor: this.getColor('Primary Color'),
          textAlign: 'center'
        }
      }
    },
    methods: {
      doCopy() {
        this.$copyText(this.url).then(() => {
          this.toast('URL이 복사되었습니다.')
          this.$emit('onShare');
        }, () => {
          this.toast('URL 복사에 실패했습니다.')
        })
      }
    }
  }
</script>

<style scoped>

</style>