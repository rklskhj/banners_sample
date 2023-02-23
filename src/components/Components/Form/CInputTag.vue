<template>
  <div :style="containerStyle">
    <!-- 레이블 -->
    <div v-if="formType.label && label" :style="labelStyle">{{ label.replace('*', '') }}
        <span v-if="label.indexOf('*')>-1" class="p-highlight">*</span></div>

    <div :style="tagContainerStyle">
      <div class="flex wrap">
        <div :key="'tag'+idx" v-for="(tag, idx) in tags" class="lp-tag-div">
          <div :style="tagStyle">{{ tag }}<i class="lp-tag-delete unselect material-icons" @click="delTag(idx)">close</i></div>
          <div style="padding:8px 2px">,</div>
        </div>
        <div class="lp-tag-input-div">
          <input class="lp-input-text-input" @keydown="onKeyDown" type="text" :value="text"
                 @input="e => text = e.target.value">
          <!--<ul v-if="text!==''">
            <li :key="'tag'+idx" v-for="(tag,idx) in tagSearch"
                @click="clickLi(tag)"
                v-if="tag!=='' && tag.search(text)>-1">{{ tag }}
            </li>
          </ul>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormMixin from '@/components/Mixins/FormMixin'

  export default {
    name: 'c-input-tag',
    mixins: [
      FormMixin
    ],
    data() {
      return {
        text: '',
        tags: [],
        tagSearch: ['']
      }
    },
    created() {
      this.tags = this.value;
    },
    watch: {
      value(n) {
        this.tags = n;
      }
    },
    methods: {
      onKeyDown(e) {
        if (e.key === 'Enter')
          this.onEnter();
        else if (e.key === 'Backspace')
          this.onDelete();
      },
      onEnter() {
        if (this.text !== '') {
          if (this.tags.length > 10) {
            this.toast('태그는 최대 10까지 등록 가능합니다.');
            this.text = '';
          }
          else {
            let hasTag = false;
            for (let i = 0; i < this.tags.length; i++) {
              if (this.tags[i] === this.text) {
                hasTag = true;
                break;
              }
            }

            if (!hasTag)
              this.tags.push(this.text);
            this.text = '';
          }
        }
      },
      /*clickLi(tag) {
        if (this.tags.length > 10) {
          this.toast('태그는 최대 10까지 등록 가능합니다.');
          this.text = '';
          return;
        }
        this.tags.push(tag);
        this.text = '';
      },*/
      onDelete() {
        if (this.text === '' && this.tags.length > 0) {
          this.tags.remove(this.tags.length - 1);
        }
      },
      delTag(idx) {
        this.tags.remove(idx);
      }
    },
    computed: {
      tagStyle() {
        let deco = {};
        deco.display = 'flex';
        deco.alignItems = 'center';
        deco.justifyContent = 'center';
        deco.color = 'white';
        deco.textAlign = 'center';
        deco.fontSize = '0.9rem';
        deco.backgroundColor = this.getColor('브랜드 강조 색상');
        deco.padding = '4px 10px 4px 12px';
        deco.borderRadius = '20px';
        deco.height = '28px';
        return deco;
      },
      tagContainerStyle() {
        let deco = this.inputStyle;
        let color = this.getColor('기본 테두리선 색상');
        switch (this.formType && this.formType.input) {
          case 'round':
            deco.borderRadius = this.radius.borderRadius;
            deco.border = `1px solid ${color}`;
            deco.padding = `8px 10px`;
            break;
          case 'underline':
            deco.borderBottom = `1px solid ${color}`;
            break;
        }
        return deco;
      },
      inputStyle() {
        let style = {};

        if (this.inputWidth !== undefined) {
          style.width = this.inputWidth;
        }
        if (this.block !== undefined) {
          style.display = this.block;
        }
        if (this.inputAlign !== undefined) {
          style.textAlign = this.inputAlign;
        }
        if (this.inputPadding !== undefined) {
          style.padding = this.inputPadding;
        }

        return style;
      }
    }
  }
</script>

<style lang="stylus" type="stylus" scoped>
  .lp-input-text-container
    padding 8px 10px
    padding-bottom 4px
    position relative
    border-radius 3px
    box-shadow inset 0 1px 2px rgba(10,10,10,0.1)
    border 1px solid #dbdbdb

  .lp-input-text-label
    margin-bottom 8px
    display block
    color #064160
    font-weight bold
    font-size 0.9rem

  .lp-input-text-input
    padding 6px 6px 5px 6px
    font-size 0.95rem
    color #555
    border 0
    display block

  .lp-tag-input-div
    flex 1
    position relative
    margin-bottom 6px

  ul
    position absolute
    top 36px
    border 1px solid #ddd
    border-radius 3px

  li
    font-size 0.9rem
    background-color #fff
    color #555
    padding 6px 12px

  li:hover
    background-color #ddd

  .lp-tag-div
    display flex
    margin 0 6px 6px 0
    height 28px

  input
    box-shadow none
    width 100%
  input:focus
    outline 0
    box-shadow none

  .lp-tag-delete
    font-size 12px
    margin-left 6px
</style>
