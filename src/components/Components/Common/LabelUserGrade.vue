<template>
<div v-if="enablePlugin" :style="labelStyle" class="flex-align" :class="`size-${fontSize}`">
  <i v-if="grade_type===2" class="material-icons size-16" style="margin-left:2px">person</i>{{grade.name}}
</div>
</template>
<script>

export default {
  name: 'LabelUserGrade',
  components: {

  },
  mixins: [

  ],
  props: {
    grade: {
      type: Object,
    },
    fontSize: {
      type: Number,
      default: 12,
    },

  },
  data() {
    return {
      "user_color": "",
      "user_border": "",
      "user_bgcolor": ""
    }
  },
  created() {
    this.user_color = this.colorToString(this.grade.style.color)
    this.user_border = `1px solid ${this.colorToString(this.grade.style.border)}`;
    this.user_bgcolor = this.colorToString(this.grade.style.border);
  },
  mounted() {

    
  },
  
  methods: {
    colorToString(lpColor) {
      return `rgba(${lpColor.r},${lpColor.g},${lpColor.b},${lpColor.a})`;
    }
  },
  computed: {
    enablePlugin() {
      return this.$store.getters.brand.plugins.indexOf('user_grade')>-1;
    },
    grade_type() {
      return this.grade.label_type;
    },
    labelStyle() {
      let deco = {};
      switch (this.grade.label_type) {
        case 0:
          deco = {
            "border": this.user_border,
            "color": this.user_color,
            "borderRadius": "25px",
            "padding": "2px 8px"
          };
          break;
          
        case 1:
          deco = {
            "color": this.user_color
          };
          break;
        case 2:
          deco = {
            "color": this.user_color,
            "borderRadius": "25px",
            "padding": "2px 8px"
          };
          break;
        case 3:
          deco = {
            "border": this.user_border,
            "color": this.user_color,
            "borderRadius": this.radius.borderRadius,
            "padding": "2px 8px",
            "backgroundColor":this.user_bgcolor
          };
          break;
        case 4:
          deco = {
            "border": this.user_border,
            "color": this.user_color,
            "padding": "2px 8px",
            "backgroundColor":this.user_bgcolor
          };
          break;
      }
      return deco;
    }
  },
  watch: {
    
  }
}
</script>


