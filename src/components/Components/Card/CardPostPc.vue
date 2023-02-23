<template>
<div class="p-border-bottom-main" style="padding:24px 0" @click="clickCard">
  <div class="flex">
    <div style="flex:1">
      <div class="size-15" style="margin-bottom:4px"><span v-if="total" class="p-main">{{ card.board_title }}</span>
        <span v-if="total && card.fields.length>0" class="p-sub2" style="margin:0 4px">/</span>
        <span v-if="card.fields.length>0" class="p-sub2">{{ card.fields.toString()}} </span>
      </div>
      <div class="ellipsis-multiple size-20 weight-500 p-main"
        style="width:100%;height:auto;line-height:24px;max-height:48px">{{ card.title }}</div>
      <div class="ellipsis-multiple size-15 p-sub2"
        style="width:100%;margin-top:6px">{{ card.content }}</div>
      <div class="flex-align" style="margin-top:8px">
        <div class="flex-align">
          <e-image :isBg="true" :isLazy="false"
            :img="card.author_img ? card.author_img : dummyImage.person" :useThumb="true"
            :width="20" :height="20" :useRatio="true" :imgRadius="20"
            :imageRates="{ratio: '1:1'}"/>
          <div class="size-14 p-sub2" style="margin-left:6px">{{ card.display_name }}</div>
          <div class="size-12 p-sub3" style="margin:0 8px">|</div>
          <div class="size-14 p-sub2">{{ dateFormat(card.created_time, 'ago')}}</div>
        </div>
        <div class="flex-align size-14 p-sub2" style="margin-left:48px">
          <i class="material-icons-outlined" style="font-size:16px;margin-right:2px">textsms</i>
          <div>{{ card.comment_count }}</div>
          
          <i class="material-icons" style="font-size:16px;margin:0 2px 0 8px">favorite_border</i>
          <div>{{ card.liked_count }}</div>
        </div>
      </div>
    </div>
    <e-image v-if="card.img && card.img !== ''" :isBg="true" :isLazy="false"
        style="margin-left:45px"
        :img="card.img ? card.img : dummyImage.bg" :useThumb="true"
        :width="150" :height="150" :useRatio="true" :imgRadius="8"
        :imageRates="{ratio: '1:1'}"/>
  </div>
</div>
</template>
<script>

export default {
  name: 'CardPostPc',
  components: {

  },
  mixins: [

  ],
  props: {
    card: {
      type: Object,
    },
    total: {
      type: Boolean,
      default: false,
    },

  },
  data() {
    return {

    }
  },
  created() {
    if(this.card.reply_content) {
      this.card.comment_count++;
    }
  },
  mounted() {

  },
  
  methods: {
    clickCard() {
      this.routerPush(`post?id=${this.card.id}&board_id=${this.card.board}`);
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


