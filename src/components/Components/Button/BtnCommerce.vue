<template>
  <div>
    <btn
        @clicked="clickBtn"
        :color="brandColor.white"
        :backgroundColor="brandBgColor.brand"
        :customStyle="customStyle"
        :ga="ga"
        class="position-relative"
    >
      <div class="flex-justify position-relative" style="align-items: center; width: 100%">
        <div>{{ name }}</div>
        <i v-if="product.price.price === 0 && $store.getters.browserType === 'pc'"
          style="right: 8px" :style="brandColor.white"
          class="position-absolute size-20 material-icons">{{ toggleDownload ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
      </div>
      <div v-if="toggleDownload && $store.getters.browserType === 'pc'" class="position-absolute"
        style="width: 290px; top: 50px; left: 0; border-radius: 4px"
        :style="[brandBorder.sub, brandBgColor.white]">
        <div v-for="(option, idx) in product.selectors[0].options"
          :key="'option-'+idx"
          @click="downloadFile(option)"
          class="flex-between unselect download-file-box"
          style="width: 100%; height: 48px; padding: 14px 12px"
          :style="boxStyle(idx)">
          <div class="size-14 weight-500" :style="brandColor.main">{{ `${option.name}.${option.file_ext.extension}` }}</div>
          <i class="size-20 material-icons" :style="brandColor.main">save_alt</i>
        </div>
      </div>
    </btn>
  </div>
</template>

<script>
  export default {
    name: "BtnCommerce",

    props: {
      product: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        default: '다운로드'
      },
      customStyle: {
        type: Object,
        required: false
      },
      // Google Analytics 세팅할 경우
      ga: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        "toggleDownload": false
      }
    },
    created() {
      if (this.product && this.product.price.price !== 0) {
        this.name = '결제 및 다운로드';
      }
    },
    methods: {
      clickBtn() {
        if (this.product.price.price === 0) {
          if (this.$store.getters.browserType === 'mobile') {
            this.$root.$emit('page_actionsheet', 'ProductDownloadSheet', {card: this.product});
          } else {
            this.toggleDownload = !this.toggleDownload;
          }
        } else {
          this.$router.push(`order_commerce?id=${this.$route.query.id}`);
        }
      },
      downloadFile(option) {
      this.$axios.get(`public/commerce/download/${option.id}`, {responseType: 'blob'}).then(res=> {
        if (res.status === 200) {
          this.product.download_count += 1;
          let blob = res.data;
          if (window.navigator.msSaveOrOpenBlob) { // for IE 
            window.navigator.msSaveOrOpenBlob((blob), `${option.name}.${option.file_ext.extension}`);  
          } else { // Others
            const reader = new FileReader();
            reader.onloadend = () => {
              const a = document.createElement("a");
              a.href = reader.result;
              a.style.display = 'none';
              a.setAttribute('download', `${option.name}.${option.file_ext.extension}`);
              document.body.appendChild(a);
              a.click();
              a.parentNode.removeChild(a);
            }
            reader.readAsDataURL(blob);
          }
          
          this.toggleDownload = !this.toggleDownload;
          
          if (this.isLogin) {
            this.$axios.post(`user/${this.$store.getters.user.user_id}/commerce/download_log/${option.id}`).then(res => {
              if(res.status ===200) {
                this.toast('파일이 다운로드 되었습니다.');
              }
            })
          }
        }
      })
    },
    boxStyle(idx) {
      if (idx === this.product.selectors[0].options.length - 1) {
        return {
          borderBottom: 'none'
        }
      } else {
        return {
          borderBottom: this.brandBorder.sub.border
        }
      }
    },
    }
  }
</script>

<style scoped>

</style>