<template>
<div class="p-bg-white radius-8 unselect" style="padding:16px"
  @click="routerPush(`contact_detail?id=${card.id}`)">
  <!--<div class="flex-between wrap">-->
  <!--  <div class="col-10">-->
  <!--    <div class="size-14 weight-500 ellipsis p-main" style="width:90%">{{ card.title }}</div>-->
  <!--    <div class="size-12 ellipsis p-sub" style="width:90%">{{ card.content }}</div>-->
  <!--  </div>-->
  <!--  <div class="col-2 weight-500" style="text-align:right;white-space:nowrap">-->
  <!--    <div class="size-10 margin-bottom-4" -->
  <!--      :class="{-->
  <!--        'p-primary': card.is_answered,-->
  <!--        'p-sub': !card.is_answered-->
  <!--      }">{{ card.is_answered ? '답변 완료' : '미답변' }}</div>-->
  <!--    <div class="size-12 p-sub">{{ dateFormat(card.created_time, 'ago') }}</div>-->
  <!--  </div>-->
  <!--</div>-->
  <div class="size-16 weight-500 p-main">{{ card.title }}</div>
  <div class="size-13 weight-400 p-main" style="margin-top: 4px">{{ card.content }}</div>
  <div class="flex-align" style="margin-top: 8px; gap: 0 12px">
    <div class="size-12 weight-400 flex-center radius-4"
      style="width: 58px; height: 20px" :class="{
      'p-white p-bg-primary': card.is_answered,
      'p-brand3 p-bg-brand1': !card.is_answered
    }">{{ card.is_answered ? '답변완료' : '미답변' }}</div>
    <div class="size-12 weight-400 p-sub2">{{ dateFormat(card.created_time, 'date_3') }}</div>
  </div>
</div>
</template>
<script>

export default {
  name: 'CardContact',
  components: {

  },
  mixins: [

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
    
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


