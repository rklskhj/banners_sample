<template>
<div v-if="card" :style="wrapStyle" class="flex-between unselect p-bg-white"
  @click="routerPush(`contact_detail?id=${card.id}`)">
  <div class="col-1 flex-align">
    <div class="size-12 flex-center radius-4" style="height: 24px; padding: 4px 8px"
      :class="{
        'p-bg-brand1': !card.is_answered,
        'p-primary': !card.is_answered,
        'p-bg-primary': card.is_answered,
        'p-white': card.is_answered
      }">{{ card.is_answered ? '답변완료' : '미답변' }}</div>
  </div>
  <div class="size-16 col-8 ellipsis p-main" style="text-align: left">{{ card.title }}</div>
  <!--<div :style="brandColor.main" class="size-14 col-2" style="text-align: center">{{ getAuthor(card.user_data.email) }}</div>-->
  <div class="size-14 col-1 p-sub2" style="text-align: center">{{ dateFormat(card.created_time, 'date_3') }}</div>
</div>
</template>
<script>
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'CardContactPc',
  components: {

  },
  mixins: [
    PageMixin
  ],
  props: {
    card: {
      type: Object,
      required: true,
    },

  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  
  methods: {
    getAuthor(email) {
      let author = email.split('@')[0].split('');
      let pattern = '';
      if (author.length > 4) {
        pattern = /.{4}$/; 
        return email.split('@')[0].replace(pattern, "****");
      } else {
        pattern = /.$/;
        return email.split('@')[0].replace(pattern, '*');
      }
      
    }
  },
  computed: {
    wrapStyle() {
      return {
        padding: '28px 16px',
        borderBottom: `1px solid ${this.brandBgColor.sub.backgroundColor}`,
        height: '80px'
      }
    }
  },
  watch: {
    
  }
}
</script>


