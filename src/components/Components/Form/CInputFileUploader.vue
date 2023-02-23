<template>
  <div :style="containerStyle">

    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
      <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <input class="file-input"
           v-if="uploadReady"
           :accept="acceptExt"
           @click.stop
           :id="uid"
           @change="onFileChange"
           type="file">
    <div class="flex">
      <label :for="uid" @click.stop
             class="unselect button-add p-bg-brand1 p-primary"><i class="material-icons">add</i>첨부파일 추가</label>
    </div>
    <!-- 추가된 첨부파일 -->
    <div
      v-for="(file, idx) in files"
      :key="`file-${idx}`"
      class="file-list">
      <!-- 썸네일 -->
      <div>
        <!-- 이미지 -->
        <a
          target="_blank"
          :href="file.file">
          <div
            v-if="isImage(file.extension)"
            class="thumb"
            :style="thumbStyle(file.file)"></div>
          <!-- 이미지 아닐 땐 파일 확장자명 표시 -->
          <div v-else
               :style="extColor(file.extension)"
               class="thumb ext">{{ upper(file.extension) }}</div>
        </a>
      </div>
      <div class="file-name">{{ file.name }}</div>
      <div class="trash unselect" @click="onDelete(idx)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H5V19C5 19.7956 5.31607 20.5587 5.87868 21.1213C6.44129 21.6839 7.20435 22 8 22H16C16.7956 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7956 19 19V8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7C21 6.73478 20.8946 6.48043 20.7071 6.29289C20.5196 6.10536 20.2652 6 20 6ZM10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V6H10V5ZM17 19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H8C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V8H17V19Z"
                :fill="brandColor.sub2.color"/>
        </svg>

      </div>
    </div>
    <div :style="fileDescStyle">{{ file_description }}</div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-fileUploader',

    mixins: [
      FormMixin
    ],

    props: {
      label: {
        type: String,
        required: false
      },
      fileListLabelCustomStyle: {
        type: Object,
        required: false
      },
      fileListLabelIcon: {
        type: String,
        default: 'attachment'
      },
      fileDescCustomStyle: {
        type: Object,
        required: false
      },
      attachmentTextCustomStyle: {
        type: Object,
        required: false
      }
    },

    created() {
      this.uid = this.dayjs().format('SSSS');
      /*if(this.description!==undefined)
        this.description = this.description;
      if(this.acceptExt !== undefined)
        this.acceptExt = this.acceptExt;
      if(this.maxLength !== undefined)
        this.maxLength = this.maxLength;*/
      if(this.value) {
        // this.files = this.value;
        this.files = [];
        this.value.forEach(file => {
          this.files.push({
            name: file,
            file : file,
            size: new Blob([file]).size,
            extension: file.split('.')[file.split('.').length - 1]
          })
        })
      }
    },

    data() {
      return {
        uid: '',
        maxLength: 5,
        acceptExt: 'image/gif, image/jpeg, image/png, .docx, .pptx, .xlsx, .hwp, .pdf',
        file_description: '첨부파일은 최대 5개, 10MB 까지 등록 가능합니다.\n' +
        '파일형식은 이미지(jpg, gif, png), 오피스 문서(hwp, pdf, pptx, docx, xlsx)만 가능합니다.',
        file: undefined,
        uploadReady: true,        // 초기화 용
        files: []
      };
    },

    watch: {
      files(n) {
        if(n) this.$emit('update:value', this.files);
      },
      value(n) {
        this.files = n;
      }
    },

    computed: {
      fileListLabelStyle() {
        let deco = {};
        if (this.fileListLabelCustomStyle) {
          deco = this.fileListLabelCustomStyle;
        }
        return deco;
      },
      attachmentTextStyle() {
        let deco = {
          paddingLeft: '12px',
          lineHeight: '46px',
          fontSize: '0.9rem',
          color: 'rgba(162, 174, 186, 1)'
        }
        if (this.attachmentTextCustomStyle) {
          deco = this.attachmentTextCustomStyle;
        }
        return deco;
      },
      fileDescStyle() {
        let deco = {
          fontSize: '13px',
          color: this.brandColor.sub2.color,
          whiteSpace: 'pre-line',
          padding: '8px 0',
        }
        if (this.fileDescCustomStyle) {
          deco = this.fileDescCustomStyle;
        }
        return deco;
      }
    },

    methods: {
      onDelete(idx) {
        this.files.remove(idx);
      },

      upper(ext) {
        return ext.toUpperCase();
      },

      extColor(ext) {
        let deco = { backgroundColor : '' };
        switch(ext.toLowerCase()) {
          case 'hwp':
            deco.backgroundColor = '#2ebcee';
            break;
          case 'pdf':
            deco.backgroundColor = '#ef4037';
            break;
          case 'docx':
            deco.backgroundColor = '#295498';
            break;
          case 'pptx':
            deco.backgroundColor = '#d14425';
            break;
          case 'xlsx':
            deco.backgroundColor = '#207245';
            break;
        }

        return deco;
      },

      isImage(ext) {
        let isImg = false;
        let imgExt = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'tif'];
        ext = ext.toLowerCase();
        if(imgExt.indexOf(ext)>-1)
          isImg = true;

        return isImg;
      },
      thumbStyle(img) {
        let deco = {
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };

        return deco;
      },
      onFileChange(e) {
        this.file = e.target.files[0];
        if(this.file === undefined) return;

        this.uploadReady = false;
        this.$nextTick(() => { this.uploadReady = true; });

        //10MB 또는 파일 maxLength개 까지만 업로드 가능
        let totalSize = 0;
        for(let i=0; i< this.files.length; i++)
          totalSize += this.files[i].size;

        if((totalSize + this.file.size ) > 1024*1024*10 || this.files.length + 1 > this.maxLength) {
          this.toast(`최대 10MB, ${this.maxLength}개 파일까지만 업로드 가능합니다.`);
          return;
        }

        if(find(this.files, 'name', this.file.name) !== undefined) {
          this.toast('이미 업로드 된 파일입니다.');
          return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (f) => {
          let file = this.file.name.split('.');
          let ext = file[file.length-1];
          this.files.push({
            name : this.file.name,
            file : f.target.result,
            size: this.file.size,
            extension: ext
          });
        };
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .file-list
    border-radius 4px
    overflow hidden
    border 1px solid #eeeeee
    background-color #ffffff
    display flex
    align-items center
    justify-content space-between
    width 100%
    height 46px
    margin-top 8px

  .thumb
  .file-attachment
    width 44px
    height 44px

  .ext
    text-align center
    color white
    background-color #064160
    line-height 44px
    font-size 0.7rem
    font-weight 100

  .file-attachment-text
    padding-left 12px
    line-height 46px
    font-size 0.9rem
    color rgba(162, 174, 186, 1)

  .file-attachment
    text-align center

  .file-attachment i
    line-height 46px
    font-size 1.6rem

  .file-desc
    font-size 0.7rem
    color rgba(162, 174, 186, 1)
    white-space pre-line
    padding 8px 0

  .file-name
    padding 0 20px
    color #303841
    font-size 0.8rem
    text-overflow ellipsis
    overflow hidden
    white-space pre
    line-height 44px
    text-align left
    flex 1

  .file-input
    width 0
    height 0
    position fixed
    top -100px
    left -100px

  .button-add
    border 0
    border-radius 8px
    display flex
    align-items center
    padding 8px 24px
  .trash
    width 44px
    height 44px
    display flex
    justify-content center
    align-items center
</style>
