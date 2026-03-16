<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('http://doc.ruoyi-wvp.top:85');

function goto() {
  window.open(url.value)
}
</script>
