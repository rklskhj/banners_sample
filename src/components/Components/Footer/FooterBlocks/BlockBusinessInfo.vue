<template>
<div :style="containerStyle" v-show="visible">
  <template v-if="list && list.length>0">
    <span v-html="list[0].text"></span>
    <span class="delim">{{ delim }}</span>
    <span v-html="list[1].text"></span>
    <br>
  </template>
  <div class="flex wrap" :style="flexAlign">
    <div v-for="(item,idx) in list.slice(2)">
      <template v-if="item.visible">
        <span v-html="item.text"></span><span class="delim" v-if="idx < list.slice(2).length - 1 && delim!==''">{{ delim }}</span>
      </template>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BlockBusinessInfo',
  components: {

  },
  mixins: [

  ],
  props: {
    list: {
      type: Array,
    },
    delim: {
      type: String,
      default: "|",
    },
    styles: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: true,
    },

  },
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {

  },
  
  methods: {
    
  },
  computed: {
    containerStyle() {
      let deco = this.cloneItem(this.styles);
      deco.color = this.parseColor(deco.color);
      return deco;
    },
    flexAlign() {
      let deco = {};
      if(this.containerStyle.textAlign === 'center') {
        deco.justifyContent = 'center';
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>
<style scoped>
.delim {
    margin: 0 4px;
    font-size: 10px;
    vertical-align: bottom;
  }
</style>
<style>
a {
    color: initial;
    text-decoration: none;
  }
</style>
