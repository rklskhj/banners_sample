<template>
  <div class="c-region-container
              c-root
              position-relative">

    <!-- 헤더 -->
    <div :style="headerStyle">
      <div class="dummy"></div>
      <div class="title">지역선택</div>
      <div class="close" @click="$emit('close')">
        <i class="material-icons">close</i>
      </div>
    </div>

    <div class="c-region">
      <!-- '시도 선택' / '시군구 선택' -->
      <div class="sort-header">
        <div class="sort-sido"
             :style="sortStyle">시/도 선택</div>
        <div class="sort-sigungu"
             :style="sortStyle">시/군/구 선택</div>
      </div>
      <!-- 시도/시군구 데이터 -->
      <div class="result-content"  :style="contentHeight">
        <!-- 시도 (좌측) -->
        <div class="result-sido-wrap"
             :style="sidoWrapStyle">
          <div class="result-sido">
            <div v-for="(item, idx) in sido"
                 :key="`sido${idx}`"
                 class="sido-item"
                 :style="itemStyle(item, 'sido')"
                 @click.stop.prevent="clickSido(item)"
                 @mouseover.stop.prevent="overSido(item)"
                 @mouseleave.stop.prevent="leaveSido">
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 시군구 (우측) -->
        <div class="result-sigungu-wrap"
             :style="sigunguWrapStyle">
          <div class="result-sigungu">
            <div v-for="(item, idx) in sigungu"
                 :key="`sigungu${idx}`"
                 class="sigungu-item"
                 :style="itemStyle(item, 'sigungu')"
                 @click.stop.prevent="clickSigungu(item)"
                 @mouseover.stop.prevent="overSigungu(item)"
                 @mouseleave.stop.prevent="leaveSigungu">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'c-region',

    props: {
      type: {
        type: String,
        default: 'service'  // 'basic'
      }
    },

    data() {
      return {
        sido: [],             // 시도 데이터
        sigungu: [],          // 시군구 데이터
        dong: [],             // 동 데이터
        selectedSido: {},     // 클릭된 시도
        selectedSigungu: {},  // 클릭된 시군구
        hoverSido: {},        // 마우스오버 시도
        hoverSigungu: {},     // 마우스오버 시군구
        contentHeight: ''
      };
    },

    computed: {
      headerStyle() {
        return {
          backgroundColor: 'white',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          padding: '0 12px',
          justifyContent: 'space-between'
        };
      },
      sortStyle() {
        return {
          color: this.brandColor.main.color,
          backgroundColor: this.brandBgColor.main
        };
      },
      sidoWrapStyle() {
        return {
          borderRight: `1px solid ${this.brandBgColor.main}`,
          borderBottom: `1px solid ${this.brandBgColor.main}`
        };
      },
      sigunguWrapStyle() {
        return {
          borderBottom: `1px solid ${this.brandBgColor.main}`
        };
      }
    },

    created() {
      // 시/도 데이터 가져오기
      this.$axios.get(`public/address/${this.type}/sido`)
        .then(res => {
          if ( res.status === 200 ) {
            this.sido = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });

      this.contentHeight = `max-height:${window.innerHeight - 148}px`;
      window.addEventListener('resize', () => {
        this.contentHeight = `max-height:${window.innerHeight - 148}px`;
      });
    },

    methods: {
      // 마우스 오버, 클릭 style 때문에 methods로 처리
      itemStyle(item, type) {
        let deco = {
          color: this.brandColor.main.color,
          borderBottom: `1px solid ${this.brandBgColor.main}`
        };

        // 시도 아이템: 마우스오버 or 클릭 시 배경색상
        if ( type === 'sido' && item !== undefined ) {
          if ( item.id === this.hoverSido.id || item.id === this.selectedSido.id ) {
            deco.background = this.brandBgColor.main;
          }
        }

        // 시군구 아이템: 마우스오버 or 클릭 시 배경색상
        if ( type === 'sigungu' && item !== undefined ) {
          if ( item.id === this.hoverSigungu.id || item.id === this.selectedSigungu.id ) {
            deco.background = this.brandBgColor.main;
          }
        }

        return deco;
      },
      clickSido(item) {
        // 시군구 데이터 가져오기
        this.$axios.get(`public/address/${this.type}/sido/${item.id}/sigungu`)
          .then(res => {
            if ( res.status === 200 ) {
              this.sigungu = res.data;
              this.selectedSido = item;
              this.selectedSigungu = {};
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      clickSigungu(item) {
        this.selectedSigungu = item;
        this.$emit('selectedRegion', {
          sido: this.selectedSido,
          sigungu: this.selectedSigungu
        });
      },
      overSido(item) {
        this.hoverSido = item;
      },
      leaveSido() {
        this.hoverSido = {};
      },
      overSigungu(item) {
        this.hoverSigungu = item;
      },
      leaveSigungu() {
        this.hoverSigungu = {};
      },
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>

  .sort-header
    .result-content
      display flex
      max-height 640px

    .sort-sido
    .sort-sigungu
    .result-sido-wrap
    .result-sigungu-wrap
      width 50%

    .sort-sido
    .sort-sigungu
      padding 12px 16px
      font-weight bold
    // color #303841  //text
    // background #f9f9f9  //point

    .result-sido-wrap
    .result-sigungu-wrap
      width 50%
      overflow-x hidden
    // border-right 1px solid #f9f9f9  //point

    .result-sido
    .result-sigungu
      width calc(100% + 17px)
      height 100%
      overflow-y scroll

    .sido-item
      padding 12px 32px
      // color #81868b  //text
      // border-bottom 1px solid #f9f9f9  //point
      cursor pointer

    .sigungu-item
      padding 12px 32px
      // color #81868b  //text
      // border-bottom 1px solid #f9f9f9 //point
      cursor pointer

    .sido-item:hover
    .sigungu-item:hover
      background #f9f9f9 //point

    .selected-sido
    .selected-sigungu
      background #f9f9f9 //point

    .title
      text-align center
      font-size 1rem

    .dummy
    .close
      width 20px
      height 20px
      cursor pointer
    .close i
      font-size 20px

</style>
