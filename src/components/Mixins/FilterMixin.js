export default {
  data() {
    return {
      "filterData": [],
      "typeList": {
        "date": "c-input-date-spin",
        "time": "c-input-time",
        "text": "c-input-text",
        "float": "c-input-number",
        "integer": "c-input-number",
        "address": "c-input-regionModal",
        "category": "c-input-category",
        "date_time": "c-input-dateTimeSpin",
        "date_range": "c-input-dateSpinRange",
        "time_range": "c-input-timeRange",
        "choice_radio": "c-input-radiobuttonGroup",
        "number_range": "c-input-rangeDual",
        "choice_checkbox": "c-input-checkboxGroup",
        "date_time_range": "c-input-dateTimeRange",
        "number_range_input": "c-input-numberRange",
        "gender": "c-input-radiobuttonGroup",
        "choice_color": "c-input-colorFilter",
      },
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
    }
  },
  methods: {
    setFilters() {
      this.$axios.get('public/service/set/filter/'+this.filterId).then(res =>{
        res.data.filter.forEach(filter => {
          filter.visible = true;
          filter.elType = this.typeList[filter.type];
          filter.selectedValue = '';

          if(filter.type === 'gender') {
            filter.elType = 'c-input-radio-full-buttonGroup';
          }

          let type = filter.elType;

          // 기존에 vuex에 저장된 필터 내용 가져오기
          let store;
          if(filter.param_id) {
            store = this.$store.getters.filtered.filter(item=>{
              return item.param_id === filter.param_id && item.elType === filter.elType;
            });
          } else {
            store = this.$store.getters.filtered.filter(item=>{
              return item.keyword === filter.keyword && item.elType === filter.elType;
            });
          }

          store = store.length>0 ? store[0] : undefined;

          filter.formType = {
            input: 'round',
            button: 'round',
            box: 'round',
            list: 'horizontal',
            label: false
          };

          if(store) {
            filter.selectedValue = store.selectedValue;
          }

          // 성별
          if(filter.type === 'gender') {
            filter.radioButtonFull = {
              col: 3,
              gutter: 4
            };
            filter.options = filter.options.map(item=>{
              return {
                id: item.id,
                value: item.id,
                label: item.name
              }
            });
            if(store) {
              filter.value = store.value;
            }

          }

          // 텍스트
          else if(['c-input-text','c-input-number'].indexOf(type)>-1) {
            filter.placeholder = filter.label + this.josa.c(filter.label, '을/를') + ' 입력해주세요';
            if (store!== undefined) {
              filter.value = store.set[0].value;
            }
          }

          else if(type === 'c-input-colorFilter') {
            if(store!==undefined) {
              filter.value = store.set[0].value;
            }
          }

          else if(type === 'c-input-time') {
            if (store!== undefined) {
              filter.value = store.set[0].value;
            } else {
              filter.value = '10:00';
            }
          }
          else if(type === 'c-input-timeRange') {
            if(store!==undefined) {
              filter.value = store.set.map(v => { return v.value });
            } else {
              filter.value = ['10:00', '11:00'];
            }
          }
          else if(type === 'c-input-dateSpinRange') {
            if(store!==undefined) {
              filter.value = store.set.map(v => { return v.value });
            } else {
              let now = this.dayjs().format('YYYY-MM-DD');
              let prev = this.dayjs().subtract(1, 'month').format('YYYY-MM-DD');
              filter.value = [prev,  now];
            }
          }
          else if(type === 'c-input-dateTimeRange') {

            if (store !== undefined) {
              filter.value = store.set.map(v=> {return v.value});
            }
          }

          else if(type === 'c-input-dateTimeSpin' || type === 'c-input-date-spin') {
            if(store!==undefined) {
              filter.value = store.set[0].value;
              filter.selectedValue = filter.value;
            }
          }

          // 체크박스 그룹
          else if(type === 'c-input-checkboxGroup') {
            filter.options = this.computedCheckbox(filter.options);

            if(store!==undefined) {
              filter.value = store.set[0].value;
            }
          }
          // 라디오버튼 그룹
          else if(type === 'c-input-radiobuttonGroup') {
            filter.options = filter.options.map(item=>{
              return {
                id: item.id,
                value: item.id,
                label: item.name
              }
            });

            if(store!==undefined && store.value!==undefined) {
              filter.value = store.value;
              filter.selectedValue = filter.options.filter(o=>{ return o.id === filter.value })[0].label;
            }
          }
          // 지역
          else if(type === 'c-input-regionModal') {
            filter.placeholder = '지역 선택';

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
                filter.selectedValue = `${filter.set[0].label} ${filter.set[1].label}`;
              } else {
                filter.selectedValue = '';
              }
            }
          }

          else if(type === 'c-input-dateRange') {
            if(store!==undefined) {
              filter.set.forEach(item => {
                store.set.forEach(storeSet => {
                  if (item.operator === storeSet.operator) item.value = storeSet.value;
                })
              })
            }
          }

          // 레인지 듀얼
          else if(['c-input-rangeDual', 'c-input-numberRange'].indexOf(type)>-1) {
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
            if(store!==undefined) {
              let v = store.set[0];
              filter.value = {
                id: v.value,
                label: store.selectedValue,
                value: v.value
              };
            }
          }
        });
        this.filterData = res.data.filter;

        /*// 정렬 설정

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
          elType : 'c-input-dropdown',
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

        // 거리 순
        let distancesData = res.data.product_distance;
        let distances = distancesData.filter(distance => distance.is_active === true);
        this.distanceData = {
          label: '거리 순',
          visible: true,
          elType: 'c-input-dropdown',
          selectedValue: '',
          value: '',
          options: distances,
          formType: {
            list: 'vertical'
          }
        };
        let distance = this.$store.getters.distance;
        if (distance) {
          this.distanceData.value = distance.value;
        }*/
      });
    },
    updateValue(item, res) {
      if(res === undefined) return;
      this.selectedValue = '';
      if(item.type.indexOf('_range')>-1) {
        item.set[0].value = res[0];
        item.set[1].value = res[1];
        if(res[0]!=='' && res[1]!=='')
          if(item.type.indexOf('number')>-1) {
            item.selectedValue = `${this.currencyNum(res[0])} ~ ${this.currencyNum(res[1])}`;
          } else {
            item.selectedValue = `${res[0]} ~ ${res[1]}`;
          }
      }

      else if(item.type === "choice_radio") {
        item.set[0].value = res;
        item.selectedValue = item.options.filter(o=>{ return o.id === res })[0].label;
      }

      else if(item.type === 'address' && res.sido) {
        item.set[0].value = res.sido.id;
        item.set[0].label = res.sido.label;
        item.set[1].value = res.sigungu ? res.sigungu.id : '';
        item.set[1].label = res.sigungu ? res.sigungu.label : '';

      }

      else if(item.type === 'category') {
        item.set = [{
          value: res.id,
          keyword: 'category',
          operator: `${res.depth}_id`
        }];
        item.selectedValue = res.label;
      }

      else if(item.type === 'choice_color') {
        item.set[0].value = res;
        item.selectedValue = res.map(i => { return item.options.filter(o=>{return i === o.id})[0].name }).toString();
      }

      else {
        item.set[0].value = res;
        item.selectedValue = res;
      }

    }
  }
}