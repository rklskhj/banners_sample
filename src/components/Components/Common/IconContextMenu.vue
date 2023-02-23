<template>
  <div class="position-relative flex-justify" v-click-outside="hide">
    <i
      class="material-icons unselect"
      :style="moreIconStyle"
      @click.stop.prevent="vMenu = !vMenu"
    >more_horiz</i>
    <div :style="[radius, contextMenuStyle]" v-if="vMenu">
      <div
        v-for="(item,idx) in menu"
        :key="'context-menu-'+idx"
        :style="brandColor.help"
        style="line-height:initial;font-size:11px;padding:12px"
        class="unselect"
        @click.stop.prevent="clickMenu(item)"
      >{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "IconContextMenu",
  props: {
    iconStyle: {
      type: [Object, Array],
      required: true
    },
    selectedIconStyle: {
      type: Object,
      required: false
    },
    menu: {
      type: Array,
      required: true
    }
  },
  directives: {
    ClickOutside
  },
  data() {
    return {
      vMenu: false
    };
  },
  methods: {
    hide() {
      this.vMenu = false;
    },
    clickMenu(item) {
      this.hide();
      this.$emit(item.action);
    }
  },
  computed: {
    contextMenuStyle() {
      return {
        position: "absolute",
        top: "32px",
        right: 0,
        boxShadow: "0 5px 20px 0 rgba(44, 39, 39, 0.16)",
        textAlign: "center",
        background: "white",
        zIndex: 1,
        minWidth: "120px"
      };
    },
    moreIconStyle() {
      if (this.vMenu) {
        return this.iconStyle;
      } else {
        return this.selectedIconStyle ? this.selectedIconStyle : this.iconStyle;
      }
    }
  }
};
</script>

<style scoped>
</style>