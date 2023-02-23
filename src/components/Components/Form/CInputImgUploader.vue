<template>
  <div
    :style="[containerStyle, alignStyle]"
    class="c-input-imgUploader-container c-root position-relative"
  >
    <!-- 레이블 -->
    <div
      v-if="formType.label && label"
      :class="{hiddenLabel: index >= 1}"
      :style="labelStyle"
    >{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 이미지 업로더 -->
    <div class="imgUploader-view flex-center" :style="viewStyles">
      <!-- 이미지 데이터가 있는 경우 -->
      <input
        class="imgUploader-input"
        v-if="(file === undefined || file==='')"
        type="file"
        accept="image/*"
        @click.stop
        :id="uid"
        @change="onFileChange"
        multiple="multiple"
      />
      <label
        class="unselect imgUploader-box"
        v-if="(file === undefined || file==='')"
        @click.stop
        :for="uid"
      >
        <!-- :style="boxStyles"> -->
        <div>
          <i class="material-icons-outlined size-30" style="color:#ddd" >add_a_photo</i>
          <div v-if="useBtnText" :style="btnTextStyle">{{ btnText }}</div>
        </div>
      </label>

      <!-- 이미지 데이터가 없는 경우 -->
      <div v-if="file && file!==''" style="position: relative; width: 100%; height: 100%;">
        <!-- 닫기버튼 -->
        <i v-if="file && file!=='' && isImgDeletable"
           class="imgUploader-close material-icons"
           style="cursor: pointer;"
           :style="closeStyles"
           @click.stop.prevent="deleteImg"
        >close</i>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from "@/components/Mixins/FormMixin";
  import ImageUploaderMixin from "@/components/Mixins/ImageUploaderMixin";
  import uuidv4 from "uuid/v4";
  export default {
    name: "c-input-imgUploader",
    mixins: [ImageUploaderMixin, FormMixin],
    props: {
      data: {
        type: String,
        required: false
      },
      label: {
        type: String,
        required: false
      },
      index: {
        type: Number,
        required: false
      },
      borderStyle: {
        type: String,
        default: "rectangle" // circle, rectangle, radius
      },
      align: {
        type: String,
        default: "left" // left, center, right
      },
      isImgDeletable: {
        type: Boolean,
        default: true
      },
      btnText: {
        type: String
      },
      useBtnText: {
        type: Boolean,
        default: false
      },
      btnTextStyle: {
        type: Object
      }
    },
    data() {
      return {
        uid: "",
        file: this.value,
        imageArray: []
      };
    },
    created() {
      this.uid = uuidv4();
      // if(this.data!==undefined) {
      //   this.properties.img = this.objectValue(this.getDataSet(), this.properties.data);
      // }
      //this.element('a-input-label').properties.enable = true;
    },
    computed: {
      alignStyle() {
        let deco = {};
        if (this.align === "center") {
          deco.display = "flex";
          deco.justifyContent = "center";
        }

        return deco;
      },
      viewStyles() {
        let deco = {
          border: "1px solid " + this.getColor("기본 테두리선 색상"),
          backgroundImage: "url(" + this.file + ")",
          marginTop: "8px",
          marginRight: "6px",
          width: "80px",
          height: "80px",
          borderRadius: '8px'
        };

        if (this.imgUploaderStyle) {
          if (this.imgUploaderStyle.width)
            deco.width = this.imgUploaderStyle.width;
          if (this.imgUploaderStyle.height)
            deco.height = this.imgUploaderStyle.height;
        }

        switch (this.borderStyle) {
          case "circle":
            deco.borderRadius = "50%";
            break;
          case "radius":
            deco.borderRadius = this.radius.borderRadius;
            break;
        }

        return deco;
      },
      closeStyles() {
        return {};
      },
      addIconStyle() {
        return { color: '#ddd' };
      }
    },
    watch: {
      value(n) {
        if (Array.isArray(this.file)) {
          this.file = n;
        } else {
          this.file = this.image(n);
        }
      }
    },
    methods: {
      async onFileChange(e) {
        this.$store.commit("setLoadingSpinner", true);
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
          this.$store.commit("setLoadingSpinner", false);
          return;
        }

        for (let j = 0; j < files.length; j++) {
          await this.loadFile(files[j], files.length, j);
        }
      },
      loadFile(file, length, index) {
        return new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = f => {
            let params = {
              f: f,
              file: file,
              length: length,
              index: index
            };
            resolve(params);
          };
        })
          .then(params => {
            return this.loadImage(
              params.f,
              params.file,
              params.length,
              params.index
            );
          })
          .catch(err => {
            this.$store.commit("setLoadingSpinner", false);
            console.log(err);
          });
      },
      loadImage(f, file, length, index) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            let params = {
              file: file,
              image: image,
              length: length,
              index: index
            };
            resolve(params);
          };
          image.src = f.target.result;
        })
          .then(params => {
            let afterAction = function(file, resizeImg, length, index) {
              let self = this;
              self.imageArray.push(resizeImg);
              if (length === self.imageArray.length) {
                if (length === 1) self.file = self.imageArray[0];
                else self.file = self.imageArray;
                self.$emit("update:value", self.file);
                self.imageArray = [];
              }
            }.bind(this);

            this.$store.commit("setLoadingSpinner", false);
            return this.getFixedImage(
              params.file,
              params.image,
              params.length,
              params.index,
              afterAction
            );
            // return this.getFixedImage(params.file, params.image, params.length, params.index);
          })
          .catch(err => {
            this.$store.commit("setLoadingSpinner", false);
            console.log(err);
          });
      },
      deleteImg() {
        if (this.file && this.file !== "") {
          this.file = "";
          this.$emit("delImg", this.index);
        }
      }
    }
  };
</script>

<style lang="stylus" type="stylus" scoped>
  // @import '~assets/css/ui_main'
  .imgUploader-view {
    background-size: cover;
    background-position: center;
  }

  .imgUploader-input {
    position: fixed;
    top: -20px;
    left: -20px;
    width: 0;
    height: 0;
  }

  .imgUploader-box {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  .imgUploader-close {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.4);
    color: #eee;
    border-radius: 50%;
    padding: 2px;
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 10;
  }

  .hiddenLabel {
    visibility: hidden;
  }
</style>
