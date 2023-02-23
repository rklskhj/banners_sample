<template>
<div>
  <block-partner-signup/>
		<tp221217212011-t-block-blank/>
<t4tp221217211833-t-block-static-list/>
		<tp221217212103-t-block-blank/>
		<t3tp221217212237-t-block-static-list/>
		<t6tp230131183619-t-block-image-text/>
		
</div>
</template>
<script>
import BlockPartnerSignup from "@/components/Components/Block/BlockPartnerSignup/BlockPartnerSignup.vue"
import tp221217212011TBlockBlank from "@/components/Components/Block/BlockBlank/tp221217212011/BlockBlank.vue"
import t4tp221217211833TBlockStaticList from "@/components/Components/Block/BlockStaticList/t4tp221217211833/BlockStaticList.vue"
import tp221217212103TBlockBlank from "@/components/Components/Block/BlockBlank/tp221217212103/BlockBlank.vue"
import t3tp221217212237TBlockStaticList from "@/components/Components/Block/BlockStaticList/t3tp221217212237/BlockStaticList.vue"
import t6tp230131183619TBlockImageText from "@/components/Components/Block/BlockImageText/t6tp230131183619/BlockImageText.vue"

export default {
  name: 'PartnerCenter',
  components: {
    BlockPartnerSignup,
    tp221217212011TBlockBlank,
    t4tp221217211833TBlockStaticList,
    tp221217212103TBlockBlank,
    t3tp221217212237TBlockStaticList,
    t6tp230131183619TBlockImageText
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
      "bgColor": "brandBgColor.main",
      "deleted": []
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.setBg();
    });
  },
  
  methods: {
    setBg() {
      this.$el.style.backgroundColor = this.parseColor(this.bgColor);
      this.$el.style.minHeight = '100vh';
    }
  },
  computed: {
    
  },
  watch: {
    bgColor() {
     this.setBg();
   }
  }
}
</script>


