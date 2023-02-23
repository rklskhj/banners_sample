<template>
  <div>
    <a id="block0">
    <div class="flex-justify position-relative">
      <block-contact-reg-member-pc />
    </div>
    <a id="block1">
    <div class="flex-justify position-relative">
      <block-contact-reg-member-prac-pc />
    </div>
  </div>
</template>
<script>
import BlockContactRegMemberPc from "@/components/Components/Block/BlockContactReg/BlockContactRegMemberPc.vue";
import BlockContactRegMemberPracPc from "@/components/Components/Block/BlockContactReg/BlockContactRegMemberPracPc.vue";
export default {
  name: "ContactRegMemberPc",
  components: {
    BlockContactRegMemberPc,
    BlockContactRegMemberPracPc,
  },
  mixins: [],
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},

  methods: {},
  computed: {},
  watch: {},
};
</script>


