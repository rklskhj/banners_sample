<template>
  <div :style="[containerStyle, alignStyle]"
       class="flex wrap
              c-input-imgUploader-container
              position-relative">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle" style="width:100%;">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <!-- 이미지 업로더 -->
    <div class="imgUploader-view flex-center"
         :style="viewStyles">
      <input class="imgUploader-input"
             type="file"
             accept="image/*"
             @click.stop
             :id="uid"
             @change="onFileChange"
             multiple="multiple" />
      <label class="imgUploader-box"
             @click.stop :for="uid" style="width:72px;height:32px;">
        <i v-if="!fileExisted"
           class="material-icons-outlined unselect"
           :style="addIconStyle">add_a_photo</i>
      </label>


      <div v-if="fileExisted"
           style="position: relative; width: 100%; height: 100%;">
        <!-- 닫기버튼 -->
        <i class="imgUploader-close material-icons"
           style="cursor: pointer;"
           :style="closeStyles"
           @click.stop.prevent="deleteImg">close</i>
      </div>

    </div>
    <!--
        <div class="flex full-width" style="margin-top:12px">
          <input class="imgUploader-input"
                  type="file"
                  accept="image/*"
                  @click.stop
                  :id="uid"
                  @change="onFileChange"
                  multiple="multiple" />
          <label class="imgUploader-box"
                  @click.stop :for="uid" style="width:72px;height:32px;">
            <div class="flex-center unselect" :style="imgAddButtonStyle">{{ fileExisted ? '변경' : '추가' }}</div>
          </label>

          <div v-if="fileExisted" class="flex-center unselect" :style="imgRemoveButtonStyle" @click.stop.prevent="deleteImg">삭제</div>
        </div> -->

  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import ImageUploaderMixin from "@/components/Mixins/ImageUploaderMixin";
  import uuidv4 from "uuid/v4";
  export default {
    name: 'c-input-fileUploader-single',
    mixins: [
      ImageUploaderMixin,
      FormMixin
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
      index: {
        type: Number,
        required: false
      },
      borderStyle: {
        type: String,
        default: 'rectangle'      // circle, rectangle, radius
      },
      align: {
        type: String,
        default: 'left'           // left, center, right
      }
    },
    data() {
      return {
        uid: '',
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
      fileExisted() {
        if (this.file===undefined || this.file==='') return false;
        else return true;
      },
      alignStyle() {
        let deco = {};
        if(this.align === 'center') {
          deco.display = 'flex';
          deco.justifyContent = 'center';
        }

        return deco;
      },
      viewStyles() {
        let deco = {
          border: this.brandBorder.main.border,
          backgroundImage: 'url('+ this.file +')',
          marginTop: '8px',
          marginRight: '6px',
          width: '96px',
          height: '96px',
          borderRadius: this.radius.borderRadius,
          backgroundColor: '#fff'
        };

        if (this.imgUploaderStyle) {
          if (this.imgUploaderStyle.width) deco.width = this.imgUploaderStyle.width;
          if (this.imgUploaderStyle.height) deco.height = this.imgUploaderStyle.height;
        }

        return deco;
      },
      closeStyles() {
        return {};
      },
      addIconStyle() {
        return {
          color: '#bbb',
          fontSize: '36px'
        }
        // return { color: this.getColor('브랜드 강조 색상') }
      },
      imgAddButtonStyle() {
        return {
          fontSize: '12px',
          fontWeight: '500',
          color: this.brandColor.main.color,
          backgroundColor: '#fff',
          borderRadius: this.radius.borderRadius,
          width: '64px',
          height: '32px',
          margin: '0 4px'
        }
      },
      imgRemoveButtonStyle() {
        return {
          fontSize: '12px',
          fontWeight: '500',
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: this.radius.borderRadius,
          width: '64px',
          height: '32px',
          margin: '0 4px'
        }
      }
    },
    watch: {
      value(n) {
        if (Array.isArray(this.file)) {
          this.file = n;
        }
        else {
          this.file = this.image(n);
        }
      }
    },
    methods: {
      async onFileChange(e) {
        this.$store.commit('setLoadingSpinner', true);
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
          this.$store.commit('setLoadingSpinner', false);
          return;
        }

        let length = Object.keys(files).length;

        for(let j=0; j<length; j++) {
          await this.loadFile(files[j], length, j);
        }
      },
      loadFile(file, length, index) {
        return new Promise((resolve) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (f) => {
            let params = {
              f: f,
              file: file,
              length: length,
              index: index
            };
            resolve(params);
          };
        })
        .then((params) => {
          return this.loadImage(params.f, params.file, params.length, params.index);
        })
        .catch((err) => {
          this.$store.commit('setLoadingSpinner', false);
          console.log(err);
        })
      },
      loadImage(f, file, length, index) {
        return new Promise((resolve, reject) => {
          const image = new Image;
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
          let afterAction = (function(file, resizeImg, length, index) {
            let self = this;
            self.imageArray.push(resizeImg);
            if (length===self.imageArray.length) {
              if (length===1) self.file = self.imageArray[0];
              else self.file = self.imageArray;
              self.$emit('update:value', self.file);
              self.imageArray = [];
            }
          }).bind(this);

          this.$store.commit('setLoadingSpinner', false);
          return this.getFixedImage(params.file, params.image, params.length, params.index, afterAction);
          // return this.getFixedImage(params.file, params.image, params.length, params.index);
        })
        .catch((err) => {
          this.$store.commit('setLoadingSpinner', false);
          console.log(err);
        })
      },
      deleteImg() {
        if ( this.file && this.file !== '' ) {
          this.file = '';
          this.$emit('delImg', this.index);
        }
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  //@import '~assets/css/ui_main'
  .imgUploader-view
    background-size cover
    background-position center

  .imgUploader-input
    position fixed
    top -20px
    left -20px
    width 0
    height 0

  .imgUploader-box
    display flex
    justify-content center
    align-items center
    text-align center
    width 100%
    height 100%

  .imgUploader-close
    cursor pointer
    background-color rgba(0, 0, 0, 0.5)
    color #eee
    border-radius 50%
    padding 2px
    font-size 15px
    font-weight bold
    text-align center
    position absolute
    top 3px
    right 3px
    z-index 10
</style>
