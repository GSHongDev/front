<template>
  <div class="app-container">
    <el-card header="节点配置" v-loading="loading">
      <el-form ref="nodeConfRef" :model="nodeConf" label-width="auto" :rules="rules">
        <el-form-item label="节点编号" prop="serverId">
          <div style="display: flex;">
            <el-input v-model="nodeConf.serverId" disabled style="min-width: 500px;"/>
            <el-button @click="handleCopyServerId(nodeConf.serverId)">复制</el-button>
          </div>
        </el-form-item>
        <el-form-item label="节点名称" prop="serverName">
          <el-input v-model="nodeConf.serverName" style="width: 500px;"/>
        </el-form-item>
        <el-form-item label="节点地址">
          <div style="display: flex;">
            <el-select v-model="CoapValue" placeholder="Select" style="width: 100px">
              <el-option
                  v-for="item in coapOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-input v-model="nodeConf.host" disabled style="width: 320px;"/>
            <el-input v-model="nodeConf.port" disabled style="width: 80px;"/>
          </div>
        </el-form-item>
        <el-form-item label="授权用户" prop="username">
          <div style="display: flex;">
            <el-input v-model="nodeConf.username" style="min-width: 500px;"/>
            <el-button @click="handleCopyServerId(nodeConf.username)">复制</el-button>
          </div>
        </el-form-item>
        <el-form-item label="授权凭证" prop="authenticate">
          <div style="display: flex;">
            <el-input v-model="nodeConf.authenticate" style="min-width: 500px;"/>
            <el-button @click="handleCopyServerId(nodeConf.authenticate)">复制</el-button>
          </div>
        </el-form-item>
        <el-form-item label="授权密码">
          <div style="display: flex;">
            <el-input v-model="nodeConfPassword" type="password" style="min-width: 500px;" disabled/>
            <el-button @click="handleCopyServerId(nodeConfPassword)">复制</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <el-button type="primary" @click="submitForm">更 新</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup name="NodeConf">
import {getNodeConf, updateServerMe} from "@/api/gat1400/nodeConf.js";
import {onMounted} from "vue";

const {proxy} = getCurrentInstance();

const nodeConf = ref({});
const nodeConfPassword = ref("123456");
const loading = ref(true);
const CoapValue = ref("HTTP");
const coapOptions = ref([
  {
    value: 'HTTP',
    label: 'HTTP',
  },
  {
    value: 'HTTPS',
    label: 'HTTPS',
  },
]);
const rules = ref({
  serverId: [{required: true, message: "节点编号不能为空", trigger: "blur"}],
  serverName: [{required: true, message: "节点名称不能为空", trigger: "blur"}],
  username: [{required: true, message: "授权用户不能为空", trigger: "blur"}],
  authenticate: [{required: true, message: "授权密码不能为空", trigger: "blur"}],
})

async function submitForm(){
  proxy.$refs["nodeConfRef"].validate(valid => {
    if (valid) {
      updateServerMe(nodeConf.value).then(() => {
        proxy.$modal.msgSuccess("更新成功");
        getNodeConfig();
      })
    }
  });
}

async function handleCopyServerId(text) {
  try {
    await navigator.clipboard.writeText(text);
    proxy.$modal.msgSuccess('复制成功');
  } catch (err) {
    proxy.$modal.msgError('复制失败:', err);
  }
}

function getNodeConfig() {
  loading.value = true;
  getNodeConf().then(res => {
    nodeConf.value = res.data;
    loading.value = false;
  })
}

onMounted(() => {
  getNodeConfig();
  if (location.protocol === "https:") {
    CoapValue.value = "HTTPS"
  } else {
    CoapValue.value = "HTTP"
  }
});

</script>

<style scoped>

</style>
