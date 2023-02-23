<template>
<div v-if="labelList && labelList.length !== 0" v-dragscroll.x="true" @dragscrollmove.prevent.self="onDrag"
    :class="{'dragscroll': isIE}" ref="dragscroll">
  <div class="grab-bing flex-align p-bg-sub2" v-click-outside="close" style="padding: 16px">
    <!--<div class="flex-align unselect size-14" @click="clearFilter"-->
    <!--  style="padding: 10px 12px; height: 36px; border-radius: 30px"-->
    <!--  :style="[brandBgColor.primary, brandColor.white]">초기화</div>-->
    <div v-for="(label, idx) in labelList" class="flex-align p-bg-primary p-white" :key="'label-'+idx" :style="btnStyle">
      <span class="size-14" style="user-select: none">{{ label.label }}</span>
      <i @click="removeFilterItem(label.id, label.parent_id)" class="unselect material-icons"
        style="vertical-align: middle; margin-left: 2px; font-size: 14px">close</i>
    </div>
  </div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'ProductFilterListPc',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "dragging": false,
      "filterId": 1,
      "openItem": {},
      "typeList": {
        "date": "c-input-date",
        "text": "c-input-text",
        "address": "c-input-regionModal",
        "category": "c-input-cascadingDropdown",
        "date_time": [
          "c-input-date",
          "c-input-time"
        ],
        "date_range": "c-input-dateRange",
        "choice_radio": "c-input-radiobuttonGroup",
        "number_range": "c-input-rangeDual",
        "choice_checkbox": "c-input-checkboxGroup",
        "date_time_range": "c-input-dateTimeRange",
        "number_range_input": "c-input-numberRange"
      },
      "labelList": [],
      "filterData": [],
      "scrollable": true,
      "scrollArray": [],
      "formTypeData": {
        "box": "round",
        "list": "vertical",
        "align": "block",
        "input": "round",
        "label": false,
        "button": "round",
        "dropdown": "list",
        "inputIcon": false
      },
      "selectedIndex": undefined
    }
  },
  created() {
    this.getFilter();
    if(this.isIE) {
      setTimeout(() => {
        dragscroll.reset();
      },1000);
    }
    this.$nextTick(() => {
      let totalWidth = 0;
      // 스크롤아이템 width 저장
      for (let i=0; i<this.filterData.length; i++) {
        if (this.$refs[`tabItem${i}`]&&this.$refs[`tabItem${i}`][0]) {
          // console.log('refs', this.$refs[`tabItem${i}`])
          let width = this.$refs[`tabItem${i}`][0].offsetWidth;
          this.scrollArray.push({
            id : this.menu[i].id,
            name : this.menu[i].name,
            width: width,                        // 본인 너비
            accumulatedWidth: totalWidth+width   // 본인 누적너비
          });
          totalWidth += width;                   // 총 너비
        }
        // 현재 선택된 탭 index 저장
        if (this.filterData[i].id === this.selectedTab) {
          this.selectedIndex = i;
        }
      }
      // 스크롤 중앙 정렬
      this.setScroll(this.selectedIndex);
    })
  },
  mounted() {

  },
  
  methods: {
    removeFilterItem(id, parent_id) {
      this.filterData.forEach(item => {
        if (parent_id === item.id) {
          if (item.type === 'choice_checkbox') {
            if (item.value.indexOf(id) !== -1) {
              item.value.splice(item.value.indexOf(id), 1);
              let index = this.labelList.findIndex(label => label.id === id);
              this.labelList.splice(index, 1)
            }
          } else if (item.type === 'choice_color') {
            if (item.value.indexOf(id) !== -1) {
              item.value.splice(item.value.indexOf(id), 1);
              let index = this.labelList.findIndex(label => label.id === id);
              this.labelList.splice(index, 1)
              
            }
          } else if (item.type === 'number_range') {
            item.value[0] = Number(item.options.min);
            item.value[1] = Number(item.options.max);
            item.set[0].value = Number(item.options.min);
            item.set[1].value = Number(item.options.max);
            this.labelList.forEach((label, idx) => {
              if (label.id === id) {
                this.labelList.splice(idx, 1);
              }
            })
            
          } else if (item.type === 'category') {
            item.set.forEach(item => {
              item.label = '';
              item.value = '';
            })
            this.labelList.forEach((label, idx) => {
              if (label.id === id) {
                this.labelList.splice(idx, 1);
              }
            })
          } else if (item.type === 'address') {
            item.set.forEach(item => {
              item.label = '';
              item.value = '';
            })
            this.labelList.forEach((label, idx) => {
              if (label.id === id) {
                this.labelList.splice(idx, 1);
              }
            })
          } else if (item.type === 'number_range_input') {
            item.value[0] = Number(item.options.min);
            item.value[1] = Number(item.options.max);
            item.set[0].value = '';
            item.set[1].value = '';
            this.labelList.forEach((label, idx) => {
              if (label.id === id) {
                this.labelList.splice(idx, 1);
              }
            })
          } else if (item.type === 'date') {
            item.value = '';
            item.selectedValue = '';
            item.set.forEach(item => {
              item.value = '';
            })
            this.labelList.forEach((label, idx) => {
              if (label.id === id) {
                this.labelList.splice(idx, 1);
              }
            })
          }
        }
      })
      if (this.labelList.length !== 0) {
        this.$store.commit('setFilter', this.filterData)
      } else {
        this.$store.commit('setFilter', [])
      }
      this.getFilter();
    },
    clickOk(idx) {
      
      if (this.filterData[idx].set[0].value === this.filterData[idx].min && this.filterData[idx].set[1].value === this.filterData[idx].max) {
        this.filterData[idx].selectedValue = '';
        this.filterData[idx].selectedLabel = '';
      } else {
        this.filterData[idx].selectedLabel = this.filterData[idx].selectedValue;
      }
      this.$store.commit('setFilter', this.filterData);
      this.$emit('selectFilter');
      this.filterData[idx].isActive = !this.filterData[idx].isActive;
    },
    updateValue(item, res) {
      this.selectedValue = '';
      if(item.type === 'text') {
        item.set[0].value = res;
      }
      else if(item.type.indexOf('number_range')>-1) {
        item.set[0].value = res[0];
        item.set[1].value = res[1];
      }

      else if(item.type === "choice_radio") {
        if (item.selectedValue === '전체보기') {
          item.set[0].value = '';
        } else {
          item.set[0].value = res;
        }
      }

      else if(item.type === 'address' && res.sido) {
        item.set[0].value = res.sido.id;
        item.set[0].label = res.sido.label;
        item.set[1].value = res.sigungu ? res.sigungu.id : '';
        item.set[1].label = res.sigungu ? res.sigungu.label : '';

      }

      else if(item.type === 'category') {
        console.log(item.set)
        if(res.dropdown1) {
          item.set[0].value = res.dropdown1;
          item.set[0].label = find(item.dropdown,'id', res.dropdown1).label;
        }
        if(res.dropdown2) {
          item.set[1].value = res.dropdown2;
          item.set[1].label = find(item.dropdown,'id', res.dropdown2).label;
        }
      }

      else if(item.type === "choice_checkbox") {
        item.set[0].value = res;
      }

    },
    onDrag(e) {
      // 기종별 감도차이 때문에 0이 아닌 1로 약간의 여유있게 줌
      if (Math.abs(e.detail.deltaX) > 1) {
        this.dragging = true;
      }
    },
    getFilter() {
      this.$axios.get(`/public/service/set/filter/${this.filterId}`).then(res => {
        if (res.status === 200) {
          res.data.filter.forEach((filter, idx) => {
            filter.id = idx;
            filter.selectedLabel = '';
            filter.isActive = false;
            filter.elType = this.typeList[filter.type];
            
            filter.selectedValue = '';
            
            let type = filter.elType;

            // 기존에 vuex에 저장된 필터 내용 가져오기
            let store = find(this.$store.getters.filtered, 'keyword', filter.keyword);
            if(filter.param_id) {
              store = find(this.$store.getters.filtered, 'param_id', filter.param_id);
            }

            filter.formType = {
              input: 'round',
              button: 'round',
              box: 'round',
              list: 'horizontal',
              label: false
            };
            
            // 텍스트
            if(type === 'c-input-text') {
              
            }
            
            // 색상
            else if (filter.type === 'choice_color') {
              if (store!==undefined) {
                filter.value = store.value;
                filter.selectedValue = store.selectedValue;
                filter.set[0].value = store.set[0].value.length === 0 ? [] : store.set[0].value;
              }
            }

            // 체크박스 그룹
            else if(type === 'c-input-checkboxGroup') {
              // 버튼 모양 변경 - 'full'
              if (this.$store.getters.commonStyle.filter &&
                this.$store.getters.commonStyle.filter.checkbox &&
                this.$store.getters.commonStyle.filter.checkbox === 'full') {
                filter.elType = 'c-input-checkbox-full-group';
              }

              filter.options = this.computedCheckbox(filter.options);

              if(store!==undefined) {
                filter.set[0].value = store.set[0].value === '' ? [] : store.set[0].value;
                filter.value = store.set[0].value === '' ? [] : store.set[0].value;
              } else {
                filter.set[0].value = []
                filter.value = []
              }
            }
            // 라디오버튼 그룹
            else if(type === 'c-input-radiobuttonGroup') {
              let options = [];
              filter.options.unshift({id: '', name: '전체보기'});
              filter.options.forEach(item => {
                options.push({
                  id: item.id,
                  value: item.id,
                  label: item.name
                });
              });

              filter.options = options;
              
              if(store!==undefined && store.set[0].value!==undefined) {
                filter.value = store.set[0].value;
                filter.options.forEach(option => {
                  if (option.value === store.set[0].value) {
                    filter.selectedValue = option.label
                  }
                })
                filter.set[0].value = store.set[0].value;
              }

              // 라디오버튼 모양 변경 - 'full'
              if (this.$store.getters.commonStyle.filter &&
                this.$store.getters.commonStyle.filter.radio &&
                this.$store.getters.commonStyle.filter.radio === 'full') {
                filter.elType = 'c-input-radio-full-buttonGroup';
              }
            }
            // 지역
            else if(type === 'c-input-regionModal') {
              filter.placeholder = '지역을 선택해주세요';

              if(store!==undefined) {
                filter.set[0].value = store.set[0].value;
                filter.set[0].label = store.set[0].label;
                filter.set[1].value = store.set[1].value;
                filter.set[1].label = store.set[1].label;
                filter.value = {
                  sido: {
                    id: store.set[0].value,
                    label:store.set[0].label,
                    name: store.set[0].label,
                    value: store.set[0].value
                  },
                  sigungu: {
                    id: store.set[1].value,
                    name: store.set[1].label,
                    label: store.set[1].label,
                    value: store.set[1].value
                  }
                };
                if (filter.set[0].label !== undefined && filter.set[1].label !== undefined) {
                  if (filter.set[0].label !== '' && filter.set[1].label !== '') {
                    if (filter.set[0].label === filter.set[1].label) {
                      filter.selectedValue = `${filter.set[0].label}`;
                    } else {
                      filter.selectedValue = `${filter.set[0].label} ${filter.set[1].label}`;
                    }
                  } else {
                    filter.selectedValue = '';
                  }
                } else {
                  filter.selectedValue = '';
                }
              }
            }
            
            else if(type === 'c-input-dateRange') {
              filter.set.forEach(item => {
                store.set.forEach(storeSet => {
                  if (item.operator === storeSet.operator) item.value = storeSet.value;
                })
              })
              // filter.set[0].value = store.set[0].value;
              // filter.set[1].value = store.set[1].value;
            }
            
            // 레인지 듀얼
            else if(type === 'c-input-rangeDual') {
              let min = filter.options.min === 0 ? 1 : filter.options.min;
              filter.value= [filter.options.min, filter.options.max];
              filter.min= filter.options.min;
              filter.max= filter.options.max;
              filter.unit= filter.options.unit;
              filter.interval= (filter.options.max / min) / 100 * min;

              if(store!==undefined) {
                let min = store.set[0].value === '' ? filter.min : store.set[0].value;
                let max = store.set[1].value === '' ? filter.max : store.set[1].value;
                filter.set[0].value = min;
                filter.set[1].value = max;
                filter.value = [min, max];
              }
            }

            //카테고리
            else if(filter.type === 'category') {
              // 캐스캐이딩 드롭다운 내 드롭다운의 options 초기화
              filter.dropdown = this.categories;
              if(store!==undefined) {
                filter.set[0].value = store.set[0].value;
                filter.set[1].value = store.set[1].value;
                filter.set[2].value = store.set[2].value;
                filter.set[0].label = store.set[0].label;
                filter.set[1].label = store.set[1].label;
                filter.set[2].label = store.set[2].label;

                if(store.set[0].value && store.set[0].value!=='') {
                  filter.selectedValue = store.set[0].label;
                  filter.value = {
                    dropdown1: store.set[0].value,
                    dropdown2: undefined
                  };
                  

                  if(store.set[1].value && store.set[1].value!=='') {
                    filter.selectedValue += " " + store.set[1].label;
                    filter.value.dropdown2 = store.set[1].value;
                  }
                }
              }
            }
            else if(filter.type === 'number_range') {
              if (store && store.set.length > 0) {
                filter.set[0].value = store.set[0].value;
                filter.set[1].value = store.set[1].value;
                filter.selectedValue = store.selectedValue;
                filter.value = store.value;
              }
            }
            else if (filter.type === 'number_range_input') {
              if (store && store.set.length > 0) {
                filter.set[0].value = store.set[0].value;
                filter.set[1].value = store.set[1].value;
                filter.selectedValue = store.selectedValue;
                filter.value = store.value;
              }
            }
            else if(filter.type === 'date') {
              if (store && store.set.length > 0) {
                filter.selectedValue = store.selectedValue;
                filter.set[0].value = store.set[0].value;
                if (store.set[1] && Object.keys(store.set[1]).length > 0) {
                  filter.set[1].value = store.set[1].value;
                }
                filter.value = store.set[0].value;
              }
            }
          });
          this.filters = this.cloneItem(res.data.filter);
          let filterData = res.data.filter;
          // filterData.splice(0, 2);

          let filtered = this.$store.getters.filtered;
      let labelArray = [];
      this.filterData = filterData;
      filterData.forEach(item => {
        if (item.type === 'category') {
          let label = '';
          if (item.set[0].label !== '' && item.set[0].label !== undefined) {
            label = item.set[0].label;
          } else {
            label = ''
          }
          if (item.set[1].label !== '' && item.set[1].label !== undefined) {
            label += ` > ${item.set[1].label}`
          }
          if (item.set[2].label !== '' && item.set[2].label !== undefined) {
            label += ` > ${item.set[2].label}`
          }

          if (label !== '' && label !== undefined) {
            labelArray.push({label: label, parent_id : item.id});
          }
        }
        if (item.type === 'address') {
          if (item.selectedValue !== '' && item.selectedValue !== undefined) {
            labelArray.push({label: item.selectedValue, parent_id: item.id})
          }
        }
        if (item.type === 'choice_checkbox') {
          item.options.forEach(option => {
            if(item.value.indexOf(option.id)>-1) {
              labelArray.push({label: option.label, id: option.id, param_name: item.param_name, parent_id: item.id})
            }
            
          })
        } else if (item.type === 'choice_color') {
          if (item.value === undefined) item.value = []
          item.options.forEach((option, idx) => {
            if (item.value.indexOf(option.id)>-1) {
              labelArray.push({label: option.name, id: option.id, parent_id: item.id})
            }
          })
        } else if (item.type === 'number_range') {
          let min = item.value[0];
          let max = item.value[1];
          if (Number(min) === Number(item.min) && Number(max) === Number(item.max)) {
            return;
          } else {
            labelArray.push({label: `${this.currencyNum(min)} ~ ${this.currencyNum(max)}`, id: item.id, parent_id: item.id})
          }
        } else if (item.type === 'number_range_input') {
          let min = item.set[0].value;
          let max = item.set[1].value;
          if (Number(min) === Number(item.options.min) && Number(max) === Number(item.options.max)) {
            return;
          } else if (min === '' && max === '') {
            return;
          } else if (min !== '' && max === '') {
            if (item.options.unit !== null && item.options.unit !== '') {
              labelArray.push({
                label: `${this.currencyNum(min)}${item.options.unit} ~`,
                id: item.id,
                parent_id: item.id
              })
            } else {
              labelArray.push({
                label: `${this.currencyNum(min)} ~`,
                id: item.id,
                parent_id: item.id
              })
            }
          } else if (min === '' && max !== '') {
            if (item.options.unit !== null && item.options.unit !== '') {
              labelArray.push({
                label: `~ ${this.currencyNum(max)}${item.options.unit}`,
                id: item.id,
                parent_id: item.id
              })
            } else {
              labelArray.push({
                label: `~ ${this.currencyNum(max)}`,
                id: item.id,
                parent_id: item.id
              })
            }
          } else {
            if (item.options.unit !== null && item.options.unit !== '') {
              labelArray.push({
                label: `${this.currencyNum(min)}${item.options.unit} ~ ${this.currencyNum(max)}${item.options.unit}`,
                id: item.id,
                parent_id: item.id
              })
            } else {
              labelArray.push({
                label: `${this.currencyNum(min)} ~ ${this.currencyNum(max)}`,
                id: item.id,
                parent_id: item.id
              })
            }
          }
        } else if (item.type === 'date') {
          if (item.set[0].value === '') {
            return;
          } else {
            labelArray.push({label: `${item.label} : ${item.set[0].value}`, id: item.id, parent_id: item.id})
          }
        }
      })
      this.labelList = labelArray;
        }
      })
    },
    computedCheckbox(items) {
      let res = [];
      for(let i=0; i<items.length; i++) {
        let item = items[i];
        res.push({
          id: item.id,
          checked: false,
          label: item.name
        });
      }

      return res;
    },
    labelStyle(item) {
      let deco = {
        color: this.brandColor.main.color
      };
      if (item.selectedLabel !== '') {
        deco.color = '#e95a25';
      }
      return deco;
    },
    openDropMenu(idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      } else {
        this.filterData.forEach((filter, index) => {
          if (index !== idx) {
            filter.isActive = false;
          }
        })
        this.filterData[idx].isActive = !this.filterData[idx].isActive;
        if (this.scrollable) {
          this.setScroll(idx);
        }
        this.openItem = this.filterData[idx];
      }
    },
    closeDropMenu(idx) {
      if (this.dragging) {
        this.dragging = false;
        return;
      } else {
        this.filterData.forEach((filter, index) => {
          if (index !== idx) {
            filter.isActive = false;
          }
        })
        this.filterData[idx].isActive = !this.filterData[idx].isActive;
      }
    },
    close() {
      this.openItem.isActive = false;
    },
    clearFilter() {
      this.filterData.forEach(filter => {
        filter.selectedLabel = '';
        filter.selectedValue = '';
      })
      this.labelList = [];
      this.$store.commit('setFilter', []);
      this.$emit('selectFilter');
    },
    setScroll(index) {
      let target = this.scrollArray[index];
      if (target) {
        let result = (target.accumulatedWidth - (target.width/2));
        result -= (this.$lp_store.getters.deviceWidth/2);
        console.log(target, result)
        this.$refs.dragscroll.scrollTo({
          behavior: 'smooth',
          left: result
        });
      }
    },
    clickOption(item, option, idx) {
      if(item.type === 'text') {
        item.set[0].value = option.value;
      }

      else if(item.type === "choice_radio") {
        if (item.selectedValue === '전체보기') {
          item.set[0].value = '';
        } else {
          item.set[0].value = option.value;
        }
      }

      else if(item.type === 'address' && option.value.sido) {
        item.set[0].value = option.value.sido.id;
        item.set[0].label = option.value.sido.label;
        item.set[1].value = option.value.sigungu ? option.value.sigungu.id : '';
        item.set[1].label = option.value.sigungu ? option.value.sigungu.label : '';

      }

      else if(item.type === 'category') {
        console.log(item.set)
        if(res.dropdown1) {
          item.set[0].value = option.value.dropdown1;
          item.set[0].label = find(item.dropdown,'id', option.value.dropdown1).label;
        }
        if(res.dropdown2) {
          item.set[1].value = option.value.dropdown2;
          item.set[1].label = find(item.dropdown,'id', option.value.dropdown2).label;
        }
      }

      else if(item.type === "choice_checkbox") {
        item.set[0].value = option.value;
      }
      
      if (option.label !== '전체보기') {
        item.selectedValue = option.label;
        item.selectedLabel = option.label;
      } else {
        item.selectedValue = '';
        item.selectedLabel = '';
      }
      
      this.$store.commit('setFilter', this.filterData);
      this.$emit('selectFilter');
      this.filterData[idx].isActive = !this.filterData[idx].isActive;
    }
  },
  computed: {
    btnStyle() {
      let deco = {
        height: '36px',
        borderRadius: '30px',
        padding: '10px 12px',
        marginLeft: '12px'
      };
      return deco;
    },
    isIE() {
      if (navigator.userAgent.indexOf('Trident') > -1) return true;
      else return false;
    }
  },
  watch: {
    '$store.getters.filtered'(n) {
      this.getFilter();
    }
  }
}
</script>
<style scoped>
.grab-bing {
  white-space: nowrap;
  position: relative;
}

.sweet-modal {
  margin: 0 16px;
  border-radius: 8px;
}
.sweet-modal.is-alert .sweet-content {
  padding: 0 !important;
}
</style>

