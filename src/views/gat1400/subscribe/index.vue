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
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['viid:subscribe:add']"
          >新增订阅
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
        <el-table-column prop="subscribeId" label="订阅标识符" align="center" show-overflow-tooltip />
        <el-table-column prop="title" label="订阅标题" align="center" show-overflow-tooltip />
        <el-table-column prop="subscribeDetail" label="订阅类型" align="center" show-overflow-tooltip />
        <el-table-column prop="resourceUri" label="资源列表" align="center" show-overflow-tooltip />
        <el-table-column prop="beginTime" label="订阅时间" align="center" show-overflow-tooltip>
          <template #default="scope">
            <div>{{scope.row.beginTime}}至{{scope.row.endTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="applicationName" label="申请信息" align="center" show-overflow-tooltip >
          <template #default="scope">
            <div>申请单位:{{scope.row.applicationOrg}},申请人:{{scope.row.applicationOrg}},理由:{{scope.row.reason}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="receiveAddr" label="订阅回调地址" align="center" show-overflow-tooltip />
        <el-table-column prop="reportInterval" label="数据上报间隔" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       style="color: #f56c6c"
                       v-hasPermi="['viid:subscribe:remove']">删除
            </el-button>
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
          <el-form-item label="订阅回调地址" prop="receiveAddr">
            <el-input v-model="form.receiveAddr" placeholder="请输入订阅回调地址" />
          </el-form-item>
          <el-form-item label="数据上报间隔" prop="reportInterval">
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

<script setup name="Subscribe">

import {addSubscribe, delSubscribes, pageSubscribe} from "@/api/gat1400/subscribe.js";
import {getServerOptions, getSubscribeDetailOptions} from "@/api/gat1400/viidutils.js";

const {proxy} = getCurrentInstance();

const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  title: "",
})
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
const openServerId = ref(false);
const title = ref("");
const value1 = ref('')

function submitForm(){
  proxy.$refs["SubscribeRef"].validate(valid => {
    if (valid){
      form.value.beginTime = value1.value[0];
      form.value.endTime = value1.value[1];
      addSubscribe(form.value).then(() => {
        open.value = false;
        proxy.$modal.msgSuccess("操作成功");
        getList();
      });
    }
  });
}

function cancel(){
  open.value = false;
}

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除订阅编号为"' + row.subscribeId + '"的数据项？').then(function () {
    delSubscribes(row.subscribeId).then((response) => {
      const responseStatusObjects = response.ResponseStatusListObject?.ResponseStatusObject;
      if (responseStatusObjects) {
        for (let index in responseStatusObjects) {
          let responseStatusObject = responseStatusObjects[index];
          if (responseStatusObject.StatusCode == "0") {
            proxy.$modal.msgSuccess("删除成功");
          } else {
            proxy.$modal.msgError(
                "取消订阅失败:" + responseStatusObject.statusString
            );
          }
        }
        getList();
      } else {
        proxy.$modal.msgError("删除失败");
      }
    })
  });
}

function handleAdd() {
  form.value = {};
  getDetails();
  open.value = true;
  title.value = "新增订阅";
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function getDetails(){
  getServerOptions().then(response => {
    serverOptions.value = response.data;
  });
  getSubscribeDetailOptions().then(response => {
    subscribeDatailOptions.value = response.data;
  });
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
  const res = await pageSubscribe(queryParams.value);
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
