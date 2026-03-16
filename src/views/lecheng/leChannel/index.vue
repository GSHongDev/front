<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <right-toolbar :search="false" @queryTable="getListDeviceDetailsByIds"></right-toolbar>
    </el-row>

    <el-table :data="channelList">
      <el-table-column label="通道名称" align="center" prop="channelName"/>
      <el-table-column label="通道号" align="center" prop="channelId"/>
      <el-table-column label="封面图" align="center" prop="channelPicUrl">
        <template #default="scope">
          <el-image v-if="scope.row.channelPicUrl" :src="scope.row.channelPicUrl" fit="cover"
                    style="width: 50px; height: 50px"
                    :preview-src-list="[scope.row.channelPicUrl]" preview-teleported>
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <picture-filled/>
                </el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="云存储状态" align="center" prop="csStatus">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.csStatus === 'notExist'">未开通套餐</el-tag>
          <el-tag type="primary" v-if="scope.row.csStatus === 'using'">开通云存储且没有过期</el-tag>
          <el-tag type="primary" v-if="scope.row.csStatus === 'expired'">套餐过期</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="遮罩状态" align="center" prop="cameraStatus">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.cameraStatus === 'on'">打开</el-tag>
          <el-tag type="danger" v-if="scope.row.cameraStatus === 'off'">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通道状态" align="center" prop="channelStatus">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.channelStatus === 'online'">在线</el-tag>
          <el-tag type="danger" v-if="scope.row.channelStatus === 'offline'">离线</el-tag>
          <el-tag type="warning" v-if="scope.row.channelStatus === 'sleep'">休眠</el-tag>
          <el-tag type="primary" v-if="scope.row.channelStatus === 'upgrading'">升级中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通道最后离线时间" align="center" prop="lastOffLineTime">
        <template #default="scope">
          {{ formatTime(scope.row.lastOffLineTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="getKitTokenFun(scope.row)"
                     v-hasPermi="['lecheng:lc:getKitToken']">播放
          </el-button>
          <el-button link type="primary" @click="modifyDeviceNameFun(scope.row)"
                     v-hasPermi="['lecheng:lc:modifyDeviceName']">修改名称
          </el-button>
          <el-button link type="primary" @click="refreshDeviceCoverFun(scope.row)"
                     v-hasPermi="['lecheng:lc:refreshDeviceCover']">刷新封面
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="播放视频参数" v-model="openGetKitToken" width="500px" append-to-body>
      <el-form ref="getKitTokenRef" :model="getKitTokenForm" :rules="getKitTokenRules" label-width="120px">
        <el-form-item label="播放类型" prop="type">
          <el-radio-group v-model="getKitTokenForm.type">
            <el-radio :value="1">直播（实时预览）</el-radio>
            <el-radio :value="2">录像回放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="本地录像" prop="recordType" v-if="getKitTokenForm.type === 2">
          <el-checkbox v-model="getKitTokenForm.recordType" true-value="localRecord" false-value="no">本地录像回放
          </el-checkbox>
        </el-form-item>
        <el-form-item label="回放开始时间" prop="beginTime" v-if="getKitTokenForm.type === 2">
          <el-date-picker v-model="getKitTokenForm.beginTime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetime"
                          placeholder="请选择回放开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="回放结束时间" prop="endTime" v-if="getKitTokenForm.type === 2">
          <el-date-picker v-model="getKitTokenForm.endTime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetime"
                          placeholder="请选择回放结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="清晰度" prop="streamId">
          <el-radio-group v-model="getKitTokenForm.streamId">
            <el-radio :value="0">高清</el-radio>
            <el-radio :value="1">标清</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频解密秘钥" prop="code">
          <template #label>
              <span>
                 <el-tooltip placement="top">
                   <template #content>
                                      设备视频解密秘钥，如果设备开启了视频加密，则必填。<br/>
                                      如果设备设置了自定义音视频加密秘钥，则填此秘钥；<br/>
                                      如果设备只设置了设备密码，则填设备密码；<br/>
                                      其他情况默认设备序列号。
                   </template>
                    <el-icon><question-filled/></el-icon>
                 </el-tooltip>
                视频解密秘钥
              </span>
          </template>
          <el-input v-model="getKitTokenForm.code" placeholder="请输入视频解密秘钥"/>
        </el-form-item>

      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="getKitTokenSubmitForm">确 定</el-button>
          <el-button @click="getKitTokenCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="播放视频" v-model="openPlayer" width="835px" append-to-body @close="playClose">
      <iframe ref="iframeRef" :src="lechengPlayAddress" style="width: 800px; height: 400px" scrolling="auto"
              frameborder="no" @load="handleIframeLoad"></iframe>
      <el-tabs v-model="tabActiveName" type="card" :stretch="true" style="margin-top: 10px;"
               allow="fullscreen; accelerometer; gyroscope" @tab-click="handleClick">
        <el-tab-pane v-if="checkPermi(['lecheng:lc:controlMovePTZ'])" label="云台控制" name="control">
          <div style="display: grid; grid-template-columns: 240px auto; height: 180px; overflow: auto">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="ptzControlUpStartFun('0')"
                     @mouseup="ptzControlUpEndFun('10')">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="ptzControlUpStartFun('2')"
                     @mouseup="ptzControlUpEndFun('10')">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="ptzControlUpStartFun('1')"
                     @mouseup="ptzControlUpEndFun('10')">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="ptzControlUpStartFun('3')"
                     @mouseup="ptzControlUpEndFun('10')">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 移动持续时间，单位毫秒 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px; width: 100px;">
                  <el-input-number v-model="duration" :min="100" :max="2000">
                    <template #suffix>
                      <span>毫秒</span>
                    </template>
                  </el-input-number>
                </div>
              </div>

              <!-- 变倍、聚焦、光圈控制 -->
              <div>
                <div class="ptz-btn-box">
                  <div @mousedown="ptzControlUpStartFun('8')" @mouseup="ptzControlUpEndFun('10')"
                       title="变倍+">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomIn/>
                    </el-icon>
                  </div>
                  <div @mousedown="ptzControlUpStartFun('9')" @mouseup="ptzControlUpEndFun('10')"
                       title="变倍-">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomOut/>
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧功能选择区域 -->
            <div style="text-align: left">
              <el-form :model="devicePTZInfoData" label-width="100px">
                <el-form-item label="水平操作" prop="h">
                  <el-input-number v-model="devicePTZInfoData.h" :step="0.1" :precision="1" :min="-1" :max="1"/>
                </el-form-item>
                <el-form-item label="垂直操作" prop="h">
                  <el-input-number v-model="devicePTZInfoData.v" :step="0.1" :precision="1" :min="-1" :max="1"/>
                </el-form-item>
                <el-form-item label="变倍" prop="h">
                  <el-input-number v-model="devicePTZInfoData.z" :step="0.1" :precision="1" :min="0" :max="1"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="controlLocationPTZFun">云台定位</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="checkPermi(['lecheng:lc:screenshot'])" label="设备抓图" name="screenshot">
          <el-button type="primary" @click="setDeviceSnapFun">setDeviceSnap设备抓图</el-button>
          <el-button type="primary" @click="setDeviceSnapEnhancedFun">setDeviceSnapEnhanced设备抓图</el-button>

          <el-divider/>

          <div style="display: flex;flex-wrap: wrap;">
            <div v-for="(item,index) in lcCaptureList" :key="index" style="margin: 0 2px 0 2px;position: relative">
              <el-image
                  style="width: 80px; height: 80px"
                  :src="item.picUrl"
                  :preview-src-list="[item.picUrl]"
                  show-progress
                  fit="cover"
              />
              <el-icon
                  :size="16"
                  color="#F56C6C"
                  style="position: absolute;top: 0;z-index: 99;right: 0;cursor: pointer;"
                  @click="captureDel(item)"
              >
                <DeleteFilled/>
              </el-icon>
            </div>
          </div>

          <pagination
              v-show="lcCaptureTotal>0"
              :total="lcCaptureTotal"
              v-model:page="lcCaptureQueryParams.pageStart"
              v-model:limit="lcCaptureQueryParams.pageSize"
              @pagination="listLcCaptureFun"
          />
        </el-tab-pane>
        <el-tab-pane v-if="checkPermi(['lecheng:lc:getCollection'])" label="收藏点" name="collection">
          <el-button type="primary" @click="setCollectionFun">新增收藏点</el-button>
          <div style="margin-top: 10px;display: flex;flex-wrap: wrap;">
            <div v-for="(item,index) in collections" style="margin: 0 5px"
                 :key="index">
              <el-tag type="primary"
                      closable
                      @click="turnCollectionFun(item)"
                      @close="deleteCollectionFun(item)">
                {{ item.name }}
              </el-tag>
              <el-button type="primary" link @click="modifyCollectionFun(item)">
                修改
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script setup name="LeChannel">
import {useRoute} from "vue-router";
import {
  controlLocationPTZ,
  controlMovePTZ, deleteCollection,
  devicePTZInfo,
  getCollection,
  getKitToken,
  listDeviceDetailsByIds, modifyCollection,
  modifyDeviceName,
  refreshDeviceCover, setCollection,
  setDeviceSnap,
  setDeviceSnapEnhanced, turnCollection
} from "../../../api/lecheng/lc.js";
import {ElMessageBox} from "element-plus";
import {getConfigKey} from "../../../api/system/config.js";
import {checkPermi} from "@/utils/permission";
import {delLcCapture, listLcCapture} from "../../../api/lecheng/lcCapture.js";

const {proxy} = getCurrentInstance();

const route = useRoute();

const configId = ref(null);
const deviceId = ref(null);
const channelList = ref([]);

const openGetKitToken = ref(false);
const getKitTokenForm = ref({});
const getKitTokenRules = ref({
  beginTime: [{required: true, message: "请选择回放开始时间", trigger: "blur"}],
  endTime: [{required: true, message: "请选择回放结束时间", trigger: "blur"}],
});

const openPlayer = ref(false)
const iframeRef = ref(null)
const lechengPlayAddress = ref(null)
const kitToken = ref(null)

const tabActiveName = ref("control")
const duration = ref(1000)
const devicePTZInfoData = ref({})

const lcCaptureList = ref([])
const lcCaptureTotal = ref(0)
const lcCaptureQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
  deviceId: null,
  channelId: null,
})

// 收藏点列表
const collections = ref([])



const formatTime = (raw) => {
  const match = raw.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/);
  if (!match) return raw;

  const [_, y, M, d, H, m, s] = match;
  const date = new Date(Date.UTC(y, M - 1, d, H, m, s));

  return new Date(date.getTime() + 8 * 3600000).toISOString().replace('T', ' ').substr(0, 19)
}

