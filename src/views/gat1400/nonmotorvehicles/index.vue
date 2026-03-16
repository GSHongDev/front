<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备编码" prop="deviceId">
        <el-input
            v-model="queryParams.deviceId"
            placeholder="请输入设备编码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据时间" style="width: 500px;">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nonmotorvehiclesList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="非机动车标识" align="center" prop="nonMotorVehicleId" />
      <el-table-column label="设备编码" align="center" prop="deviceId" />
      <el-table-column label="左上角X坐标" align="center" prop="leftTopX" />
      <el-table-column label="左上角Y坐标" align="center" prop="leftTopY" />
      <el-table-column label="右下角X坐标" align="center" prop="rightBtmX" />
      <el-table-column label="右下角Y坐标" align="center" prop="rightBtmY" />
      <el-table-column label="车辆出现时间" align="center" prop="appearTime" />
      <el-table-column label="车牌号" align="center" prop="plateNo" />
      <el-table-column label="车身颜色" align="center" prop="vehicleColor" />
      <el-table-column label="车辆款型" align="center" prop="vehicleType" />
      <el-table-column label="车辆品牌" align="center" prop="vehicleBrand" />
      <el-table-column label="车辆长度" align="center" prop="vehicleLength" />
      <el-table-column label="车辆款型" align="center" prop="vehicleType" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
<!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:config:edit']" >修改</el-button>-->
<!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:config:remove']">删除</el-button>-->
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
  </div>
</template>

<script setup name="Nonmotorvehicles">
import {nonmotorvehiclesPage} from "../../../api/gat1400/nonmotorvehicles.js";

const { proxy } = getCurrentInstance();


const loading = ref(true);
const showSearch = ref(true);
const nonmotorvehiclesList = ref([]);
const total = ref(0);
const dateRange = ref([]);


const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: null,
    startTime: null,
    endTime: null,
  },
});

const { queryParams} = toRefs(data);

/** 查询列表 */
function getList() {
  loading.value = true;
  if(dateRange.value.length > 0){
    queryParams.value.startTime = dateRange.value[0]
    queryParams.value.endTime = dateRange.value[1]
  }
  nonmotorvehiclesPage(queryParams.value).then(response => {
    nonmotorvehiclesList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm("queryRef");
  handleQuery();
}

getList();
</script>

<style scoped>

</style>