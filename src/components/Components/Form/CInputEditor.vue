<template>
  <div class="c-input-editor" :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>
    <textarea id="editor"></textarea>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'
  import suneditor from 'suneditor'
  import plugins from 'suneditor/src/plugins'
  import table from 'suneditor/src/plugins/submenu/table'
  import lang from 'suneditor/src/lang'

  export default {
    name: "CInputEditor",
    mixins: [
      FormMixin
    ],
    props: {
      text: {
        type: String
      },
      height: {
        type: Number,
        default: 500
      },
      disablePhoto: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      this.editor = suneditor.create('editor', {
        plugins: plugins,
        placeholder: this.placeholder,
        buttonList: [
          [ 'font', 'fontSize'], ['fontColor', 'hiliteColor'],
          ['bold', 'italic'], ['underline', 'strike'],
          ['align', 'outdent', 'indent'],
          ['list', 'table' ],
          ['horizontalRule', 'video', 'image'],
        ],
        font: [
          "Nanum Gothic",
          "Noto Sans Korean",
          "Spoqa Han Sans",
          "BM DoHyeon",
          "BM HANNA",
          "BM YEONSUNG",
          "BM KIRANGHAERANG",
          "BM JUA",
          "BM EULJIRO",
          "Arita Buri Bold",
          "Arita Buri SemiBold",
          "Arita Dotum Medium",
          "Arita Dotum SemiBold",
          "S-CoreDream",
          "Godo",
          "AppleSDGothicNeo"
        ],
        fontSize: [
          10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,36,48,72
        ],
        lang: lang.ko,
        width: '100%',
        height: 'auto',
        minHeight: '200px',
        maxHeight: this.$store.getters.device === 'pc' ? 'calc(100vh - 350px)' : '100%',
        stickyToolbar: this.$store.getters.device === 'pc' ? this.pcToolbarTop : this.mobileToolbarTop,
        defaultStyle: 'font-size:14px',
        resizingBar: false
      });

      this.$nextTick(()=>{
        let list = document.getElementsByClassName('se-btn-list');
        for(let i=0; i<list.length; i++) {
          let item = list[i];
          let titleKor = {
            'Nanum Gothic': '나눔 고딕',
            'Noto Sans CJK kr': '노토 산스',
            'Spoqa Han Sans': '스포카 한 산스',
            'BM DoHyeon': '배민 도현체',
            'BM HANNA': '배민 한나체',
            'BM YEONSUNG': '배민 연성체',
            'BM KIRANGHAERANG': '배민 기랑해랑체',
            'BM JUA': '배민 주아체',
            'BM EULJIRO': '배민 을지로체',
            'Arita Buri Bold': '아리따 부리 Bold',
            'Arita Buri SemiBold': '아리따 부리 SemiBold',
            'Arita Dotum Medium': '아리따 돋움 Medium',
            'Arita Dotum SemiBold': '아리따 돋움 SemiBold',
            'S-CoreDream': '에스코어 드림',
            'Godo': '고도체',
            'AppleSDGothicNeo': '애플 산들고딕 Neo'
          };
          let title = titleKor[item.title];
          if(title) {
            item.title = title;
            item.innerText = title;
          }
        }
        let tray = this.$el.getElementsByClassName('se-btn-tray')[0];
        let desc = document.createElement('div');
        desc.innerHTML = `<div class="unselect" style="color:${this.brandColor.sub2.color};padding:8px 4px;font-size:12px;">*각 이미지 용량 최대 5MB, 가로 1000px, 세로 10000px까지 업로드 가능합니다.</div>`;
        tray.appendChild(desc);

        this.$el.getElementsByClassName('sun-editor-editable')[0].innerHTML = this.value;
        let el = document.getElementsByClassName('se-wrapper-inner')[0];
        el.blur();
      });

      this.editor.onChange = (e) => {
        this.$emit('update:value', e);
      };
    },
    data() {
      return {
        editor: undefined
      }
    },
    computed: {
      pcToolbarTop() {
        let headerHeight = this.$store.getters.headerHeight;
        if (headerHeight) {
          if (headerHeight > 0) {
            return `${headerHeight}px`
          } else {
            return '144px'
          }
        } else {
          return '144px'
        }
      },
      mobileToolbarTop() {
        let headerHeight = this.$store.getters.headerHeight;
        if (headerHeight) {
          if (headerHeight > 0) {
            return `${headerHeight}px`
          } else {
            return '0px'
          }
        } else {
          return '0px'
        }
      },
    },
    watch: {
      value(n,o) {
        if(o === '' && n !== '' && this.editor.getContents() !== n) {
          this.$el.getElementsByClassName('sun-editor-editable')[0].innerHTML = n;
          //this.editor.setContents(n);
        }
      }
    }
  }
</script>

<style lang="stylus">
  .sun-editor
    border 0

  .e-editor img
    max-width 100%
    display inline

  .sun-editor .se-toolbar
    padding 0
    outline none
    background-color white

  .sun-editor-editable table td.se-table-selected-cell
    border 1px solid #e1e1e1
    background transparent
  .sun-editor-editable td p
    margin 0

  .sun-editor-editable .se-component.__se__float-left
  .sun-editor-editable .se-component.__se__float-right
    margin 0

  .sun-editor .se-list-layer.se-list-line
    width 125px

  .sun-editor .se-list-layer
    max-height 300px
    overflow-y auto

  .sun-editor .se-wrapper
    border-top 1px solid #e3e3e3
    border-bottom 1px solid #e3e3e3

</style>
