<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="设备标识" prop="apeId">
          <el-input v-model="queryParams.apeId" placeholder="请输入设备标识" clearable/>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="是否在线" prop="isOnline">
          <el-select v-model="queryParams.isOnline" clearable placeholder="请选择是否在线" style="width: 180px;">
            <el-option label="在线" value="1" />
            <el-option label="离线" value="2" />
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
              v-hasPermi="['viid:apedevice:add']"
          >新增
          </el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tableList" border>
        <template v-for="(item, index) in tableColumns">
          <el-table-column v-if="item.show" :key="index" :prop="item.prop" :label="item.label" :formatter="item.formatter"
                           align="center" show-overflow-tooltip />
        </template>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['viid:apedevice:edit']">修改
            </el-button>
            <el-button link type="primary" icon="Box" @click="handleGather(scope.row)"
                       v-hasPermi="['viid:apedevice:gather']">采集列表
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       style="color: #f56c6c"
                       v-hasPermi="['viid:apedevice:remove']">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />

      <DeviceDialog
          v-model="open"
          :form-data="form"
          :is-add="addAndUpdate"
          :title="title"
          @submit="handleSubmit"
      />

    </el-card>
  </div>
</template>

<script setup name="DeviceManage">
import { h } from 'vue';
import { ElTag } from 'element-plus';
import {pageApeDevice, getApeDevice, delApeDevices, addApeDevice, updateApeDevice} from "@/api/gat1400/apedevice.js";
import {getServerOptions} from "@/api/gat1400/viidutils.js";
import DeviceDialog from './components/DeviceDialog.vue';

const {proxy} = getCurrentInstance();
const router = useRouter();

const loading = ref(true);
const open = ref(false);
const title = ref("");
const tableList = ref([]);
const serverOptions = ref([]);
const total = ref(0);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  apeId: '',
  name: '',
  isOnline: null
});
const showSearch = ref(true);
const addAndUpdate = ref(false);
const form = ref({});
const tableColumns = ref([
  { prop: 'apeId', label: '设备标识', show: true },
  { prop: 'name', label: '设备名称', show: true },
  { prop: 'model', label: '设备型号', show: true },
  { prop: 'ipAddr', label: '设备地址', show: true },
  { prop: 'port', label: '设备端口', show: true },
  { prop: 'longitude', label: '经度', show: true },
  { prop: 'latitude', label: '纬度', show: true },
  { prop: 'placeCode', label: '位置编码', show: true },
  { prop: 'isOnline', label: '是否在线', show: true, formatter: onlineFormatter },
  { prop: 'userId', label: '用户标识', show: true },
  { prop: 'password', label: '口令', show: true }
]);
const rules = ref({
  apeId: [{ required: true, message: '设备标识不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
  longitude: [{ required: true, message: '卡口经度不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '卡口纬度不能为空', trigger: 'blur' }],
  placeCode: [{ required: true, message: '位置编码不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '用户标识不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '口令不能为空', trigger: 'blur' }],
  ipAddr: [{ required: true, message: '设备地址不能为空', trigger: 'blur' }],
  port: [{ required: true, message: '设备端口不能为空', trigger: 'blur' }]
});

function handleGather(row){
  let data = {
    apeId: row.apeId,
    name: row.name,
    model: row.model,
    port: row.port,
  }
  router.push({
    path: '/gat1400/gatherList',
    query: data
  });
}

function handleSubmit(data) {
  const request = addAndUpdate.value ? addApeDevice(data) : updateApeDevice(data);
  request.then(response => {
    if (response.success) {
      proxy.$modal.msgSuccess("操作成功");
      getList();
      open.value = false;
    }
  }).catch(() => {
    loading.value = false;
  });
}

async function submitForm() {
  proxy.$refs["deviceManageRef"].validate(valid => {
    if (valid) {
      if (addAndUpdate.value){
        addApeDevice(form.value).then(response => {
          if(response.success){
            proxy.$modal.msgSuccess("操作成功");
            getList();
            cancel();
          }
        });
      } else {
        updateApeDevice(form.value).then(response => {
          if(response.success){
            proxy.$modal.msgSuccess("操作成功");
            getList();
            cancel();
          }
        });
      }
    }
  });
}

function onlineFormatter(row, column, cellValue) {
  if (cellValue === '1') {
    return h(ElTag, { type: 'success' }, { default: () => '在线' })
  } else {
    return h(ElTag, { type: 'warning' }, { default: () => '离线' })
  }
}

function cancel() {
  form.value = {};
  open.value = false;
  addAndUpdate.value = false;
}

function handleAdd() {
  addAndUpdate.value = true;
  form.value = {};
  open.value = true;
  title.value = "APE设备新增";
}

const getServe = async (keyword, id) => {
  const res = await getServerOptions({serverName: keyword, serverId: id});
  serverOptions.value = res.data;
}

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除APE设备编号为"' + row.apeId + '"的数据项？').then(function () {
    delApeDevices(row.apeId).then(response => {
      if (response.success) {
        proxy.$modal.msgSuccess('删除成功')
        getList()
      }
    })
  });
}

function handleUpdate(row) {
  getApeDevice(row.apeId).then(res => {
    addAndUpdate.value = false;
    form.value = res.data;
    open.value = true;
    title.value = "修改APE设备";
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
    apeId: '',
    name: '',
    isOnline: null
  }
  getList();
}

async function getList(){
  loading.value = true;
  const res = await pageApeDevice(queryParams.value);
  if (res.success) {
    tableList.value = res.data;
    total.value = res.total;
  }
  loading.value = false;
}

onMounted(() => {
  getList();
  getServe();
});
</script>

<style scoped>

</style>
