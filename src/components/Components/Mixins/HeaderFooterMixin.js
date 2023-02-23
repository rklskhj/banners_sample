
export default {
    components: {

    },
    mixins: [

    ],
    props: {

    },
    data() {
    return {
      "info": undefined,
      "center": undefined,
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
    this.setInit();
    this.getMenusetInit();
    this.getBusinessInfo();
  },
  mounted() {

  },
  
    methods: {
      setInit() {
        this.info = this.$store.getters.service.business_info;
        this.center = this.$store.getters.service.service_center;
      },
    getBusinessInfo() {
      if(!this.businessInfo) return;
      if(this.businessInfo.list.length === 0) {
        this.businessInfo.list = [
          {label: '', key: 'info.company', visible: true},
          {label: '대표자명', key: 'info.ceo_name', visible: true},
          {label: '회사주소', key: 'info.address.full', visible: true},
          {label: '사업자등록번호', key: 'info.business_num', visible: true},
          {label: '통신판매업신고', key: 'info.ecommerce_num', visible: true},
          {label: '고객센터', key: 'center.call', visible: true},
          {label: '운영시간', key: 'center.time', visible: true},
          {label: '팩스번호', key: 'center.fax', visible: true},
          {label: '이메일', key: 'center.email', visible: true},
          {label: '카카오플러스 고객상담 주소', key: 'center.kakao_url', visible: true}
        ];
      }
      this.businessInfo.list.forEach(i => {
        let keys = i.key.split('.');
        if(keys.length === 2) {
          i.text = this[keys[0]][keys[1]];
          if(keys[1].indexOf('email')>-1) {
            i.text = `<a style="color: inherit" href="mailto:${i.text}">${i.text}</a>`;
          }
          else if(keys[1].indexOf('url')>-1) {
            i.text = `<a style="color: inherit" target="_blank" href="${i.text}">${i.text}</a>`;
          }
        }
        if(keys.length === 3) {
          i.text = this[keys[0]][keys[1]][keys[2]];
        }
        
        if(i.label !== '') {
          i.text = `${i.label}: ${i.text}`;
        }
      });
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
      let res = await this.$axios.get(`public/ui/menuset/style/${item.key}?activated=true`, {
        cancelToken: null
      });
      let list = [];
      res.data[0].menu.forEach(menu => {
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
    
    },
    watch: {
    
    }
}
