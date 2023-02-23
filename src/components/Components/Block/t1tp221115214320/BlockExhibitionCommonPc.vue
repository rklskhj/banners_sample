<template>
<div class="flex-justify" style="min-height: 200px; padding:40px 0">  
      
  <div class="full-width" :style="pcMaxWidth">
    <div class="full-width" style="margin-bottom:24px">
      <div v-if="title !== ''" class="size-22 weight-700 p-main">{{ title }}</div>
      <div v-if="subTitle !== ''" class="size-14 p-sub" style="margin-top:8px">{{ subTitle }}</div>
    </div>
    
    <div class="grid-wrap full-width" ref="imgWrap">
      <div v-for="(item, idx) in list" :key="'item-'+idx" 
        class="unselect" @click="clickCat(item)" :style="itemStyle(idx)">
          <e-image :isBg="false" :isLazy="false" :img="item.img"
            :useThumb="true" :width="width" :imageRates="imageRates"
            :style="imgRadius"></e-image>
          <div style="padding: 24px 24px 32px 24px">
            <div class="full-width margin-bottom-4" :style="menuTitle">
              {{ item.title }}
            </div>
            <div class="full-width" :style="menuSubtitle">{{ item.desc }}</div>
          </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin"

export default {
  name: 'BlockExhibitionCommonPc',
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
      "cumWidth": undefined,
      "infState": undefined,
      "reRender": true,
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
      "visibleNum": 3,
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
    this.setBg();
    this.$nextTick(() => {
      this.width = (this.$refs.imgWrap.clientWidth - 48) / 3;
    })
  },
  
  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(this.bgColor);
    },
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
        borderRadius: '8px',
        border: this.brandBorder.main.border
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
        borderRadius: '8px 8px 0 0'
      }
    }
  },
  watch: {
    bgColor() {
      this.setBg();
    }
  }
}
</script>
<style scoped>
.grid-wrap {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 24px
  }
.img-wrap {
  width: 80px;
  height: 80px;
  border: 1px solid #D8D8D8;
  background-color: white;
}
.cat-img {
  width: 172px;
  height: 172px;
  border-radius: 8px;
  object-fit: cover;
}
</style>

