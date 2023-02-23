<template>
<div v-show="visible" class="flex-center search-wrap position-relative block-header-search">
  <div :style="boxStyle">
    <input type="text" 
      :value="searchValue" :placeholder="placeholder"
      class="size-14 block-header-search-input" :style="searchStyle"
      @keyup="e => searchValue = e.target.value" 
      @keyup.enter="search" />
    <i class="material-icons position-absolute unselect" 
      :style="searchIconStyle" @click="search">search</i>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockHeaderSearch',
  components: {

  },
  mixins: [

  ],
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    iconStyle: {
      type: Object,
      required: false,
    },
    wrapStyle: {
      type: Object,
      required: false,
    },
    inputStyle: {
      type: Object,
      required: false,
    },
    borderColor: {
    },
    placeholder: {
      type: String,
      default: "검색어를 입력하세요",
      required: false,
    },

  },
  data() {
    return {
      "searchValue": ""
    }
  },
  created() {
    
  },
  mounted() {

  },
  
  methods: {
    search() {
      if(this.searchValue!=='') {
       this.routerPush(`search?search=${this.searchValue}`); 
      }
    }
  },
  computed: {
    boxStyle() {
      let deco = {};
      
      if(this.wrapStyle&&Object.keys(this.wrapStyle).length>0) {
        deco = this.wrapStyle;
      }
      else {
        deco.width = '100%';
      }
      
      return deco;
    },
    searchStyle() {
      let deco = {};
      
      if(this.inputStyle) {
        deco = this.cloneItem(this.inputStyle);
        deco.color = this.parseColor(deco.color);
        deco.backgroundColor = this.parseColor(deco.backgroundColor);
      }
      else {
        deco.height = '32px';
        deco.width = '164px';
        deco.padding = '4px 40px 4px 16px';
        deco.borderRadius = '20px';
        deco.border =  this.brandBorder.main;
      }
      if(this.borderColor) {
        deco.border = `1px solid ${this.parseColor(this.borderColor)}`;
      }
      return deco;
    },
    searchIconStyle() {
      let deco = {};
      
      if(this.iconStyle) {
        deco = this.cloneItem(this.iconStyle);
        if(deco.color) {
          deco.color = this.parseColor(deco.color);
        }
      }
      else {
        deco.top = '6px';
        deco.right = '12px';
        deco.fontSize = '20px';
      }
      
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


