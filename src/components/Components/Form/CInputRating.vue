<template>
  <div class="c-rating" :style="containerStyle">


    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <star-rating :star-size="starSize"
                 :border-width="2"
                 inactive-color="#ffffff"
                 :border-color="rateColor"
                 :increment="0.5"
                 :padding="ratePadding"
                 :active-color="rateColor"
                 :show-rating="showRating"
                 :rounded-corners="true"
                 :read-only="disabled"
                 :star-points="isNew ? newShape : originShape"
                 v-model="rating"></star-rating>
  </div>
</template>

<script>
  import StarRating from 'vue-star-rating';
  import FormMixin from "@/components/Mixins/FormMixin"

  export default {
    name: "c-input-rating",
    props: {
      rateColor: {
        type: String,
        required: false,
        default: '#fddb46'
      },
      rateSize: {
        type: Number,
        required: false,
        default: 25
      },
      showRating: {
        type: Boolean,
        required: false,
        default: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      isNew: {
        type: Boolean,
        required: false,
        default: false
      },
      ratePadding: {
        type: Number,
        required: false,
        default: 0
      }
    },

    mixins: [
      FormMixin
    ],

    components: {
      StarRating
    },

    data() {
      return {
        rating: this.value,
        originShape: [23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17],
        newShape: [20,34, 30,40, 31,40, 32,40, 33,38, 33,37, 31,25, 39,18, 40,16, 40,15, 39,14, 38,13, 27,12, 22,1, 21,0, 20,0, 19,0, 18,1, 13,12, 2,13, 1,14, 0,15, 0,16, 1,18, 9,25, 7,37, 7,38, 8,40, 9,40, 10,40, 20,34]
      }
    },

    watch: {
      rating(n) {
        this.$emit('update:value', n);
      },
      value(n) {
        this.rating = n;
      }
    },

    computed: {
      starSize() {
        return this.rateSize;
      }
      /*
            rating: {
              get() {
                let change = this.$store.state.builder.backendChange;

                if (typeof(this.properties.rating) === 'number') {
                  return this.properties.rating
                }

                let text = this.cloneItem(this.properties.rating);
                let dataSet = this.getDataSet(text);
                // text에서 {} 로 매핑할 데이터 구성한 경우
                if (text.search('{') > -1) {
                  // dataSet이 없을 때, 관리자의 경우 dummy값 출력
                  if (dataSet === undefined) {
                    text = '';
                  }

                  else {
                    let arr = text.match(/\{([^}]+)\}/g);
                    if (arr === null) return '';
                    for (let i = 0; i < arr.length; i++) {
                      let val = arr[i];
                      let val_org = val;
                      let isLength = false;
                      if (val.search('.length') > -1) {
                        isLength = true;
                        val = val.replace('.length', '');
                      }

                      let dataVal = this.objectValue(dataSet, val);
                      if (dataVal === undefined) {
                        if (this.isAdmin())
                          text = this.properties.emptyView;
                        else
                          text = '';
                        break;
                      } else {
                        if (isLength) {
                          dataVal = dataVal.length.toString();
                        }
                      }
                      text = text.replace(val_org, dataVal);
                    }
                  }
                }

                if (text === "undefined" || text === undefined || text === '') {
                  if (this.isAdmin())
                    text = this.properties.emptyView;
                  else
                    text = '';
                }
                if (text === '') text = 0;
                text = parseInt(text);
                return text;
              },

              set(newValue) {
                this.properties.rating = newValue;
              }
            }*/
    }
  }
</script>
<style type="stylus" lang="stylus">
  .c-rating
    margin-bottom 6px

  .not-form .c-rating
    margin 0 !important

</style>
