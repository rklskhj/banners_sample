<template>
  <section v-if="enabled" ref="actionsheet">
    <aside class="sidebar" :style="style" ref="element">
      <slot></slot>
    </aside>
    <div class="overlay" ref="overlay" @click="$emit('close')"></div>
  </section>
</template>
<script>
  export default {
    name: 'ActionSheet',
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
        },
      }
    },
    computed:{
      actionsheet() {
        return this.$refs.actionsheet;
      },
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
        return deco;
      },
    },
    mounted(){
      window.addEventListener('resize', (e) =>{this.setVisibality(e)}, true);
      this.overlay.addEventListener('transitionend',(e) =>{this.handleZindex(e)},false);
      this.overlay.addEventListener('click',() =>{this.close()},false);
      this.setVisibality();
    },
    methods:{
      setVisibality(){
        this.visible = this.element.offsetWidth !== 0;
      },

      handleZindex(){
        let opacity = window.getComputedStyle(this.overlay).getPropertyValue('opacity');
        if(opacity<=0){
          this.overlay.style.zIndex = -999;
        }
      },
      overlayOpacity(opacity){
        this.overlay.style.opacity = opacity;
        if(opacity > 0){
          this.overlay.style.zIndex = 999;
        }
      },
      open(){
        this.translate = 0;
        this.actionsheet.style.display = 'block';
        // this.element.style.transitionDuration = this.auto_speed;
        this.overlayOpacity(1);
        this.lock(document.querySelector('html'));
        this.lock(document.querySelector('body'));
        this.element.classList.add('active');
        this.active = true;
        this.moving = { x: null, y: null };        
      },
      close(){
        // this.element.style.transitionDuration = this.auto_speed;
        this.overlayOpacity(0);
        this.unlock(document.querySelector('html'));
        this.unlock(document.querySelector('body'));
        this.element.classList.remove('active');
        this.active = false;
        this.moving = { x: null, y: null };
        // this.actionsheet.style.display = 'none'
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
        element.style.height = '100%';
        element.style.minHeight = '100%';
        element.style.position = 'fixed';
        window.addEventListener('scroll', (e) => {
          e.preventDefault();
        })
        window.addEventListener('touchmove', (e) => {
          e.preventDefault();
        })
        window.addEventListener('mousewheel', (e) => {
          e.preventDefault();
        })
        window.addEventListener('DOMMouseScroll', (e) => {
          e.preventDefault();
        })
      },
      unlock(element){
        element.style.removeProperty('overflow');
        element.style.removeProperty('touch-action');
        element.style.removeProperty('height');
        element.style.removeProperty('min-height');
        element.style.removeProperty('position');
        window.removeEventListener('scroll', (e) => {
          e.preventDefault();
        })
        window.removeEventListener('touchmove', (e) => {
          e.preventDefault();
        })
        window.removeEventListener('mousewheel', (e) => {
          e.preventDefault();
        })
        window.removeEventListener('DOMMouseScroll', (e) => {
          e.preventDefault();
        })
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
    /* will-change: transform; */
    /* height: 100%; */
    /* top: 0px; */
    bottom: -100%;
    /* transition:transform 0.3s ease; */
    transition: all 600ms cubic-bezier(0.86, 0, 0.07, 1);
    background:#fff;
    min-width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    word-wrap: break-word;
  }

  .active {
    bottom: 0px !important
  }
</style>