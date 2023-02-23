<template>
<div class="flex-justify" v-if="pagingData" :style="containerStyle">
  <div class="flex-center unselect" :style="arrowLeftEndStyle"
    @click="clickLeftEnd" v-if="arrLeft===true && arrowEnd === true">
    <i class="material-icons">double_arrow</i>
  </div>

  <div class="flex-center unselect" :style="arrowLeftStyle"
    @click="clickLeft" v-if="arrLeft===true">
    <i class="material-icons">keyboard_arrow_left</i>
  </div>

  <div v-for="(item,idx) in paging" :key="'key-'+idx" 
    :style="pagingData.cur_page==item ? selectedNumStyle : numStyle"
    @click="clickNum(item)" class="unselect">
    {{ item }}
  </div>

  <div class="flex-center unselect" :style="arrowRightStyle"
    @click="clickRight" v-if="arrRight===true">
    <i class="material-icons">keyboard_arrow_right</i>
  </div>

  <div class="flex-center unselect" :style="arrowRightEndStyle"
    @click="clickRightEnd" v-if="arrRight===true && arrowEnd === true">
    <i class="material-icons">double_arrow</i>
  </div>
</div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pageNum: {
      type: Number,
      required: true
    },
    pagingData: {
      type: Object,
      required: true
    },
    arrowEnd: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      startPage: 1,
      endPage: undefined,
      paging: [],
      arrLeft: false,
      arrRight: false,
    }
  },
  created() {
    this.getPaging();
  },
  watch: {
    'pagingData.total_page'() {
      this.getPaging();
    }
  },
  methods: {
    getPaging() {
      // 현재 페이지네이션 중에서 맨 첫번째 시작 넘버 계산
      this.startPage = parseInt((this.pagingData.cur_page-1) / this.pageNum) * this.pageNum + 1
      // 현재 페이지네이션 중에서 맨 마지막 넘버 계산
      this.endPage = this.startPage + this.pageNum -1

      if (this.pageNum<this.pagingData.total_page) {
        this.arrLeft = true;
      }
      else this.arrLeft = false;

      if (this.pageNum < this.pagingData.total_page) {
        this.arrRight = true;
      }

      if (this.endPage >= this.pagingData.total_page) {
        this.endPage = this.pagingData.total_page;
        this.arrRight = false;
      }
      
      this.paging = [];
      for(let i=this.startPage;i<=this.endPage; i++) {
        this.paging.push(i)
      }
    },
    clickNum(item) {
      this.$emit('curPaginationNum', item);
      this.pagingData.cur_page = item;
    },
    clickRight() {
      this.pagingData.cur_page = this.endPage + 1;
      this.$emit('curPaginationNum', this.pagingData.cur_page);
      this.getPaging();
    },
    clickLeft() {
      if (this.startPage===1) {
        this.pagingData.cur_page = 1
      }
      else this.pagingData.cur_page = this.startPage - 1;
      this.$emit('curPaginationNum', this.pagingData.cur_page);
      this.getPaging();
    },
    clickLeftEnd() {
      this.pagingData.cur_page = 1;
      this.$emit('curPaginationNum', this.pagingData.cur_page);
      this.getPaging();
    },
    clickRightEnd() {
      this.pagingData.cur_page = this.pagingData.total_page;
      this.$emit('curPaginationNum', this.pagingData.cur_page);
      this.getPaging();
    }
  },
  computed: {
    containerStyle() {
      let deco = {};
      if(this.$store.getters.device==='pc') {
        deco.marginTop = '60px'
      }
      if(this.$store.getters.device==='mobile') {
        deco.marginTop = '32px'
      }
      return deco;
    },
    numStyle() {
      return {
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    selectedNumStyle() {
      return {
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${this.getColor('보조 테두리선 색상')}`
      }
    },
    arrowLeftStyle() {
      return {
        width: '40px',
        height: '40px',
        border: '1px solid #dddddd',
        color: '#dddddd',
        marginRight: '20px'
      }
    },
    arrowRightStyle() {
      return {
        width: '40px',
        height: '40px',
        border: '1px solid #dddddd',
        color: '#dddddd',
        marginLeft: '20px'
      }
    },
    arrowLeftEndStyle() {
      return {
        width: '40px',
        height: '40px',
        border: '1px solid #dddddd',
        color: '#dddddd',
        marginRight: '8px',
        transform: 'rotate(180deg)',
      }
    },
    arrowRightEndStyle() {
      return {
        width: '40px',
        height: '40px',
        border: '1px solid #dddddd',
        color: '#dddddd',
        marginLeft: '8px',
      }
    }
  }
}
</script>

<style scoped>

</style>