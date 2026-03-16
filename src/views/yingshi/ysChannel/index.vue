<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <right-toolbar :search="false" @queryTable="getCameraDeviceFun"></right-toolbar>
    </el-row>

    <el-table :data="channelList">
      <el-table-column label="设备序列号" align="center" prop="deviceSerial" width="100"/>
      <el-table-column label="IPC序列号" align="center" prop="ipcSerial" width="100"/>
      <el-table-column label="通道号" align="center" prop="channelNo" width="100"/>
      <el-table-column label="设备名" align="center" prop="deviceName"/>
      <el-table-column label="设备上报名称" align="center" prop="localName"/>
      <el-table-column label="通道名" align="center" prop="channelName"/>
      <el-table-column label="图片地址（大图）" align="center" prop="picUrl">
        <template #default="scope">
          <el-image :src="scope.row.picUrl" fit="cover" style="width: 50px; height: 50px"
                    :preview-src-list="[scope.row.picUrl]" preview-teleported>
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
      <el-table-column label="在线状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="yingshi_monitoring_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="是否加密" align="center" prop="isEncrypt">
        <template #default="scope">
          <dict-tag :options="yingshi_camera_is_encrypt" :value="scope.row.isEncrypt"/>
        </template>
      </el-table-column>
      <el-table-column label="视频质量" align="center" prop="videoLevel">
        <template #default="scope">
          <dict-tag :options="yingshi_camera_video_quality" :value="scope.row.videoLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="当前通道是否关联IPC" align="center" prop="relatedIpc" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.relatedIpc" effect="dark">是</el-tag>
          <el-tag v-else effect="dark">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center" prop="isAdd" width="100">
        <template #default="scope">
          <dict-tag :options="yingshi_camera_is_add" :value="scope.row.isAdd"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="play(scope.row)"
                     v-hasPermi="['yingshi:ys:play']">播放</el-button>
          <el-button link type="primary" @click="cameraNameUpdateFun(scope.row)"
                     v-hasPermi="['yingshi:ys:cameraNameUpdate']">通道名称</el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="播放" v-model="visible" width="800px" append-to-body @close="playClose">
      <div style="width: 770px;height: 500px;">
        <div id="containerId"></div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="云台" name="PTZ" v-hasPermi="['yingshi:ys:control','yingshi:ys:mirror']">
          <div style="display: grid; grid-template-columns: 240px auto; height: 180px; overflow: auto">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="startControlFun(0)"
                     @mouseup="endControlFun(0)">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="startControlFun(2)"
                     @mouseup="endControlFun(2)">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="startControlFun(1)"
                     @mouseup="endControlFun(1)">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="startControlFun(3)"
                     @mouseup="endControlFun(3)">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 速度控制 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px;width: 190px;">
                  <el-radio-group v-model="speed">
                    <el-radio :label="0">慢</el-radio>
                    <el-radio :label="1">适中</el-radio>
                    <el-radio :label="2">快</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <!-- 变倍、聚焦、光圈控制 -->
              <div>
                <div class="ptz-btn-box">
                  <div @mousedown="startControlFun(8)" @mouseup="endControlFun(8)"
                       title="变倍+">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomIn/>
                    </el-icon>
                  </div>
                  <div @mousedown="startControlFun(9)" @mouseup="endControlFun(9)"
                       title="变倍-">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomOut/>
                    </el-icon>
                  </div>
                </div>
                <div class="ptz-btn-box">
                  <div @mousedown="startControlFun(11)" @mouseup="endControlFun(11)" title="聚焦+">
                    <i class="iconfont icon-bianjiao-fangda control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                  <div @mousedown="startControlFun(10)" @mouseup="endControlFun(10)" title="聚焦-">
                    <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="display: flex;align-items: center">
                <div>镜像翻转：</div>
                <el-radio-group v-model="command">
                  <el-radio :label="0">上下</el-radio>
                  <el-radio :label="1">左右</el-radio>
                  <el-radio :label="2">中心</el-radio>
                </el-radio-group>
                <el-button style="margin-left: 20px" type="primary" @click="mirrorFlipFun">确定</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="预置点" name="PRESET" v-hasPermi="['yingshi:ys:preset']">
         <div style="display:flex;align-items: center">
           <el-input v-model="presetForm.name" show-word-limit :maxlength="50" placeholder="请输入预置点名称"/>
           <el-button style="margin-left: 20px" type="primary" @click="presetAddFun">确定</el-button>
         </div>
          <div style="display: flex;flex-wrap: wrap;">
            <div v-for="(item,index) in ysPresetList" :key="index" style="margin: 0 2px 0 2px">
              <el-tag type="primary" closable @close="presetClose(item)" @click="presetClick(item)">{{item.name}}</el-tag>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="抓拍" name="CAPTURE" v-hasPermi="['yingshi:ys:capture']">
          <div style="display: flex;align-items: center">
            <el-radio-group v-model="quality">
              <el-radio :label="0">流畅</el-radio>
              <el-radio :label="1">高清(720P)</el-radio>
              <el-radio :label="2">4CIF</el-radio>
              <el-radio :label="3">1080P</el-radio>
              <el-radio :label="4">400w 注：此参数不生效</el-radio>
            </el-radio-group>
            <el-button style="margin-left: 20px" type="primary" @click="captureFun">设备抓图</el-button>
          </div>
          <div style="display: flex;flex-wrap: wrap;">
            <div v-for="(item,index) in ysCaptureList" :key="index" style="margin: 0 2px 0 2px;position: relative">
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
                <DeleteFilled />
              </el-icon>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
    <el-dialog title="播放参数选择" v-model="visibleParameter" width="500px" append-to-body>
      <el-form ref="playParameterFormRef" :model="form" label-width="120px">
        <el-form-item label="设备序列号" prop="model">
          <el-input v-model="form.deviceSerial" disabled show-word-limit :maxlength="50" placeholder="请输入设备序列号"/>
        </el-form-item>
        <el-form-item label="地址的类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
                v-for="dict in yingshi_address_type"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频清晰度" prop="quality">
          <el-radio-group v-model="form.quality">
            <el-radio
                v-for="dict in yingshi_quality"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="播放协议" prop="protocol">
          <el-radio-group v-model="form.protocol">
            <el-radio
                v-for="dict in yingshi_protocol"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频加密密码" prop="code" >
          <template #label>
              <span>
                 <el-tooltip content="设备的视频加密密码，针对ezopen协议设置有效，hls/rtmp不支持加密视频" placement="top">
                    <el-icon><question-filled /></el-icon>
                 </el-tooltip>
                 视频加密密码
              </span>
          </template>
          <el-input v-model="form.code" show-word-limit :maxlength="50" placeholder="请输入视频加密密码"/>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime" v-if="form.type !== '1'">
          <el-date-picker v-model="form.startTime" value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetime" placeholder="选择开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="stopTime" v-if="form.type !== '1'">
          <el-date-picker v-model="form.stopTime" value-format="YYYY-MM-DD HH:mm:ss"
                          type="datetime" placeholder="选择结束时间"
          ></el-date-picker>
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

