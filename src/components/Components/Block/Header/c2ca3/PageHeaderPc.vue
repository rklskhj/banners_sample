<template>
  <div class="page-header-relative full-width" :style="containerBg">
    <div class="flex-justify">
      <div class="flex-between" :style="pcMaxWidth">
        <button-partner-center
          :iconSize="20"
          :textStyle="centerStyle"
        ></button-partner-center>
        <div class="flex-align">
          <block-header-auth-text></block-header-auth-text>
          <block-menuset v-bind="menusetList[1]"></block-menuset>
        </div>
      </div>
    </div>
    <div class="flex-justify position-relative">
      <div class="grid-3" :style="pcMaxWidth">
        <block-header-logo v-bind="headerLogo"></block-header-logo>
        <div style="justify-content: center">
          <block-header-search v-bind="searchInput"></block-header-search>
        </div>
        <div style="justify-content: flex-end">
          <template v-for="(menu, idx) in buttonMenu">
            <block-button-menu
              v-bind="menu"
              :key="'menu-' + idx"
            ></block-button-menu>
          </template>
        </div>
        <block-hamburger v-bind="hamburger"></block-hamburger>
        <div style="justify-content: center">
          <block-menuset v-bind="menusetList[0]"></block-menuset>
        </div>
        <div style="justify-content: flex-end">
          <block-menuset v-bind="menusetList[2]"></block-menuset>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlockHeaderLogo from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderLogo.vue";
import BlockHeaderSearch from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderSearch.vue";
import BlockButtonMenu from "@/components/Components/Block/Header/Blocks/BlockButtonMenu.vue";
import BlockHamburger from "@/components/LaunchPack_Common/Header/Blocks/BlockHamburger.vue";
import BlockMenuset from "@/components/Components/Block/Header/Blocks/BlockMenuset.vue";
import BlockHeaderAuthText from "@/components/LaunchPack_Common/Header/Blocks/BlockHeaderAuthText.vue";
import ButtonPartnerCenter from "@/components/LaunchPack_Common/Header/Blocks/ButtonPartnerCenter.vue";
import BlockMixin from "@/components/Components/Mixins/BlockMixin";

