<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="乐橙配置">
        <el-select
            v-model="queryParams.configId"
            placeholder="乐橙配置"
            style="width: 240px"
            @change="handleQuery"
        >
          <el-option
              v-for="item in lcConfigList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关系类型">
        <el-select
            v-model="queryParams.source"
            placeholder="关系类型"
            style="width: 240px"
            @change="handleQuery"
        >
          <el-option label="绑定设备" value="bind"/>
          <el-option label="分享设备" value="share"/>
          <el-option label="绑定及分享设备" value="bindAndShare"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lecheng:lc:bindDevice']">
          绑定设备
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="single" @click="handleDelete"
                   v-hasPermi="['lecheng:lc:unBindDevice']"
        >解绑设备
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain icon="Collection" @click="unBindDeviceInfoFun()" v-hasPermi="['lecheng:lc:unBindDeviceInfo']"
        >未绑定设备信息获取
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain icon="Money" @click="checkDeviceBindOrNotFun()"
                   v-hasPermi="['lecheng:lc:checkDeviceBindOrNot']"
        >设备绑定情况
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left"/>
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="设备序列号" align="center" prop="deviceId" width="100"/>
      <el-table-column label="设备型号" align="center" prop="deviceModel"/>
      <el-table-column label="有新版本升级" align="center" prop="canBeUpgrade">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.canBeUpgrade">是</el-tag>
          <el-tag type="primary" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="接入类型" align="center" prop="accessType" width="150">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.accessType === 'PaaS'">Paas程序接入</el-tag>
          <el-tag type="primary" v-if="scope.row.accessType === 'Lechange'">乐橙非PaaS设备</el-tag>
          <el-tag type="primary" v-if="scope.row.accessType === 'Easy4IP'">Easy4IP程序设备</el-tag>
          <el-tag type="primary" v-if="scope.row.accessType === 'P2P'">P2P程序设备</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备版本号" align="center" prop="deviceVersion"/>
      <!--      <el-table-column label="设备播放码" align="center" prop="playToken"/>-->
      <el-table-column label="设备品牌信息" align="center" prop="brand">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.brand === 'lechange'">乐橙设备</el-tag>
          <el-tag type="primary" v-if="scope.row.brand === 'general'">通用设备</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备加密模式" align="center" prop="encryptMode">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.encryptMode === '0'">加密</el-tag>
          <el-tag type="primary" v-if="scope.row.encryptMode === '1'">自定义加密</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.deviceStatus === 'online'">在线</el-tag>
          <el-tag type="danger" v-if="scope.row.deviceStatus === 'offline'">离线</el-tag>
          <el-tag type="warning" v-if="scope.row.deviceStatus === 'sleep'">休眠</el-tag>
          <el-tag type="primary" v-if="scope.row.deviceStatus === 'upgrading'">升级中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备大类" align="center" prop="catalog"/>
      <el-table-column label="最大支持通道数" align="center" prop="channelNum"/>
      <el-table-column label="权限类型" align="center" prop="source"/>
      <el-table-column label="最后离线时间" align="center" prop="lastOffLineTime">
        <template #default="scope">
          {{ formatTime(scope.row.lastOffLineTime) }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="是否为子设备" align="center" prop="isSubDevice"/>-->
      <!--      <el-table-column label="设备能力集" align="center" prop="deviceAbility"/>-->
      <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="getListDeviceDetailsByIds(scope.row)"
                     v-hasPermi="['lecheng:lc:listDeviceDetailsByIds']">通道
          </el-button>
          <el-button link type="primary" @click="getDeviceOnline(scope.row)"
                     v-hasPermi="['lecheng:lc:deviceOnline']">在线状态
          </el-button>
          <el-button link type="primary" @click="deviceControlFun(scope.row)"
                     v-hasPermi="['lecheng:lc:deviceTime','lecheng:lc:restartDevice']">设备控制
          </el-button>
          <el-button link type="primary" @click="deviceSdFun(scope.row)"
                     v-hasPermi="['lecheng:lc:deviceStorage','lecheng:lc:recoverSDCard','lecheng:lc:deviceSdcardStatus']">
            设备SD卡
          </el-button>
          <el-button link type="primary" @click="modifyDeviceNameFun(scope.row)"
                     v-hasPermi="['lecheng:lc:modifyDeviceName']">修改名称
          </el-button>
          <el-button link type="primary" @click="modifyPasswordFun(scope.row)"
                     v-hasPermi="['lecheng:lc:modifyPassword']">修改密码
          </el-button>
          <el-button link type="primary" @click="openUpgradeDeviceFun(scope.row)"
                     v-hasPermi="['lecheng:lc:upgradeDevice']">设备升级
          </el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)"
                     v-hasPermi="['lecheng:lc:unBindDevice']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageStart"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <el-dialog title="绑定设备" v-model="open" width="500px" append-to-body>
      <el-form ref="lcDeviceBindRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="设备序列号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备序列号" maxlength="32" show-word-limit/>
        </el-form-item>
        <el-form-item label="设备安全码或密码" prop="code">
          <template #label>
              <span>
                 <el-tooltip placement="top">
                   <template #content>
                     如果设备已设置了设备密码，则输入密码；<br/>
                                      如果设备未设置密码，请输入设备机身底部标签上的安全码；<br/>
                                      如果设备未设置密码且设备标签上也无安全码，则可不填。
                   </template>
                    <el-icon><question-filled/></el-icon>
                 </el-tooltip>
                设备安全码或密码
              </span>
          </template>
          <el-input v-model="form.code" placeholder="请输入设备安全码或密码" maxlength="32" show-word-limit/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设备在线状态" v-model="openDeviceOnline" width="500px" append-to-body>
      设备在线状态
      <el-descriptions
          style="margin-top: 10px"
          :column="2"
          border
      >
        <el-descriptions-item label="设备序列号">
          {{ deviceStatus.deviceId }}
        </el-descriptions-item>
        <el-descriptions-item label="在线状态">
          <el-tag type="danger" v-if="deviceStatus.onLine === '0'">不在线</el-tag>
          <el-tag type="success" v-if="deviceStatus.onLine === '1'">在线</el-tag>
          <el-tag type="primary" v-if="deviceStatus.onLine === '3'">升级中</el-tag>
          <el-tag type="warning" v-if="deviceStatus.onLine === '4'">休眠</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider/>
      通道在线状态
      <el-table :data="deviceStatus.channels" style="margin-top: 10px">
        <el-table-column label="设备通道号" align="center" prop="channelId"/>
        <el-table-column label="在线状态" align="center" prop="onLine" border>
          <template #default="scope">
            <el-tag type="danger" v-if="deviceStatus.onLine === '0'">不在线</el-tag>
            <el-tag type="success" v-if="deviceStatus.onLine === '1'">在线</el-tag>
            <el-tag type="primary" v-if="deviceStatus.onLine === '3'">升级中</el-tag>
            <el-tag type="warning" v-if="deviceStatus.onLine === '4'">休眠</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="未绑定设备信息获取" v-model="openUnBindDeviceInfo" width="900px" append-to-body>
      <el-form :model="unBindDeviceInfoForm" ref="unBindDeviceInfoRef" :inline="true" label-width="120px"
               :rules="unBindDeviceInfoRules">
        <el-form-item label="设备序列号" prop="deviceId">
          <el-input v-model="unBindDeviceInfoForm.deviceId" placeholder="请输入设备序列号"/>
        </el-form-item>
        <el-form-item label="设备二维码型号" prop="deviceCodeModel">
          <el-input v-model="unBindDeviceInfoForm.deviceCodeModel" placeholder="请输入设备二维码型号"/>
        </el-form-item>
        <el-form-item label="设备市场型号" prop="deviceModelName">
          <el-input v-model="unBindDeviceInfoForm.deviceModelName" placeholder="请输入设备市场型号"/>
        </el-form-item>
        <el-form-item label="设备配网能力" prop="ncCode">
          <el-input v-model="unBindDeviceInfoForm.ncCode" placeholder="请输入设备配网能力"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUnBindDeviceInfo">获 取</el-button>
        </el-form-item>
      </el-form>
      <el-divider/>
      <el-descriptions
          style="margin-top: 10px"
          :column="2"
          border
      >
        <el-descriptions-item label="平台是否支持该设备">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.support">支持</el-tag>
            <el-tag type="danger" v-else>不支持</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备在平台是否存在">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.deviceExist === 'exist'">存在</el-tag>
            <el-tag type="danger" v-if="unBindDeviceInfoData.deviceExist === 'notExist'">不存在</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备状态">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.status === 'online'">在线</el-tag>
            <el-tag type="danger" v-if="unBindDeviceInfoData.status === 'offline'">离线</el-tag>
            <el-tag type="warning" v-if="unBindDeviceInfoData.status === 'sleep'">休眠</el-tag>
            <el-tag type="primary" v-if="unBindDeviceInfoData.status === 'upgrading'">升级中</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备绑定情况">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.bindStatus === 'unbind'">设备未绑定</el-tag>
            <el-tag type="primary" v-else>设备已绑定</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备是否支持用户自选可用的配网方式">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.wifiConfigModeOptional">支持自选</el-tag>
            <el-tag type="primary" v-else>不支持自选</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备无线支持频段的序列">
          <span v-if="unBindDeviceInfoData">{{ unBindDeviceInfoData.wifiTransferMode }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="设备上报型号">
          <span v-if="unBindDeviceInfoData">{{ unBindDeviceInfoData.deviceCodeModel }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="设备市场型号">
          <span v-if="unBindDeviceInfoData">{{ unBindDeviceInfoData.deviceModelName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="设备大类">
          <span v-if="unBindDeviceInfoData">{{ unBindDeviceInfoData.catalog }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="硬件类型">
          <div v-if="unBindDeviceInfoData">
            <el-tag type="success" v-if="unBindDeviceInfoData.type === 'device'">设备</el-tag>
            <el-tag type="primary" v-if="unBindDeviceInfoData.type === '配件'">不支持自选</el-tag>
          </div>
        </el-descriptions-item>

      </el-descriptions>
    </el-dialog>

    <el-dialog title="查询设备绑定情况" v-model="openCheckDeviceBindOrNot" width="500px" append-to-body>
      <el-descriptions
          :column="2"
          border
      >
        <el-descriptions-item label="是否被绑定到某个账号">
          <el-tag type="success" v-if="checkDeviceBindOrNotData.isBind">已被绑定</el-tag>
          <el-tag type="primary" v-else>未被绑定</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否属于当前账号">
          <el-tag type="success" v-if="checkDeviceBindOrNotData.isMine">属于当前账号</el-tag>
          <el-tag type="primary" v-else>不属于当前账号</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="设备升级" v-model="openUpgradeDevice" width="800px" append-to-body>
      <el-button type="primary" @click="upgradeDeviceFun" v-hasPermi="['lecheng:lc:upgradeDevice']">升 级</el-button>
      <el-button type="primary" @click="upgradeProcessDeviceFun" v-hasPermi="['lecheng:lc:upgradeProcessDevice']">
        升级状态和进度
      </el-button>

      <el-divider/>

      <el-descriptions
          :column="2"
          border
      >
        <el-descriptions-item label="设备程序版本号">
          {{ upgradeProcessDeviceData.version }}
        </el-descriptions-item>
        <el-descriptions-item label="设备升级状态">
          <el-tag type="primary" v-if="upgradeProcessDeviceData.status === 'idle'">没在升级</el-tag>
          <el-tag type="primary" v-if="upgradeProcessDeviceData.status === 'downloading'">正在下载升级包</el-tag>
          <el-tag type="primary" v-if="upgradeProcessDeviceData.status === 'upgrading'">升级中</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备升级进度百分比">
          <el-progress type="dashboard" :percentage="parseInt(upgradeProcessDeviceData.percent)" :color="colors"/>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="修改密码" v-model="openModifyPassword" width="500px" append-to-body>
      <el-form ref="modifyPasswordRef" :model="modifyPasswordForm" :rules="modifyPasswordRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="modifyPasswordForm.oldPassword" placeholder="请输入原密码" maxlength="32" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="modifyPasswordForm.newPassword" placeholder="请输入新密码" maxlength="32" show-password/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="modifyPasswordSubmitForm">确 定</el-button>
          <el-button @click="modifyPasswordCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设备控制" v-model="deviceControlOpen" width="500px" append-to-body>
      <div>
        <el-button type="primary" @click="calibrationDeviceTimeFun">设置设备时间</el-button>
        <el-button type="primary" @click="getDeviceTimeFun">查询设备时间</el-button>
        设备时间：{{ deviceTime }}
      </div>
      <el-divider/>
      <el-button type="primary" @click="restartDeviceFun">重启设备</el-button>
    </el-dialog>

    <el-dialog title="设备SD卡" v-model="deviceSdOpen" width="500px" append-to-body>
      <div v-if="deviceStorageFrom.totalBytes && deviceStorageFrom.usedBytes">
        总容量：{{ formatBytes(deviceStorageFrom.totalBytes) }} <br/>
        已使用容量：{{ formatBytes(deviceStorageFrom.usedBytes) }}
      </div>
      <div>
        {{ deviceStorageMsg }}
      </div>
      <div style="margin-top: 10px">
        存储卡状态：
        <el-tag type="info" v-if="deviceStorageStatus === 'empty'">无SD卡</el-tag>
        <el-tag type="success" v-if="deviceStorageStatus === 'normal'">正常</el-tag>
        <el-tag type="danger" v-if="deviceStorageStatus === 'abnormal'">异常</el-tag>
        <el-tag type="primary" v-if="deviceStorageStatus === 'recovering'">格式化中</el-tag>
      </div>
      <el-button style="margin-top: 10px" type="primary" @click="recoverSDCardFun">设备SD卡格式化</el-button>
    </el-dialog>
  </div>
</template>

<script setup name="LcDevice">
import {
  bindDevice,
  calibrationDeviceTime,
  checkDeviceBindOrNot,
  deviceOnline,
  deviceSdcardStatus,
  deviceStorage,
  getDeviceTime,
  listDeviceDetailsByPage,
  modifyDeviceName,
  modifyPassword,
  recoverSDCard,
  restartDevice,
  unBindDevice,
  unBindDeviceInfo,
  upgradeDevice,
  upgradeProcessDevice,
  verifyPassword
} from "../../../api/lecheng/lc.js";
import {listLcConfigVo} from "../../../api/lecheng/lcConfig.js";
import router from "@/router";
import {ElMessageBox} from "element-plus";

const {proxy} = getCurrentInstance();

const loading = ref(true);
const showSearch = ref(true);
const lcConfigList = ref([]);
const deviceList = ref([]);
const total = ref(0);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const open = ref(false);

const deviceStatus = ref();
const openDeviceOnline = ref(false);

const unBindDeviceInfoData = ref(null);
const openUnBindDeviceInfo = ref(false);
const unBindDeviceInfoForm = ref({});
const unBindDeviceInfoRules = ref({
  deviceId: [{required: true, message: "请输入设备序列号", trigger: "blur"}],
});

const checkDeviceBindOrNotData = ref();
const openCheckDeviceBindOrNot = ref(false);

const upgradeDeviceForm = ref({
  configId: null,
  deviceId: null,
});
const openUpgradeDevice = ref(false);
const upgradeProcessDeviceData = ref({
  percent: 0,
  version: null,
  status: null,
});
const colors = [
  {color: '#f56c6c', percentage: 20},
  {color: '#e6a23c', percentage: 40},
  {color: '#5cb87a', percentage: 60},
  {color: '#1989fa', percentage: 80},
  {color: '#6f7ad3', percentage: 100},
]

const openModifyPassword = ref(false);
const modifyPasswordForm = ref({
  configId: null,
  deviceId: null,
  oldPassword: null,
  newPassword: null,
});
const modifyPasswordRules = ref({
  oldPassword: [{required: true, message: "请输入原密码", trigger: "blur"}],
  newPassword: [{required: true, message: "请输入新密码", trigger: "blur"}],
})

const deviceControlOpen = ref(false)
const deviceControlForm = ref({
  configId: null,
  deviceId: null,
})
const deviceTime = ref(null)


const deviceSdOpen = ref(false)
const deviceStorageStatus = ref(null)
const deviceStorageFrom = ref({})
const deviceStorageMsg = ref(null)


const deviceId = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    configId: null,
    pageSize: 10,
    page: 1,
    source: 'bindAndShare',
  },
  rules: {
    deviceId: [{required: true, message: "请输入设备序列号", trigger: "blur"}],
  }
});

const {queryParams, form, rules} = toRefs(data);

const formatTime = (raw) => {
  const match = raw.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
  if (!match) return raw;

  const [_, y, M, d, H, m, s] = match;
  const date = new Date(Date.UTC(y, M - 1, d, H, m, s));

  return new Date(date.getTime() + 8 * 3600000).toISOString().replace('T', ' ').substr(0, 19)
}

/**
 * 获取设备列表
 */
const getList = () => {
  loading.value = true;
  listDeviceDetailsByPage(queryParams.value).then(response => {
    if (response.result.code === '0') {
      deviceList.value = response.result.data.deviceList;
      total.value = response.result.data.count;
      loading.value = false;
    } else {
      proxy.$modal.msgError(response.result.msg);
    }
  })
}

/**
 * 获取乐橙配置列表
 */
const getListLcConfigVo = () => {
  listLcConfigVo().then(res => {
    if (res.data.length > 0) {
      queryParams.value.configId = res.data[0].id
      lcConfigList.value = res.data
      getList()
    } else {
      proxy.$modal.msgError("请先配置乐橙配置");
    }
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageStart = 0;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  proxy.resetForm("queryRef");
  handleQuery();
}

/**
 * 根据设备id获取通道列表
 */
const getListDeviceDetailsByIds = (row) => {
  if (row.deviceId) {
    let data = {
      deviceId: row.deviceId,
      configId: queryParams.value.configId,
    }
    router.push({
      path: '/lecheng/leChannel/index',
      query: data
    });
  }
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    configId: null,
    deviceId: null,
    code: null,
    encryptCode: null,
  };
  proxy.resetForm("lcDeviceBindRef");
}

/**
 * 绑定设备
 */
const handleAdd = () => {
  reset();
  form.value.configId = queryParams.value.configId;
  open.value = true;
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.deviceId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["lcDeviceBindRef"].validate(valid => {
    if (valid) {
      bindDevice(form.value).then(response => {
        if (response.result.code === '0') {
          proxy.$modal.msgSuccess("绑定成功");
          open.value = false;
          getListLcConfigVo()
        } else {
          proxy.$modal.msgError(response.result.msg);
        }
      })
    }
  })
}

/** 解绑设备按钮操作 */
function handleDelete(row) {
  const _ids = row.deviceId || ids.value[0];
  proxy.$modal.confirm('是否确认解绑设备设备序列号为"' + _ids + '"的数据项？').then(function () {
    let data = {
      configId: queryParams.value.configId,
      deviceId: _ids,
      productId: null,
      subDeviceId: null,
    }
    return unBindDevice(data);
  }).then(() => {
    getListLcConfigVo();
    proxy.$modal.msgSuccess("解绑设备成功");
  }).catch(() => {
  });
}

/**
 * 获取设备在线状态
 */
const getDeviceOnline = (row) => {
  let data = {
    configId: queryParams.value.configId,
    deviceId: row.deviceId,
  }

  deviceOnline(data).then(res => {
    if (res.result.code === '0') {
      deviceStatus.value = res.result.data
      openDeviceOnline.value = true
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 未绑定设备信息获取
 *
 * @param row
 */
const unBindDeviceInfoFun = (row) => {
  resetUnBindDeviceInfoForm()
  unBindDeviceInfoData.value = null
  unBindDeviceInfoForm.value.configId = queryParams.value.configId
  openUnBindDeviceInfo.value = true
}

// 表单重置
function resetUnBindDeviceInfoForm() {
  unBindDeviceInfoForm.value = {
    configId: null,
    deviceId: null,
    deviceCodeModel: null,
    deviceModelName: null,
    ncCode: null,
  };
  proxy.resetForm("unBindDeviceInfoRef");
}

const getUnBindDeviceInfo = () => {
  proxy.$refs["unBindDeviceInfoRef"].validate(valid => {
    if (valid) {
      unBindDeviceInfo(unBindDeviceInfoForm.value).then(response => {
        if (response.result.code === '0') {
          unBindDeviceInfoData.value = response.result.data
        } else {
          proxy.$modal.msgError(response.result.msg);
        }
      })
    }
  })
}

const checkDeviceBindOrNotFun = () => {
  ElMessageBox.prompt('请输入设备序列号', '温馨提示', {
    confirmButtonText: '查询',
    cancelButtonText: '取消',
  })
      .then(({value}) => {
        checkDeviceBindOrNot({
          configId: queryParams.value.configId,
          deviceId: value,
        }).then(response => {
          if (response.result.code === '0') {
            checkDeviceBindOrNotData.value = response.result.data
            openCheckDeviceBindOrNot.value = true
          } else {
            proxy.$modal.msgError(response.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

/**
 * 设备升级
 */
const openUpgradeDeviceFun = (row) => {
  upgradeProcessDeviceData.value = {
    percent: 0,
    version: null,
    status: null,
  }
  upgradeDeviceForm.value.configId = queryParams.value.configId
  upgradeDeviceForm.value.deviceId = row.deviceId
  openUpgradeDevice.value = true
}

const upgradeDeviceFun = () => {
  upgradeDevice(upgradeDeviceForm.value).then(response => {
    if (response.result.code === '0') {
      proxy.$modal.msgSuccess("操作成功");
    } else {
      proxy.$modal.msgError(response.result.msg);
    }
  })
}

const upgradeProcessDeviceFun = () => {
  upgradeProcessDevice(upgradeDeviceForm.value).then(response => {
    if (response.result.code === '0') {
      upgradeProcessDeviceData.value = response.result.data
    } else {
      proxy.$modal.msgError(response.result.msg);
    }
  })
}

const modifyDeviceNameFun = (row) => {
  ElMessageBox.prompt('请输入设备名称', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(({value}) => {
        modifyDeviceName({
          configId: queryParams.value.configId,
          deviceId: row.deviceId,
          name: value,
          channelId: null,
        }).then(response => {
          if (response.result.code === '0') {
            proxy.$modal.msgSuccess("修改成功");
            getListLcConfigVo()
          } else {
            proxy.$modal.msgError(response.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

const modifyPasswordFun = (row) => {
  modifyPasswordForm.value.configId = queryParams.value.configId
  modifyPasswordForm.value.deviceId = row.deviceId
  openModifyPassword.value = true
}

const modifyPasswordCancel = () => {
  modifyPasswordForm.value.configId = null
  modifyPasswordForm.value.deviceId = null
  modifyPasswordForm.value.oldPassword = null
  modifyPasswordForm.value.newPassword = null
  proxy.resetForm("modifyPasswordRef");
  openModifyPassword.value = true
}

const modifyPasswordSubmitForm = () => {
  proxy.$refs["modifyPasswordRef"].validate(valid => {
    if (valid) {
      verifyPassword({
        configId: modifyPasswordForm.value.configId,
        deviceId: modifyPasswordForm.value.deviceId,
        password: modifyPasswordForm.value.oldPassword,
      }).then(response => {
        if (response.result.code === '0') {
          modifyPassword(modifyPasswordForm.value).then(res => {
            if (res.result.code === '0') {
              proxy.$modal.msgSuccess("修改成功");
              openModifyPassword.value = false
            } else {
              proxy.$modal.msgError(response.result.msg);
            }
          })
        } else {
          proxy.$modal.msgError(response.result.msg);
        }
      })
    }
  })
}

/**
 * 设备控制
 *
 * @param row
 */
const deviceControlFun = (row) => {
  deviceControlForm.value.configId = queryParams.value.configId
  deviceControlForm.value.deviceId = row.deviceId
  deviceControlOpen.value = true
}

/**
 * 查询设备UTC时间
 */
const getDeviceTimeFun = () => {
  getDeviceTime(deviceControlForm.value).then((res) => {
    if (res.result.code === '0') {
      deviceTime.value = formatTime(res.result.data.time)
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 校准设备UTC时间
 */
const calibrationDeviceTimeFun = () => {
  calibrationDeviceTime(deviceControlForm.value).then((res) => {
    if (res.result.code === '0') {
      proxy.$modal.msgSuccess("校准成功");
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 重启设备
 */
const restartDeviceFun = () => {
  ElMessageBox.confirm(
      '确定重启设备?',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        restartDevice(deviceControlForm.value).then((res) => {
          if (res.result.code === '0') {
            proxy.$modal.msgSuccess("重启设备成功");
          } else {
            proxy.$modal.msgError(res.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

/**
 * 设备SD卡
 */
const deviceSdFun = async (row) => {
  deviceStorageMsg.value = null
  deviceId.value = row.deviceId
  const deviceStorageData = await deviceStorage({
    configId: queryParams.value.configId,
    deviceId: row.deviceId,
  })
  if (deviceStorageData.result.code === '0') {
    deviceStorageFrom.value = deviceStorageData.result.data
  } else {
    deviceStorageMsg.value = deviceStorageData.result.msg
  }

  await deviceSdcardStatusFun()

  deviceSdOpen.value = true
}

const deviceSdcardStatusFun = async () => {
  const deviceSdcardStatusData = await deviceSdcardStatus({
    configId: queryParams.value.configId,
    deviceId: deviceId.value,
  })

  if (deviceSdcardStatusData.result.code !== '0') {
    proxy.$modal.msgError(deviceSdcardStatusData.result.msg);
  }
  deviceStorageStatus.value = deviceSdcardStatusData.result.data.status
}

/**
 * 内存单位转换
 *
 * @param bytes
 * @param decimals
 * @returns {string}
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 设备SD卡格式化
 */
const recoverSDCardFun = () => {
  recoverSDCard({
    configId: queryParams.value.configId,
    deviceId: deviceId.value,
  }).then((res) => {
    if (res.result.code === '0') {
      if (res.result.data.result === 'start-recover') {
        proxy.$modal.msgSuccess("开始初始化");
      } else if (res.result.data.result === 'no-sdcard') {
        proxy.$modal.msgError("插槽内无SD卡");
      } else if (res.result.data.result === 'in-recover') {
        proxy.$modal.msgSuccess("正在初始化");
      } else if (res.result.data.result === 'sdcard-error') {
        proxy.$modal.msgError("其他SD卡错误");
      }
      deviceSdcardStatusFun()
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

onMounted(async () => {
  await getListLcConfigVo();
})
</script>

<style scoped>

</style>