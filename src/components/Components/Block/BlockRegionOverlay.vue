<template>
  <div :style="`height: ${isPc ? 'calc(100% - 24px)' : '100%'}`">
    <page-header v-if="!isPc">
      <div slot="right">
        <i class="material-icons header-icon" @click="clickClose" style="margin: 0 10px;">close</i>
      </div>
      <span class="header-title" slot="center">지역 선택</span>
    </page-header>
    <div :style="[pagePadding, pageStyle]">
      <!--주소 선택-->
      <!-- <div class="text-center" style="height:50px;margin-bottom:12px;" :style="`margin-top:${isPc ? '24px' : 0}`">
        <div class="size-16 weight-500" :style="brandColor.main">지역 선택</div>
      </div> -->
      <div class="full-width" style="height: calc(100% - 80px); overflow-y: hidden">
        <div v-if="$store.getters.social_key.naver.map.client_id !== ''"
             class="flex-end">
          <div class="button size-14 flex-align unselect"
               style="gap: 0 4px; padding:6px 8px; margin: 12px 0 16px; height:34px; border-radius: 8px"
               :style="[brandBgColor.main, brandColor.sub, brandBorder.main]"
               @click="clickCurrent">
            <i class="material-icons" style="font-size: 16px">gps_fixed</i>
            <span>내 위치로 설정</span>
          </div>
        </div>
        <!-- 시도/시군구 데이터 -->
        <div class="flex size-12 weight-500"
             :style="{borderTop: brandBorder.main.border, height: isPc ? 'calc(100% - 50px)': '100%'}">
          <!-- 시도 (좌측) -->
          <div :style="[colLeft, scrollLeftStyle]">
            <div v-for="(item, idx) in sido"
                 :key="`sido${idx}`"
                 class="sido-item flex-align unselect"
                 :style="[itemStyle(item, 'sido', idx)]"
                 @click.stop.prevent="clickSido(item)"
                 @mouseover.stop.prevent="overSido(item)"
                 @mouseleave.stop.prevent="leaveSido">
              {{ item.name }}
            </div>
          </div>
          <!-- 시군구 (우측) -->
          <div :style="[colRight, scrollRightStyle]">
            <div v-for="(item, idx) in sigungu"
                 :key="`sigungu${idx}`"
                 class="sigungu-item flex-align unselect"
                 :style="[itemStyle(item, 'sigungu', idx)]"
                 @click.stop.prevent="clickSigungu(item)"
                 @mouseover.stop.prevent="overSigungu(item)"
                 @mouseleave.stop.prevent="leaveSigungu">
              {{ item.name }}
              <i v-if="item.id===selectedSigungu.id" class="material-icons size-20" :style="brandColor.white">check</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CardMixin from '@/components/Mixins/CardMixin';

  export default {
    name: 'BlockRegionOverlay',
    components: {
    },
    mixins: [
      CardMixin
    ],
    props: {
      filterOptions: {
        type: Object,
      }
    },
    data() {
      return {
        "dong": [],
        "sido": [],
        "type": "service",
        "address": {},
        "showMap": false,
        "sigungu": [],
        "hoverSido": {},
        "hoverSigungu": {},
        "selectedSido": {},
        "selectedSigungu": {}
      }
    },
    created() {
      // 시/도 데이터 가져오기
      this.$axios.get(`public/address/${this.type}/sido`)
        .then(res => {
          if ( res.status === 200 ) {
            this.sido = res.data;
            this.sido.unshift({
              id: '',
              label: '전체',
              name: '전체',
              value: ''
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    mounted() {
      this.$nextTick(() => {
        if (!this.isPc) {
          document.getElementsByClassName('page-header')[1].style.display = 'none';
        }
      })
    },
    beforeDestroy() {
      this.$nextTick(() => {
        if (!this.isPc) {
          document.getElementsByClassName('page-header')[1].style.display = 'block';
        }
      })
    },
    methods: {
      clickClose() {
        this.$emit('closeModal');
      },
      getAddress(params) {

        console.log('params',params)

        /* 좌표 세팅 로직 시작 */
        if (params === undefined) {
          // navigator 로 현재 좌표 가져오기
          if (navigator.geolocation) { // GPS를 지원하면 navigator.geolocation 으로 현재 좌표 얻어오기
            navigator.geolocation.getCurrentPosition(position => {
              this.address.latitude = position.coords.latitude;
              this.address.longitude = position.coords.longitude;

              let location = {lat: this.address.latitude, lng: this.address.longitude};
              this.$store.commit('setCurrentPosition', location);
              this.$store.commit('setCurrentAddress', this.address);
              // this.$emit('currentAddress', this.address);


              // 다시 호출해서 좌표 업데이트하는 방식 - recursive
              this.getAddress(location);
              /*무한루프로 코드 제거*/
            }, error => {
              let address = {
                lat: 37.5666805,
                lng: 126.9784147
              };
              this.$axios.get(`public/service/geocode?latitude=${address.lat}&longitude=${address.lng}`)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.address) {
                      this.address = res.data.address;

                      let location = {lat: this.address.latitude, lng: this.address.longitude};
                      this.$store.commit('setCurrentPosition', location);
                      this.$store.commit('setCurrentAddress', this.address);
                      this.$emit('currentAddress', this.address);
                    }

                    // API 키가 없을 경우 예외처리, (사용하지 않을 경우) 서비스명으로 처리하도록 인자값 false 전달
                    // if (res.data.address === false) this.setFullAddress(false);
                    // else this.setFullAddress(true);

                    // 위치 업데이트 emit
                    this.$emit('updatePosition');

                    // this.setFullAddress();
                  }
                })
                .catch(err => {
                  console.log(err);
                })
            }, {
              enableHighAccuracy: false,
              maximumAge:Infinity,
              timeout: 10000
            });
          }
          else {
            console.log('GPS를 지원하지 않습니다');
          }
        }
        else {
          console.log('address', this.address)

          this.address.latitude = params.lat;
          this.address.longitude = params.lng;

          let location = {lat: this.address.latitude, lng: this.address.longitude};
          this.$store.commit('setCurrentPosition', location);
          this.$store.commit('setCurrentAddress', this.address);
          this.$emit('changePosition', location)
          // this.$emit('currentAddress', this.address);

          // 가져온 좌표로 주소 받아오기
          setTimeout(() => {
            this.$axios.get(`public/service/geocode?latitude=${this.address.latitude}&longitude=${this.address.longitude}`)
              .then(res => {
                if (res.status === 200) {
                  if (res.data.address) {
                    this.address = res.data.address;

                    let addressLabel = `${this.address.sido} ${this.address.sigungu}`;

                    let location = {lat: this.address.latitude, lng: this.address.longitude};
                    this.$store.commit('setCurrentPosition', location);

                    let sido = {
                      id: this.address.sido_id,
                      name: this.address.sido,
                      label: this.address.sido,
                      value: this.address.sido_id
                    };
                    let sigungu = {
                      id: this.address.sigungu_id,
                      name: this.address.sigungu,
                      label: this.address.sigungu,
                      value: this.address.sigungu_id
                    }
                    this.$emit('selectedRegion', {
                      sido: sido,
                      sigungu: sigungu
                    });

                    this.filterOptions.set.forEach(setItem => {
                      if (setItem.operator ==='__sido__id') {
                        setItem.value = this.address.sido_id;
                        setItem.label = this.address.sido;
                      } else if(setItem.operator ==='__sigungu__id') {
                        setItem.value = this.address.sigungu_id;
                        setItem.label = this.address.sigungu;
                      }
                    })
                    this.$emit('update:filterOptions', this.filterOptions)

                    this.$emit('selectedLabel',0,addressLabel)
                    this.$emit('selectFilter')
                  }

                  // API 키가 없을 경우 예외처리, (사용하지 않을 경우) 서비스명으로 처리하도록 인자값 false 전달
                  // if (res.data.address === false) this.setFullAddress(false);
                  // else this.setFullAddress(true);

                  // 위치 업데이트 emit
                  // this.$emit('updatePosition');

                  // this.setFullAddress();
                }
              })
              .catch(err => {
                console.log(err);
                this.toast('현위치 설정에 실패하였습니다')
              })
          }, 500)
        }
        //this.$emit('selectedLabel',0,this.address)
        //this.$emit('selectFilter')
        this.selectedSido = {};
        this.selectedSigungu = {};
        this.$emit('closeModal');
        /* 좌표 세팅 로직 끝 */
      },
      // 현재 위치로 설정
      clickCurrent() {
        this.getAddress();
      },
      // 마우스 오버, 클릭 style 때문에 methods로 처리
      itemStyle(item, type, idx) {
        let deco = {
          color: this.brandColor.sub2.color,
          borderBottom: this.brandBorder.main.border
          // marginBottom: this.layout_gutter+'px'
        };

        // 시도 아이템: 마우스오버 or 클릭 시 배경색상
        if ( type === 'sido' && item !== undefined ) {
          deco.background = this.brandBgColor.sub2.backgroundColor;
          if ( item.id === this.hoverSido.id || item.id === this.selectedSido.id ) {
            deco.background = this.brandBgColor.main.backgroundColor;
            deco.color = this.brandColor.primary.color;
            //if (idx === this.sido.length-1) deco.border = 'none';
          }
        }

        // 시군구 아이템: 마우스오버 or 클릭 시 배경색상
        if ( type === 'sigungu' && item !== undefined ) {
          deco.color = this.brandColor.main.color;
          deco.background = this.brandBgColor.white.backgroundColor;
          if ( item.id === this.hoverSigungu.id || item.id === this.selectedSigungu.id ) {
            deco.background = this.brandBgColor.main.backgroundColor;
            deco.color = this.brandColor.primary.color;
            deco.justifyContent = 'space-between';
            if (idx === this.sigungu.length-1) deco.border = 'none';
          }
        }

        return deco;
      },
      clickSido(item) {
        // 시군구 데이터 가져오기
        if (item.id !== '') {
          this.$axios.get(`public/address/${this.type}/sido/${item.id}/sigungu`)
            .then(res => {
              if ( res.status === 200 ) {
                res.data.unshift({
                  id: '',
                  name: '전체',
                  label: '전체',
                  value: ''
                });
                this.sigungu = res.data;
                this.selectedSido = item;
                this.selectedSigungu = {};
              }
            })
            .catch(err => {
              console.log(err);
            })
        } else {
          this.sigungu = [
            {
              id: '',
              label: '전체',
              name: '전체',
              sido_id: '',
              value: '',
            }
          ];
          this.selectedSido = item;
          this.selectedSigungu = {};
        }
      },
      clickSigungu(item) {
        this.selectedSigungu = item;
        this.$emit('selectedRegion', {
          sido: this.selectedSido,
          sigungu: this.selectedSigungu
        });
      },
      selectRegion() {
        let address = `${this.selectedSido.name} ${this.selectedSigungu.name}`;
        if (this.selectedSido.name==='세종특별자치시') address = this.selectedSido.name;
        if (this.selectedSido.name === '전체') address = this.selectedSido.name;
        let url = `/public/service/local?search_text=${address}`;

        if (this.isIE) {
          url = encodeURI(`/public/service/local?search_text=${address}`);
        }

        this.$axios.get(url)
          .then(res => {
            if (res.status===200) {
              let location = res.data.local_list[0];
              if (location && Object.keys(location).length !== 0) {
                this.$store.commit('setCurrentPosition', {
                  lng: location.x,
                  lat: location.y
                })
              }
              this.filterOptions.set.forEach(setItem => {
                if (setItem.operator ==='__sido__id') {
                  setItem.value = this.selectedSido.id;
                  setItem.label = this.selectedSido.label;
                } else if(setItem.operator ==='__sigungu__id') {
                  setItem.value = this.selectedSigungu.id;
                  setItem.label = this.selectedSigungu.label;
                }
              })
              this.$emit('update:filterOptions', this.filterOptions)
              this.$emit('selectedLabel',0,address)
              this.$emit('selectFilter')
              this.$emit('closeModal');
            }
          })
      },
      selectMap(val) {
        this.$store.commit('setCurrentPosition', {
          lng: val.x,
          lat: val.y
        })
        this.$emit('changePosition', {
          lng: val.x,
          lat: val.y
        })
        this.showMap = false;
        this.selectedSido = {};
        this.selectedSigungu = {};
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
      }
    },
    computed: {
      pageStyle() {
        let deco = {height:'100vh'};
        if(this.isPc) {
          deco.height = '100%';
        } else {
          deco.paddingTop = '50px'
        }
        return deco;
      },
      isPc() {
        return this.$store.getters.device === 'pc';
      },
      colLeft() {
        return {
          width: '38%',
          marginRight: `${this.layout_gutter/2}px`
        }
      },
      colRight() {
        return {
          width: '62%',
          marginLeft: `${this.layout_gutter/2}px`
        }
      },
      scrollLeftStyle() {
        let scrollbar = this.getScrollbarWidth();
        return {
          width: `calc(38% + ${scrollbar}px)`,
          height: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }
      },
      scrollRightStyle() {
        let scrollbar = this.getScrollbarWidth();
        return {
          width: `calc(62% + ${scrollbar}px)`,
          height: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }
      }
    },
    watch: {

    }
  }
</script>
<style lang="stylus" type="stylus" scoped>
  .sido-item, .sigungu-item
    padding: 12px 8px
    height: 40px
</style>