export default {
  name: "PageHeaderPc",
  components: {
    BlockHeaderLogo,
    BlockHeaderSearch,
    BlockButtonMenu,
    BlockHamburger,
    BlockMenuset,
    BlockHeaderAuthText,
    ButtonPartnerCenter,
  },
  mixins: [BlockMixin],
  props: {},
  data() {
    return {
      list: [],
      bgColor: "brandBgColor.main",
      showMenu: false,
      hamburger: {
        id: 5,
        key: "hamburger",
        list: [],
        color: "brandColor.sub",
        visible: true,
        maxLength: 20,
        buttonName: "카테고리",
        activeColor: "brandColor.brand",
        activeBgColor: "brandBgColor.sub2",
      },
      buttonMenu: [
        {
          list: [
            {
              icon: "favorite_border",
              link: "like",
              visible: true,
              img_type: "icon",
              linkType: "link",
            },
            {
              icon: "shopping_cart",
              link: "cart",
              visible: false,
              img_type: "icon",
              linkType: "link",
              useOutline: true,
            },
            {
              icon: "person_outline",
              link: "mypage",
              visible: true,
              img_type: "icon",
              linkType: "link",
            },
          ],
          index: 0,
          visible: true,
        },
      ],
      headerLogo: {
        link: "home",
        type: "header_pc",
        visible: true,
        imgStyle: {
          height: "32px",
          maxWidth: "400px",
        },
        linkType: "link",
        containStyle: {
          display: "flex",
          alignItems: "center",
        },
      },
      limitIndex: 4,
      menusetList: [
        {
          id: 1,
          key: "header",
          list: [],
          index: 1,
          moreBtn: true,
          visible: true,
          colorSet: {
            sub: "brandColor.brand",
            main: "brandColor.sub",
            indicator: "brandBgColor.brand",
          },
          maxLength: 2,
          limitIndex: 2,
          selectState: true,
          visibleLimit: 2,
          menuItemStyle: {
            margin: "0 20px",
            fontSize: "16px",
            fontWeight: "500",
          },
          containerStyle: {
            fontSize: "15px",
          },
        },
        {
          id: 2,
          key: "header_top_right1",
          list: [],
          index: 2,
          moreBtn: true,
          visible: true,
          colorSet: {
            sub: "brandColor.brand",
            main: "brandColor.sub",
            indicator: "brandBgColor.brand",
          },
          maxLength: 10,
          limitIndex: 10,
          selectState: true,
          visibleLimit: 10,
          menuItemStyle: {
            padding: "4px 0",
            fontSize: "12px",
            marginLeft: "24px",
          },
          containerStyle: {
            fontSize: "15px",
          },
        },
        {
          id: 3,
          key: "header_top_right2",
          list: [],
          index: 3,
          moreBtn: true,
          visible: true,
          colorSet: {
            sub: "brandColor.brand",
            main: "brandColor.sub",
            indicator: "brandBgColor.brand",
          },
          maxLength: 10,
          limitIndex: 10,
          selectState: true,
          visibleLimit: 10,
          menuItemStyle: {
            padding: "4px 0",
            fontSize: "14px",
          },
          containerStyle: {
            fontSize: "15px",
          },
        },
      ],
      searchInput: {
        visible: true,
        iconStyle: {
          top: "9px",
          color: "#636363",
          right: "12px",
        },
        inputStyle: {
          color: "brandColor.main",
          width: "300px",
          height: "42px",
          padding: "8px 40px 8px 16px",
          borderRadius: "8px",
          backgroundColor: "brandBgColor.main",
        },
        borderColor: "brandBorder.main",
        placeholder: "",
      },
      searchValue: "",
      searchIconStyle: {},
    };
  },
  created() {
    this.$emit("headerChange", true);
    this.getMenusetInit();
    let pack = this.$store.getters.service.package;
    this.buttonMenu.forEach((menu) => {
      menu.list.forEach((item) => {
        if (item.icon === "shopping_cart") {
          item.visible = pack.some((i) => ["mart", "delivery"].indexOf(i) > -1);
        }
      });
    });
  },
  mounted() {},
  updated() {},

  methods: {
    async getMenusetInit() {
      let index = 0;
      for (let item of this.menusetList) {
        item.index = index++;
        await this.getMenuset(item);
      }
    },
    async getMenuset(item) {
      if (this.isLogin) {
        item.key = item.key.replace("guest", "member");
      } else {
        item.key = item.key.replace("member", "guest");
      }
      let res = await this.$axios.get(
        `public/ui/menuset/style/${item.key}?activated=true`,
        {
          cancelToken: null,
        }
      );
      let res_menu = res.data[0].menu;
      let list = [];
      res_menu.forEach((menu) => {
        if (menu.is_category) {
          this.$store.getters.category.forEach((cat) => {
            list.push({
              link: `product?gnb=${cat.id}`,
              linkType: "link",
              name: cat.name,
              id: cat.id,
              icon: cat.img_before,
            });
          });
        } else {
          list.push(menu);
        }
      });

      item.list = list.slice(0, item.maxLength);
    },
    currentCategory(id) {
      if (this.$route.path.indexOf("category") > -1) {
        let tab = "";
        if (this.$route.query.tab === undefined || this.$route.query.tab === "")
          tab = "";
        else tab = parseInt(this.$route.query.tab);

        if (tab === id) return true;
        else return false;
      } else return false;
    },
    closeMenu() {
      this.showMenu = false;
    },
    search() {
      let tab = this.$route.query.tab ? this.$route.query.tab : "";
      if (this.searchValue) {
        this.routerPush(`product?tab=${tab}&search=${this.searchValue}`);
      }
    },
  },
  computed: {
    centerStyle() {
      return {
        fontSize: "13px",
        color: this.brandColor.main.color,
      };
    },
    containerBg() {
      return {
        backgroundColor: this.parseColor(this.bgColor),
        borderBottom: this.brandBorder.main.border,
      };
    },
    categoryList() {
      return this.$store.getters.category;
    },
  },
  watch: {
    "$route.query"(n) {
      if (!n || !n.search) {
        this.searchValue = "";
      }
    },
  },
};
</script>
<style scoped>
.page-header-relative {
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*z-index: 100;*/
}
.divider {
  width: 1px;
  height: 16px;
  margin: 0 8px 0 24px;
}

input {
  height: 48px;
  width: 256px;
  border: none;
  padding: 12px 40px 12px 16px;
}
.header-border {
  border-bottom: 1px solid #f5f5f5;
  bottom: 0;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.grid-3 > * {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

