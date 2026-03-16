<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标记名称" prop="markName">
        <el-input
          v-model="queryParams.markName"
          placeholder="请输入标记名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['wvp:mark:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wvp:mark:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wvp:mark:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['wvp:mark:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="markList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="标记名称" align="center" prop="markName" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wvp:mark:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wvp:mark:remove']">删除</el-button>
          <el-button link type="primary" icon="VideoCamera" @click="handleCamera(scope.row)" v-hasPermi="['wvp:wvpMarkChannel:list']">设备</el-button>
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

    <el-dialog title="收藏设备" v-model="openCamera" width="1000px" append-to-body>
      <el-table v-loading="loadingCamera" :data="listCamera" border>
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="gbName" />
        <el-table-column label="设备ID" align="center" prop="gbParentid" />
        <el-table-column label="通道ID" align="center" prop="gbDeviceid" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-if="checkPermi(['wvp:play:start'])"
                       icon="VideoPlay" type="text" @click="start(scope.row)">
              播放
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="totalCamera>0"
          :total="totalCamera"
          v-model:page="queryParamsCamera.pageNum"
          v-model:limit="queryParamsCamera.pageSize"
          @pagination="getCameraList"
      />
    </el-dialog>

    <el-dialog title="标记设备" v-model="openCamera" width="1000px" append-to-body>
      <el-table v-loading="loadingCamera" :data="listCamera" border>
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="gbName" />
        <el-table-column label="设备ID" align="center" prop="gbParentid" />
        <el-table-column label="通道ID" align="center" prop="gbDeviceid" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button v-if="checkPermi(['wvp:play:start'])"
                       icon="VideoPlay" type="text" @click="start(scope.row)">
              播放
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="totalCamera>0"
          :total="totalCamera"
          v-model:page="queryParamsCamera.pageNum"
          v-model:limit="queryParamsCamera.pageSize"
          @pagination="getCameraList"
      />
    </el-dialog>

    <el-dialog title="播放视频" v-model="openPlay" width="1000px" append-to-body>
      <div class="player" v-if="openPlay">
        <Jessibuca v-if="openPlay" ref="flv" :visible.sync="showVideoDialog"
                   :videoUrl="flv" :error="videoError" :message="videoError" height="100px"
                   :hasAudio="hasAudio" fluent autoplay live></Jessibuca>
      </div>
    </el-dialog>


    <!-- 添加或修改wvp通道标记对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="markRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标记名称" prop="markName">
          <el-input v-model="form.markName" placeholder="请输入标记名称" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="200" show-word-limit />
        </el-form-item>
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

<script setup name="Mark">
import { listMark, getMark, delMark, addMark, updateMark } from "@/api/wvp/mark";
import {listWvpMarkChannel} from "@/api/wvp/wvpMarkChannel.js";
import {checkPermi} from "@/utils/permission";
import {sendDevicePush} from "@/api/wvp/channel.js";
import Jessibuca from "@/components/jessibuca/index.vue";

const { proxy } = getCurrentInstance();

const markList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const queryParamsCamera = ref({
  pageNum: 1,
  pageSize: 10,
  markId: null,
});
const listCamera = ref([]);
const openCamera = ref(false);
const openPlay = ref(false);
const loadingCamera = ref(true);
const totalCamera = ref(0);
const flv = ref("");
const showVideoDialog = ref(false);
const hasAudio = ref(false);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    markName: null,
  },
  rules: {
    markName: [
      { required: true, message: "标记照片不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

function handleCamera(row){
  loadingCamera.value = true;
  queryParamsCamera.value.markId = row.id;
  getCameraList();
  openCamera.value = true;
}

async function start(row){
  const params = {
    deviceId: row.gbParentid,
    channelId: row.gbDeviceid
  }
  const res = await sendDevicePush(params);
  if (location.protocol === "https:") {
    flv.value = res.data.https_flv;
  } else {
    flv.value = res.data.flv;
  }
  openCamera.value = false;
  openPlay.value = true;
}

function getCameraList(){
  listWvpMarkChannel(queryParamsCamera.value).then(res => {
    listCamera.value = res.rows;
    totalCamera.value = res.total;
    loadingCamera.value = false;
  });
}

/** 查询wvp通道标记列表 */
function getList() {
  loading.value = true;
  listMark(queryParams.value).then(response => {
    markList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    markName: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("markRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加wvp通道标记";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMark(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改wvp通道标记";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["markRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMark(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMark(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除wvp通道标记编号为"' + _ids + '"的数据项？').then(function() {
    return delMark(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wvp/mark/export', {
    ...queryParams.value
  }, `mark_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
.player {
  width: 100%;
  height: 450px;
}
</style>
