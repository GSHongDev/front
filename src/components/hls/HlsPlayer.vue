<template>
  <div :class="className">
    <video
        ref="videoRef"
        :controls="controls"
        :autoplay="autoplay"
        :muted="muted"
        :loop="loop"
        :poster="poster"
        playsinline
        class="hls-video"
        @play="$emit('play')"
        @pause="$emit('pause')"
        @ended="$emit('ended')"
    ></video>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, onUnmounted, nextTick} from 'vue'
import Hls from 'hls.js'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: true
  },
  muted: {
    type: Boolean,
    default: false
  },
  loop: {
    type: Boolean,
    default: false
  },
  poster: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: 'hls-player'
  }
})

const emit = defineEmits(['play', 'pause', 'ended', 'error'])

const videoRef = ref(null)
let hls = null

// 初始化播放器
const initializePlayer = async () => {
  await nextTick() // 确保 DOM 已渲染
  const video = videoRef.value
  if (!video || !props.src) return

  // 清理之前的实例
  if (hls) {
    hls.destroy()
    hls = null
  }

  if (Hls.isSupported()) {
    hls = new Hls({
      // 可选配置（根据需求调整）
      // autoStartLoad: true,
      // startPosition: -1,
      // maxBufferLength: 30,
    })

    hls.loadSource(props.src)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (props.autoplay) {
        video.play().catch(err => {
          console.warn('Autoplay failed:', err)
          emit('error', {type: 'autoplay-blocked', error: err})
        })
      }
    })

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data)
      emit('error', {type: data.type, details: data.details, error: data})

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError()
            break
          default:
            hls.destroy()
            break
        }
      }
    })

  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari / iOS 原生支持
    video.src = props.src
    video.addEventListener('loadedmetadata', () => {
      if (props.autoplay) {
        video.play().catch(err => {
          console.warn('Autoplay failed:', err)
          emit('error', {type: 'autoplay-blocked', error: err})
        })
      }
    })
  } else {
    emit('error', {type: 'unsupported', message: '当前浏览器不支持 HLS 播放'})
  }
}

// 监听 src 变化，重新加载
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    initializePlayer()
  }
}, {immediate: true})

onMounted(() => {
  initializePlayer()
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
    hls = null
  }
})
</script>

<style scoped>
.hls-player {
  width: 100%;
  position: relative;
  background: #000;
}

.hls-video {
  width: 100%;
  height: auto;
  display: block;
}
</style>
