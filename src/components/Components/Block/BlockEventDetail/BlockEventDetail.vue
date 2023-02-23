<template>
<div class="p-main" style="padding: 16px 0px 100px" :style="pagePadding" v-if="detail">
  <e-image :isBg="true" :isLazy="true" :img="detail.img"
    class="position-relative" :useRatio="false"
    width="100%" :height="200"
    style="margin:0 0 12px" :style="lrMargin">
    <div slot="inner" class="position-absolute layer-box flex-center">
      <div style="width:170px">
        <div class="size-24 weight-700 text-center p-white">{{ detail.title }}</div>
          
        <div class="size-12 text-center p-white">{{ formattedDate() }}</div>
      </div>
    </div>
  </e-image>

  <div class="size-14 p-main">
    <e-editor :html="detail.content" style="padding:0"></e-editor>
  </div>
  <div style="margin-top: 22px">
    <div @click="$router.push('/event')"
      class="unselect flex-justify size-14 radius-8 p-sub2 p-border-main"
      style="height: 48px; align-items: center">목록</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockEventDetail',
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "detail": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios.get(`public/board/event/${this.$route.query.id}`)
      .then(res => {
        this.detail = res.data;
      })
    },
    formattedDate() {
      if (this.detail.start_date === '1111-01-01' && this.detail.end_date === '9999-01-01') {
        return '상시';
      } else {
        return `${this.dateFormat(this.detail.start_date, 'date_3')} ~ ${this.dateFormat(this.detail.end_date, 'date_3')}`
      }
    }
  },
  computed: {
    lrMargin() {
      let deco = this.cloneItem(this.pagePadding);
      Object.keys(deco).forEach(i => {
        Object.defineProperty(deco, i.replace('padding', 'margin'), Object.getOwnPropertyDescriptor(deco, i));
        delete deco[i];
        deco[i.replace('padding', 'margin')] = `-${deco[i.replace('padding', 'margin')]}`;
      })
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.layer-box {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.3);
}
</style>

