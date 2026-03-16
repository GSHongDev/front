<template>
  <div class="app-container">
    <el-card>
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="卡口标识" prop="tollgateId">
          <el-select v-model="queryParams.tollgateId" clearable filterable remote :remote-method="loadTollgateOptions"
                     placeholder="请选择卡口" style="width: 180px;">
            <el-option v-for="item in tollgateOptions" :key="item.id" :value="item.value" :label="item.label"/>
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
                v-hasPermi="['viid:lane:add']"
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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="250">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['viid:lane:edit']">修改
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       style="color: #f56c6c"
                       v-hasPermi="['viid:lane:remove']">删除
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

    </el-card>

    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="laneManageRef" :model="form" :rules="rules" label-width="120px">
        <el-tooltip class="item" effect="dark" content="国标格式卡口编号(6位地区编码+0000121+7位随机数)设备唯一不可重复" placement="top">
          <el-form-item label="卡口编号" prop="tollgateId">
            <el-select v-model="form.tollgateId" clearable filterable remote :remote-method="loadTollgateOptions" placeholder="请选择卡口">
              <el-option v-for="item in tollgateOptions" :key="item.id" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-tooltip>
        <el-form-item label="车道ID" prop="laneId">
          <el-input type="number" v-model="form.laneId" placeholder="请输入车道ID" :disabled="!addAndUpdate"  />
        </el-form-item>
        <el-form-item label="车道编号" prop="laneNo">
          <el-input type="number" v-model="form.laneNo" placeholder="请输入车道编号"/>
        </el-form-item>
        <el-form-item label="车道名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车道名称" />
        </el-form-item>
        <el-form-item label="车道方向" prop="direction">
          <el-select v-model="form.direction" placeholder="请选择车道方向">
            <el-option value="1" label="东"></el-option>
            <el-option value="2" label="西"></el-option>
            <el-option value="3" label="南"></el-option>
            <el-option value="4" label="北"></el-option>
            <el-option value="5" label="东北"></el-option>
            <el-option value="6" label="西南"></el-option>
            <el-option value="7" label="东南"></el-option>
            <el-option value="8" label="西北"></el-option>
            <el-option value="9" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车道描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入车道描述" />
        </el-form-item>
        <el-form-item label="限速" prop="maxSpeed">
          <el-input type="number" v-model="form.maxSpeed" placeholder="请输入车道限速" />
        </el-form-item>
        <el-form-item label="出入城" prop="cityPass">
          <el-select v-model="form.cityPass" placeholder="请选择车道出入城">
            <el-option :value="1" label="进城"></el-option>
            <el-option :value="2" label="出城"></el-option>
            <el-option :value="3" label="非进出城"></el-option>
            <el-option :value="4" label="进出城混合"></el-option>
          </el-select>
        </el-form-item>
        <el-tooltip class="item" effect="dark" content="车道关联的设备编号" placement="top">
          <el-form-item label="关联采集设备" type="number" prop="apeId">
            <el-select v-model="form.apeId" clearable filterable remote :remote-method="loadDeviceOptions" placeholder="请选择关联采集设备">
              <el-option v-for="item in deviceOptions" :key="item.id" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-tooltip>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="LaneManage">
import {pageLane, delLanes, addLane, updateLane} from "@/api/gat1400/laneManage.js";
import {getDeviceOptions} from "@/api/gat1400/apedevice";
import {getTollgateOptions} from "@/api/gat1400/tollgateManage.js";

const {proxy} = getCurrentInstance();
const addAndUpdate = ref(false);
const loading = ref(true);
const open = ref(false);
const title = ref("");
const tableColumns = ref([
  {prop: 'tollgateId', label: '卡口', show: true},
  {prop: 'laneId', label: '车道ID', show: true},
  {prop: 'laneNo', label: '车道编号', show: true},
  {prop: 'name', label: '车道名称', show: true},
  {prop: 'direction', label: '车道方向', show: true},
  {prop: 'desc', label: '车道描述', show: true},
  {prop: 'maxSpeed', label: '限速', show: true},
  {prop: 'cityPass', label: '车道出入城', show: true},
  {prop: 'apeId', label: '设备编号', show: true}
]);
const tableList = ref([]);
const total = ref(0);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  tollgateId: '',
  name: '',
  orgCode: ''
});
const showSearch = ref(true);
const tollgateOptions = ref([]);
const deviceOptions = ref([]);
const form = ref({});
const rules = ref({
  tollgateId: [{ required: true, message: '卡口编号不能为空', trigger: 'blur' }],
  laneId: [{ required: true, message: '车道ID不能为空', trigger: 'blur' }],
  laneNo: [{ required: true, message: '车道编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '车道名称不能为空', trigger: 'blur' }],
  direction: [{ required: true, message: '车道方向不能为空', trigger: 'blur' }]
});
const loadDeviceOptions = (keyword, id) => {
  getDeviceOptions({name: keyword, apeId: id, pageNum: 1}).then(response => {
    deviceOptions.value = response.data.map(ele => {
      return {
        id: ele.apeId,
        value: ele.apeId,
        label: ele.name
      }
    })
  })
};

const loadTollgateOptions = (keyword, id) => {
  getTollgateOptions({name: keyword, tollgateId: id}).then(response => {
    tollgateOptions.value = response.data.map(ele => {
      return {
        id: ele.tollgateId,
        value: ele.tollgateId,
        label: ele.name
      }
    })
  })
}

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除视图库车道编号为"' + row.id + '"的数据项？').then(function () {
    delLanes(row.id).then(response => {
      if (response.success) {
        proxy.$modal.msgSuccess('删除成功')
        getList()
      }
    })
  });
}

function handleUpdate(row) {
  form.value = row;
  open.value = true;
  addAndUpdate.value = false;
  title.value = "修改视图库车道";
}

async function submitForm() {
  proxy.$refs["laneManageRef"].validate(valid => {
    if (valid) {
      if (addAndUpdate.value){
        addLane(form.value).then(response => {
          if(response.success){
            proxy.$modal.msgSuccess("操作成功");
            getList();
            cancel();
          }
        })
      } else {
        updateLane(form.value).then(response => {
          if(response.success){
            proxy.$modal.msgSuccess("操作成功");
            getList();
            cancel();
          }
        })
      }
    }
  });
}

function cancel() {
  form.value = {};
  open.value = false;
}
function handleAdd() {
  form.value = {
    cityPass: 1,
    direction: "1",
  };
  addAndUpdate.value = true;
  open.value = true;
  title.value = "新增视图库车道";
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    tollgateId: '',
    name: '',
    orgCode: ''
  }
  getList();
}

async function getList() {
  loading.value = true;
  const res = await pageLane(queryParams.value);
  loading.value = false;
  if (res.success) {
    tableList.value = res.data;
    total.value = res.total;
  }
}

onMounted(() => {
  getList();
  loadDeviceOptions();
});
</script>

<style scoped>

</style>
