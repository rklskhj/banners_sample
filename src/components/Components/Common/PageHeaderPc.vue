<template>
  <div class="flex-center header-pc" :style="brandBgColor.white">
    <div class="flex-between" :style="pcWrapStyle">
      <div class="unselect" :style="logoStyle" 
        @click="clickLogo">{{ logo === '' ? serviceTitle : '' }}</div>
      <div class="flex-align">
        <div v-for="(item,idx) in menu" :key="item.id"
          @click.stop.prevent="clickMenu(item)"
          class="header-item position-relative" :style="brandColor.primary"
          :class="{ 'selected' : $route.path.indexOf(item.link)>-1 }"
          @mouseover="!item.content ? '' : mouseoverIndex=idx"
          @mouseleave="menuMouseover ? mouseoverIndex=idx : mouseoverIndex=undefined">
          <span>{{ item.name }}</span>

          <!-- 서브 메뉴 -->
          <div v-if="item.content && mouseoverIndex===idx" 
            class="cat-wrap position-absolute"
            @mouseover="menuMouseover=true"
            @mouseleave="menuMouseover=false"
            >
            <div v-for="cat in item.content" :key="cat.id"
              class="cat-depth-1">
              <div class="cat-item"
                @click.stop.prevent="clickMenu(item, cat.id)"
                >{{ cat.name }}</div>
            </div>
          </div>

        </div>
        <div v-if="!isLogin"
          class="sign-button"
          :style="[brandColor.white, brandBgColor.primary]"
          @click="routerPush('/signin')"
          >로그인</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PageHeaderPc",
    props: {
      setMenu: {
        type: Array,
        required: false
      }
    },
    created() {
      // this.menu = this.$store.getters.brand.menu;
      if (this.setMenu) this.menu = this.setMenu;

      for (let i=0; i<this.menu.length; i++) {
        if (this.menu[i].link === 'board_cat') {
          this.$axios.get(`public/board/category`)
          .then(res => {
            this.menu[i].content = res.data;
            this.$forceUpdate();
          })
        }
        else continue;
      }            
    },
    data() {
      return {
        menu: [],
        mouseoverIndex: undefined,
        menuMouseover: false
      }
    },
    computed: {
      logo() {
        if(this.$store.getters.brand && this.$store.getters.brand.logo)
          return this.$store.getters.brand.logo;
        else
          return ''
      },
      serviceTitle() {
        if(this.$store.getters.service)
          return this.$store.getters.service.title;
        else
          return '';
      },
      pcWrapStyle() {
        return {
          width: '1020px'
        }
      },
      logoStyle() {
        return {
          backgroundImage: `url("${this.$store.getters.brand.logo}")`,
          width: '160px',
          height: '80px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          color: 'white',
          lineHeight:'80px',
          fontSize: '24px',
          fontFamily: 'BM JUA'
        }
      }
    },
    methods: {
      clickLogo() {
        // this.$route.meta.clickPush = true;
        this.routerPush('/home');
      },
      clickMenu(menu, id) {
        // 서브메뉴 없을 경우
        if (menu.content===undefined && id===undefined) {
          // this.$route.meta.clickPush = true;
          this.routerPush('/'+menu.link);
        }
        // 서브메뉴 있을 경우
        else {
          // 게시판
          if (menu.link==='board_cat') {
            if (id) this.routerPush('/'+menu.link + '/'+id);   // 서브메뉴 클릭 시
            else this.routerPush('/'+menu.link+'/'+menu.content[0].id);  // 메뉴 클릭 시 (첫번째 서브메뉴)
          }
          else this.routerPush('/'+menu.link);
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .header-pc
    position fixed
    z-index 10
    width 100%
    top 0

  .header-item
    padding 16px 20px
    cursor pointer
    &.selected
      font-weight 600
      color rgba(255,255,255,1)

  .sign-button
    border-radius 4px
    padding 8px 16px
    margin-left 16px
    font-size 14px
    cursor pointer

  .cat-wrap 
    background #fff
    border-radius: 4px;
    box-shadow: 0px 3px 16px 1px rgba(170,170,170,0.1);
    top: 52px;
    left: 0px;
    width: 180px;
    font-weight normal
  .cat-item
    padding 8px 12px
    &:hover
      background #f2f2f2

</style>