<template>
<div>
  <video :id="'video'+uid" oncontextmenu="return false" controlsList="nodownload"
    :autoplay="useAutoplay" :controls="useControls" style="object-fit: cover; outline: none"
    :loop="useLoop" :muted="useMuted" :width="width" :height="height">
    <!-- 비디오 source -->
    <source :src="video">

    <!-- 자막 있는 경우 -->
    <template v-if="subtitles && subtitles.length > 0">
      <track v-for="(subtitle, idx) in subtitles" :key="'subtitle-'+idx"
        kind="subtitles" :src="subtitle.src" :srclang="subtitle.lang" :label="subtitle.label">
    </template>
  </video>
</div>
</template>
<script>

export default {
  name: 'EVideo',
  components: {

  },
  mixins: [

  ],
  props: {
    video: {
      type: String,
      required: true
    },
    useAutoplay: {
      type: Boolean,
      default: true
    },
    useControls: {
      type: Boolean,
      default: true
    },
    useLoop: {
      type: Boolean,
      default: true
    },
    useMuted: {
      type: Boolean,
      default: true
    },
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    subtitles: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      uid: ''
    }
  },
  created() {
    this.uid = this.uuidv4();
  },
  mounted() {
    let style = document.documentElement.style;
    let userAgent = navigator.userAgent;
    let isChrome = /Chrome/.test(userAgent);
    if (isChrome) {
      let version = userAgent.split('Chrome/')[1].split('.')[0];
      if (Number(version) >= 55) {
        style.setProperty('--move-download-button', '50px')
      } else {
        style.setProperty('--move-download-button', '0px')
      }
    }
  },

  methods: {
  
  },
  computed: {
    
  },
  watch: {
    
  }
}
</script>

<style>
video::-internal-media-controls-download-button {
  display: none;
}
video::-webkit-media-controls-enclosure {
  overflow: hidden;
}
video::-webkit-media-controls-panel {
  width: calc(100% + var(--move-download-button));
}
</style>
