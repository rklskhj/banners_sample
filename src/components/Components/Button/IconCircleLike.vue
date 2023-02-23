<template>
  <div class="flex-center unselect" @click.stop.prevent="clickBtn" 
    :style="[containStyle ? containStyle : iconWrapStyle]"
    @mouseover="hoverMouse"
    @mouseleave="leaveMouse">
    <i class="material-icons"
      :style="iconStyle"
      >{{ isLike ? 'favorite' : 'favorite_border' }}</i>
    <div v-if="text" :style="[textStyle ? textStyle : letterStyle]">{{ text }}</div>
    <div v-if="count!==undefined&&computedCount!==undefined"
        class="full-width" :style="countStyle">{{ computedCount }}</div>
  </div>
</template>

<script>
  export default {
    name: "IconCircleLike",
    props: {
      id: {
        type: Number,
        required: false
      },
      value: {        // 좋아요 여부 (props로 넘기지 않을 경우 api 호출)
        required: false
      },
      likeType: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: 'sub'
      },
      activeColor: {
        type: String,
        default: 'brand'
      },
      count: {          // 숫자표시
        type: Number,
        required: false
      },
      countCustomStyle: {
        type: Object,
        required: false
      },
      menuTitle: {
        type: String,
        default: '마이페이지 > 찜'
      },
      text: {
        type: String,
        required: false
      },
      hover: {
        type: Boolean,
        required: false
      },
      width: {
        type: Number,
        required: false,
        default: 48
      },
      height: {
        type: Number,
        required: false,
        default: 48
      },
      borderRadius: {
        type: Number,
        default: 8
      },
      border: {
        type: String,
        required: false,
      },
      containStyle: {
        type: Object,
        required: false
      },
      textStyle: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        icon: 'favorite_border',
        isLike: false,
        url: '',
        computedCount: undefined,
        mouseHover: false
      }
    },
    created() {
      if (this.count !== undefined) this.computedCount = this.count;

      if(!this.isLogin) return;

      let id = this.$route.query.id;
      if (this.id) id = this.id;
      this.url = `user/${this.$store.getters.user.user_id}/${this.likeType}/${id}/islike`;

      // 좋아요 값 props로 넘길 경우
      if (this.value!==undefined) this.isLike = this.value;
      // props로 넘기지 않을 경우 각각 api 호출
      else {
        this.$axios.get(this.url).then(res => {
          this.isLike = res.data.is_liked;
        });
      }
    },
    computed: {
      iconStyle() {
        let color = this.isLike ? this.activeColor : this.color;
        let deco = {};
        deco.fontSize = (this.size).toString()+'px';
        deco.height = (this.size).toString()+'px';
        deco.textAlign = 'center';
        if (this.isHex(color)) {
          deco.color = `#${color}`;
        } else {
          deco.color = this.brandColor[color].color;
        }

        return deco;
      },
      iconWrapStyle() {
        let deco = {
          backgroundColor: `${this.getColor('기본 배경 색상')}`,
          // border: `1px solid ${this.getColor('기본 테두리선 색상')}`
        };
        // 버튼 안에 글자 있을때
        if(this.text) {
          deco.borderRadius = `${this.borderRadius}px`,
          deco.textAlign = 'center',
          deco.border = `1px solid ${this.getColor('기본 테두리선 색상')}`
          if(this.$store.getters.device==='mobile') {
            deco.padding = '4px 8px'
          }
          else {
            deco.padding = '8px 28px',
            deco.height = '56px'
          }
        }

        // 버튼 안에 아이콘만 있을 때
        else {
          // 마우스 오버 사용할 때
          if(this.hover) {
            if(!this.mouseHover) {
              deco.width = '42px',
              deco.height = '42px',
              deco.borderRadius = `${this.borderRadius}px`
            }
            if(this.mouseHover) {
              deco.width = '44px',
              deco.height = '44px',
              deco.borderRadius = `${this.borderRadius}px`,
              deco.boxShadow = '0 3px 6px 0 rgba(0, 0, 0, 0.16)'
            }
          }

          // 마우스 오버 사용하지 않을 때
          else {
            if(this.width) deco.width = `${this.width}px`
            if(this.height) deco.height = `${this.height}px`
            if(this.borderRadius) deco.borderRadius = `${this.borderRadius}px`
            if(this.border) deco.border = `${this.border}`
          }
          
        }
        
        return deco;
      },
      

      countStyle() {
        let deco = {};

        deco.color = this.brandColor.main.color;
        deco.fontSize = '11px';
        deco.textAlign = 'center';

        if (this.countCustomStyle) deco = this.countCustomStyle;

        return deco;
      },
      letterStyle() {
        return {
          marginLeft: '6px',
          whiteSpace: 'pre',
          color: this.getColor('보조 내용 색상')
        }
      }

    },

    methods: {
      isHex(h) {
        let a = parseInt(h, 16);
        return (a.toString(16) === h.toLowerCase());
      },
      hoverMouse() {
        this.mouseHover = true;
      },
      leaveMouse() {
        this.mouseHover = false;
      },
      clickBtn() {
        if(!this.isLogin) {
          // this.toast('찜하시려면 로그인이 필요합니다')
          this.$store.commit('setPreviousPath', this.$route.fullPath);
          this.routerPush('/signin');
          return;
        }

        this.$axios.post(this.url.replace('islike','like'))
          .then(() => {
            this.isLike = !this.isLike;
            this.$emit('liked', this.isLike)

            if (this.isLike) {
              if (this.likeType === 'product')
                this.toast('상품을 찜하였습니다.');
                // this.toast('상품을 찜하였습니다.\n' +
                //   this.menuTitle + '에서 \n' +
                //   '확인하실 수 있습니다._icon_favorite');
              else if (this.likeType === 'partner')
                this.toast('파트너를 찜하였습니다.');
                // this.toast('파트너를 찜하였습니다.\n' +
                //   this.menuTitle + '에서 \n' +
                //   '확인하실 수 있습니다._icon_favorite');
            }

            // 클릭 공통 emit
            this.$emit('click');

            // 카운트 숫자 있을 경우
            if (!this.isLike) this.computedCount -= 1;
            else this.computedCount += 1;

            if (this.computedCount<0) this.computedCount = 0;
          });
      }
    }

  }
</script>