const getListDeviceDetailsByIds = () => {
  listDeviceDetailsByIds({
    configId: configId.value,
    deviceList: [{
      deviceId: deviceId.value,
      channelId: null,
    }]
  }).then(res => {
    if (res.result.code === '0') {
      channelList.value = res.result.data.deviceList[0].channelList;
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

const modifyDeviceNameFun = (row) => {
  console.log(row)
  ElMessageBox.prompt('请输入设备名称', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(({value}) => {
        modifyDeviceName({
          configId: configId.value,
          deviceId: deviceId.value,
          name: value,
          channelId: row.channelId,
        }).then(response => {
          if (response.result.code === '0') {
            proxy.$modal.msgSuccess("修改成功");
            getListDeviceDetailsByIds()
          } else {
            proxy.$modal.msgError(response.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

const refreshDeviceCoverFun = (row) => {
  refreshDeviceCover({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: row.channelId,
  }).then(response => {
    if (response.result.code === '0') {
      proxy.$modal.msgSuccess("刷新封面成功");
      getListDeviceDetailsByIds()
    } else {
      proxy.$modal.msgError(response.result.msg);
    }
  })
}

const getKitTokenFun = (row) => {
  getKitTokenReset();
  getKitTokenForm.value.configId = configId.value
  getKitTokenForm.value.deviceId = deviceId.value
  getKitTokenForm.value.channelId = row.channelId
  getKitTokenForm.value.code = deviceId.value
  openGetKitToken.value = true;
}

// 表单重置
function getKitTokenReset() {
  getKitTokenForm.value = {
    configId: null,
    deviceId: null, // 设备序列号
    channelId: null, // 设备通道号
    type: 1, // 播放类型： 1 直播（实时预览）； 2 录像回放；
    streamId: 1, //	清晰度： 0 高清 ；1 标清；
    recordType: 'cloud', // type=2 的情况下默认云录像回放；若 recordType=localRecord 则本地录像回放
    beginTime: null, // 回放开始时间   YYYY-MM-DD HH:mm:ss
    endTime: null, // 回放结束时间   YYYY-MM-DD HH:mm:ss
    controls: true, //播放器控制栏显示/隐藏
    muted: true, //静音
    code: null, //设备视频解密秘钥，如果设备开启了视频加密，则必填。如果设备设置了自定义音视频加密秘钥，则填此秘钥；如果设备只设置了设备密码，则填设备密码；其他情况默认设备序列号。
    videoTalk: false, //视频对讲
    controlsSize: 35, // 控件大小设置
    controlsColor: "#ffffff", // 控件颜色设置
    controlsActiveColor: "#f18d00", // 控件高亮颜色设置
    templateMode: "pc", // UI模板配置PC端：pc； 移动端：mobile
    title: null, // 标题内容
    titleColor: "#ffffff", // 标题颜色
    // 控件配置
    controlsConfig: ["play", "volume", "talk", "capture", "videoRecord", "ptz", "resolution", "fullPageScreen", "fullScreen", "speed", "recordChange", "recordTimeLine", "calendar", "digitalZoom"],
  };
  proxy.resetForm("getKitTokenRef");
}

const getKitTokenCancel = () => {
  getKitTokenReset();
  openGetKitToken.value = false;
}

const getKitTokenSubmitForm = () => {
  proxy.$refs["getKitTokenRef"].validate(valid => {
    if (valid) {
      openPlayer.value = true
      openGetKitToken.value = false
      nextTick(() => {
        let data = JSON.parse(JSON.stringify(getKitTokenForm.value))
        getKitToken({
          configId: data.configId,
          deviceId: data.deviceId,
          channelId: data.channelId,
          type: '0',
        }).then(res => {
          kitToken.value = res.result.data.kitToken
          handleIframeLoad();

          devicePTZInfoFun();

          listLcCaptureFun();
        })
      })
    }
  })
}

const handleIframeLoad = () => {
  let data = JSON.parse(JSON.stringify(getKitTokenForm.value))
  nextTick(() => {
    const iframe = iframeRef.value;
    iframe.contentWindow.postMessage({
      type: "play",
      param: {
        width: 800,
        height: 400,
        kitToken: kitToken.value,
        ...data
      }
    }, lechengPlayAddress.value);
  })
}

const playClose = () => {
  getKitTokenReset();
  openPlayer.value = false
  const iframe = iframeRef.value;
  iframe.contentWindow.postMessage({
    type: "destroy",
  }, lechengPlayAddress.value)
};

const getConfigKeyFun = () => {
  getConfigKey('sys_lecheng_play_address').then(response => {
    lechengPlayAddress.value = response.msg
  })
}

/**
 * 云台控制开始
 */
const ptzControlUpStartFun = (type) => {
  controlMovePTZ({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
    operation: type,
    duration: duration.value,
  }).then((res) => {
    if (res.result.code !== '0') {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 云台控制结束
 *
 * @param type
 */
const ptzControlUpEndFun = (type) => {
  controlMovePTZ({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
    operation: type,
    duration: duration.value,
  }).then((res) => {
    if (res.result.code !== '0') {
      proxy.$modal.msgSuccess(res.result.msg);
    }
  })
}

/**
 * 获取设备云台控制接口
 */
const devicePTZInfoFun = () => {
  devicePTZInfo({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
  }).then((res) => {
    if (res.result.code === '0') {
      devicePTZInfoData.value = res.result.data
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

const controlLocationPTZFun = () => {
  controlLocationPTZ({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
    h: devicePTZInfoData.value.h,
    v: devicePTZInfoData.value.v,
    z: devicePTZInfoData.value.z,
  }).then((res) => {
    if (res.result.code === '0') {
      proxy.$modal.msgSuccess("定位成功");
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * setDeviceSnap设备抓图
 */
const setDeviceSnapFun = () => {
  setDeviceSnap({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
  }).then((res) => {
    if (res.result.code === '0') {
      proxy.$modal.msgSuccess("设备抓图成功");
      listLcCaptureFun()
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * setDeviceSnapEnhanced设备抓图
 */
const setDeviceSnapEnhancedFun = () => {
  setDeviceSnapEnhanced({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
  }).then((res) => {
    if (res.result.code === '0') {
      proxy.$modal.msgSuccess("设备抓图成功");
      listLcCaptureFun()
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 获取设备抓图列表
 */
const listLcCaptureFun = () => {
  lcCaptureQueryParams.value.deviceId = deviceId.value
  lcCaptureQueryParams.value.channelId = getKitTokenForm.value.channelId
  listLcCapture(lcCaptureQueryParams.value).then((res) => {
    lcCaptureTotal.value = res.total
    lcCaptureList.value = res.rows
  })
}

/**
 * 删除设备抓图
 *
 * @param row
 */
const captureDel = (row) => {
  delLcCapture(row.id).then((res) => {
    proxy.$modal.msgSuccess("删除设备抓图成功");
    listLcCaptureFun()
  })
}

/**
 * 获取收藏点信息
 */
const getCollectionFun = () => {
  getCollection({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
  }).then((res) => {
    if (res.result.code === '0') {
      collections.value = res.result.data.collections
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

const handleClick = (tab, event) => {
  nextTick(() => {
    if (tabActiveName.value === 'collection') {
      getCollectionFun()
    }
  })
}

/**
 * 新增收藏点
 */
const setCollectionFun = () => {
  ElMessageBox.prompt('请输入收藏点名称', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(({value}) => {
        setCollection({
          configId: configId.value,
          deviceId: deviceId.value,
          channelId: getKitTokenForm.value.channelId,
          name: value,
          needCruise: false,
        }).then((res) => {
          if (res.result.code === '0') {
            proxy.$modal.msgSuccess("新增收藏点成功");
            getCollectionFun()
          } else {
            proxy.$modal.msgError(res.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

/**
 * 删除收藏点
 *
 * @param item
 * @param index
 */
const deleteCollectionFun = (item) => {
  deleteCollection({
    configId: configId.value,
    deviceId: deviceId.value,
    channelId: getKitTokenForm.value.channelId,
    names: [item.name],
  }).then((res) => {
    if (res.result.code === '0') {
      proxy.$modal.msgSuccess("删除收藏点成功");
      getCollectionFun()
    } else {
      proxy.$modal.msgError(res.result.msg);
    }
  })
}

/**
 * 转动到收藏点
 *
 * @param item
 */
const turnCollectionFun = (item) => {
  ElMessageBox.confirm(
      '是否转动到收藏点？',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        turnCollection({
          configId: configId.value,
          deviceId: deviceId.value,
          channelId: getKitTokenForm.value.channelId,
          name: item.name,
        }).then((res)=>{
          if (res.result.code === '0') {
            proxy.$modal.msgSuccess("转动到收藏点成功");
          } else {
            proxy.$modal.msgError(res.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

/**
 * 修改收藏点
 */
const modifyCollectionFun = (item) => {
  ElMessageBox.prompt('请输入收藏点名称', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(({value}) => {
        modifyCollection({
          configId: configId.value,
          deviceId: deviceId.value,
          channelId: getKitTokenForm.value.channelId,
          oldName: item.name,
          newName: value,
        }).then((res) => {
          if (res.result.code === '0') {
            proxy.$modal.msgSuccess("修改收藏点成功");
            getCollectionFun()
          } else {
            proxy.$modal.msgError(res.result.msg);
          }
        })
      })
      .catch(() => {

      })
}

onMounted(async () => {
  configId.value = route.query && route.query.configId;
  deviceId.value = route.query && route.query.deviceId;
  await getListDeviceDetailsByIds()
  await getConfigKeyFun()
})
</script>

<style scoped>
::v-deep(.el-icon) {
  height: auto !important;
}

.control-wrapper {
  position: relative;
  width: 100px; /* 6.25rem * 16 = 100px */
  height: 100px; /* 6.25rem * 16 = 100px */
  max-width: 100px; /* 6.25rem * 16 = 100px */
  max-height: 100px; /* 6.25rem * 16 = 100px */
  border-radius: 100%;
  margin-top: 24px; /* 1.5rem * 16 = 24px */
  margin-left: 8px; /* 0.5rem * 16 = 8px */
  float: left;
}

.control-btn {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 44%;
  height: 44%;
  border-radius: 5px;
  border: 1px solid #78aee4;
  box-sizing: border-box;
  transition: all 0.3s linear;
}


.control-btn:hover {
  cursor: pointer;
}

.control-btn .icon {
  width: 100%;
  font-size: 20px;
  color: #78aee4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-btn .icon:hover {
  cursor: pointer;
}

.control-zoom-btn:hover {
  cursor: pointer;
}

.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: #fff;
  border-radius: 100%;
}

.control-round-inner {
  position: absolute;
  left: 13%;
  top: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  font-size: 40px;
  color: #78aee4;
  border: 1px solid #78aee4;
  border-radius: 100%;
  transition: all 0.3s linear;
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fafafa;
}

.control-top {
  top: -12px; /* -8% of 100px ≈ -12px */
  left: 27%;
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .icon {
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .control-inner {
  left: -1px;
  bottom: 0;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-top .fa {
  transform: rotate(45deg) translateY(-7px);
}

.control-left {
  top: 27%;
  left: -12px; /* -8% of 100px ≈ -12px */
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
}

.control-left .icon {
  transform: rotate(-45deg);
}

.control-left .control-inner {
  right: -1px;
  top: -1px;
  border-bottom: 1px solid #78aee4;
  border-left: 1px solid #78aee4;
  border-radius: 0 0 0 100%;
}

.control-left .fa {
  transform: rotate(-45deg) translateX(-7px);
}

.control-right {
  top: 27%;
  right: -12px; /* -8% of 100px ≈ -12px */
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-right .icon {
  transform: rotate(-45deg);
}

.control-right .control-inner {
  left: -1px;
  bottom: -1px;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-right .fa {
  transform: rotate(-45deg) translateX(7px);
}

.control-bottom {
  left: 27%;
  bottom: -12px; /* -8% of 100px ≈ -12px */
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
}

.control-bottom .icon {
  transform: rotate(-45deg);
}

.control-bottom .control-inner {
  top: -1px;
  left: -1px;
  border-bottom: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 0 100% 0;
}

.control-bottom .fa {
  transform: rotate(-45deg) translateY(7px);
}

.trank {
  width: 80%;
  height: 180px;
  text-align: left;
  padding: 0 10%;
  overflow: auto;
}

.trankInfo {
  width: 80%;
  padding: 0 10%;
}

.el-dialog__body {
  padding: 10px 20px;
}

.ptz-btn-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 32px; /* 2rem * 16 = 32px */
  height: 48px; /* 3rem * 16 = 48px */
  line-height: 64px; /* 4rem * 16 = 64px */
}
</style>