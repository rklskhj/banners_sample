<template>
<div class="flex-align size-14 weight-500 p-main" style="padding:32px 0">
  <div v-for="(item,idx) in value" :key="`parent${idx}`"
    class="parent unselect position-relative flex-align p-bg-white radius-6" 
    style="z-index:10;" @click.stop.prevent="clickMenu(item, idx)">
    <div class="full-width text-center">{{ item.name }}</div>
    <i class="material-icons size-20" v-if="item.list" style="margin-left: 4px;"
      >{{ openListIndex===idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</i>
    <div v-if="openListIndex===idx && item.list"
      class="position-absolute children unselect p-bg-white radius-6"
      v-click-outside="closeList">
      <div v-for="(child,child_idx) in item.list" :key="`child${child_idx}`" class="child"
        @click.stop.prevent="clickChild(idx,child_idx)">
        <div>{{ child.name }}</div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

export default {
  name: 'BreadCrumbPc',
  components: {

  },
  mixins: [

  ],
  props: {
    breadcrumb: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      "value": [],
      "openListIndex": undefined
    }
  },
  created() {
    this.setValue();
  },
  mounted() {

  },
  
  methods: {
    setValue() {
      this.value = [];
      this.breadcrumb.forEach(item => {
        item.openList = false;
        item.uid = this.uuidv4();
        this.value.push(item);
      });
    },
    clickMenu(item, idx) {
      if (item.list===undefined) {
        if (item.link) this.routerPush(item.link);
        else return;
      }
      else {
        if (this.openListIndex===idx) this.openListIndex = undefined;
        else this.openListIndex = idx;
      }
    },
    closeList() {
      this.openListIndex = undefined;
    },
    clickChild(idx, child_idx) {
      let parent = this.value[idx];
      let child = this.value[idx].list[child_idx];
      parent.name = child.name;
      parent.link = child.link;
      this.openListIndex = undefined;
      this.routerPush(child.link);
    }
  },
  computed: {
    
  },
  watch: {
    breadcrumb(n) {
      this.setValue();
    }
  }
}
</script>
<style scoped>
.parent {
  padding: 12px;
  margin-right: 12px;
  height: 48px;
  min-width: 48px;
}
.children {
  white-space: pre;
  padding: 12px;
  top: 60px;
  left: 0;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.24);
}
.child {
  padding: 8px 12px;
}
</style>