<script setup name="YsChannel">
import {useRoute} from "vue-router";
import {
  cameraNameUpdate,
  capture,
  endControl,
  getAddressDevice,
  getCameraDevice,
  mirrorFlip,
  presetAdd,
  presetClear,
  presetMove,
  startControl
} from "../../../api/yingshi/ysDevice.js";
import {ref} from "vue";
import EZUIKit from 'ezuikit-js';
import {getYsConfig} from "../../../api/yingshi/ysConfig.js";
import {listYsPreset} from "../../../api/yingshi/ysPreset.js";
import {delYsCapture, listYsCapture} from "../../../api/yingshi/ysCapture.js";
import {ElMessageBox} from "element-plus";

const {proxy} = getCurrentInstance();
const {
  yingshi_camera_is_encrypt,
  yingshi_camera_video_quality,
  yingshi_camera_is_add,
  yingshi_monitoring_status,
  yingshi_address_type,
  yingshi_quality,
  yingshi_protocol,
} = proxy.useDict('yingshi_camera_is_encrypt', 'yingshi_camera_video_quality', 'yingshi_camera_is_add', 'yingshi_monitoring_status','yingshi_address_type','yingshi_quality','yingshi_protocol');

const route = useRoute();

const configId = ref(null)
const deviceSerial = ref(null)
const channelList = ref([])

const visible = ref(false);
const visibleParameter = ref(false);
const playParameterFormRef = ref(null);
const form = ref({});
const player = ref(null);
const speed = ref(1);
const activeName = ref('PTZ');
const command = ref(0);
const presetForm = ref({
  name: null,
  deviceSerial: null,
  channelNo: null,
  configId: null,
});
const ysPresetList = ref([])
const ysCaptureList = ref([])
const quality = ref(0)

/**
 * 播放
 */
const play = async (data) => {
  reset();
  form.value.deviceSerial = data.deviceSerial
  form.value.channelNo = data.channelNo
  form.value.configId = configId.value
  visibleParameter.value = true
}

/** 表单重置 */
const reset = () => {
  form.value = {
    configId: null,
    deviceSerial: '',
    type: '1',
    quality: 2,
    channelNo: null,
    protocol: 1,
    startTime: null,
    stopTime: null,
    code: null,
  }
  playParameterFormRef.value?.resetFields();
}

/** 取消按钮 */
const cancel = () => {
  reset();
  visibleParameter.value = false;
}

/** 提交按钮 */
const submitForm = () => {
  playParameterFormRef.value?.validate(async (valid) => {
    if (valid) {
      if(form.value.type === '1'){
        form.value.startTime = null;
        form.value.stopTime = null;
      }
      const res = await getAddressDevice(form.value);
      visibleParameter.value = false;
      await initPlayer(res.data.url)
    }
  });
}

