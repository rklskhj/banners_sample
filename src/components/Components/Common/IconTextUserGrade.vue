<template>
  <div
      v-if="grade!==undefined"
      class="lp-grade-label" :style="labelStyle">
    <i class="material-icons" v-if="labelType === 2" style="font-size:22px;margin-right:2px">person_outline</i> <span>{{ userGradeName }}</span>
  </div>
</template>

<script>
  import {colorToString} from '@/utils/helper/object-helper'
  export default {
    name: "IconTextUserGrade",
    props: {
      grade: {
        type: Object,
        required: false
      }
    },
    computed: {
      gradeStyle() {
        return find(this.$store.getters.grade, 'order', this.grade.order);
      },
      userGradeName() {
        return this.gradeStyle.name;
      },
      labelType() {
        return this.gradeStyle.label_type;
      },
      labelStyle() {
        let color = colorToString(this.gradeStyle.color.color);
        let border = `1px solid ${colorToString(this.gradeStyle.color.border)}`;
        let style = {};
        switch (this.labelType) {
          case 0:
            style = {
              border: border,
              padding: '2px 8px',
              borderRadius: '16px',
              color: color
            };
            break;
          case 1:
          case 2:
            style = {
              color: color
            };
            break;
          case 3:
            style = {
              backgroundColor: color,
              borderRadius: '6px',
              color: 'white'
            };
            break;
          case 4:
            style = {
              backgroundColor: color,
              color: 'white'
            };
            break;

        }
        return style;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .lp-grade-label
    padding 2px 8px
    margin-left 8px
    font-size 13px
    display flex
    align-items center
    font-weight 400
</style>
