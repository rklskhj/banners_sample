<template>
<div>
  <div class="flex-justify position-relative"><block-partner-signup-pc/></div>
  
  <div class="flex-justify position-relative"><t1tp230131184849-t-block-static-list-pc/></div>
<div class="flex-justify position-relative"><t3tp221217131844-t-block-static-list-pc/></div>
		<div class="flex-justify position-relative"><t4tp230131184715-t-block-image-text-pc/></div>
  
		
		
</div>
</template>
<script>
import BlockPartnerSignupPc from "@/components/Components/Block/BlockPartnerSignup/BlockPartnerSignupPc.vue"
import t1tp230131184849TBlockStaticListPc from "@/components/Components/Block/BlockStaticListPc/t1tp230131184849/BlockStaticListPc.vue"
import t3tp221217131844TBlockStaticListPc from "@/components/Components/Block/BlockStaticListPc/t3tp221217131844/BlockStaticListPc.vue"
import t4tp230131184715TBlockImageTextPc from "@/components/Components/Block/BlockImageTextPc/t4tp230131184715/BlockImageTextPc.vue"

export default {
  name: 'PartnerCenterPc',
  components: {
    BlockPartnerSignupPc,
    t1tp230131184849TBlockStaticListPc,
    t3tp221217131844TBlockStaticListPc,
    t4tp230131184715TBlockImageTextPc
  },
  mixins: [

  ],
  props: {

  },
  data() {
    return {
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


