<template>
  <div class="flex wrap">
    {{ hello }}
    <c-input-imgUploader
        v-bind="$props"
        v-for="(el, idx) in files"
        :value.sync="el"
        :index="idx"
        @update:value="addImg"
        @delImg="delImg"
        :key="`img-uploader-array-${idx}`"
    ></c-input-imgUploader>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin';
  import ImageUploaderMixin from "@/components/Mixins/ImageUploaderMixin";
  import CInputImgUploader from "./CInputImgUploader.vue";
  export default {

    components: {CInputImgUploader},
    name: "c-input-imgUploaderArray",

    mixins: [
      FormMixin,
      ImageUploaderMixin
    ],

    props: {
      data: {
        type: String,
        required: false
      },
      label: {
        type: String,
        required: false
      },
      limit: {
        type: Number,
        default: 5
      }
    },

    data() {
      return {
        files: this.value,
        hello: ''
      }
    },
    created() {
      if(this.value.length===0) {
        this.files = [''];
      }
    },

    computed: {
    },
    watch: {
      value(n) {
        if(n.length===0) this.files = [''];
        else this.files = n;
      }
    },
    methods: {
      addImg(value) {
        if (this.files.length <= this.limit) {
          // multiple images
          if (Array.isArray(value)) {
            this.files = value;
            if (this.files.length < this.limit) {
              this.files.push("");
            }
            if (this.files.length > this.limit) {
              this.files = this.files.slice(0, this.limit)
            }
          }
          // single image
          else {
            this.files.splice(this.files.length-1, 0, value);
            if (this.files.length > this.limit) {
              this.files = this.files.slice(0, this.limit)
            }
          }
          this.$emit('update:value', this.files);

        }
      },
      delImg(index) {
        this.files.remove(index);
        if(this.files.length === 0) {
          this.files.push("");
        } else if (this.files.length > 0) {
          this.files = [...this.files.filter(item => item !== ''), ''];
        }
      }
    }
  }
</script>

<style scoped>

</style>
