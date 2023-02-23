<template>
<div v-if="partner"  class="position-relative" 
     :style="brandBgColor.main" style="padding-top:16px;padding-bottom: 80px;">
  <div class="flex-center" ref="tabMenu"
    :style="[fixedStyle, {borderBottom: brandBorder.main.border}]">
    <div v-for="(item,idx) in menu" :key="'menu-'+idx" class="tab-item"
         :style="tabItemStyle(item)"
         @click="clickMenuItem(item, idx)">{{ item.name }}<span v-if="item.count" style="margin-left:4px">{{ item.count }}</span></div>
  </div>
  
  <div id="item1">
    <div :style="pagePadding" 
         style="padding-top:24px;padding-bottom:24px;">
      <template v-if="partner.phone && partner.phone !== ''">
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">call</i>
          <a :href="`tel:${partner.phone}`" style="text-decoration:none">
            <div class="size-14 p-primary">{{ partner.phone }}</div>
          </a>
        </div>
      </template>
      <template v-if="partner.address && partner.address !== ''">
        <div class="divider"></div>
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">location_on</i>
          <div class="flex-1 size-14">{{ partner.address }}</div>
          <div class="flex-align" style="margin-left:6px; gap: 0 2px" :style="brandColor.primary" @click="clickAddress">
            <i class="material-icons" style="font-size:16px">content_copy</i>
            <div class="size-14">복사</div>
          </div>
        </div>
      </template>
      <template v-if="partner.operating_time && partner.operating_time !== ''">
        <div class="divider"></div>
        <div class="flex">
          <i class="material-icons-outlined icon-info p-sub3">access_time</i>
          <div class="size-14">영업시간
            <div style="white-space:pre-line">{{ partner.operating_time }}</div>
          </div>
        </div>
      </template>
      <template v-if="partner.homepage && partner.homepage !== ''">
        <div class="divider"></div>
        <div class="flex-align">
          <i class="material-icons-outlined icon-info p-sub3">home</i>
          <a :href="partner.homepage" target="_blank" style="text-decoration:none">
            <div class="size-14" :style="brandColor.primary">{{ partner.homepage }}</div>
          </a>
        </div>
      </template>
      <!-- SNS 문의 전환-->
      <template v-if="$store.getters.brand.plugins.indexOf('sns_inquiry') > -1">
        <div class="divider"></div>
        <div class="flex-align" style="height: 32px">
          <div class="flex-between" style="gap: 0 12px">
            <span style="width: 32px; height: 32px"
              :style="!isHomepageActive ? deactivated : ''">
              <a class="unselect" :href="`${getHomepageHref}`" target="_blank"
                :style="!isHomepageActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickHomepageBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/47403855.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isKakaoActive ? deactivated : ''">
              <a class="unselect" :href="'#'" target="_blank"
                :style="!isKakaoActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click.prevent="clickKakaoBtn">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/04669285.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isInstagramActive ? deactivated : ''">
              <a class="unselect" :href="`${getInstagramHref}`" target="_blank"
                :style="!isInstagramActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickInstagramBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/11063162.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
            <span style="width: 32px; height: 32px"
              :style="!isNaverBlogActive ? deactivated : ''">
              <a class="unselect" :href="`${getNaverBlogHref}`" target="_blank"
                :style="!isNaverBlogActive ? deactivatedLink : ''"
                style="text-decoration: none; display: inline-block" @click="clickNaverBlogBtn($event)">
                <e-image
                  :img="'https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/17025317.png'"
                  :width="32" :imageRates="{ratio:'1:1'}" :isLazy="false" :isBg="false"></e-image>
              </a>
            </span>
          </div>
        </div>
      </template>
    </div>
    <div class="divider-big"></div>
    <div style="padding: 24px 0" :style="pagePadding">
      <e-editor :html="partner.info" :style="brandBgColor.white"></e-editor>
    </div>
    <div class="divider-big"></div>
  </div>
  <div id="item2" :style="pagePadding" style="padding-bottom: 24px" class="p-border-bottom-sub">
    <list-partner-product></list-partner-product>
  </div>
  <div id="item3" :style="pagePadding" style="padding-top:24px" class="p-border-bottom-sub">
    <list-product-review :isProd="false" @totalCount="res => setTotalCount('review', res)"></list-product-review>  
  </div>
  
  <div id="item4" :style="pagePadding" style="padding-top:24px" class="p-border-bottom-sub">
    <list-product-inquiry :isProd="false" @totalCount="res => setTotalCount('inquiry', res)"></list-product-inquiry>  
  </div>
  
  <div v-if="partner.address" style="margin-top:50px" :style="pagePadding">
    <div class="size-18 weight-500 margin-bottom-16" :style="brandColor.main">위치</div>
    <location-map-block :address="partner.address" :latitude="partner.location.latitude" :longitude="partner.location.longitude"
      :mapStyle="mapStyle"></location-map-block>
    <div class="flex-between" style="margin-top:16px" :style="brandColor.sub">
      <div class="flex-align" style="flex:1"><i class="material-icons-outlined" style="font-size:20px">location_on</i>
      <div style="padding-right:12px" class="size-12">{{ partner.address }}</div></div>
      <div class="flex-align size-10" @click="clickAddress"><i class="material-icons-outlined" style="font-size:13px">content_copy</i>
      <div>주소복사</div></div>
    </div>
  </div>
  
