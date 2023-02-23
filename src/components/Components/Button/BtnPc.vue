<template>
<div :style="btnStyle()" class="unselect"
  @click="clickBtn"><slot></slot></div>
</template>
<script>

export default {
  name: 'BtnPc',
  components: {

  },
  mixins: [

  ],
  props: {
    styles: {
      type: String,
      default: "more",
      required: false,
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
    btnStyle() {
      let deco = {
        width: '240px',
        height: '60px',
        textAlign: 'center',
        lineHeight: '60px',
        borderRadius: '50px',
        fontSize: '16px',
        fontFamily: 'BM Euljiro'
      };
      if(this.styles==='more') {
        deco.border = `1px solid ${this.getColor('보조 테두리선 색상')}`
        deco.backgroundColor = 'white'
        deco.color = `${this.getColor('보조 내용 색상')}`
      }
      if(this.styles==='reverse') {
        deco.backgroundColor = `#c3996b`
        deco.color = 'white'
      }
      if(this.styles==='brand') {
        deco.backgroundColor = `${this.getColor('브랜드 강조 색상')}`
        deco.color = 'white'
      }
      if(this.styles==='primary') {
        deco.backgroundColor = `${this.getColor('Primary Color')}`
        deco.color = 'white'
      }
      return deco;
    },
    clickBtn() {
      this.$emit('onClick');
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


