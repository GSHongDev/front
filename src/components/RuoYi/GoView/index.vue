<template>
  <div>
    <svg-icon icon-class="goview" @click="goto" />
  </div>
</template>

<script setup>
import {getToken} from "../../../utils/auth.js";
import {getConfigKey} from "../../../api/system/config.js";

const url = ref('');

function getConfigKeyFun() {
  getConfigKey("sys_goview_address").then(response => {
    url.value = response.msg + '?token='+getToken()
  })
}

function goto() {
  window.open(url.value)
}

getConfigKeyFun()

</script>
