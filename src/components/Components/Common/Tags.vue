<template>
  <div class="flex-align" style="flex-wrap:wrap">
    <div class="unselect tag"  v-for="(tag,idx) in computedTags" :key="'tag-'+idx" @click.stop.prevent="clickTag(tag)"
         :style="[brandBgColor.main, brandColor.sub, elementStyle]">{{ tag }}</div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Tags",
    props: {
      tags: {
        type: Array,
        required: false,
        default: function() {
          return [];
        }
      },
      tagStyle: {
        type: Object,
        required: false
      }
    },
    computed: {
      computedTags() {
        let result = [];
        this.tags.forEach(tag => {
          if(tag !== '' && tag !== ' ')
            result.push(tag);
        });
        return result;
      },
      elementStyle() {
        let deco = {
          border: '1px solid ' + this.getColor('기본 테두리선 색상'),
          padding: '6px 12px',
          borderRadius: '36px',
          marginRight: '4px',
          marginBottom: '4px'
        }

        if(this.tagStyle) {
          return Object.assign(deco, this.tagStyle);
        } else {
          return deco;
        }
      }
    },
    methods: {
      clickTag(tag) {
        this.$axios.post('public/product/tag/log', {tag: tag}).then( res => {
          this.routerPush('search?search_tag='+tag.replace('#',''));
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .tag:hover
    color black !important
</style>