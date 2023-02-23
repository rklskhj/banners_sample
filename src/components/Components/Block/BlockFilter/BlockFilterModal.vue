<template>
<div style="width:100%">
    <div class="flex-between">
      <div class="size-18 full-width" style="text-align:center">필터</div>
      <i class="material-icons unselect" @click="$emit('closePage')">close</i>
    </div>
    <div style="height:calc(70vh - 124px);padding-top:20px">
      <block-filter ref="filter" :vBottom="false" @closePage="$emit('closePage')"
        :isModal="true"></block-filter>
    </div>
    <div style="margin-top:20px" class="flex-align">
      <button class="unselect flex-center size-16 bold radius-8 p-border-primary p-bg-white p-primary"
        style="flex:1;height: 56px;margin-right:8px" @click="cancel">초기화</button>
      <button class="unselect flex-center size-16 bold radius-8 p-border-primary p-bg-primary p-white"
        style="flex:1;height: 56px;margin-left:8px" @click="confirm">적용</button>
    </div>
  </div>
</template>
<script>
import BlockFilter from "@/components/Components/Block/BlockFilter/BlockFilter.vue"

export default {
  name: 'BlockFilterModal',
  components: {
    BlockFilter
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {

    }
  },
  created() {
    
  },
  mounted() {
    this.$nextTick(()=>{
      for(let el of document.getElementsByClassName('sweet-content')) { 
        if(el.offsetHeight>0) {
          el.style.backgroundColor = this.brandBgColor.sub.backgroundColor;
          el.style.setProperty('padding', '32px', 'important')
          el.parentElement.style.borderRadius = '8px';
          el.parentElement.style.width = '564px';
        }
      }
      
      for(let el of document.getElementsByClassName('sweet-box-actions')) {
        if(el.offsetHeight>0) {
          el.style.display = 'none'
        }
      }
    });
  },
  
  methods: {
    confirm() {
      let err = '';
      this.$refs.filter.filterData.forEach(item => {
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
        this.$store.commit('setFilter', this.$refs.filter.filterData);
        this.$emit('closePage');
      }
    },
    cancel() {
      this.$store.commit('clearFilter');
      this.$refs.filter.setFilters();
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


