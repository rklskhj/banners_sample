<template>
<div>
  <div class="flex-end margin-bottom-12">
    <div :style="[dropStyle, brandColor.sub]" class="position-relative">
      <div @click.stop.prevent="clickDrop" class="flex-between unselect" style="padding:0 12px;line-height:40px">
        <div>{{ selectedMenu.name }}</div>
        <div class="material-icons">keyboard_arrow_down</div>
      </div>

      <div v-if="showDrop===true" class="position-absolute" v-click-outside="closeDrop"
        :style="downStyle">
        <div v-for="(item,idx) in dropMenu" :key="'key'+idx" class="drop-menu"
          @click="clickDropMenu(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <input :style="inputStyle" :value="searchValue" @input="e => inputSearch(e.target.value)"
      @keyup.enter="getSearch">
    <div :style="btnStyle" class="flex-center unselect" @click="getSearch">검색</div>
  </div>
</div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  name: "SearchList",
  directives: {
    ClickOutside
  },
  data() {
    return {
      searchValue: '',
      dropMenu: [
        {
          name: '통합',
          type: 'all'
        },
        {
          name: '제목',
          type: 'title'
        },
        {
          name: '내용',
          type: 'content'
        }
      ],
      showDrop: false,
      selectedMenu:
      {
        name: '통합',
        type: 'all'
      }
    }
  },
  computed: {
    dropStyle() {
      return {
        width: '100px',
        height: '40px',
        border: '1px solid #dddddd'
      }
    },
    downStyle() {
      return {
        width: '100px',
        height: '102px',
        backgroundColor: '#ffffff',
        border: '1px solid #dddddd',
        top: '37px',
        left: '-1px'
      }
    },
    inputStyle() {
      return {
        width: '260px',
        height: '40px',
        border: '1px solid #dddddd',
        marginLeft: '6px',
        fontSize: '16px',
        paddingLeft: '12px'
      }
    },
    btnStyle() {
      return {
        width: '110px',
        height: '40px',
        border: '1px solid #959595',
        backgroundColor: '#959595',
        color: 'white',
        marginLeft: '6px'
      }
    }
  },
  methods: {
    inputSearch(value) {
      this.searchValue = value;
    },
    getSearch() {
      this.$emit('getSearch', this.selectedMenu.type, this.searchValue)
    },
    closeDrop() {
      this.showDrop = false
    },
    clickDrop() {
      this.showDrop = !this.showDrop
    },
    clickDropMenu(item) {
      this.selectedMenu = item;
      this.showDrop = false;
    }
  }
}
</script>

<style scoped>
.drop-menu {
  line-height:34px; 
  padding-left:12px;
}
.drop-menu:hover {
  background-color: #dddddd;
}
</style>