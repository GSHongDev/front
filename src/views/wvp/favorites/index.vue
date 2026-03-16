<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="收藏夹名称" prop="favoritesName">
        <el-input
          v-model="queryParams.favoritesName"
          placeholder="请输入收藏夹名称"
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
          v-hasPermi="['wvp:favorites:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wvp:favorites:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wvp:favorites:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['wvp:favorites:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="favoritesList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="收藏夹名称" align="center" prop="favoritesName" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wvp:favorites:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wvp:favorites:remove']">删除</el-button>
          <el-button link type="primary" icon="VideoCamera" @click="handleCamera(scope.row)" v-hasPermi="['wvp:favoritesChannel:list']">设备</el-button>
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

    <el-dialog title="播放视频" v-model="openPlay" width="1000px" append-to-body>
      <div class="player" v-if="openPlay">
        <Jessibuca v-if="openPlay" ref="flv" :visible.sync="showVideoDialog"
                   :videoUrl="flv" :error="videoError" :message="videoError" height="100px"
                   :hasAudio="hasAudio" fluent autoplay live></Jessibuca>
      </div>
    </el-dialog>

    <!-- 添加或修改国标通道收藏对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="favoritesRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="收藏夹名称" prop="favoritesName">
          <el-input v-model="form.favoritesName" placeholder="请输入收藏夹名称" maxlength="30" show-word-limit />
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

<script setup name="Favorites">
import { listFavorites, getFavorites, delFavorites, addFavorites, updateFavorites } from "@/api/wvp/favorites";
import {listFavoritesChannel} from "@/api/wvp/favoritesChannel.js";
import {checkPermi} from "@/utils/permission";
import {sendDevicePush} from "@/api/wvp/channel.js";
import Jessibuca from "@/components/jessibuca/index.vue";

const { proxy } = getCurrentInstance();

const favoritesList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    favoritesName: null,
  },
  rules: {
    favoritesName: [{ required: true, message: '收藏夹名称不能为空', trigger: 'blur' }],
  }
});

const { queryParams, form, rules } = toRefs(data);

const queryParamsCamera = ref({
  pageNum: 1,
  pageSize: 10,
  favoritesId: null,
});
const listCamera = ref([]);
const openCamera = ref(false);
const openPlay = ref(false);
const loadingCamera = ref(true);
const totalCamera = ref(0);
const flv = ref("");
const showVideoDialog = ref(false);
const hasAudio = ref(false);

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

const videoError = (e) => {
  console.log("播放器错误：" + JSON.stringify(e));
}

function getCameraList(){
  listFavoritesChannel(queryParamsCamera.value).then(res => {
    listCamera.value = res.rows;
    totalCamera.value = res.total;
    loadingCamera.value = false;
  })
}

function handleCamera(row){
  loadingCamera.value = true;
  queryParamsCamera.value.favoritesId = row.id;
  getCameraList();
  openCamera.value = true;
}

/** 查询国标通道收藏列表 */
function getList() {
  loading.value = true;
  listFavorites(queryParams.value).then(response => {
    favoritesList.value = response.rows;
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
    favoritesName: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("favoritesRef");
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
  title.value = "添加国标通道收藏";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFavorites(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改国标通道收藏";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["favoritesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFavorites(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFavorites(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除国标通道收藏编号为"' + _ids + '"的数据项？').then(function() {
    return delFavorites(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('wvp/favorites/export', {
    ...queryParams.value
  }, `favorites_${new Date().getTime()}.xlsx`)
}

getList();

</script>

<style scoped>
.player {
  width: 100%;
  height: 450px;
}
</style>
