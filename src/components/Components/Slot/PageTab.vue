<template>
  <div>
    <div class="flex-justify position-relative" v-if="device === 'pc'">
      <div :style="[tabStyle, pcMaxWidth]">
        <div v-for="(item,idx) in tabs" :key="'page-tab-'+idx"
             class="unselect" :style="tabHeaderStyle(item)" @click="clickTab(item)">{{ item.tab_name }}</div>
      </div>
    </div>
    <template v-else>
      <div :style="tabStyle">
        <div v-for="(item,idx) in tabs" :key="'page-tab-'+idx"
             class="unselect" :style="tabHeaderStyle(item)" @click="clickTab(item)">{{ item.tab_name }}</div>
      </div>
    </template>
    <div class="page-tab-content">
      <div v-for="(item,idx) in tabs" :key="'page-tab-content-'+idx">
        <template v-if="item.tab_index === Number($route.query.tab_id)">
          <slot :name="item.name"></slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PageTab",
    props: {
      tabs: {
        type: Array
      },
      device: {
        type: String,
        default: 'pc'
      }
    },
    mounted() {
      this.$nextTick(()=>{
        if(this.tabs.length>0) {
          if(!this.$route.query.tab_id) {
            this.clickTab(this.tabs[0]);
          }
        }
      })
    },
    data() {
      return {}
    },
    methods: {
      clickTab(item) {
        let query = this.cloneItem(this.$route.query);
        query.tab_id = item.tab_index;
        this.$router.replace({
          path: this.$route.path,
          query: query
        });
      },
      tabHeaderStyle(item) {
        let color = this.brandColor.sub.color;
        let bottomColor = 'transparent';
        if(item.tab_index === Number(this.$route.query.tab_id)) {
          bottomColor = this.getColor('브랜드 강조 색상');
          color = this.brandColor.brand.color;
        }
        let deco = {
          color: color,
          padding: '12px 16px 10px 16px',
          borderBottom: `2px solid ${bottomColor}`,
          textAlign: 'center'
        }
        if(this.device === 'mobile') {
          deco.width = `${100 / this.tabs.length }%`;
        }
        return deco;
      }
    },
    computed: {
      tabStyle() {
        return {
          display: 'flex',
          borderBottom: this.brandBorder.main.border
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .page-tab-header
    border-bottom 1px solid #dddddd
    display flex

  .page-tab-header-select
    border-bottom 2px solid #333

</style>
