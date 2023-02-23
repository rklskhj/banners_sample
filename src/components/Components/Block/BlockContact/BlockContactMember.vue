<template>
<div class="p-bg-sub" style="padding:16px 0 100px" :style="pagePadding">
  <div class="flex-between margin-bottom-16 p-bg-white radius-8" style="padding: 16px">
    <div>
      <!--<div class="size-20 weight-500 margin-bottom-4" :style="brandColor.main">1:1 문의</div>-->
      <div class="flex" style="align-items:baseline">
        <div class="size-14 p-sub"><span class="weight-700">{{ count }}</span>개의 문의</div>
      </div>
    </div>
    
    <div style="width: 76px; height: 32px" @click="routerPush(`contact_reg`)"
      class="size-12 weight-400 unselect flex-center p-white p-bg-primary radius-6">
      문의 작성</div>
  </div>
  
  <list-vertical>
    <transition-group name="fade" slot="card" tag="div">
      <card-contact
        v-for="(item, idx) in list"
        :key="'item-'+idx"
        :card="item" :style="cardStyle(idx)"></card-contact>
    </transition-group>
  </list-vertical>
  <div v-if="list && list.length===0" class="empty-view" style="color: #000000">
    문의 내역이 없습니다.
  </div>
</div>
</template>
<script>
import CardContact from "@/components/Components/Card/CardContact.vue"
import PageMixin from "@/components/Components/Mixins/PageMixin"

export default {
  name: 'BlockContactMember',
  components: {
    CardContact
  },
  mixins: [
    PageMixin
  ],
  props: {

  },
  data() {
    return {
      "list": undefined,
      "count": undefined
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  },
  
  methods: {
    getData() {
      this.$axios(`user/${this.$store.getters.user.user_id}/inquiry/personal`)
      .then(res => {
        this.list = res.data.data;
        this.count = res.data.count
      })
    },
    cardStyle(idx) {
      let deco = {
        marginBottom: '16px'
      }
      if (idx === this.list.length - 1) {
        deco.marginBottom = '0px'
      }
      return deco;
    }
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>


