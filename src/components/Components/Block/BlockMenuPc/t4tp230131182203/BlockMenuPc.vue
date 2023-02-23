<template>
  <div class="flex-justify" style="min-height: 218px; padding: 40px 0">
    <div class="full-width" :style="pcMaxWidth" style="padding: 16px 8px">
      <div class="grid-wrap" :style="gridWrapStyle">
        <div
          v-for="(item, idx) in list"
          :key="item.id"
          class="flex-center wrap unselect"
          @click="clickCat(item)"
        >
          <div class="img-wrap flex-center wrap" :style="boxStyle(idx)">
            <i
              v-if="item.img_type && item.img_type === 'icon'"
              :style="brandColor.main"
              class="material-icons-outlined"
              style="font-size: 48px"
              >{{ item.icon }}</i
            >
            <e-image
              v-else
              :isBg="true"
              :isLazy="false"
              :img="item.img"
              :useThumb="true"
              :width="48"
              :useRatio="true"
              :imageRates="imageRates"
              class="flex-center position-relative"
            >
            </e-image>
            <div
              class="full-width size-16 text-center weight-500"
              style="margin-top: 12px"
              :style="brandColor.main"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlockMixin from "@/components/Components/Mixins/BlockMixin";

export default {
  name: "BlockMenuPc",
  components: {},
  mixins: [BlockMixin],
  props: {},
  data() {
    return {
      img: "https://launchpack-storage.s3.ap-northeast-2.amazonaws.com/media/lptemp/non-path/41446278.jpeg",
      key: "t2tp221201181208",
      list: [],
      title: "메뉴",
      bgColor: "brandBgColor.main",
      gridNum: 4,
      imageRates: {
        ratio: "1:1",
      },
      visibleNum: 12,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.setBg();
  },

  methods: {
    setBg() {
      this.$el.parentElement.style.backgroundColor = this.parseColor(
        this.bgColor
      );
    },
    async getData() {
      let res = await this.$axios.get(
        `public/ui/menuset/style/${this.key}?activated=true`
      );
      let list = [];
      res.data[0].menu.forEach((menu) => {
        if (menu.is_category) {
          list = list.concat(
            this.$store.getters.category.map((cat) => {
              return {
                link: `product?gnb=${cat.id}`,
                linkType: "link",
                name: cat.name,
                id: cat.id,
                img: cat.img_before ? cat.img_before : this.img,
              };
            })
          );
        } else {
          if (menu.img_type === "icon" && menu.icon === "") {
            menu.img_type = "img";
            menu.img = this.img;
          } else if (menu.img) {
            menu.img_before = menu.img;
          } else if (!menu.img || !menu.img) {
            menu.img = this.img;
          }
          list.push(menu);
        }
      });

      this.list = list.slice(0, this.visibleNum);
    },
    clickCat(item) {
      if (item.linkType === "link" || item.linkType === "page") {
        this.routerPush(item.link);
      } else if (item.linkType === "overlay") {
        this.routerOverlay(item.link);
      } else if (item.linkType === "modal") {
        this.routerModal(item.link);
      } else if (item.linkType === "drawer_left") {
        this.routerDrawerLeft(item.link);
      } else if (item.linkType === "drawer_right") {
        this.routerDrawerRight(item.link);
      } else if (item.linkType === "emit") {
        this.$emit(item.link);
      } else if (item.linkType === "outlink") {
        const a = document.createElement("a");
        a.href = item.link;
        a.setAttribute("target", "_blank");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      }
    },
    boxStyle(idx) {
      const border = this.brandBorder.sub.border;
      let deco = {
        borderRight: border,
        borderBottom: border,
      };

      if (idx % this.gridNum === 0) {
        deco.borderLeft = border;
      }

      if (idx < this.gridNum) {
        deco.borderTop = border;
      }

      return deco;
    },
  },
  computed: {
    gridWrapStyle() {
      return `grid-template-columns: repeat(${this.gridNum}, 1fr);`;
    },
  },
  watch: {
    bgColor() {
      this.setBg();
    },
  },
};
</script>
<style scoped>
.grid-wrap {
  display: grid;
}
.img-wrap {
  width: 100%;
  height: 120px;
  padding: 20px 0;
}
.cat-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>

