<template>
<div>
  <div class="flex-align position-relative">
    <i v-if="height >= 500" class="material-icons unselect p-white"
      style="font-size: 44px; position: absolute; top: 0; right: 64px"
      @click="$emit('closePage')">close</i>
    <img src="/static/image/icon/arrow_back_svg.svg" @click="$refs.slider.$refs.slick.prev()">
    <div id="slider-wrap" ref="sliderWrap" style="width:500px;margin:0 80px">
      <image-slider ref="slider"
                    :listData="card.imgs"
                    :useRatio="true"
                    :imageRates="{ratio:'1:1'}"
                    :indicator="true"
                    :height="500"
                    :customNumIndicatorStyle="customNumIndicatorStyle"
                    @change="onChange"
                    indicatorType="num"></image-slider>
    </div>
    <img src="/static/image/icon/arrow_next_svg.svg" @click="$refs.slider.$refs.slick.next()">
  </div>
  
    <div class="flex-align" style="width:500px;margin:32px auto 0 auto">
      <div class="thumb" v-for="(img,idx) in card.imgs" :key="'img-'+idx" 
          :style="thumbStyle(img, idx)" @click="clickThumb(idx)"></div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockReviewImageOverlayPc',
  components: {

  },
  mixins: [

  ],
  props: {
    prop: {
      type: Object,
    },

  },
  data() {
    return {
      "card": {},
      "height": 0,
      "currentIndex": 0,
      "customNumIndicatorStyle": {
        "left": "calc(50% - 24px)",
        "bottom": "20px"
      }
    }
  },
  created() {
    this.card = this.prop.card;
  },
  mounted() {
    this.$nextTick(()=>{
      let ob = new this.ResizeObserver((e) => {
        this.height = e[0].contentRect.height;
      })
      ob.observe(document.getElementById('slider-wrap'));
      
      for(let el of document.getElementsByClassName('sweet-content')) { 
        if(el.offsetHeight>0) {
          el.setAttribute('style', 'padding:0 !important')
        }
      }
      for(let el of document.getElementsByClassName('sweet-box-actions')) { 
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
      for(let el of document.getElementsByClassName('sweet-modal')) { 
        if(el.offsetHeight>0) {
          el.setAttribute('style','max-width:780px;box-shadow:none;background-color:transparent');
        }
      }
    });
  },
  
  methods: {
    clickClose() {
      this.$emit('closePage');
    },
    clickThumb(idx) {
      this.currentIndex = idx;
      this.$refs.slider.$refs.slick.goTo(idx);
    },
    onChange(idx) {
      this.currentIndex = idx;
    },
    thumbStyle(img, idx) {
      let path = img;
      if(path.indexOf('launchpack-')>-1) {
        let ext = path.substring(path.indexOf('.', path.length-8));
        path = path.replace(ext, '_thumb'+ext);
      }
      let deco = {
        backgroundImage: `url(${path})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
      if(this.currentIndex === idx) {
        deco.border = `3px solid ${this.brandColor.primary.color}`;
      } else {
        deco.border = '3px solid transparent';
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>
<style scoped>
.thumb {
    width: 53px;
    height: 53px;
    margin-right: 4px;
  }
</style>

