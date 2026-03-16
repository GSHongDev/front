<template>
  <div>
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="设备编码" prop="deviceId">
          <el-input v-model="queryParams.deviceId" placeholder="请输入客户端名称" clearable disabled />
        </el-form-item>
        <el-form-item label="数据时间">
          <el-date-picker v-model="queryParams.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择开始时间" align="center">
          </el-date-picker>
          <el-date-picker v-model="queryParams.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择结束时间" align="center">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tableList" border>
        <template v-for="(item, index) in tableColumns">
          <el-table-column v-if="item.show" :key="index" :prop="item.prop" :label="item.label"
                           :formatter="item.formatter" align="center" show-overflow-tooltip />
        </template>
        <el-table-column label="图片列表" align="center" show-overflow-tooltip>
          <template #default="scope">
            <el-row>
              <el-col :span="12" v-for="(image, index) in scope.row.subImageList.SubImageInfoObject" :key="index">
                <image-preview :src="loadImagePath(image)" :width="50" :height="50"/>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="100">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       style="color: #f56c6c"
                       v-hasPermi="['viid:face:remove']">删除
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
  </div>
</template>

<script setup name="GatherFaceManage">

import {delFaces, pageFace} from "@/api/gat1400/face.js";

const {proxy} = getCurrentInstance();
const props = defineProps({
  deviceId: {
    type: String,
    default: ''
  }
});

const form = ref({});
const showSearch = ref(true);
const loading = ref(true);
const open = ref(false);
const tableList = ref([]);
const total = ref(0);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  deviceId: props.deviceId,
  startTime: null,
  endTime: null
});


const tableColumns = ref([
  { prop: 'deviceId', label: '设备编码', show: true },
  { prop: 'genderCode', label: '性别', show: true },
  { prop: 'ageUpLimit', label: '年龄', show: true },
  { prop: 'faceAppearTime', label: '人脸出现时间', show: true },
  { prop: 'faceDisAppearTime', label: '人脸消失时间', show: true },
]);

function handleDelete(row) {
  proxy.$modal.confirm('是否确认人脸编号为"' + row.id + '"的数据项？').then(function () {
    delFaces(row.id).then(response => {
      if (response.success) {
        proxy.$modal.msgSuccess('删除成功');
        getList();
      }
    })
  });
}


function loadImagePath(image) {
  if (image) {
    return image.StoragePath
  }
  return null
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    deviceId: props.deviceId,
    startTime: null,
    endTime: null
  }
  getList();
}


async function getList(){
  loading.value = true;
  console.log(queryParams.value)
  const res = await pageFace(queryParams.value);
  tableList.value = res.data;
  total.value = res.total;
  loading.value = false;
}

onMounted(() => {
  getList();
})
</script>

<style scoped>

</style>