</div>
</template>
<script>
import ListPartnerProduct from "@/components/Components/List/ListPartnerProduct.vue"
import ListProductReview from "@/components/Components/List/ListProductReview.vue"
import ListProductInquiry from "@/components/Components/List/ListProductInquiry.vue"
import LocationMapBlock from "@/components/Components/Common/LocationMapBlock.vue"

export default {
  name: 'BlockPartnerDetailTab',
  components: {
    ListPartnerProduct,
    ListProductReview,
    ListProductInquiry,
    LocationMapBlock
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "top": 50,
      "menu": [
        {
          "id": 0,
          "name": "소개",
          "value": "introduce"
        },
        {
          "id": 1,
          "name": "전체상품",
          "value": "product"
        },
        {
          "id": 2,
          "name": "후기",
          "count": 0,
          "value": "review"
        },
        {
          "id": 3,
          "name": "문의",
          "count": 0,
          "value": "inquiry"
        }
      ],
      "partner": undefined,
      "mapStyle": {
        "width": "100%",
        "height": "200px"
      },
      "tabFixed": false,
      "review_list": undefined,
      "selectedTab": 0,
      "inquiryCount": undefined,
      "inquiry_list": undefined
    }
  },
  created() {
    this.getPartner();
  },
  mounted() {
    let ob = new this.ResizeObserver((e) => {
      this.top = e[0].contentRect.height + document.getElementsByClassName('page-header')[0].getBoundingClientRect().height;
    })
    ob.observe(document.getElementById('tap-bar-wrapper'));
    if (document.getElementsByClassName('header-container')[0] !== undefined) {
      let ob2 = new this.ResizeObserver((e) => {
        this.top = e[0].contentRect.height + document.getElementsByClassName('page-header')[0].getBoundingClientRect().height;
      })
      ob2.observe(document.getElementsByClassName('header-container')[0]);
    }
    this.$nextTick(() => {
      if (this.$route.query.tab && Number(this.$route.query.tab) === 1) {
        setTimeout(()=>{
          this.clickMenuItem(this.menu[Number(this.$route.query.tab)], Number(this.$route.query.tab))
          
        }, 1000);
        
      }
    })
    document.addEventListener('scroll', this.detectClientHeight);
  },
  activated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
  deactivated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
  beforeDestroy() {
    document.removeEventListener('scroll', this.detectClientHeight);
  },
  
  methods: {
    detectClientHeight() {
      this.$nextTick(function() {
        if(this.$refs.tabMenu) {
          if (document.documentElement.scrollTop > 240) {
            this.tabFixed = true;
          }
          else {
            this.tabFixed = false;
          }
        }
      })
    },
    clickMenuItem(item, idx) {
      this.selectedTab = item.id;
      let element = document.getElementById(`item${idx+1}`)
      let offset = window.pageYOffset + element.getBoundingClientRect().top - 40
      if (!this.tabFixed) {
        offset -= this.top + this.$refs.tabMenu.clientHeight;
      } else {
        offset -= this.top;
      }
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    },
    getPartner() {
      this.$api.PartnerDetail(this).then(res => {
        this.partner = res;
      })
    },
    clickAddress() {
      this.$copyText(this.partner.address).then(e => {
        this.toast('주소가 복사되었습니다.')
      }, e => {
        this.toast('주소복사에 실패했습니다.')
      })
    },
    tabItemStyle(item) {
      let deco = {
        color: this.brandColor.main.color,
        padding: '0 24px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: '14px',
        borderBottom: '2px solid transparent'
      };
      if(this.selectedTab === item.id) {
        deco.color = this.brandColor.primary.color;
        deco.borderBottom = this.brandBorder.primary.border.replace('1px', '2px');
      }
      return deco;
    },
    setTotalCount(key, count) {
      count = count > 99 ? '99+' : count;
      this.menu.filter(item=>{ return item.value === key })[0].count = count;
    },
    clickNaverBlogBtn(e) {
      if (this.isNaverBlogActive) {
        this.setGa('네이버 블로그 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/naver`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickKakaoBtn() {
      if (this.partner.kakao !== '' && this.partner.kakao !== null) {
        if (this.partner.kakao.indexOf('pf.kakao.com/') !== -1) {
          const a = document.createElement("a");
          a.style.display = 'none';
          a.onclick = this.clickLink(this.partner.kakao);
          document.body.appendChild(a);
          a.click();
          a.parentNode.removeChild(a);
        } else {
          Kakao.Channel.chat({
            channelPublicId: this.partner.kakao
          });
        }
        this.setGa('카카오톡 채널 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/kakao`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickLink(href) {
      window.open(href, '', 'width=440,height=768');
      return false;
    },
    clickInstagramBtn(e) {
      if (this.isInstagramActive) {
        this.setGa('인스타그램 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/instagram`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    },
    clickHomepageBtn(e) {
      if (this.isHomepageActive) {
        this.setGa('홈페이지 바로가기', '클릭', `파트너 id: ${this.$route.query.id}`, this.$route.query.id);
        // this.$axios.post(`/public/product/${this.$route.query.id}/share/homepage`).then(res => {
        //   if (res.status === 200) {
        //   }
        // })
      }
    }
  },
  computed: {
    fixedStyle() {
      if (this.tabFixed) {
        return {
          width: `${this.$store.getters.deviceWidth}px`,
          backgroundColor: 'white',
          position: 'fixed',
          zIndex: 1,
          top: `${this.top}px`
        }
      } else {
        return {}
      }
    },
    isNaverBlogActive() {
      if (this.partner.enable_naver) {
        if (this.partner.naver !== '' && this.partner.naver !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isKakaoActive() {
      if (this.partner.enable_kakao) {
        if (this.partner.kakao !== '' && this.partner.kakao !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isInstagramActive() {
      if (this.partner.enable_instagram) {
        if (this.partner.instagram !== '' && this.partner.instagram !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    isHomepageActive() {
      if (this.partner.enable_homepage) {
        if (this.partner.homepage !== '' && this.partner.homepage !== null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    getNaverBlogHref() {
      return this.partner.naver;
    },
    getInstagramHref() {
      return this.partner.instagram;
    },
    getHomepageHref() {
      return this.partner.homepage;
    },
    deactivated() {
      return {
        opacity: '0.2',
        cursor: 'not-allowed',
      }
    },
    deactivatedLink() {
      return {
        pointerEvents: 'none',
        
      }
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}
.icon-info {
  font-size: 20px;
  margin-right: 6px;
}

.divider {
  height: 1px;
  background-color: #f8f8f8;
  margin: 12px 0;
}

.divider-big {
  height: 8px;
  background-color: #f8f8f8;
}
</style>

