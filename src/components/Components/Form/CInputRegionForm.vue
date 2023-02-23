<template>
  <div>
    <div :style="containerStyle">

      <!-- 레이블 -->
      <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

      <div class="grid-box">
        <!-- 시/도 -->
        <div class="col-6" style="padding-right:4px">
          <div :style="computedLabelStyle">시/도</div>
          <c-input-dropdown
              v-if="sido.options.length>0"
              v-bind="sido" :gutter="0"
              :value="sidoValue"
              @update:value="res => onSido(res, true)"
              style="margin:0"></c-input-dropdown>
        </div>
        <!-- 시/군/구 -->
        <div class="col-6" style="padding-left:4px">
          <div :style="computedLabelStyle">시/군/구</div>
          <c-input-dropdown
              v-if="sigungu.options.length>0"
              v-bind="sigungu" :gutter="0"
              :value="sigunguValue"
              @update:value="res => onSigungu(res)"
              style="margin:0"></c-input-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from "@/components/Mixins/FormMixin";

  export default {
    name: "c-input-regionForm",

    mixins: [
      FormMixin
    ],

    created() {
      // 시/도 데이터 가져오기
      this.$axios.get(`public/address/service/sido`)
        .then(res => {
          if ( res.status === 200 ) {
            res.data.splice(0,0, {
              id: '',
              label: '전체',
              name: '전체',
              value: ''
            });
            this.sido.options = res.data;

            if(this.value && this.value.sido.id !== '') {
              this.inputValue = this.value;
              this.onSido(this.inputValue.sido.id, false);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    props: {
      type: {
        type: String,
        default: 'service'  // 'basic'
      }
    },

    data() {
      return {
        inputValue:{
          sido: undefined,
          sigungu: undefined
        },
        sido: {
          formType: this.formType,
          // label: '시/도',
          options: [],
          value: ''
        },
        sigungu: {
          formType: this.formType,
          // label: '시/군/구',
          options: [],
          value: ''
        }
      }
    },

    computed: {
      sidoValue() {
        return this.inputValue.sido ? this.inputValue.sido.value : '';
      },
      sigunguValue() {
        return this.inputValue.sigungu ? this.inputValue.sigungu.value : '';
      },
      computedLabelStyle() {
        let deco = {};
        if (this.labelStyle!==undefined) {
          deco = this.labelStyle
        }
        deco.margin = '4px 0 8px 4px';
        return deco;
      }
    },

    watch: {
      value(n) {
        this.inputValue = n;
      }
    },

    methods: {
      onSido(id, initSigungu) {
        this.inputValue.sido = find(this.sido.options, 'id', id);
        if(initSigungu) {
          if(this.sigungu.options.length>0)
            this.inputValue.sigungu = undefined;
          this.$emit('update:value', this.inputValue);
          this.$emit('update:selectedValue', `${this.inputValue.sido.name}`);
        }

        this.$axios.get(`public/address/service/sido/${id}/sigungu`)
          .then(res => {
            if ( res.status === 200 ) {
              res.data.splice(0,0, {
                id: '',
                label: '전체',
                name: '전체',
                value: ''
              });
              this.sigungu.options = res.data;
              if(!initSigungu) {
                this.onSigungu(this.inputValue.sigungu.id);
              } else {
                this.onSigungu(this.sigungu.options[0].id);
              }
            }
          })
          .catch(() => {
            this.sigungu.options = [{
              id: '',
              label: '전체',
              name: '전체',
              value: ''
            }];
          })
      },
      onSigungu(id) {
        this.inputValue.sigungu = find(this.sigungu.options, 'id', id);
        this.$emit('update:value', this.inputValue);
        if (this.inputValue.sido.name === this.inputValue.sigungu.name) {
          this.$emit('update:selectedValue', `${this.inputValue.sido.name}`);
        } else {
          this.$emit('update:selectedValue', `${this.inputValue.sido.name} ${this.inputValue.sigungu.name}`);
        }
      }
    }
  }
</script>

<style scoped>

</style>
