<template>
<div style="height:100%">
    <div class="p-bg-sub" :style="paddingStyle"
      style="height: 100%;overflow-y: auto">
      <!-- 아코디언 -->
      <div style="padding-top:12px">
        <div v-for="(item,idx) in filterData" :key="'filter-'+idx" class="p-bg-white radius-8" style="margin-bottom: 12px">
          <div class="flex-align unselect" @click="item.visible = !item.visible" style="padding:16px;line-height: 24px">

            <div class="weight-500 size-16 p-main">{{ item.label }}</div>
            <div class="ellipsis size-14 p-primary"
              style="flex:1;width:100%;text-align: right;padding: 0 4px 0 12px">{{ item.selectedValue }}</div>
            <i class="material-icons p-main">{{ item.visible ? 'expand_less' : 'expand_more' }}</i>
          </div>
          <!-- 컨텐트 영역 -->
          <div v-if="item.visible" style="padding:16px">
            <component :is="item.elType" v-bind="item" :gutter="0"
                       :inputCustomStyle="inputCustomStyle"
                       :dropdownCustomStyle="dropdownCustomStyle"
                       :selectedValue.sync="item.selectedValue"
                       :formType="formTypeData"
                       :value.sync="item.value"
                       :filterOptions.sync="item"
                       :fullUnselectedCustomStyle="fullUnselectedCustomStyle"
                       :fullSelectedCustomStyle="fullSelectedCustomStyle"
                       :iconVisible="false"
                       @update:value="res => updateValue(item, res)"
            ></component>
          </div>
        </div>
      </div>
      <div v-if="vBottom" style="margin-top:40px">
        <button class="size-16 radius-6 p-bg-brand p-white"
          style="width: 100%; border: 0; height: 48px"
          @click="clickApply">적용</button>
      </div>
    </div>
  </div>
</template>
<script>
import FilterMixin from "@/components/Components/Mixins/FilterMixin"

export default {
  name: 'BlockFilter',
  components: {

  },
  mixins: [
    FilterMixin
  ],
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
    vBottom: {
      type: Boolean,
      default: true,
    },

  },
  data() {
    return {
      "useSort": true,
      "filterId": 1,
      "sortData": undefined,
      "distanceData": undefined,
      "inputCustomStyle": {
        "border": "1px solid rgba(221,221,221,1)",
        "padding": "12px",
        "fontSize": "14px",
        "borderRadius": "10px"
      },
      "dropdownCustomStyle": {
        "border": "1px solid rgba(221,221,221,1)",
        "padding": "8px 16px",
        "fontSize": "14px",
        "borderRadius": "6px"
      },
      "fullSelectedCustomStyle": {},
      "fullUnselectedCustomStyle": {}
    }
  },
  created() {
      this.inputCustomStyle.border = this.brandBorder.main.border;
      this.dropdownCustomStyle.border = this.brandBorder.main.border;
      this.fullUnselectedCustomStyle = {
        borderRadius: '30px',
        border: this.brandBorder.main.border,
        color: this.brandColor.sub.color,
        backgroundColor: this.brandBgColor.white.backgroundColor,
        height: '34px',
        textAlign: 'center'
      };
      this.fullSelectedCustomStyle = {
        borderRadius: '30px',
        border: this.brandBorder.primary.border,
        color: this.brandBgColor.main.backgroundColor,
        backgroundColor: this.brandBgColor.primary.backgroundColor,
        height: '34px',
        textAlign: 'center'
      };
      this.setFilters();
    },
  
  methods: {
    clickApply() {
      let err = '';
      this.filterData.forEach(item => {
        if (item.type === 'number_range_input') {
          if (item.value[0] !== '' && item.value[1] !== '') {
            if (Number(item.value[0]) > Number(item.value[1])) {
              err = '최저 값은 최고 값보다 더 큰 값으로 지정할 수 없습니다.'
            }
          }
        }
      })
      if (err !== '') {
        this.toast(err);
        return;
      } else {
        this.$store.commit('setFilter', this.cloneItem(this.filterData));
        this.$store.commit('setFiltertoggle', true)
        this.$emit('closePage');
      }
    },
    clickReset() {
        this.$store.commit('clearFilter');
        this.$emit('closePage');
      },
    computedCheckbox(items) {
        let res = [];
        for(let i=0; i<items.length; i++) {
          let item = items[i];
          res.push({
            id: item.id,
            checked: false,
            label: item.name,
            value: item.id
          });
        }

        return res;
      }
  },
  computed: {
    paddingStyle() {
      let deco = {}
      if (this.$store.getters.device !== 'pc') {
        deco = this.pagePadding
      } else {
        deco.paddingLeft = '0px';
        deco.paddingRight = '0px';
      }
      if (this.isModal) {
        deco.paddingBottom = '0px';
      } else {
        deco.paddingBottom = '150px';
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>

<style>
.radio-button-text {
    text-align: left !important;
  }
</style>
