<template>
  <van-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: '100%' }"
    round
  >
    <div class="cropper-container">
      <van-nav-bar
        title="裁剪图片"
        left-text="取消"
        right-text="确认"
        @click-left="onCancel"
        @click-right="onConfirm"
      />
      <div class="cropper-wrapper">
        <img ref="imageRef" :src="imageSrc" style="max-width: 100%;" />
      </div>
      <div class="cropper-tips">
        请裁剪出需要识别的区域
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const visible = ref(props.show)
const imageRef = ref(null)
let cropper = null

watch(() => props.show, async (val) => {
  visible.value = val
  if (val && props.imageSrc) {
    await nextTick()
    initCropper()
  } else if (!val && cropper) {
    destroyCropper()
  }
})

watch(visible, (val) => {
  emit('update:show', val)
})

const initCropper = () => {
  if (cropper) {
    destroyCropper()
  }
  if (imageRef.value) {
    cropper = new Cropper(imageRef.value, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      restore: false,
      modal: true,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true
    })
  }
}

const destroyCropper = () => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

const onCancel = () => {
  visible.value = false
  emit('cancel')
}

const onConfirm = () => {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas({
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    const base64 = canvas.toDataURL('image/jpeg', 0.98)
    emit('confirm', base64)
    visible.value = false
  }
}
</script>

<style scoped>
.cropper-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
}

.cropper-wrapper {
  flex: 1;
  overflow: hidden;
}

.cropper-tips {
  padding: 16px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
}
</style>
