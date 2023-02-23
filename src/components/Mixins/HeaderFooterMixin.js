
export default {
  components: {

  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "staticText": {
        "value": "Copyright@2020 launchpackCorp. All rights reserved. Powered by launchpack",
        "styles": {
          "color": "#4f4f4f",
          "padding": 0
        }
      },
      "staticTextMobile": {
        "value": "Powered by launchpack",
        "styles": {
          "color": "#666666",
          "padding": 0,
          "textAlign": "center"
        }
      }
    }
  },
  created() {
    this.getMenusetInit();
    this.getBusinessInfo();
  },
  mounted() {

  },

  methods: {
    getBusinessInfo() {
      if(!this.businessInfo) return;
      let list = [];
      list.push({text: `사업자등록번호: ${this.info.business_num}`, visible: true});
      list.push({text: `대표자명: ${this.info.ceo_name}`, visible: true});
      list.push({text: `회사주소: ${this.info.address.full}`, visible: true});
      list.push({text: `고객센터: ${this.center.call}`, visible: true});
      list.push({text: `통신판매신고: ${this.info.ecommerce_num}`, visible: true});
      list.push({text: `운영시간: ${this.center.time}`, visible: true});
      list.push({text: `팩스번호: ${this.center.fax}`, visible: true});
      list.push({text: `이메일: <a href="mailto:${this.center.email}">${this.center.email}</a>`, visible: true});
      list.push({text: `카카오플러스 고객상담 주소: <a target="_blank" href="${this.center.kakao_url}">${this.center.kakao_url}</a>`, visible: true});


      this.businessInfo.list = list;
    },
    async getMenusetInit() {
      if(!this.menusetList) return;

      let index = 0;
      for(let item of this.menusetList) {
        item.index = index++;
        await this.getMenuset(item);
      }
    },
    async getMenuset(item) {
      let res = await this.$axios.get(`public/ui/menuset/${item.id}`);
      let list = [];
      res.data.menu.forEach(menu => {
        if(menu.is_category) {
          this.$store.getters.category.forEach(cat => {
            list.push({
              link: `product?gnb=${cat.id}`,
              linkType: 'link',
              name: cat.name,
              id: cat.id,
              icon: cat.img_before
            });
          });
        }
        else {
          list.push(menu);
        }
      });

      item.list = list.slice(0, item.maxLength);

      // 기본 스타일
      if(item.colorSet.main === '') {
        item.colorSet.main = this.brandColor.main;
        item.colorSet.sub = this.brandColor.brand;
        item.colorSet.indicator = this.brandBgColor.brand;
      }
    }
  },
  computed: {
    info() {
      return this.$store.getters.service.business_info;
    },
    center() {
      return this.$store.getters.service.service_center;
    }
  },
  watch: {

  }
}
