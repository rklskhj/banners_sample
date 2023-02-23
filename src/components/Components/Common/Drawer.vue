<template>
  <section v-if="enabled">
    <aside class="sidebar" :style="style" ref="element">
      <slot></slot>
    </aside>
    <div class="overlay" ref="overlay" @click="$emit('close')"></div>
  </section>
</template>
<script>
  export default {
    name: 'Drawer',
    props: {
      direction: {
        type: String
      },
      exist: {
        type: Boolean
      },
      bottomHeight: {
        type: Number,
        default: 150
      },
      asideStyle: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    data(){
      return {
        auto_speed:'0.3s',
        manual_speed:'0.03s',
        threshold:20,
        startTime:null,
        startPos:null,
        translate:null,
        active:false,
        visible:true,
        moving: {
          x: null,
          y: null
        }
      }
    },
    computed:{
      element() {
        return this.$refs.element;
      },
      overlay() {
        return this.$refs.overlay;
      },
      enabled() {
        return this.exist === true;

      },
      style() {
        let deco = this.asideStyle;
        if(this.direction === 'right') {
          deco.transform = 'translate3d(100%,0,0)';
          deco.right = 0;
        } else if(this.direction === 'bottom') {
          let height = window.innerHeight - this.bottomHeight;
          if (this.bottomHeight > window.innerHeight) {
            height = (this.bottomHeight - window.innerHeight) * 2
          }
          deco.transform = 'translate3d(0,'+ height + 'px,0)';
          deco.bottom = 0;
        }
        else {
          deco.transform = 'translate3d(-100%,0,0)';
          deco.left = 0;
        }
        return deco;
      },
    },
    mounted(){
      // document.addEventListener('touchstart',(e) =>{this.handleStart(e)});
      // document.addEventListener('touchmove',(e) =>{this.handleMove(e)});
      // document.addEventListener('touchend',(e) =>{this.handleEnd(e)});
      // document.addEventListener('touchcancel',(e) =>{this.handleEnd(e)});
      window.addEventListener('resize', (e) =>{this.setVisibality(e)}, true);
      this.overlay.addEventListener('transitionend',(e) =>{this.handleZindex(e)},false);
      this.overlay.addEventListener('click',() =>{this.close()},false);
      this.setVisibality();
    },
    methods:{
      setVisibality(){
        this.visible = this.element.offsetWidth !== 0;
      },
      handleStart(e){
        this.startTime = new Date().getTime();
        this.startPos = e.targetTouches[0].pageX;
        this.element.style.transitionDuration = this.manual_speed;
      },
      handleMove(e){
        let gesture = this.direction === 'bottom' ? this.gestureY(e) : this.gesture(e);
        let valid = this.validate(this.direction,gesture);
        if(valid){
          let percent = this.percentage(this.direction,gesture);
          if(this.direction === 'left'){
            /* touch scroll-y 튕김 방지 */
            let oldY = this.moving.y;
            let currentY = e.touches[0].pageY;
            let offsetY = oldY - currentY;
            if (offsetY<0) return;

            /* 터치 감도 조정 코드
            let oldX = this.moving.x;
            let currentX = e.touches[0].pageX;
            let offsetX = oldX - currentX;
            if (offsetX>offsetY) return; */

            this.translate = (e.touches[0].pageX-this.element.offsetWidth);
            if(this.translate < 0){
              this.element.style.transform = 'translate3d('+ this.translate +'px,0,0)';
            }else{
              this.open();
            }
          } else if(this.direction === 'right'){
            /* touch scroll-y 튕김 방지 */
            let oldY = this.moving.y;
            let currentY = e.touches[0].pageY;
            let offsetY = oldY - currentY;
            if (offsetY<0) return;

            this.translate = -(screen.width-this.element.offsetWidth-e.touches[0].pageX);
            if(this.translate > 0){
              this.element.style.transform = 'translate3d('+ this.translate +'px,0,0)';
            }else{
              this.open();
            }
          } else if(this.display === 'bottom'){
            this.translate = -(screen.height-this.bottomHeight-e.touches[0].pageY);
            if(this.translate > 0){
              this.element.style.transform = 'translate3d(0,'+ this.translate +'px,0)';
            }else{
              this.open();
            }
          }
          this.overlayOpacity(percent/100);

          this.moving.x = e.touches[0].pageX;
          this.moving.y = e.touches[0].pageY;
        }
      },
      handleEnd(e){
        let speed = this.speed(e);
        let gesture = this.direction === 'bottom' ? this.gestureY(e) : this.gesture(e);
        let valid = this.validate(this.direction,gesture);
        if(valid){
          if(speed>0.6){
            if(!this.active){
              this.open();
            }else{
              this.close();
            }
          }else{
            if(this.direction === 'bottom') {
              if(this.bottomHeight/2>Math.abs(this.translate)) {
                this.open();
              }else{
                this.close();
              }
            }
            else if(this.element.offsetWidth/2>Math.abs(this.translate)){
              this.open();
            }else{
              this.close();
            }
          }
        }
      },
      handleZindex(){
        let opacity = window.getComputedStyle(this.overlay).getPropertyValue('opacity');
        if(opacity<=0){
          this.overlay.style.zIndex = -999;
        }
      },
      validate(direction,gesture){
        if(direction === 'left'){
          if((this.active && gesture === 'swiperight') || (!this.active && (gesture === 'swipeleft' || this.startPos>this.threshold))){
            return false;
          }
        } else if(direction === 'right'){
          if((this.active && gesture === 'swipeleft') || (!this.active && (gesture === 'swiperight' || this.startPos<(screen.width-this.threshold)))){
            return false;
          }
        } else if(direction === 'bottom'){
          if((this.active && gesture === 'swipebottom') || (!this.active && (gesture === 'swipebottom' || this.startPos<(screen.height-this.threshold)))){
            return false;
          }
        }
        if((document.querySelector('.sidebar.active') && !this.active) || !this.visible){
          return false;
        }
        return true;
      },
      overlayOpacity(opacity){
        this.overlay.style.opacity = opacity;
        if(opacity > 0){
          this.overlay.style.zIndex = 999;
        }
      },
      gesture(e){
        let directions = [
          'swipeleft',
          'swiperight'
        ];
        let currentPos = e.changedTouches[0].pageX;
        if((this.startPos-currentPos)<0){
          return directions[1];
        }else{
          return directions[0];
        }
      },
      gestureY(e){
        let directions = [
          'swipetop',
          'swipebottom'
        ];
        let currentPos = e.changedTouches[0].pageY;
        if((this.startPos-currentPos)<0){
          return directions[1];
        }else{
          return directions[0];
        }
      },
      open(){
        this.translate = 0;
        if(this.direction === 'bottom') {
          let height = window.innerHeight - this.bottomHeight;
          if (this.bottomHeight > window.innerHeight) {
            height = (this.bottomHeight - window.innerHeight) * 2
          }
          this.element.style.transform = 'translate3d(0,'+height+'px,0)';
        } else {
          this.element.style.transform = 'translate3d('+this.translate+',0,0)';
        }
        this.element.style.transitionDuration = this.auto_speed;
        this.overlayOpacity(1);
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
        this.element.classList.add('active');
        this.active = true;

        this.moving = { x: null, y: null };        
      },
      close(){
        if(this.direction === 'left'){
          if (this.element.offsetWidth > this.element.offsetHeight) {
            // this.translate = '-'+this.element.offsetWidth+'px';
            this.translate = '-100%';
          } else {
            // this.translate = '-'+this.element.offsetHeight+'px';
            this.translate = '-100%';
          }
        } else if(this.direction === 'right'){
          this.translate = this.element.offsetWidth+'px';
        }  else if(this.direction === 'bottom'){
          this.translate = screen.height + 'px';
        }

        if(this.direction === 'bottom') {
          this.element.style.transform = 'translate3d(0,'+this.translate+',0)';
        } else {
          this.element.style.transform = 'translate3d('+this.translate+',0,0)';
        }
        this.element.style.transitionDuration = this.auto_speed;
        this.overlayOpacity(0);
        this.unlock(document.querySelector('html'));
        this.unlock(document.querySelector('body'));
        this.element.classList.remove('active');
        this.active = false;

        this.moving = { x: null, y: null };
      },
      speed(e){
        let time = new Date().getTime() - this.startTime;
        let startP = Math.abs(this.startPos);
        let endP =  this.direction === 'bottom' ? Math.abs(e.changedTouches[0].pageY) : Math.abs(e.changedTouches[0].pageX);
        let distance = startP>endP? (startP-endP):(endP-startP);
        return distance/time;
      },
      percentage(direction,gesture){
        let percentage = 0;
        let test = [];
        if(direction === 'left'){
          test = ['swipeleft','swiperight']
        } else if(direction === 'right'){
          test = ['swiperight','swipeleft']
        } else if(direction === 'bottom'){
          test = ['swipebottom','swipetop']
        }
        let size = direction === 'bottom' ? 'offsetHeight' : 'offsetWidth';
        if(this.active && gesture === test[0]){
          percentage = 100-Math.round(Math.abs(this.translate)/this.element[size]*100);
        }
        if(!this.active && gesture === test[1]){
          percentage = Math.round(100-Math.abs(this.translate)/this.element[size]*100);
        }
        if(percentage>100){
          percentage = 100;
        }
        if(percentage<0){
          percentage = 0;
        }
        return percentage;
      },
      lock(element){
        element.style.overflow = 'hidden';
        element.style.touchAction = 'none';
      },
      unlock(element){
        element.style.removeProperty('overflow');
        element.style.removeProperty('touch-action');
      }
    }
  }
</script>
<style scoped>
  div.overlay{
    position:fixed;
    z-index: -999;
    left: 0px;
    top:0px;
    background:rgba(11, 10, 12, 0.35);
    opacity: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
  }
  aside.sidebar{
    z-index: 9999;
    position: fixed;
    will-change: transform;
    height: 100%;
    top: 0px;
    transition:transform 0.3s ease;
    background:#fff;
    min-width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    word-wrap: break-word;
  }
</style>