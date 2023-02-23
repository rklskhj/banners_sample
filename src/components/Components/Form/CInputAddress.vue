<template>
  <div :style="containerStyle">
    <template v-if="showMobile">
      <portal to="input-address-mobile">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 10000">
          <page-header class="p-bg-white" style="left: 0">
            <div slot="left">
              <i class="material-icons header-icon" @click="clickCloseBtn" style="margin: 0 10px;">close</i>
            </div>
            <span class="header-title" slot="center">주소 검색</span>
          </page-header>
        </div>
      </portal>
    </template>

    <div id="cinput-address-content">
      <!-- 레이블 -->
      <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

      <div class="flex-align" :style="addressInputWrapStyle">
        <input
            class="address-zipcode"
            placeholder="우편번호"
            v-model="address.post_code"
            type="text"
            readonly
            :style="[inputStyle, zipcodeStyle]"
        />
        <div class="unselect">
          <div :style="buttonStyle" @click="openDaumPostcode"
            id="open-post-popup">
            <i
                v-if="addressButtonIcon"
                style="margin-right: 7px"
                :class="addressButtonIcon.className"
            >{{ addressButtonIcon.iconName }}</i> 주소 검색
          </div>
        </div>
      </div>
      <div :style="addressInputWrapStyle">
        <input
            v-model="address.new"
            placeholder="시/도 시/군/구"
            class="full-width"
            type="text"
            readonly
            :style="inputStyle"
        />
      </div>
      <div :style="addressInputWrapStyle">
        <input
            :value="address.detail"
            class="full-width"
            @input="e => address.detail = e.target.value"
            type="text"
            placeholder="상세주소"
            :style="inputStyle"
        />
        <!-- :placeholder="address_detail_ph" -->
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    name: "c-input-address",

    head: {
      script() {
        return [
          {
            type: "text/javascript",
            src: "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
            head: true
          }
        ];
      }
    },

    mixins: [FormMixin],

    props: {
      value: {
        type: [Object, String],
        required: false
      },
      label: {
        type: String,
        required: false
      },
      addressInputWrapStyle: {
        type: Object,
        required: false,
        default: function () {
          return {
            marginTop: "4px"
          };
        }
      },
      addressButtonCustomStyle: {
        type: Object,
        required: false
      },
      addressButtonIcon: {
        type: Object,
        required: false
      },
      zipcodeStyle: {
        type: Object,
        required: false
      }
    },

    data() {
      return {
        routerIndex: 1,
        showMobile: false,
        address_detail_ph: "",
        address: {
          sido: "",
          sigungu: "",
          dong: "",
          detail: "",
          post_code: "",
          old: "",
          new: "",
          latitude: "",
          longitude: ""
        }
      };
    },

    watch: {
      value(n) {
        if (!n)
          this.address = {
            sido: "",
            sigungu: "",
            dong: "",
            old: "",
            new: "",
            full: "",
            post_code: "",
            detail: ""
          };
        else this.address = n;
      },
      address: {
        handler(n) {
          this.$emit("update:value", n);
        },
        deep: true
      },
    },

    created() {
      if (!this.value) {
        this.address = {
          sido: "",
          sigungu: "",
          dong: "",
          old: "",
          new: "",
          full: "",
          post_code: "",
          detail: ""
        };
      } else {
        this.address = this.value;
      }
    },
    mounted() {
      if(this.$store.getters.device === 'mobile') {
        window.onpopstate = () => {
          if(this.showMobile)
            this.clickClose();
        };
      }
    },

    methods: {
      openDaumPostcode() {
        // 모바일인 경우
        let isMobile = false;
        if (navigator.userAgent.match(/Android/i)
          || navigator.userAgent.match(/webOS/i)
          || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPod/i)
          || navigator.userAgent.match(/iPad/i)
          || navigator.userAgent.match(/BlackBerry/i)
          || navigator.userAgent.match(/Windows Phone/i)
        ) {
          isMobile = true;
          this.$emit('openPostcode')
        }
        daum.postcode.load(() => {
          let pos_code = new daum.Postcode({
            onsearch: () => {
              this.routerIndex++;
            },
            oncomplete: data => {
              this.address.sido = data.sido;
              this.address.sigungu = data.sigungu;
              this.address.dong = data.bname;
              this.address.old = data.jibunAddress
                ? data.jibunAddress
                : data.autoJibunAddress;
              this.address.new = data.roadAddress
                ? data.roadAddress
                : data.autoRoadAddress;
              this.address_detail_ph = "상세 주소";
              this.address.post_code = data.zonecode;
              this.$forceUpdate()
              this.setPosition();

              if (isMobile) {
                // this.showMobile = false;
                // let layer = '';
                // let el = document.getElementsByTagName('body')[0];
                // for(let i=0; i<el.children.length; i++) {
                //   if(el.children[i].id.indexOf('__daum__layer')>-1) {
                //     layer = el.children[i];
                //   }
                // }
                // el.removeChild(layer)

                this.$router.go(-1*this.routerIndex);
                this.routerIndex = 1;
              }
            }
          });
          if (!isMobile) {
            pos_code.open();
          }
          else {
            history.pushState(null, 'postcode', location.href);
            this.$store.commit('setPopstate', 'postcode')
            window.scrollTo(0, 0);
            let layer = document.createElement('div');
            layer.setAttribute('id', 'layer');
            layer.style.display = 'none';
            let main = document.getElementsByClassName('app-main')[0];
            main.appendChild(layer);
            this.showMobile = true;
            layer.style.display = 'block'
            pos_code.embed(layer);
            this.$nextTick(() => {
              // let layer = '';
              // let el = document.getElementsByTagName('body')[0];
              // for(let i=0; i<el.children.length; i++) {
              //   if(el.children[i].id.indexOf('__daum__layer')>-1) {
              //     layer = el.children[i];
              //   }
              // }
              // console.log(layer)
              if(layer) {
                // let el = document.getElementById('__daum__layer_1');
                let addressArea = layer.firstElementChild;
                addressArea.style.position = 'absolute';
                addressArea.style.top = '50px';
                addressArea.style.left = 0;
                addressArea.style.zIndex = 10000;
                addressArea.style.height = '100%';
                addressArea.style.width = '100%';
              }
            })
          }
        });
      },
      setPosition() {
        this.$axios
          .get("public/service/geocode?address=" + encodeURI(this.address.old))
          .then(res => {
            this.address.latitude = res.data.position.latitude;
            this.address.longitude = res.data.position.longitude;
          });
      },
      clickCloseBtn() {
        // this.$router.back();
        this.clickClose();
      },
      clickClose() {
        this.showMobile = false;
        let layer = document.getElementById('layer');
        let main = document.getElementsByClassName('app-main')[0];
        layer.style.display = 'none';
        main.removeChild(layer);
        this.$store.commit('removePopstate')
        this.$emit('addressClose')
        // let el = document.getElementsByTagName('body')[0];
        // for(let i=0; i<el.children.length; i++) {
        //   if(el.children[i].id.indexOf('__daum__layer')>-1) {
        //     layer = el.children[i];
        //   }
        // }
        // el.removeChild(layer);
      }
    }
  };
</script>

<style lang="stylus" type="stylus" scoped>
  .address-zipcode {
    // margin-bottom 4px
    display: inline-block;
    width: 92px;
    margin-right: 10px;
  }
</style>
