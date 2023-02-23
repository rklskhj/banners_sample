<template>
<div>
  <button-ordering v-if="product" :product="product" width="180px" :usePopup="true"
    @liked="res => toggleLiked(res)" :menuTitle="'마이페이지 > 찜 목록'"></button-ordering>
</div>
</template>
<script>
import ButtonOrdering from "@/components/Components/Button/ButtonOrdering.vue"

export default {
  name: 'BlockProductDetailBottomBtn',
  components: {
    ButtonOrdering
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "product": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      let url = `/user/${this.user.user_id}/mapping/product/${this.$route.query.id}`
      url += `?fields=id,order_conversion_type,info&hit=false`
        // url += `?fields=id,parent,img,name,simple_desc,tags,form,order_conversion_type,category1,category2,category3,inquiry_conversion_type`
        // url += `,rate,stock,stock_type,input,like_count,reviews_count,visit,price,related_products,selectors`
        // url += `,minimum,maximum,partner,address,dong,distance,params,imgs,common_info,info,operating_time,phone,params,location,enable_option,enable_prod&hit=false`
      this.$axios.get(url)
      .then(res => {
        if(this.$store.getters.browserType!=='pc')
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:100vw" ');
        else
          res.data.info = res.data.info.replace(/<img /gi, '<img style="margin:0 -16px;max-width:416px" ');
        res.data.isOrderable = true;
        this.product = res.data;
      });
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


