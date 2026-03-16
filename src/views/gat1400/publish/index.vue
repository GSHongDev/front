<template>
  <div class="app-container">
    <el-card>
      <el-form ref="queryForm" :model="queryParams" :inline="true" v-show="showSearch">
        <el-form-item label="订阅标题" prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入订阅标题" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
          v-loading="loading"
          :data="tableList"
          border
          tooltip-effect="dark"
      >
        <el-table-column prop="subscribeId" label="订阅标识符" align="center" show-overflow-tooltip/>
        <el-table-column prop="title" label="订阅标题" align="center" show-overflow-tooltip/>
        <el-table-column prop="subscribeDetail" label="订阅类型" align="center" show-overflow-tooltip/>
        <el-table-column prop="resourceUri" label="资源列表" align="center" show-overflow-tooltip/>
        <el-table-column prop="beginTime" label="订阅时间" align="center" show-overflow-tooltip>
          <template #default="scope">
            <div>{{ scope.row.beginTime }}至{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="applicationName" label="申请信息" align="center" show-overflow-tooltip>
          <template #default="scope">
            <div>
              申请单位:{{ scope.row.applicationOrg }},申请人:{{ scope.row.applicationOrg }},理由:{{ scope.row.reason }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="receiveAddr" label="订阅回调地址" align="center" show-overflow-tooltip/>
        <el-table-column prop="description" label="任务描述" align="center" show-overflow-tooltip/>
        <el-table-column prop="progress" label="推送进度" align="center" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.metric">
              <el-progress :percentage="scope.row.metric.percentage" color="#e6a23c"></el-progress>
              共{{ scope.row.metric.maxOffset }}/已推{{ scope.row.metric.curOffset }}
            </div>
            <div v-else>暂无进度</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template #default="scope">
            <div style="display:flex; align-items: center;justify-content: center">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                         v-hasPermi="['viid:publish:edit']">修改
              </el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                         style="color: #f56c6c"
                         v-hasPermi="['viid:publish:remove']">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
        <el-form ref="SubscribeRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="订阅节点" prop="serverId">
            <el-select v-model="form.serverId" placeholder="请选择订阅节点">
              <el-option v-for="server in serverOptions" :key="server.id" :label="server.label"
                         :value="server.value" :disabled="server.data === '0'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订阅标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入订阅标题" />
          </el-form-item>
          <el-form-item label="订阅类型" prop="subscribeDetail">
            <el-select v-model="form.subscribeDetail" placeholder="请选择订阅类型">
              <el-option v-for="item in subscribeDatailOptions" :key="item.id" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源列表" prop="resourceUri">
            <el-select v-model="form.resourceUri" multiple placeholder="请选择资源列表" style="width: 100%;">
              <el-option v-for="item in serverOptions" :key="item.id" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片格式" prop="resultImageDeclare">
            <el-select v-model="form.resultImageDeclare" placeholder="请选择图片格式">
              <el-option label="Base64" value="1" />
              <el-option label="URL" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="订阅回调地址" prop="receiveAddr">
            <el-input v-model="form.receiveAddr" placeholder="请输入订阅回调地址" />
          </el-form-item>
          <el-form-item label="下发间隔(秒)" prop="reportInterval">
            <el-input type="number" v-model="form.reportInterval" placeholder="请输入数据上报间隔" />
          </el-form-item>
          <el-form-item label="申请人" prop="applicationName">
            <el-input v-model="form.applicationName" placeholder="请输入申请人" />
          </el-form-item>
          <el-form-item label="申请单位" prop="applicationOrg">
            <el-input v-model="form.applicationOrg" placeholder="请输入申请单位" />
          </el-form-item>
          <el-form-item label="理由" prop="reason">
            <el-input v-model="form.reason" placeholder="请输入理由" />
          </el-form-item>
          <el-form-item label="订阅时间">
            <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                start-placeholder="订阅开始时间"
                end-placeholder="订阅结束时间"
            />
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

<script setup name="Publish">

import {delPublishs, getPublish, pagePublish, updatePublish} from "@/api/gat1400/publish.js";
import {getServerOptions, getSubscribeDetailOptions} from "@/api/gat1400/viidutils.js";

const {proxy} = getCurrentInstance();

const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  title: "",
});
const serverOptions = ref([]);
const subscribeDatailOptions = ref([]);
const tableList = ref([]);
const rules = ref({
  serverId: [{ required: true, message: '视图库节点不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '订阅标题不能为空', trigger: 'blur' }],
  subscribeDetail: [{ required: true, message: '订阅类型不能为空', trigger: 'blur' }],
  resourceUri: [{ required: true, message: '资源列表不能为空', trigger: 'blur' }]
});
const form = ref({});
const total = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const open = ref(false);
const title = ref("");
const value1 = ref([]);

function submitForm(){
  proxy.$refs["SubscribeRef"].validate(valid => {
    if (valid){
      form.value.beginTime = value1.value[0];
      form.value.endTime = value1.value[1];
      updatePublish(form.value).then(() => {
        open.value = false;
        proxy.$modal.msgSuccess("操作成功");
        getList();
      });
    }
  });
}

function handleUpdate(row) {
  getPublish(row.subscribeId).then(response => {
    const data = response.data
    data.resourceUri = data.resourceUri ? data.resourceUri.split(',') : []
    form.value = data;
    getDetails();
    value1.value[0] = form.value.beginTime;
    value1.value[1] = form.value.endTime;
    title.value = "编辑推送";
    open.value = true;
  })
}

function getDetails(){
  getServerOptions().then(response => {
    serverOptions.value = response.data;
  });
  getSubscribeDetailOptions().then(response => {
    subscribeDatailOptions.value = response.data;
  });
}

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除推送编号为"' + row.subscribeId + '"的数据项？').then(function () {
    delPublishs(row.subscribeId).then(() => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    })
  });
}

function cancel() {
  open.value = false;
}


function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 20,
    title: "",
  };
  getList();
}

async function getList() {
  loading.value = true;
  const res = await pagePublish(queryParams.value);
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
