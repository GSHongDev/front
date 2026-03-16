<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="萤石配置">
        <el-select
            v-model="queryParams.configId"
            placeholder="萤石配置"
            style="width: 240px"
            @change="handleQuery"
        >
          <el-option
              v-for="item in ysConfigList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['yingshi:ys:add']">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="single" @click="handleDelete"
                   v-hasPermi="['yingshi:ys:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain icon="Refresh" @click="equipmentSupportFun()" v-hasPermi="['yingshi:ys:equipmentSupport']"

        >设备支持萤石协议
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left"/>
      <el-table-column label="设备序列号" align="center" prop="deviceSerial" width="100"/>
      <el-table-column label="设备名称" align="center" prop="deviceName" width="150"/>
      <el-table-column label="设备类型" align="center" prop="deviceType" width="150"/>
      <el-table-column label="设备IP地址" align="center" prop="netAddress" width="150"/>
      <el-table-column label="设备版本号" align="center" prop="deviceVersion" width="150"/>
      <el-table-column label="在线状态" align="center" prop="status" width="80">
        <template #default="scope">
          <dict-tag :options="yingshi_online_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="具有防护能力的设备布撤防状态" align="center" prop="defence" width="150">
        <template #header>
          <el-tooltip
              effect="dark"
              content="0-睡眠，8-在家，16-外出，普通IPC布撤防状态：0-撤防，1-布防"
              placement="top"
          >
            具有防护能力的设备布撤防状态
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-text type="primary" v-if="scope.row.defence === 0">具有防护能力的设备；睡眠或者普通IPC布撤防状态；撤防</el-text>
          <el-text type="primary" v-if="scope.row.defence === 1">布防</el-text>
          <el-text type="primary" v-if="scope.row.defence === 8">在家</el-text>
          <el-text type="primary" v-if="scope.row.defence === 16">外出</el-text>
        </template>
      </el-table-column>
      <el-table-column label="设备风险安全等级" align="center" prop="riskLevel" width="150">
        <template #header>
          <el-tooltip
              effect="dark"
              content="0-安全，大于零，有风险，风险越高，值越大"
              placement="top"
          >
            设备风险安全等级
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.riskLevel === 0">安全</el-tag>
          <el-tag type="danger" v-else>风险</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="addTime" width="150">
        <template #default="scope">
          <span>{{ parseTime(parseInt(scope.row.addTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="150">
        <template #default="scope">
          <span>{{ parseTime(parseInt(scope.row.updateTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备二级类目" align="center" prop="parentCategory"/>
      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="getCameraDeviceFun(scope.row)"
                     v-hasPermi="['yingshi:ys:channel']">通道</el-button>
          <el-button link type="primary" @click="updateDeviceNameFun(scope.row)"
                     v-hasPermi="['yingshi:ys:updateDeviceName']">修改名称</el-button>
          <el-button link type="primary" @click="deviceInfoFun(scope.row)"
                     v-hasPermi="['yingshi:ys:deviceInfo']">设备信息</el-button>
          <el-button link type="primary" @click="deviceDefenceSetFun(scope.row)"
                     v-hasPermi="['yingshi:ys:deviceDefenceSet']">撤/布防</el-button>

          <el-button link type="primary" @click="deviceDefencePlanFun(scope.row)"
                     v-hasPermi="['yingshi:ys:deviceDefencePlan']">布撤防计划</el-button>
          <el-button link type="primary" @click="deviceVersionInfoFun(scope.row)"
                     v-hasPermi="['yingshi:ys:deviceVersionInfo']">版本信息</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)"
                     v-hasPermi="['yingshi:ys:remove']">删除</el-button>
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

    <HandleAdd ref="handleAddRef" @success="addSuccess"></HandleAdd>
    <EquipmentSupport ref="equipmentSupportRef"></EquipmentSupport>

    <el-dialog :title="`【${deviceInfoData.deviceName}】设备信息`" v-model="deviceInfoOpen" width="1000px" append-to-body>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="设备IP地址">{{ deviceInfoData.netAddress }}</el-descriptions-item>
        <el-descriptions-item label="设备序列号">{{ deviceInfoData.deviceSerial }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ deviceInfoData.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="设备上报名称">{{ deviceInfoData.localName }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{ deviceInfoData.model }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">
          <dict-tag :options="yingshi_online_status" :value="deviceInfoData.status" />
        </el-descriptions-item>
        <el-descriptions-item label="布撤防状态">
          <el-text type="primary" v-if="deviceInfoData.defence === 0">具有防护能力的设备；睡眠或者普通IPC布撤防状态；撤防</el-text>
          <el-text type="primary" v-if="deviceInfoData.defence === 1">布防</el-text>
          <el-text type="primary" v-if="deviceInfoData.defence === 8">在家</el-text>
          <el-text type="primary" v-if="deviceInfoData.defence === 16">外出</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="是否加密">
          <el-switch
              active-text="开启"
              inactive-text="未开启"
              v-model="deviceInfoData.isEncrypt"
              :active-value="1"
              :inactive-value="0"
              @change="isEncryptChange"
          />
          <el-button type="primary" text v-if="deviceInfoData.isEncrypt" @click="devicePasswordUpdateFun">
            修改加密密码
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="告警声音模式">
          <el-tag type="primary" v-if="deviceInfoData.alarmSoundMode === 0">短叫</el-tag>
          <el-tag type="primary" v-if="deviceInfoData.alarmSoundMode === 1">长叫</el-tag>
          <el-tag type="primary" v-if="deviceInfoData.alarmSoundMode === 2">静音</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备下线是否通知">
          <el-tag type="primary" v-if="deviceInfoData.offlineNotify === 0">不通知</el-tag>
          <el-tag type="primary" v-if="deviceInfoData.offlineNotify === 1">通知</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备大类">{{ deviceInfoData.category }}</el-descriptions-item>
        <el-descriptions-item label="设备二级类目">{{ deviceInfoData.parentCategory }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ deviceInfoData.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="网络类型">{{ deviceInfoData.netType }}</el-descriptions-item>
        <el-descriptions-item label="信号强度(%)">{{ deviceInfoData.signal }}</el-descriptions-item>
        <el-descriptions-item label="设备风险安全等级">
          <el-tag type="primary" v-if="deviceInfoData.riskLevel === 0">安全</el-tag>
          <el-tag type="danger" v-else>风险</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="修改加密密码" v-model="devicePasswordUpdateOpen" width="500px" append-to-body>
      <el-form ref="devicePasswordUpdateRef" :model="devicePasswordUpdateForm" :rules="devicePasswordUpdateRules" label-width="70px">
        <el-form-item label="注意">
          <el-text type="warning">修改后，请牢记您的新密码，若密码丢失，将不能被找回，需要重置设备恢复初始值。</el-text>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="devicePasswordUpdateForm.oldPassword" placeholder="请输入旧密码" show-word-limit  maxlength="12"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="devicePasswordUpdateForm.newPassword" placeholder="请输入新密码"  show-password maxlength="12"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="devicePasswordUpdateSubmitForm">确 定</el-button>
          <el-button @click="devicePasswordUpdateCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设备版本信息" v-model="deviceVersionInfoOpen" width="600px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="最新版本">{{ deviceVersionInfoData.latestVersion }}</el-descriptions-item>
        <el-descriptions-item label="当前版本">{{ deviceVersionInfoData.currentVersion }}</el-descriptions-item>
        <el-descriptions-item label="是否需要升级">
          <el-tag type="primary" v-if="deviceVersionInfoData.isNeedUpgrade === 0">不需要</el-tag>
          <el-tag type="primary" v-if="deviceVersionInfoData.isNeedUpgrade === 1">需要</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否正在升级">
          <el-tag type="primary" v-if="deviceVersionInfoData.isUpgrading === 0">未升级</el-tag>
          <el-tag type="primary" v-if="deviceVersionInfoData.isUpgrading === 1">正在升级</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px" v-hasPermi="['yingshi:ys:channel','yingshi:ys:deviceUpgradeStatus']">
        <el-button type="primary" @click="deviceUpgradeFun">设备升级</el-button>
        <el-button type="primary" @click="deviceUpgradeStatusFun">设备升级状态</el-button>

        <div style="margin-top: 20px;display: flex;align-items: center">
          <div style="display: flex;align-items: center">
            升级状态：
            <el-tag type="primary" v-if="deviceUpgradeStatusData.status === 0">正在升级</el-tag>
            <el-tag type="primary" v-if="deviceUpgradeStatusData.status === 1">设备重启</el-tag>
            <el-tag type="primary" v-if="deviceUpgradeStatusData.status === 2">升级成功</el-tag>
            <el-tag type="danger" v-else>升级失败</el-tag>
          </div>
          <div style="margin-left: 20px;display: flex;align-items: center">
            升级进度：
            <el-progress type="circle" :percentage="deviceUpgradeStatusData.progress" />
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="设置设备撤/布防" v-model="deviceDefenceSetOpen" width="600px" append-to-body>
      <el-form ref="deviceDefenceSetRef" :model="deviceDefenceSetForm" :rules="deviceDefenceSetRules" label-width="100px">
        <el-form-item label="注意">
          <el-text type="warning">具有防护能力设备布撤防状态：0-睡眠，8-在家，16-外出，普通IPC设备布撤防状态：0-撤防，1-布防。</el-text>
        </el-form-item>
        <el-form-item label="布撤防状态" prop="isDefence">
          <el-radio-group v-model="deviceDefenceSetForm.isDefence">
            <el-radio :value="0">睡眠/撤防</el-radio>
            <el-radio :value="1">布防</el-radio>
            <el-radio :value="8">在家</el-radio>
            <el-radio :value="16">外出</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="deviceDefenceSetSubmitForm">确 定</el-button>
          <el-button @click="deviceDefenceSetCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="设置布撤防时间计划" v-model="deviceDefencePlanOpen" width="600px" append-to-body>
      <el-form ref="deviceDefencePlanRef" :model="deviceDefencePlanForm" :rules="deviceDefencePlanRules" label-width="100px">
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
              v-model="deviceDefencePlanForm.startTime"
              arrow-control
              placeholder="请选择开始时间"
              value-format="HH:mm"
              :clearable="false"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="stopTime">
          <el-time-picker
              v-model="deviceDefencePlanForm.stopTime"
              arrow-control
              :clearable="false"
              placeholder="请选择结束时间"
              value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="星期" prop="period">
          <el-checkbox-group v-model="deviceDefencePlanForm.period" :min="1">
            <el-checkbox label="星期一" value="0" />
            <el-checkbox label="星期二" value="1" />
            <el-checkbox label="星期三" value="2" />
            <el-checkbox label="星期四" value="3" />
            <el-checkbox label="星期五" value="4" />
            <el-checkbox label="星期六" value="5" />
            <el-checkbox label="星期七" value="6" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="启用状态" prop="enable">
          <el-radio-group v-model="deviceDefencePlanForm.enable">
            <el-radio :value="0">不启用</el-radio>
            <el-radio :value="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="deviceDefencePlanSubmitForm">确 定</el-button>
          <el-button @click="deviceDefencePlanCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="YsDevice">
import HandleAdd from "./components/HandleAdd"
import EquipmentSupport from "./components/EquipmentSupport"
import {listYsConfigVo} from "../../../api/yingshi/ysConfig.js";
import {
  delDevice, deviceDefencePlanGet, deviceDefencePlanSet, deviceDefenceSet,
  deviceEncryptOff, deviceEncryptOn,
  deviceInfo, devicePasswordUpdate, deviceUpgrade, deviceUpgradeStatus, deviceVersionInfo,
  listYsDevice,
  updateDeviceName
} from "../../../api/yingshi/ysDevice.js";
import router from "@/router";
import {ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance();
const { yingshi_online_status } = proxy.useDict('yingshi_online_status');

const ysConfigList = ref([])
const deviceList = ref([]);
const showSearch = ref(true);
const loading = ref(true);
const total = ref(0);
const handleAddRef = ref(null);
const equipmentSupportRef = ref(null);
const videoUrl = ref('');
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);

const deviceInfoData = ref({});
const deviceInfoOpen = ref(false);

const devicePasswordUpdateOpen = ref(false);
const devicePasswordUpdateForm = ref({
  configId: null,
  deviceSerial: null,
  oldPassword: null,
  newPassword: null,
});
const devicePasswordUpdateRules = ref({
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
})

const deviceVersionInfoData = ref({});
const deviceVersionInfoOpen = ref(false);
const deviceSerial = ref(null);
const deviceUpgradeStatusData = ref({});

const deviceDefenceSetOpen = ref(false)
const deviceDefenceSetForm = ref({
  configId: null,
  deviceSerial: null,
  isDefence: null,
})
const deviceDefenceSetRules = ref({
  isDefence: [{ required: true, message: "请选择布撤防状态", trigger: "blur" }],
})

const deviceDefencePlanForm = ref({
  configId: null,
  deviceSerial: null,
  startTime: "00:00",
  stopTime: "23:59",
  period: [],
  enable: 1
})
const deviceDefencePlanOpen = ref(false)
const deviceDefencePlanRules = ref({

})

const data = reactive({
  form: {},
  queryParams: {
    configId: null,
    pageStart: 0,
    pageSize: 10
  },
  rules: {}
});

const { queryParams, form, rules } = toRefs(data);

/** 查询监控设备列表 */
const getList = async () => {
  loading.value = true;
  listYsDevice(queryParams.value).then((res)=>{
    deviceList.value = res.data;
    total.value = res.page.total;
    loading.value = false;
  })
}

const getListYsConfigVoFun = async () => {
  listYsConfigVo().then((res)=>{
    if(res.data.length > 0){
      queryParams.value.configId = res.data[0].id
      ysConfigList.value = res.data
      getList()
    }else {
      proxy.$modal.msgError("请先配置萤石配置");
    }
  })
};

/**
 * 添加设备
 */
const handleAdd = () => {
  handleAddRef.value.show(queryParams.value.configId)
}

/**
 * 添加成功回调
 */
const addSuccess = () => {
  getList();
}

/**
 * 设备支持萤石协议
 */
const equipmentSupportFun = () => {
  equipmentSupportRef.value.show(queryParams.value.configId)
}

/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.deviceSerial);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 删除按钮操作 */
const handleDelete = async (row) => {
  const deviceSerial = row?.deviceSerial || ids.value[0];
  await proxy?.$modal.confirm('是否确认删除监控设备编号为"' + deviceSerial + '"的数据项？').finally(() => loading.value = false);
  await delDevice(deviceSerial,queryParams.value.configId);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
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
 * 获取指定设备的通道信息
 *
 * @param row
 */
const getCameraDeviceFun = async (row) => {
  if (row.deviceSerial) {
    let data = {
      deviceSerial: row.deviceSerial,
      configId: queryParams.value.configId,
    }
    router.push({
      path: '/yingshi/ysChannel/index',
      query: data
    });
  }
}

/**
 * 修改云端设备名称
 *
 * @param row
 */
const updateDeviceNameFun = (row) => {
  ElMessageBox.prompt('请输入云端设备名称', '修改云端设备名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  .then(({ value }) => {
    updateDeviceName({
      configId: queryParams.value.configId,
      deviceSerial: row.deviceSerial,
      deviceName: value,
    }).then((res)=>{
      proxy?.$modal.msgSuccess("修改成功");
      getList();
    })
  })
  .catch(() => {

  })
}

/**
 * 获取单个设备信息
 *
 * @param row
 */
const deviceInfoFun = (row) => {
  deviceInfo({
    configId: queryParams.value.configId,
    deviceSerial: row.deviceSerial,
  }).then((res)=>{
    deviceInfoData.value = res.data
    deviceInfoOpen.value = true
  })
}

const isEncryptChange = (e) => {
  if(e === 0){
    deviceEncryptOff({
      configId: queryParams.value.configId,
      deviceSerial: deviceInfoData.value.deviceSerial,
    }).then((res)=>{
      proxy?.$modal.msgSuccess("关闭成功");
    })
  }else {
    deviceEncryptOn({
      configId: queryParams.value.configId,
      deviceSerial: deviceInfoData.value.deviceSerial,
    }).then((res)=>{
      proxy?.$modal.msgSuccess("开启成功");
    })
  }
}

const devicePasswordUpdateFun = (e) => {
  devicePasswordUpdateForm.value.configId = queryParams.value.configId
  devicePasswordUpdateForm.value.deviceSerial = deviceInfoData.value.deviceSerial
  devicePasswordUpdateForm.value.oldPassword = null
  devicePasswordUpdateForm.value.newPassword = null
  devicePasswordUpdateOpen.value = true
}

const devicePasswordUpdateCancel = () => {
  devicePasswordUpdateForm.value.configId = null
  devicePasswordUpdateForm.value.deviceSerial = null
  devicePasswordUpdateForm.value.oldPassword = null
  devicePasswordUpdateForm.value.newPassword = null
  devicePasswordUpdateOpen.value = false
}

const devicePasswordUpdateSubmitForm = () => {
  proxy.$refs["devicePasswordUpdateRef"].validate(valid => {
    if (valid) {
      devicePasswordUpdate(devicePasswordUpdateForm.value).then((res)=>{
        proxy?.$modal.msgSuccess("修改成功");
        devicePasswordUpdateOpen.value = false
      })
    }
  })
}

const deviceVersionInfoFun = (row) => {
  deviceSerial.value = row.deviceSerial
  deviceVersionInfo({
    configId: queryParams.value.configId,
    deviceSerial: row.deviceSerial,
  }).then((res)=>{
    deviceVersionInfoData.value =  res.data
    deviceVersionInfoOpen.value = true
  })
}

const deviceUpgradeFun = () => {
  deviceUpgrade({
    configId: queryParams.value.configId,
    deviceSerial: deviceSerial.value,
  }).then((res)=>{
    proxy?.$modal.msgSuccess("调用成功，设备升级中...");
  })
}

const deviceUpgradeStatusFun = () => {
  deviceUpgradeStatus({
    configId: queryParams.value.configId,
    deviceSerial: deviceSerial.value,
  }).then((res)=>{
    deviceUpgradeStatusData.value = res.data
  })
}

const deviceDefenceSetFun = (row) => {
  deviceDefenceSetForm.value.isDefence = row.defence
  deviceDefenceSetForm.value.configId = queryParams.value.configId
  deviceDefenceSetForm.value.deviceSerial = row.deviceSerial
  deviceDefenceSetOpen.value = true
}

const deviceDefenceSetCancel = () => {
  deviceDefenceSetForm.value.isDefence = null
  deviceDefenceSetOpen.value = false
}

const deviceDefenceSetSubmitForm = () => {
  proxy.$refs["deviceDefenceSetRef"].validate(valid => {
    if (valid) {
      deviceDefenceSet(deviceDefenceSetForm.value).then((res)=>{
        proxy?.$modal.msgSuccess("修改成功");
        deviceDefenceSetOpen.value = false
        setTimeout(()=>{
          getList();
        }, 300)
      })
    }
  })
}

const deviceDefencePlanFun = (row) => {
  deviceDefencePlanForm.value.configId = queryParams.value.configId
  deviceDefencePlanForm.value.deviceSerial = row.deviceSerial
  deviceDefencePlanGet({
    configId: queryParams.value.configId,
    deviceSerial: row.deviceSerial,
  }).then((res)=>{
    deviceDefencePlanForm.value.startTime = res.data.startTime
    deviceDefencePlanForm.value.stopTime = "23:59"
    deviceDefencePlanForm.value.period = res.data.period.split(",")
    deviceDefencePlanForm.value.enable = res.data.enable
    deviceDefencePlanOpen.value = true
  })
}

const deviceDefencePlanCancel = () => {
  deviceDefencePlanForm.value.startTime = null
  deviceDefencePlanForm.value.stopTime = null
  deviceDefencePlanForm.value.period = null
  deviceDefencePlanForm.value.enable = null
  deviceDefencePlanOpen.value = false
}

const deviceDefencePlanSubmitForm = () => {
  proxy.$refs["deviceDefencePlanRef"].validate(valid => {
    if (valid) {
      let data = {
        ...deviceDefencePlanForm.value
      }
      data.period = data.period.join(",")
      deviceDefencePlanSet(data).then((res)=>{
        proxy?.$modal.msgSuccess("设置成功");
        deviceDefencePlanOpen.value = false
        setTimeout(()=>{
          getList();
        }, 300)
      })
    }
  })
}

getListYsConfigVoFun();
</script>

<style scoped>

</style>