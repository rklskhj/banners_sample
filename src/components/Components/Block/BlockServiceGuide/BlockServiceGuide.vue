<template>
<div class="flex wrap position-absolute" :style="containerStyle">

    <div class="top-area full-width flex-align wrap position-absolute"
      style="justify-content:flex-end">
      <transition name="fade">
      <div v-if="currentSlide!==list.length-1" 
        class="click-text unselect size-13"
        :style="brandColor.sub"
        @click="clickStartPage">
        건너뛰기
      </div>
      </transition>
    </div>

    <div class="slide-area" :style="[deviceWidth, calHeight]">
      <slick ref="slick"
        v-if="reRender"
        @afterChange="handleAfterChange"
        :options="slickOptions">
        <div v-for="(item,idx) in list" :key="`guide-${idx}`" :style="deviceWidth">
          <div class="flex-center wrap" :style="deviceWidth">

            <div v-if="item.url!==undefined" class="guide-img" 
              :style="[bgContainStyle(item.url), deviceWidth, calHeight]"
              @click="lastSlide ? clickStartPage() : ''">
            </div>
              
            <!-- <img v-if="item.url!==undefined" class="guide-img" 
              :src="item.url" alt=""
              :style="[deviceWidth, calHeight]"> -->

            <!-- <div v-if="idx===list.length-1" class="full-width flex-center" :style="btnAreaHeight">
              <div class="size-20 start-btn text-center weight-500"
                :style="[brandColor.white, radius, brandBorder.main, brandBgColor.primary]"
                @click="routerPush('home')"
                >{{ $store.getters.service.title }} 시작하기</div>
            </div> -->
          </div>
        </div>
      </slick>
    </div>

    <div class="bottom-area flex-center position-absolute full-width">
      <transition name="fade">
      <div class="flex-center animation" v-if="list.length > 1 && currentSlide!==list.length-1">
        <div v-for="i in Array.from({length:list.length}, (v,k) => k)" :key="'ic'+i" @click="$refs.slick.goTo(i)">
          <div v-if="i === currentSlide" class="indicator" :style="brandBgColor.primary"></div>
          <div v-else class="indicator" style="background-color:#ccc"></div>
        </div>
      </div>
      </transition>
      <transition name="fade">
      <div class="next">
        <div class="click-text unselect animation" 
          :style="lastSlide ? brandColor.primary : brandColor.main"
          @click="clickNext">
          {{ lastSlide ? '확인' : '다음' }}
        </div>
      </div>
      </transition>
    </div>

  </div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockServiceGuide',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": [],
      "reRender": true,
      "currentSlide": 0
    }
  },
  created() {
      this.$axios.get('public/guide')
      .then(res => {
        if (res.status===200) {
          if (res.data.data.length>0) {
            this.list = res.data.data;
            this.$nextTick(() => {
              this.reRenderSlick();
            });
          }
          else {
            this.clickStartPage();
          }
        }
      })
    },
  mounted() {
      this.$nextTick(() => {
        this.reRenderSlick();
      });
    },
  
  methods: {
    handleAfterChange(event, slick, currentSlide) {
        this.currentSlide = currentSlide;
      },
    reRenderSlick() {
        if(this.reRender === false) return;

        this.$nextTick(() => {
          this.reRender = false;
          setTimeout(() => {
            this.reRender = true;
          },500);
        });
      },
    clickNext() {
        if ( this.lastSlide ) {
          this.clickStartPage();
        }
        else {
          this.$refs.slick.next();
        }
      },
    clickStartPage() {
        this.routerPush(this.$store.getters.brand.startpage);
      }
  },
  computed: {
    deviceWidth() {
        return {
          width: this.$store.getters.deviceWidth + 'px'
        }
      },
    calHeight() {
        let height = Math.ceil(this.$store.getters.deviceWidth*16/9);
        return {
          height: height + 'px'
        }
      },
    btnAreaHeight() {
        let height = Math.round(this.$store.getters.deviceWidth/3);
        return {
          height: height + 'px'
        }
      },
    containerStyle() {
        return {
          backgroundColor: this.brandBgColor.main.backgroundColor,
          minHeight: '100vh',
          // alignContent: 'space-between'
          alignItems: 'center'
        }
      },
    // 슬릭 옵션
      slickOptions() {
        return {
          infinite: false,
          centerPadding: '',
          centerMode: false,
          autoplay: false,
          arrows: false,
          dots: false,
        }
      },
    lastSlide() {
        return this.currentSlide===this.list.length-1
      }
  },
  watch: {
    
  }
}
</script>

<style>
.arrow-wrap {
    z-index: 1;
    height: 100vh;
    top: 0;
  }
  .arrow-wrap.material-icons {
    padding: 12px 8px;
  }
  .guide-last {
    padding: 20px;
  }
  .start-btn {
    padding: 12px 16px;
    width: 80%;
  }
  .top-area {
    height: 48px;
    z-index: 1;
    top: 0;
  }
  .bottom-area {
    height: 48px;
    z-index: 1;
    bottom: 0;
  }
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: red;
    margin-right: 4px;
  }  
  .next {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .click-text {
    padding: 10px 12px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
