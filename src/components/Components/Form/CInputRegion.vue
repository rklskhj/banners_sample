<template>
  <div class="full-width" :style="containerStyle">
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    <div style="width: 100%; min-height: 48px; border-radius: 8px" :style="brandBgColor.sub">
      <div>
        <input
          :style="brandColor.sub"
          style="border-radius:3px; width:95%;margin:6px 8px; padding: 8px; font-size:14px;height:36px;"
          :placeholder="placeholder"
          v-model="inputVal"
          @keyup="e => inputVal = e.target.value"
        />
      </div>
      <div v-show="displayList">
        <div v-if="locationData.length>0" style="flex-wrap: wrap;" class="flex-align">
          <div v-for="(list,idx) in locationData" :key="'sel'+idx" style="text-align:center;">
            <div class="listStyle size-14">
              {{list.full_text}}
              <i
                class="material-icons size-14 unselect"
                @click="removeListItem(idx)"
              >close</i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="this.inputVal.length>0" class="listBoxStyle" :style="borderStyle">
      <div
        v-for="(item,idx) in arrayAddress"
        :key="'addr'+idx"
        class="size-14"
        :style="brandColor.sub"
        @click="selectAddress(item)"
        style="padding:4px"
      >{{ item.full_text }}</div>
      <div
        v-if="arrayAddress.length===0 && this.inputVal.length>0"
        :style="brandColor.sub"
      >검색 결과가 없습니다.</div>
    </div>
  </div>
</template>
<script>
import FormMixin from "@/components/Mixins/FormMixin";
export default {
  name: "CInputRegion",
  mixins: [FormMixin],
  data() {
    return {
      inputVal: "",
      addressList: "",
      locationData: []
    };
  },
  created() {
    if(this.value) {
      this.locationData = this.value;
    }
    this.getAddress();
  },
  mounted() {},
  methods: {
    getAddress() {
      if (this.address.length === 0) {
        this.$axios.get("/public/address/default/all").then(res => {
          if (res.status === 200) {
            this.$store.commit("setAddress", res.data);
          }
        });
      }
    },
    selectAddress(addrItem) {
      this.locationData.push(addrItem);
      this.inputVal = "";
      this.$emit("update:value", this.locationData);
    },
    removeListItem(idx) {
      this.locationData.splice(idx, 1);
      this.$emit("update:value", this.locationData);
    }
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
    arrayAddress() {
      if (this.inputVal.trim() === "") return [];
      return this.address.filter(item => {
        return item.full_text.indexOf(this.inputVal) > -1;
      });
    },
    displayList() {
      return this.inputVal.length === 0;
    },
    borderStyle() {
      return { border: `1px solid ${this.getColor("보조 테두리선 색상")}` };
    }
  },
  watch: {
    value(n) {
      this.locationData = n;
    }
  }
};
</script>
<style lang="stylus" type="stylus" scoped>
.listStyle {
  padding: 8px;
  border-radius: 18px;
  margin: 5px;
  background-color: #cfdae8;
}

input {
  background-color: white;
  border: 0px solid;
  height: 20px;
  width: 160px;
}

.headerStyle {
  text-align: center;
  line-height: 50px;
}

.listBoxStyle {
  max-height: 150px;
  width: 100%;
  overflow: scroll;
  background-color: #ffffff;
  border: 2px solid grey;
}
</style>
