<template>
  <div>
    <!-- 아코디언 -->
    <div v-for="(item,idx) in filterData" :key="'filter-'+idx">
      <div class="grid-box unselect" @click="item.visible = !item.visible" style="padding:12px 16px" :style="brandBgColor.sub">
        <div class="col-11 flex-between">
          <div :style="brandColor.help">{{ item.label }}</div>
          <div :style="brandColor.brand" style="font-size:13px">{{ item.selectedValue }}</div>
        </div>
        <div class="col-1 flex-end">
          <i class="material-icons" :style="brandColor.sub">{{ item.visible ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
        </div>
      </div>
      <!-- 컨텐트 영역 -->
      <div v-if="item.visible" style="padding:20px">
        <component :is="item.elType" v-bind="item" :gutter="0"
                   :selectedValue.sync="item.selectedValue"
                   :formType="formTypeData"
                   :value.sync="item.value"
                   @update:value="res => updateValue(item, res)"
                   :radioButtonFull="{col: 4, gutter: 4}"
        ></component>
      </div>
    </div>

    <!-- 정렬 -->
    <div v-if="sortData && useSort">
      <div class="grid-box unselect" @click="sortData.visible = !sortData.visible" style="padding:16px" :style="brandBgColor.sub">
        <div class="col-11 flex-between">
          <div :style="brandColor.help">{{ sortData.label }}</div>
          <div :style="brandColor.brand" style="font-size:13px">{{ sortData.selectedValue }}</div>
        </div>
        <div class="col-1 flex-end">
          <i class="material-icons" :style="brandColor.sub">{{ sortData.visible ? 'arrow_drop_up' : 'arrow_drop_down' }}</i>
        </div>
      </div>
      <!-- 컨텐트 영역 -->
      <div v-if="sortData.visible" style="padding:20px">
        <component :is="sortData.elType" v-bind="sortData" :gutter="0"
                   :selectedValue.sync="sortData.selectedValue"
                   :value.sync="sortData.value" @update:value="res => updateValue(sortData, res)"></component>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FilterSort",
    props: {
      filterId: {
        type: Number,
        default: 1
      },
      useSort: {       // Sort 사용 여부
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        formTypeData: {
          input: 'round',         // round, underline
          button: 'round',
          box: 'round',
          list: 'vertical',
          label: false,
          align: 'block',  // block, center, space-between, flex-start, flex-end
          inputIcon: false,
          dropdown: 'list'      // list, modal
        },
        categories: [],
        filterData: [],
        sortData: undefined,
        typeList: {
          'choice_checkbox': 'c-input-checkboxGroup',
          'choice_radio': 'c-input-radiobuttonGroup',
          'address': 'c-input-regionForm',
          'number_range': 'c-input-rangeDual',
          'date_range': 'c-input-dateRange',
          'date': 'c-input-date',
          'date_time': ['c-input-date', 'c-input-time'],
          'date_time_range': 'c-input-dateTimeRange',
          'category': 'c-input-cascadingDropdown'
        }
      }
    },
    created() {
      // 카테고리 내용 미리 받아두기
      this.setCategories();
    },
    methods: {
      setCategories() {
        this.$axios.get('public/category?depth=2').then(res => {
          this.categories = [];
          for(let i=0; i<res.data.length; i++) {
            let cat1 = res.data[i];
            let child = [];
            if (cat1.child) {
              for (let j = 0; j < cat1.child.length; j++) {
                let cat2 = cat1.child[j];
                let child2 = [];
                for (let k = 0; k < cat2.child.length; k++) {
                  let cat3 = cat2.child[k];
                  child2.push({id: cat3.id, label: cat3.name, value: cat3.id});
                }
                cat2 = {id: cat2.id, label: cat2.name, value: cat2.id, child: child2};
                child.push(cat2);
              }
            }
            cat1 = {id: cat1.id, label: cat1.name, value: cat1.id, child: child};
            this.categories.push(cat1);
          }

          // 백엔드에서 필터 가져와서 적용
          this.setFilters();
        });
      },
      setFilters() {
        this.$axios.get('public/service/set/filter/'+this.filterId).then(res =>{
          res.data.filter.forEach(filter => {
            filter.visible = true;
            filter.elType = this.typeList[filter.type];
            filter.selectedValue = '';

            let type = filter.elType;

            // 기존에 vuex에 저장된 필터 내용 가져오기
            let store = find(this.$store.getters.filtered, 'keyword', filter.keyword);
            if(store === undefined) {
              store = find(this.$store.getters.filtered, 'param_id', filter.param_id);
            }

            filter.formType = {
              input: 'round',
              button: 'round',
              box: 'round',
              list: 'horizontal',
              label: false
            };

            // 체크박스 그룹
            if(type === 'c-input-checkboxGroup') {
              // 버튼 모양 변경 - 'full'
              if (this.$store.getters.commonStyle.filter &&
                this.$store.getters.commonStyle.filter.checkbox &&
                this.$store.getters.commonStyle.filter.checkbox === 'full') {
                filter.elType = 'c-input-checkbox-full-group';
              }

              filter.options = this.computedCheckbox(filter.options);

              if(store!==undefined) {
                filter.value = store.set[0].value;
              }
            }
            // 라디오버튼 그룹
            else if(type === 'c-input-radiobuttonGroup') {
              let options = [];
              filter.options.forEach(item => {
                options.push({
                  id: item.id,
                  value: item.id,
                  label: item.name
                });
              });

              filter.options = options;

              if(store!==undefined && store.value!==undefined) {
                filter.value = store.value.value;
              }

              // 라디오버튼 모양 변경 - 'full'
              if (this.$store.getters.commonStyle.filter &&
                this.$store.getters.commonStyle.filter.radio &&
                this.$store.getters.commonStyle.filter.radio === 'full') {
                filter.elType = 'c-input-radio-full-buttonGroup';
              }
            }
            // 지역
            else if(type === 'c-input-regionForm') {
              filter.placeholder = '지역을 선택해주세요';

              if(store!==undefined) {
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
              }
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
                filter.set[0].value = store.set[0].value;
                filter.set[1].value = store.set[1].value;
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
          });

          this.filterData = res.data.filter;

          // 정렬 설정

          let elType = 'c-input-radiobuttonGroup';
          // 라디오버튼 모양 변경 - 'full'
          if (this.$store.getters.commonStyle.filter &&
            this.$store.getters.commonStyle.filter.radio &&
            this.$store.getters.commonStyle.filter.radio === 'full') {
            elType = 'c-input-radio-full-buttonGroup';
          }

          // 정렬 (only active)
          let sortsData = res.data.sort;
          let sorts = sortsData.filter(srt => srt.is_active===true);
          this.sortData = {
            label: '정렬',
            visible: true,
            elType : elType,
            selectedValue: '',
            value: '',
            options: sorts,
            formType: {
              list: 'vertical',
            }
          };
          let sorted = this.$store.getters.sorted;
          if(sorted) {
            this.sortData.value = sorted.value;
          }
        });
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
      updateValue(item, res) {
        this.selectedValue = '';
        if(item.type === 'number_range') {
          item.set[0].value = res[0];
          item.set[1].value = res[1];
        }

        else if(item.type === "choice_radio") {
          item.set[0].value = res;
        }

        else if(item.type === 'address' && res.sido) {
          item.set[0].value = res.sido.id;
          item.set[0].label = res.sido.label;
          item.set[1].value = res.sigungu ? res.sigungu.id : '';
          item.set[1].label = res.sigungu ? res.sigungu.label : '';

        }

        else if(item.type === 'category') {
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

      }
    }
  }
</script>