/**
 * 初始化播放器
 */
const initPlayer = async (url) => {
  visible.value = true;
  const res = await getYsConfig(form.value.configId)
  await getListYsPresetFun()
  await getListYsCaptureFun()
  await nextTick(()=>{
    player.value = new EZUIKit.EZUIKitPlayer({
      autoplay: true,  // 默认播放
      //视频播放包裹元素
      id: 'containerId',
      //萤石token
      accessToken: res.data.accessToken,
      // ezopen://open.ys7.com/${设备序列号}/{通道号}.live
      url: url, // 播放地址
      template: "security", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
      // header: ['capturePicture', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
      plugin: ['talk','ptz','voiceTalk','snapshot','record'], // 加载插件，talk-对讲
      // 视频下方底部控件
      footer: ["talk", "broadcast", "hd", "fullScreen",'volume','capturePicture','playback','zoom'], // 如果template参数不为simple,该字段将被覆盖
      header: ['capturePicture', 'hd','zoom','ptz','hd','fullScreen'],
      // footer: ['talk', 'hd', 'fullScreen'], // 如果template参数不为simple,该字段将被覆盖
      audio: 0, // 是否默认开启声音 0 - 关闭 1 - 开启
      // openSoundCallBack: data => console.log("开启声音回调", data),
      // closeSoundCallBack: data => console.log("关闭声音回调", data),
      // startSaveCallBack: data => console.log("开始录像回调", data),
      // stopSaveCallBack: data => console.log("录像回调", data),
      // capturePictureCallBack: data => console.log("截图成功回调", data),
      // fullScreenCallBack: data => console.log("全屏回调", data),
      // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
      rotate: 0,
      controls: true,
      width: 770,
      height: 500,
    })
  })
}

const getListYsPresetFun = async () => {
  const res = await listYsPreset({
    deviceSerial: form.value.deviceSerial,
    channelNo: form.value.channelNo,
  })
  ysPresetList.value = res.data
}

const playClose = () => {
  player.value.stop();
  player.value.destroy();
  player.value  = null;
}

/**
 * 开始云台控制
 *
 * @param type
 */
const startControlFun = (type) => {
  let data = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    direction: type,
    speed: speed.value,
  }
  startControl(data)
}

/**
 * 结束云台控制
 *
 * @param type
 */
const endControlFun = (type) => {
  let data = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    direction: type,
  }
  endControl(data)
}

const mirrorFlipFun = async () => {
  let data = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    command: command.value,
  }
  await mirrorFlip(data)
}

const presetAddFun = () => {
  presetForm.value.configId = configId.value
  presetForm.value.deviceSerial = deviceSerial.value
  presetForm.value.channelNo = form.value.channelNo
  presetAdd(presetForm.value).then(res => {
    proxy?.$modal.msgSuccess("添加成功");
    getListYsPresetFun()
  })
}

const presetClick = (data) => {
  let dataForm = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    index: data.index,
  }

  presetMove(dataForm).then(res => {
    proxy?.$modal.msgSuccess("调用成功");
  })
}

const presetClose = (data) => {
  let dataForm = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    index: data.index,
  }

  presetClear(dataForm).then(res => {
    proxy?.$modal.msgSuccess("删除成功");
    getListYsPresetFun()
  })
}

const getListYsCaptureFun = async () => {
  const res = await listYsCapture({
    deviceSerial: form.value.deviceSerial,
    channelNo: form.value.channelNo,
  })
  ysCaptureList.value = res.data
}

const captureFun = () => {
  let dataForm = {
    configId: configId.value,
    deviceSerial: deviceSerial.value,
    channelNo: form.value.channelNo,
    quality: quality.value,
  }

  capture(dataForm).then(res => {
    proxy?.$modal.msgSuccess("设备抓图成功");
    getListYsCaptureFun()
  })
}

const captureDel = (data) => {
  const _ids = data.id;
  proxy.$modal.confirm('是否确认删除设备抓拍？').then(function() {
    return delYsCapture(_ids);
  }).then(() => {
    getListYsCaptureFun();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

const getCameraDeviceFun = async () => {
  const res = await getCameraDevice({
    configId: configId.value,
    deviceSerial: deviceSerial.value
  })
  channelList.value = res.data
}

/**
 * 修改云端通道名称
 *
 * @param row
 * @returns {Promise<void>}
 */
const cameraNameUpdateFun = async (row) => {
  ElMessageBox.prompt('请输入云端通道名称', '修改云端通道名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(({ value }) => {
        cameraNameUpdate({
          configId: configId.value,
          deviceSerial: deviceSerial.value,
          name: value,
          channelNo: row.channelNo,
        }).then((res)=>{
          proxy?.$modal.msgSuccess("修改成功");
          getCameraDeviceFun()
        })
      })
      .catch(() => {

      })
}

onMounted(async () => {
  configId.value = route.query && route.query.configId;
  deviceSerial.value = route.query && route.query.deviceSerial;
  await getCameraDeviceFun()
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