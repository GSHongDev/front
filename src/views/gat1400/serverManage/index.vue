<template>
  <div class="app-container">
    <el-card>
      <el-form ref="queryForm" :model="queryParams" :inline="true" v-show="showSearch">
        <el-form-item label="视图库名称" prop="serverName">
          <el-input
              v-model="queryParams.serverName"
              placeholder="请输入视图库名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="是否在线" prop="isOnline">
          <el-select v-model="queryParams.isOnline" clearable placeholder="请选择是否在线" style="width: 240px;">
            <el-option label="在线" value="1"/>
            <el-option label="离线" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['viid:server:add']"
          >新增
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
          v-loading="loading"
          :data="tableList"
          border
          tooltip-effect="dark"
      >
        <el-table-column prop="serverId" label="视图库编号" align="center" show-overflow-tooltip />
        <el-table-column prop="serverName" label="视图库名称" align="center" show-overflow-tooltip />
        <el-table-column prop="host" label="视图库地址" align="center" :formatter="serverHostFormmatter"  show-overflow-tooltip />
        <el-table-column prop="category" label="节点类型" align="center" :formatter="categoryFormatter" />
        <el-table-column prop="username" label="授权用户" align="center" show-overflow-tooltip />
        <el-table-column prop="enabled" label="是否启用" align="center" >
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" :active-value="true" :inactive-value="false" @change="changeServerEnable(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="keepalive" label="开启双向保活" >
          <template #default="scope">
            <el-switch v-model="scope.row.keepalive" :active-value="true" :inactive-value="false" @change="changeServerKeepalive(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="online" label="在线状态" :formatter="onlineFormatter" />
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="scope">
            <div style="display:flex; align-items: center;justify-content: center">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                         v-hasPermi="['viid:server:edit']">修改
              </el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                         style="color: #f56c6c"
                         v-hasPermi="['viid:server:remove']">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />

      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
        <el-form ref="ServerManageRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="视图库编号" prop="serverId">
            <el-input v-model="form.serverId" placeholder="请输入视图库编号" :disabled="openServerId"/>
          </el-form-item>
          <el-form-item label="节点类别" prop="category">
            <el-select v-model="form.category" placeholder="请选择协议">
              <el-option label="下级节点" value="1"></el-option>
              <el-option label="上级节点" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="视图库名称" prop="serverName">
            <el-input v-model="form.serverName" placeholder="请输入视图库编号" />
          </el-form-item>
          <el-form-item label="视图库地址" prop="serverName">
            <el-row>
              <el-col>
                <el-select v-model="form.scheme" slot="prepend" placeholder="请选择协议" style="width: 120px;">
                  <el-option label="HTTP" value="http"></el-option>
                  <el-option label="HTTPS" value="https"></el-option>
                </el-select>
                <el-input placeholder="视图库地址" v-model="form.host" class="input-with-select"
                          style="width: 300px;">
                </el-input>
                <el-input v-model="form.port" placeholder="端口" style="width: 90px;" class="clear-number-input"
                          type="number" :min="1" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="授权用户" prop="username">
            <el-input v-model="form.username" placeholder="请输入授权用户" />
          </el-form-item>
          <el-form-item label="授权凭证" prop="authenticate">
            <el-input v-model="form.authenticate" placeholder="请输入授权凭证" />
          </el-form-item>
          <el-form-item label="数据传输类型" prop="transmission">
            <el-select v-model="form.transmission" placeholder="请选择数据传输类型">
              <el-option label="标准http协议" value="http"></el-option>
              <el-option label="跨网websocket协议" value="websocket"></el-option>
              <el-option label="设备直推" value="device"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代理网络类型" prop="proxyNetwork">
            <el-select v-model="form.proxyNetwork" placeholder="请选择代理网络类型">
              <el-option label="直连网络" value="1"></el-option>
              <el-option label="跨网边界" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>

    </el-card>
  </div>
</template>

<script setup name="ServerManage">
import { h } from 'vue';
import {
  serverManagePage,
  changeServerEnableApi,
  changeServerKeepaliveApi,
  delServers,
  upsertServer, getServer
} from "@/api/gat1400/serverManage.js";

const {proxy} = getCurrentInstance();
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  serverId: undefined,
  category: undefined,
  serverName: undefined,
  isOnline: undefined,
  excludeSelf: undefined,
})
const tableList = ref([]);
const form = ref({});
const validatePort = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('端口不能为空'));
  }
  if (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 65535) {
    callback(new Error('请输入1-65535之间的整数'));
  } else {
    callback();
  }
};
const rules = ref({
  serverId: [
    { required: true, message: '请输入视图库编号', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请选择节点类别', trigger: 'change' }
  ],
  serverName: [
    { required: true, message: '请输入视图库名称', trigger: 'blur' },
  ],
  scheme: [
    { required: true, message: '请选择协议', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入视图库地址', trigger: 'blur' },
    {
      pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*)$/,
      message: '请输入有效的IP地址或域名',
      trigger: 'blur'
    }
  ],
  port: [
    { required: true, validator: validatePort, trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入授权用户', trigger: 'blur' },
  ],
  authenticate: [
    { required: true, message: '请输入授权凭证', trigger: 'blur' },
  ],
  transmission: [
    { required: true, message: '请选择数据传输类型', trigger: 'change' }
  ],
  proxyNetwork: [
    { required: true, message: '请选择代理网络类型', trigger: 'change' }
  ]
});
const total = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const open = ref(false);
const openServerId = ref(false);
const title = ref("");

function submitForm(){
  proxy.$refs["ServerManageRef"].validate(valid => {
    if (valid){
      upsertServer(form.value).then(() => {
        open.value = false;
        getList();
      });
    }
  });
}
function cancel(){
  open.value = false;
  openServerId.value = false;
}

function handleAdd(){
  form.value = {
    category: '1',
    scheme: 'http',
    transmission: 'http',
    proxyNetwork: '1',
  };
  openServerId.value = false;
  open.value = true;
  title.value = "新增视图库";
}

function handleUpdate(row){
  getServer(row.serverId).then(res => {
    form.value = res.data;
    open.value = true;
    openServerId.value = true;
    title.value = "修改视图库";
  })
}

function handleDelete(row){
  proxy.$modal.confirm('选中数据将被永久删除, 是否继续？').then(function () {
    return delServers(row.serverId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  });
}

function onlineFormatter(row, column, cellValue, index) {
  if (cellValue === '1') {
    return h('el-tag', { type: 'success' }, '在线');
  } else {
    return h('el-tag', { type: 'warning' }, '离线');
  }
}

function categoryFormatter(row, column, cellValue, index) {
  const types = {
    '1': h('el-tag', { type: 'info' }, '下级节点'),
    '2': h('el-tag', { type: 'info' }, '上级节点')
  };
  return types[cellValue] || h('el-tag', { type: 'info' }, '未知节点');
}

function serverHostFormmatter(row, column, cellValue, index) {
  return row.scheme + "://" + row.host + ":" + row.port;
}

async function changeServerEnable(val) {
  const data = {
    serverId: val.serverId,
    enabled: val.enabled
  }
  await changeServerEnableApi(data);
  getList();
}

function changeServerKeepalive(val) {
  const data = {
    serverId: val.serverId,
    keepalive: val.keepalive
  }
  changeServerKeepaliveApi(data).then(() => {
    getList();
  })
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    serverName: undefined,
    serverId: undefined,
    isOnline: undefined,
    category: undefined,
    excludeSelf: undefined,
  };
  getList();
}

async function getList() {
  loading.value = true;
  const res = await serverManagePage(queryParams.value);
  if (res.success) {
    tableList.value = res.data;
    total.value = res.total;
  }
  loading.value = false;
}

onMounted(() => {
  getList();
})
</script>

<style scoped>

</style>
