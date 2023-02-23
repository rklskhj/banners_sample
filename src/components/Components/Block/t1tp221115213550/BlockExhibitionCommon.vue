<template>
<div class="full-width" :style="[containerBg, pagePadding]" style="padding:25px 0" ref="blockWrap">
    
    <div class="full-width" style="margin-bottom: 16px">
      <div v-if="title !== ''" class="size-18 weight-500 p-main">{{ title }}</div>
      <div v-if="subTitle !== ''" class="size-13 p-sub" style="margin-top:8px">{{ subTitle }}</div>
    </div>
    
    <div v-for="(item, idx) in list" :key="'item-'+idx" 
      class="full-width unselect" @click="clickCat(item)"
      :style="itemStyle(idx)">
      <e-image :isBg="false" :isLazy="false" :img="item.img"
      :useThumb="true" :width="width" :imageRates="imageRates"
      :style="imgRadius"></e-image>
      <div class="full-width margin-bottom-4" :style="menuTitle">
        {{ item.title }}
      </div>
      <div class="full-width" :style="menuSubtitle">{{ item.desc }}</div>
    </div>
  </div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockExhibitionCommon',
  components: {

  },
  mixins: [
    BlockMixin
  ],
  props: {

  },
  data() {
    return {
      "ids": [
        1,
        2,
        3
      ],
      "list": [],
      "title": "기획전 목록",
      "width": 0,
      "bgColor": "brandBgColor.main",
      "subTitle": "",
      "imageRates": {
        "ratio": "5:3"
      },
      "titleStyle": {
        "size": 16,
        "align": "left",
        "color": "brandColor.main",
        "weight": "500"
      },
      "visibleNum": 12,
      "slickOptions": {
        "dots": false,
        "arrows": false,
        "autoplay": false,
        "infinite": true,
        "centerMode": false,
        "slidesToShow": 1,
        "swipeToSlide": true,
        "autoplaySpeed": "",
        "centerPadding": "",
        "variableWidth": true
      },
      "subtitleStyle": {
        "size": 14,
        "align": "left",
        "color": "brandColor.sub",
        "weight": "normal"
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.$nextTick(() => {
      this.width = this.$refs.blockWrap.clientWidth - (this.pagePaddingAll.padding.substring(0,2) * 2);
    })
  },
  
  methods: {
    getData() {
      let query = '';
      if(this.ids.length>0) {
        query = '&ids=' + this.ids.toString();
      }
      this.$axios.get(`public/exhibition?ordering=id${query}`)
      .then(res => {
        this.list = res.data.data.slice(0,this.visibleNum);
      })
    },
    clickCat(item) {
      this.routerPush(`exhibition_detail?id=${item.id}`);
    },
    itemStyle(idx) {
      let deco = {
        marginBottom: '16px',
      }
      if (idx === this.list.length - 1) {
        deco.marginBottom = '0px';
      }
      return deco;
    }
  },
  computed: {
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor)
      }
    },
    menuTitle() {
      return {
        marginTop: '12px',
        fontSize: this.titleStyle.size + 'px',
        fontWeight: this.titleStyle.weight,
        color: this.parseColor(this.titleStyle.color),
        textAlign: this.titleStyle.align,
      } 
    },
    menuSubtitle() {
      return {
        fontSize: this.subtitleStyle.size + 'px',
        fontWeight: this.subtitleStyle.weight,
        color: this.parseColor(this.subtitleStyle.color),
        textAlign: this.subtitleStyle.align,
      } 
    },
    imgRadius() {
      return {
        borderRadius: '8px'
      }
    }
  },
  watch: {
    
  }
}
</script>


