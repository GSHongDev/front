<template>
  <div class="">

    <el-card class="app-card" :body-style="{ padding:'0px !important'}" v-loading="loadingShow">
      <div class="menu-box" v-loading="loadingShow">

        <el-switch v-model="closeDevice" active-text="开启" inactive-text="关闭" inline-prompt/>

        <div v-show="closeDevice">
          <el-tabs v-model="activeNameMode" class="demo-tabs" @tab-click="handleClick" style="width: 350px">
            <el-tab-pane label="国标设备" name="GB">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px"/>
              </div>
              <div class="top">
                <InfiniteList
                    v-if="deviceList.length > 0"
                    :data="deviceList"
                    :width="'100%'"
                    :height="'700px'"
                    :itemSize="40"
                    v-slot="{ item, index }"
                >
                  <div style="cursor: pointer">
                    <el-tag
                        @click="deviceClick(item)"
                        style="width: 100%;"
                        size="large"
                        :type="item.onLine ? 'success' : 'danger'"
                    >
                      {{ item.name }}
                    </el-tag>
                  </div>
                </InfiniteList>
              </div>
            </el-tab-pane>

            <el-tab-pane label="ONVIF" name="ONVIF">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>
              <InfiniteList
                  v-if="deviceList.length >0"
                  :data="deviceList"
                  :width="'100%'"
                  :height="'700px'"
                  :itemSize="40"
                  v-slot="{ item, index }"
              >
                <div style="cursor: pointer">
                  <el-tag @click="deviceClick(item)" style="width: 100%;" size="large"
                          :type="selectDeviceId === item.id ? 'success' : ''">
                    <svg-icon icon-class="camera" style="margin-right: 6px"/>
                    {{ item.name }}
                  </el-tag>
                </div>
              </InfiniteList>

              <el-empty v-if="deviceList.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="RTSP" name="RTSP">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>
              <InfiniteList
                  v-if="deviceList.length >0"
                  :data="deviceList"
                  :width="'100%'"
                  :height="'700px'"
                  :itemSize="40"
                  v-slot="{ item, index }"
              >
                <div style="cursor: pointer">
                  <el-tag @click="deviceClick(item)" style="width: 100%;" size="large"
                          :type="selectDeviceId === item.id ? 'success' : ''">
                    <svg-icon icon-class="camera" style="margin-right: 6px"/>
                    {{ item.name }}
                  </el-tag>
                </div>
              </InfiniteList>

              <el-empty v-if="deviceList.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="海康" name="ISUP">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>
              <InfiniteList
                  v-if="deviceList.length > 0"
                  :data="deviceList"
                  :width="'100%'"
                  :height="'700px'"
                  :itemSize="40"
                  v-slot="{ item, index }"
              >
                <div style="cursor: pointer">
                  <el-tag @click="deviceClick(item)" style="width: 100%;" size="large"
                          :type="item.status === 'ON' ? 'success' : 'danger'">
                    <svg-icon icon-class="camera" style="margin-right: 6px"/>
                    {{ item.name }}
                  </el-tag>
                </div>
              </InfiniteList>

              <el-empty v-if="deviceList.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="大华" name="DAHUA">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>
              <InfiniteList
                  v-if="deviceList.length > 0"
                  :data="deviceList"
                  :width="'100%'"
                  :height="'700px'"
                  :itemSize="40"
                  v-slot="{ item, index }"
              >
                <div style="cursor: pointer">
                  <el-tag @click="deviceClick(item)" style="width: 100%;" size="large"
                          :type="selectDeviceId === item.deviceId ? 'success' : ''">
                    <svg-icon icon-class="camera" style="margin-right: 6px"/>
                    {{ item.name }}
                  </el-tag>
                </div>
              </InfiniteList>

              <el-empty v-if="deviceList.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="国标通道" name="GBCHANNEL">
              <div>
                <el-switch
                    v-model="activeValue"
                    active-text="行政区划"
                    inactive-text="业务分组"
                    @change="onSwitch"
                />
              </div>
              <div class="tree">
                <el-tree
                    style="height: 720px;"
                    v-if="activeValue"
                    :data="regionTrees"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <div v-if="data.type === 0">{{ node.label }}</div>
                      <div
                          v-if="data.type === 1"
                          style="display:flex;">
                        <svg-icon icon-class="camera" style="margin-right: 6px"/>
                        <span style="width: 100px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">{{
                            node.label
                          }}</span>
                      </div>
                      <div style="display:flex;" v-if="data.type === 1">
                        <div>
                          {{ data.ip }}
                        </div>
                        <div style="margin-left: 6px">
                          <el-icon v-if="data.status === 'ON'" color="#67C23A">
                            <CircleCheckFilled/>
                          </el-icon>
                          <el-icon v-if="data.status !== 'ON'" color="#F56C6C">
                            <CircleCloseFilled/>
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-tree>

                <el-tree
                    style="height: 720px;"
                    v-if="!activeValue"
                    :data="groupTrees"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <div v-if="!(data.treeId && data.addressMap)">{{ node.label }}</div>
                      <div
                          v-if="data.treeId && data.addressMap"
                          style="display:flex;">
                        <svg-icon icon-class="camera" style="margin-right: 6px"/>
                        <span style="width: 100px;white-space: nowrap; overflow: hidden;text-overflow: ellipsis;">{{
                            node.label
                          }}</span>
                      </div>
                      <div style="display:flex;" v-if="data.treeId && data.addressMap">
                        <div>
                          {{ data.ip }}
                        </div>
                        <div style="margin-left: 6px">

                          <el-icon v-if="data.status === 'ON'" color="#67C23A">
                            <CircleCheckFilled/>
                          </el-icon>
                          <el-icon v-if="data.status !== 'ON'" color="#F56C6C">
                            <CircleCloseFilled/>
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-tree>
              </div>
            </el-tab-pane>

          </el-tabs>
        </div>

        <!--        <el-button type="primary" @click="handleButtonClick">123</el-button>-->
      </div>
      <div class="theme">
        <el-dropdown @command="(command)=>{moreClick(command)}">
          <span class="el-dropdown-link" style="display: flex; cursor: pointer;"> 主题
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="dark">幻影黑</el-dropdown-item>
              <el-dropdown-item command="darkblue">极夜蓝</el-dropdown-item>
              <el-dropdown-item command="grey">雅士灰</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div :style="'height:'+height+'px'" id="container"></div>

    </el-card>

    <el-dialog v-model="dialogVisible" title="播放视频" width="835px" append-to-body draggable>
      <div v-if="playType === '2'" style="width: 100%;height: 100%">
        <Jessibuca :videoUrl="flvUrl" fluent autoplay live
                   :key="'jessibuca'"/>
      </div>

      <video
          v-if="playType === '1' || playType === '3' "
          id="rtspVideo"
          muted
          playsinline
          controls
          style="width: 100%;height: 100%"
      ></video>

      <el-row :gutter="10" style="margin-top: 20px" v-if="playType === '1' || playType === '3'">
        <el-col :span="4"><span style="width: 100px; line-height: 40px; text-align: right;">播放地址：</span></el-col>
        <el-col :span="20">
          <el-input v-model="rtspURL" :disabled="true">
            <template #append>
              <el-button type="primary" :icon="DocumentCopy" @click="copyToClipboard(rtspURL)"/>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <div v-if="activeNameMode === 'ONVIF'">
        <div v-if="checkPermi(['dahua:device:ptzCtrl'])">
          <div style="display: grid; grid-template-columns: 240px auto; height: 180px; overflow: auto">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="onvifPtzCtrlStartFun('upper')"
                     @mouseup="onvifPtzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="onvifPtzCtrlStartFun('left')"
                     @mouseup="onvifPtzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="onvifPtzCtrlStartFun('below')"
                     @mouseup="onvifPtzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="onvifPtzCtrlStartFun('right')"
                     @mouseup="onvifPtzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 速度控制 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px; width: 100px;">
                  <el-slider v-model="onvifControSpeed" :step="0.1" :min="0.1" :max="1"></el-slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeNameMode === 'ISUP'">
        <div v-if="checkPermi(['isup:lsupDevice:ptzCtrl'])">
          <div style="display: grid; height: 180px; ">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="ptzCtrlStartFun(3)" @mouseup="ptzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="ptzCtrlStartFun(2)" @mouseup="ptzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="ptzCtrlStartFun(4)" @mouseup="ptzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="ptzCtrlStartFun(1)" @mouseup="ptzCtrlEndFun()">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 速度控制 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px; width: 100px;">
                  <el-slider v-model="haikangControSpeed" :min="1" :max="15"></el-slider>
                </div>
              </div>

              <!-- 变倍、聚焦、光圈控制 -->
              <div>
                <div style="margin-left: 20px;width: 100px;">
                  聚焦
                  <el-slider v-model="haikangControSpeedFocus" :max="100" :min="-100" @change="haikangFocusCamera"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeNameMode === 'DAHUA'">
        <div v-if="checkPermi(['dahua:device:ptzCtrl'])">
          <div style="display: grid; grid-template-columns: 240px auto; height: 180px; overflow: auto">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="ptzControlUpStartFun('up')"
                     @mouseup="ptzControlUpEndFun('up')">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="ptzControlUpStartFun('left')"
                     @mouseup="ptzControlUpEndFun('left')">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="ptzControlUpStartFun('down')"
                     @mouseup="ptzControlUpEndFun('down')">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="ptzControlUpStartFun('right')"
                     @mouseup="ptzControlUpEndFun('right')">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 速度控制 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px; width: 100px;">
                  <el-slider v-model="dahuaControSpeed" :min="1" :max="15"></el-slider>
                </div>
              </div>

              <!-- 变倍、聚焦、光圈控制 -->
              <div>
                <div class="ptz-btn-box">
                  <div @mousedown="ptzControlUpStartFun('doubling+')" @mouseup="ptzControlUpEndFun('doubling+')"
                       title="变倍+">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomIn/>
                    </el-icon>
                  </div>
                  <div @mousedown="ptzControlUpStartFun('doubling-')" @mouseup="ptzControlUpEndFun('doubling-')"
                       title="变倍-">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomOut/>
                    </el-icon>
                  </div>
                </div>
                <div class="ptz-btn-box">
                  <div @mousedown="ptzControlUpStartFun('zoom+')" @mouseup="ptzControlUpEndFun('zoom+')" title="聚焦+">
                    <i class="iconfont icon-bianjiao-fangda control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                  <div @mousedown="ptzControlUpStartFun('zoom-')" @mouseup="ptzControlUpEndFun('zoom-')" title="聚焦-">
                    <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                </div>
                <div class="ptz-btn-box">
                  <div @mousedown="ptzControlUpStartFun('aperture+')" @mouseup="ptzControlUpEndFun('aperture+')"
                       title="光圈+">
                    <i class="iconfont icon-guangquan control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                  <div @mousedown="ptzControlUpStartFun('aperture-')" @mouseup="ptzControlUpEndFun('aperture-')"
                       title="光圈-">
                    <i class="iconfont icon-guangquan- control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogChannel" title="通道列表" width="835px" append-to-body draggable>
      <el-table v-loading="loading" :data="channelList" ref="channelListTable" border>
        <el-table-column prop="name" label="名称" min-width="180" align="center"/>
        <el-table-column prop="deviceId" label="编号" min-width="180" align="center"/>
        <el-table-column prop="manufacturer" label="厂家" min-width="100" align="center"/>
        <el-table-column prop="ptzType" label="云台类型" min-width="100" align="center">
          <template #default="scope">
            <div>{{ scope.row.ptzTypeText }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag v-if="scope.row.status === 'ON'">在线</el-tag>
              <el-tag type="info" v-if="scope.row.status !== 'ON'">离线</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <el-button v-if="checkPermi(['wvp:play:start'])"
                       type="text" @click="start(scope.row)">播放
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getDeviceChannelList"
      />
    </el-dialog>

    <el-dialog title="播放视频" v-model="openPlay" width="1000px" append-to-body draggable>
      <el-tabs v-model="activeName" type="card" :stretch="true">
        <el-tab-pane label="flv播放" name="flv">
          <el-row>
            <el-col :span="24">
              <div class="player" v-if="activeName === 'flv'">
                <Jessibuca v-if="activeName === 'flv'" ref="flv" :visible.sync="showVideoDialog"
                           :videoUrl="vUrl" :error="videoError" :message="videoError" height="100px"
                           :hasAudio="hasAudio" fluent autoplay live></Jessibuca>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="webRtc" name="webRtc">
          <RtcPlayer v-if="activeName === 'webRtc'" ref="webRTC" :visible.sync="showVideoDialog"
                     :videoUrl="rtcUrl" :error="videoError" :message="videoError" height="100px"
                     :hasAudio="hasAudio" fluent autoplay live></RtcPlayer>
        </el-tab-pane>
        <el-tab-pane label="H265" name="H265">
          <H265web v-if="activeName === 'H265'" ref="h265web" :visible.sync="showVideoDialog"
                   :videoUrl="wsUrl" :error="videoError" :message="videoError" height="100px"></H265web>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="tabActiveName" type="card" :stretch="true" style="margin-top: 10px;">
        <el-tab-pane label="实时视频" name="media">
          <el-row :gutter="10">
            <el-col :span="2"><span style="width: 80px; line-height: 40px; text-align: right;">播放地址：</span></el-col>
            <el-col :span="18">
              <el-input v-model="vUrl" :disabled="true" v-show="activeName === 'flv'">
                <template #prepend>flv地址</template>
                <template #append>
                  <el-button type="primary" :icon="DocumentCopy" @click="copyToClipboard(vUrl)"/>
                </template>
              </el-input>
              <el-input v-model="rtcUrl" :disabled="true" v-show="activeName === 'webRtc'">
                <template #prepend>rtcUrl地址</template>
                <template #append>
                  <el-button type="primary" :icon="DocumentCopy" @click="copyToClipboard(rtcUrl)"/>
                </template>
              </el-input>
              <el-input v-model="wsUrl" :disabled="true" v-show="activeName === 'H265'">
                <template #prepend>wsUrl地址</template>
                <template #append>
                  <el-button type="primary" :icon="DocumentCopy" @click="copyToClipboard(wsUrl)"/>
                </template>
              </el-input>
            </el-col>
            <el-col :span="2">
              <StreamDropdown :stream-info="streamInfo"/>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="编码信息" name="codec">
          <MediaInfo v-if="tabActiveName === 'codec'" ref="mediaInfo" :app="streamInfo.app" :stream="streamInfo.stream"
                     :mediaServerId="streamInfo.mediaServerId"></MediaInfo>
        </el-tab-pane>
        <el-tab-pane label="云台控制" name="control">
          <div style="display: grid; grid-template-columns: 240px auto; height: 180px; overflow: auto">
            <!-- 左侧控制区域 -->
            <div style="display: grid; grid-template-columns: 100px auto;">
              <!-- 方向控制 -->
              <div class="control-wrapper">
                <div class="control-btn control-top" @mousedown="ptzCamera('up')" @mouseup="ptzCamera('stop')">
                  <el-icon class="icon">
                    <CaretTop/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-left" @mousedown="ptzCamera('left')" @mouseup="ptzCamera('stop')">
                  <el-icon class="icon">
                    <CaretLeft/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-bottom" @mousedown="ptzCamera('down')" @mouseup="ptzCamera('stop')">
                  <el-icon class="icon">
                    <CaretBottom/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-btn control-right" @mousedown="ptzCamera('right')" @mouseup="ptzCamera('stop')">
                  <el-icon class="icon">
                    <CaretRight/>
                  </el-icon>
                  <div class="control-inner-btn control-inner"></div>
                </div>
                <div class="control-round">
                  <div class="control-round-inner"><i class="fa fa-pause-circle"></i></div>
                </div>
                <!-- 速度控制 -->
                <div class="contro-speed" style="position: absolute; left: 4px; top: 112px; width: 100px;">
                  <el-slider v-model="controSpeed" :min="1"></el-slider>
                </div>
              </div>
              <!-- 变倍、聚焦、光圈控制 -->
              <div>
                <div class="ptz-btn-box">
                  <div @mousedown="ptzCamera('zoomin')" @mouseup="ptzCamera('stop')" title="变倍+">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomIn/>
                    </el-icon>
                  </div>
                  <div @mousedown="ptzCamera('zoomout')" @mouseup="ptzCamera('stop')" title="变倍-">
                    <el-icon class="control-zoom-btn" style="font-size: 24px;">
                      <ZoomOut/>
                    </el-icon>
                  </div>
                </div>
                <div class="ptz-btn-box">
                  <div @mousedown="focusCamera('near')" @mouseup="focusCamera('stop')" title="聚焦+">
                    <i class="iconfont icon-bianjiao-fangda control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                  <div @mousedown="focusCamera('far')" @mouseup="focusCamera('stop')" title="聚焦-">
                    <i class="iconfont icon-bianjiao-suoxiao control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                </div>
                <div class="ptz-btn-box">
                  <div @mousedown="irisCamera('in')" @mouseup="irisCamera('stop')" title="光圈+">
                    <i class="iconfont icon-guangquan control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                  <div @mousedown="irisCamera('out')" @mouseup="irisCamera('stop')" title="光圈-">
                    <i class="iconfont icon-guangquan- control-zoom-btn" style="font-size: 24px;"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧功能选择区域 -->
            <div style="text-align: left">
              <el-select
                  v-model="ptzMethod"
                  style="width: 100%"
                  placeholder="请选择云台功能"
              >
                <el-option label="预置点" value="preset"></el-option>
                <el-option label="巡航组" value="cruise"></el-option>
                <el-option label="自动扫描" value="scan"></el-option>
                <el-option label="雨刷" value="wiper"></el-option>
                <el-option label="辅助开关" value="switch"></el-option>
              </el-select>


              <PtzPreset :channel-device-id="channelId" :device-id="deviceId" v-if="ptzMethod === 'preset'"
                         style="margin-top: 16px"></PtzPreset>
              <PtzCruising :channel-device-id="channelId" :device-id="deviceId" v-if="ptzMethod === 'cruise'"
                           style="margin-top: 16px"></PtzCruising>
              <PtzScan :channel-device-id="channelId" :device-id="deviceId" v-if="ptzMethod === 'scan'"
                       style="margin-top: 16px"></PtzScan>
              <PtzWiper :channel-device-id="channelId" :device-id="deviceId" v-if="ptzMethod === 'wiper'"
                        style="margin-top: 16px"></PtzWiper>
              <PtzSwitch :channel-device-id="channelId" :device-id="deviceId" v-if="ptzMethod === 'switch'"
                         style="margin-top: 16px"></PtzSwitch>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="语音对讲" name="broadcast">
          <div style="padding: 0 10px">
            <el-radio-group v-model="broadcastMode" :disabled="broadcastStatus !== -1">
              <el-radio :label="true">喊话(Broadcast)</el-radio>
              <el-radio :label="false">对讲(Talk)</el-radio>
            </el-radio-group>
          </div>

          <div class="trank" style="text-align: center;">
            <el-button @click="broadcastStatusClick()" :type="getBroadcastStatus()" :disabled="broadcastStatus === -2"
                       circle :icon="Microphone" style="font-size: 32px; padding: 24px;margin-top: 24px;"/>
            <p>
              <span v-if="broadcastStatus === -2">正在释放资源</span>
              <span v-if="broadcastStatus === -1">点击开始对讲</span>
              <span v-if="broadcastStatus === 0">等待接通中...</span>
              <span v-if="broadcastStatus === 1">请说话</span>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script setup name="GIsMap">
import {DocumentCopy, Microphone} from '@element-plus/icons-vue'
import StreamDropdown from "@/views/wvp/channel/components/streamDropdown.vue";
import MediaInfo from "@/views/wvp/channel/components/mediaInfo.vue";
import PtzPreset from "@/views/wvp/channel/components/ptzPreset.vue";
import PtzCruising from "@/views/wvp/channel/components/ptzCruising.vue";
import PtzScan from "@/views/wvp/channel/components/ptzScan.vue";
import PtzWiper from "@/views/wvp/channel/components/ptzWiper.vue";
import PtzSwitch from "@/views/wvp/channel/components/ptzSwitch.vue";
import {ZLMRTCClient} from '@/components/rtcPlayer/js/ZLMRTCClient';

import {checkPermi} from "@/utils/permission";
import {onMounted, onUnmounted, ref} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {getConfigKey} from "@/api/system/config.js";
import {rtspDeviceList} from "@/api/rtsp/RtspDevice.js";
import {deviceList as onvifDeviceList} from "@/api/onvif/device.js";
import {listDevice as gbListDevice, listDeviceChannel} from "@/api/wvp/device.js";
import {lsupDeviceList, ptzCtrlEnd, ptzCtrlStart} from "../../api/isup/lsupDevice.js";
import {queryListByCivilCode, sendDevicePush} from "@/api/wvp/channel.js";
import Jessibuca from "@/components/jessibuca/index.vue";
import RtcPlayer from "@/components/rtcPlayer/index.vue";
import H265web from "@/components/H265web/index.vue";
import {queryForTree} from "@/api/wvp/region.js";
import InfiniteList from 'vue3-infinite-list';
import {listDahuaDevice, ptzControlUpEnd, ptzControlUpStart} from "../../api/dahua/device.js";
import {startPlay} from "../../api/wvp/push.js";
import {
  gbChannelList,
  listByCivilCode,
  listByParentId,
  queryGroupForTree,
  queryRegionForTree
} from "@/api/gls/glsMap.js";
import {ElMessage} from "element-plus";
import {GetBroadcast, getFocusCamera, getIrIsCamera, getPtzCamera} from "../../api/wvp/channel.js";
import CryptoJS from "crypto-js";
import {onvifPZTEnd, onvifPZTStart} from "../../api/onvif/device.js";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard()

const {proxy} = getCurrentInstance();

const switchValue = ref(true);
const loadingShow = ref(true);
const closeDevice = ref(true);
const activeValue = ref(true);
const deviceName = ref("");
let map = null;
let infoWindow = null;
// 在线图片地址
let url3 = "https://ry-wvp-1315132478.cos.ap-guangzhou.myqcloud.com/绿色.png";
// 离线图片地址
let url4 = "https://ry-wvp-1315132478.cos.ap-guangzhou.myqcloud.com/红色.png";
// 选中图片地址
let url5 = "https://ry-wvp-1315132478.cos.ap-guangzhou.myqcloud.com/蓝色.png";

let markers = [];
const map_key = ref();
const AMapSecurityConfig = ref();
const total = ref(0);
const channelList = ref([]);
const dialogVisible = ref(false);
const dialogChannel = ref(false);
const openPlay = ref(false);
const loading = ref(false);
const rtspURL = ref("");
const deviceId = ref("");
const mode = ref("gb");
const activeName = ref('flv');
const tabActiveName = ref('media');
const activeNameMode = ref('GB');
const deviceList = ref([]);
const treeData = ref([]);
const selectDeviceId = ref(null);

const defaultProps = {
  children: 'children',
  label: 'name',
  leaf: 'leaf'
};


const channelId = ref('');
const streamInfo = ref({});
const vUrl = ref(null);
const rtcUrl = ref('');
const wsUrl = ref('');
const showVideoDialog = ref(false);
const hasAudio = ref(false);

const ptzMethod = ref('preset');
const broadcastMode = ref(true);
const broadcastStatus = ref(-1); // -2 正在释放资源 -1 默认状态 0 等待接通 1 接通成功
const broadcastRtc = ref(null);

const controSpeed = ref(30);
const dahuaControSpeed = ref(5);
const haikangControSpeed = ref(5);
const haikangControSpeedFocus = ref(0);
const onvifControSpeed = ref(0.1);

const deviceData = ref();

const height = ref(document.documentElement.clientHeight - 94.5 + "px;")

const playType = ref(null);
const flvUrl = ref(null);

const webRtcServer = ref();
const rtspAddress = ref('');

const videoError = (e) => {
  console.log("播放器错误：" + JSON.stringify(e));
}

function moreClick(command) {
  map.setMapStyle("amap://styles/" + command);
}

const deviceChange = () => {
  getList()
}

const handleClick = (tab, event) => {
  nextTick(async () => {
    deviceName.value = '';
    await getList();
  })
}


async function getList() {
  loadingShow.value = true;
  deviceList.value = [];
  if (activeNameMode.value === 'GB') {
    await getGBList();
  } else if (activeNameMode.value === 'ONVIF') {
    onvifDeviceList({
      name: deviceName.value,
      mapType: 'map'
    }).then(res => {
      deviceList.value = []
      res.data.map((item)=>{
        if(item.lat && item.lng){
          deviceList.value.push(item)
        }
      })
      getKey(deviceList.value);
      loadingShow.value = false;
    })
  } else if (activeNameMode.value === 'RTSP') {
    rtspDeviceList({
      name: deviceName.value,
      mapType: 'map'
    }).then(res => {
      deviceList.value = []
      res.data.map((item)=>{
        if(item.lat && item.lng){
          deviceList.value.push(item)
        }
      })
      getKey(deviceList.value);
      loadingShow.value = false;
    })
  } else if (activeNameMode.value === 'ISUP') {
    lsupDeviceList({
      name: deviceName.value,
      mapType: 'map'
    }).then(res => {
      deviceList.value = []
      res.data.map((item)=>{
        if(item.lat && item.lng){
          deviceList.value.push(item)
        }
      })
      getKey(deviceList.value);
      loadingShow.value = false;
    })
  } else if (activeNameMode.value === 'DAHUA') {
    listDahuaDevice({
      name: deviceName.value,
      mapType: 'map'
    }).then(res => {
      deviceList.value = []
      res.data.map((item)=>{
        if(item.lat && item.lng){
          deviceList.value.push(item)
        }
      })
      getKey(deviceList.value);
      loadingShow.value = false;
    })
  } else if (activeNameMode.value === 'GBCHANNEL') {
    await getDeviceListFun();
  }
}

const groupTrees = ref([]);
const regionTrees = ref([]);

async function getDeviceListFun() {
  gbChannelList().then(res => {
    Promise.all([
      handleGrouTree(res.data.groupTrees, "id").then((ans1) => {
        groupTrees.value = [
          {
            id: 0,
            name: "根资源组",
            type: 0,
            children: ans1
          }
        ];
      }),
      handleRegionTree(res.data.regionTrees, "id").then((ans2) => {
        regionTrees.value = [
          {
            id: 0,
            name: "根资源组",
            type: 0,
            children: ans2
          }
        ];
        getKey(regionTrees.value);
      })
    ]).then(() => {
      loadingShow.value = false;
    }).catch((error) => {
      console.error("处理树形结构时出错:", error);
      loadingShow.value = false;
    });
  });
}

const handleRegionTree = async (
    data,
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey = 'children'
) => {
  const config = {
    id: idKey,
    parentId: parentIdKey,
    childrenList: childrenKey
  };
  const processNode = async (node) => {
    if (!Array.isArray(node[config.childrenList])) {
      node[config.childrenList] = [];
    }
    if (!node.leaf) {
      try {
        const query = {
          query: "",
          parent: node[config.id],
          hasChannel: true
        };
        const res = await queryRegionForTree(query);
        const ans = await listByCivilCode({
          pageNum: 1,
          pageSize: 500,
          civilCode: node.deviceId
        });
        const childrenData = res.data.map((item) => {
          if (item.leaf) {
            const matchedAns = ans.rows.find((item2) => item2.gbId === item.id);
            if (matchedAns) {
              console.log(matchedAns)
              item.gbParentId = matchedAns.gbParentId;
              item.gbDeviceId = matchedAns.gbDeviceId;
              item.lng = matchedAns.gbLongitude;
              item.lat = matchedAns.gbLatitude;
              item.addressMap = matchedAns.gbAddress;
              item.ip = matchedAns.gbIpAddress;
            }
          }
          return item;
        });
        const childrenPromises = childrenData.map((child) => processNode(child));
        const processedChildren = await Promise.all(childrenPromises);
        node[config.childrenList] = processedChildren;
      } catch (error) {
        console.error(`Error fetching children for node ${node.id}:`, error);
        node[config.childrenList] = [];
      }
    }
    return node;
  };
  const topLevelNodes = data.filter((node) => !node[config.parentId]);
  const processedData = await Promise.all(topLevelNodes.map((node) => processNode(node)));
  return processedData;
}

const handleGrouTree = async (
    data,
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey = 'children'
) => {
  const config = {
    id: idKey,
    parentId: parentIdKey,
    childrenList: childrenKey
  };

  const processNode = async (node) => {
    if (!Array.isArray(node[config.childrenList])) {
      node[config.childrenList] = [];
    }
    node.isLeaf = node.leaf;
    if (!node.leaf) {
      try {
        const query = {
          query: "",
          parent: node[config.id],
          hasChannel: true
        };
        const res = await queryGroupForTree(query);
        const ans = await listByParentId({
          pageNum: 1,
          pageSize: 500,
          groupDeviceId: node.deviceId
        });
        const childrenData = res.data.map((item) => {
          if (item.leaf) {
            const matchedAns = ans.rows.find((item2) => item2.gbId === item.id);
            if (matchedAns) {
              item.gbParentId = matchedAns.gbParentId;
              item.gbDeviceId = matchedAns.gbDeviceId;
              item.lng = matchedAns.gbLongitude;
              item.lat = matchedAns.gbLatitude;
              item.addressMap = matchedAns.gbAddress;
              item.ip = matchedAns.gbIpAddress;
            }
          }
          return item;
        });
        const childrenPromises = childrenData.map((child) => processNode(child));
        const processedChildren = await Promise.all(childrenPromises);
        node[config.childrenList] = processedChildren;
      } catch (error) {
        console.error(`Error fetching children for node ${node.id}:`, error);
        node[config.childrenList] = [];
      }
    }
    return node;
  };
  const topLevelNodes = data.filter((node) => !node[config.parentId]);
  const processedData = await Promise.all(topLevelNodes.map((node) => processNode(node)));
  return processedData;
};

async function handleNodeClick(e) {
  if (e.children.length === 0) {
    if (!e.lat || !e.lng) return;
    let lngLat = [e.lng, e.lat];
    if (!map || !lngLat) return;
    map.setCenter(lngLat);
    let currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
    markers.forEach(marker => {
      marker.setIcon(new AMap.Icon({
        image: url3,
        size: new AMap.Size(64, 45),
        imageSize: new AMap.Size(50, 45),
      }));
    });
    const targetMarker = markers.find(marker => {
      const pos = marker.getPosition();
      return pos.lng === Number(lngLat[0]) && pos.lat === Number(lngLat[1]);
    });
    if (targetMarker) {
      targetMarker.setIcon(new AMap.Icon({
        image: url5,
        size: new AMap.Size(64, 45),
        imageSize: new AMap.Size(50, 45),
      }));
    }
  }
}


async function onSwitch(e) {
  if (activeValue.value) {
    await getKey(regionTrees.value);
  } else {
    await getKey(groupTrees.value);
  }
}

const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve([{
      treeId: "",
      deviceId: "",
      name: "根资源组",
      isLeaf: false,
      type: 0
    }]);
  } else if (node.data.deviceId.length <= 8) {
    if (node.data.leaf) {
      return resolve([])
    }

    let res = await queryForTree({
      query: '',
      parent: node.data.id,
      hasChannel: ''
    });

    queryParams.value.civilCode = node.data.deviceId;
    const response = await queryListByCivilCode(queryParams.value);
    const children = response.rows.map(item => ({
      ...item,
      leaf: true,
      name: item.gbName
    }));

    let terr = [...proxy.handleTree(res.data, "id"), ...children]
    resolve(terr);
  } else {
    resolve([]);
  }
};

function deviceClick(data) {
  if (!data.lat || !data.lng) return;
  let lngLat = [data.lng, data.lat];
  if (!map || !lngLat) return;
  map.setCenter(lngLat);
  let currentZoom = map.getZoom();
  map.setZoom(currentZoom + 1);
  markers.forEach(marker => {
    marker.setIcon(new AMap.Icon({
      image: url3,
      size: new AMap.Size(64, 45),
      imageSize: new AMap.Size(50, 45),
    }));
  });
  const targetMarker = markers.find(marker => {
    const pos = marker.getPosition();
    return pos.lng === Number(lngLat[0]) && pos.lat === Number(lngLat[1]);
  });

  if (targetMarker) {
    targetMarker.setIcon(new AMap.Icon({
      image: url5,
      size: new AMap.Size(64, 45),
      imageSize: new AMap.Size(50, 45),
    }));
  }
}


async function start(itemData) {
  const params = {
    deviceId: deviceId.value,
    channelId: itemData.deviceId
  }
  channelId.value = itemData.deviceId;
  const res = await sendDevicePush(params);
  streamInfo.value = res.data;
  if (location.protocol === "https:") {
    vUrl.value = res.data.https_flv;
    rtcUrl.value = res.data.rtcs;
    wsUrl.value = res.data.wss_flv;
  } else {
    vUrl.value = res.data.flv;
    rtcUrl.value = res.data.rtc;
    wsUrl.value = res.data.ws_flv;
  }
  dialogChannel.value = false;
  openPlay.value = true;
}

const inGaDeMap = async (data) => {
  await getConfigKey("amap.security.key").then(response => {
    AMapSecurityConfig.value = response.msg;
  });
  await getConfigKey("amap.key").then(response => {
    map_key.value = response.msg;
  });
  AMapLoader.load({
    key: map_key.value,
    version: '2.0',
    plugins: [
      'AMap.AutoComplete',
      'AMap.PlaceSearch',
      "AMap.Geolocation",
      "AMap.Geocoder",
      "AMap.Marker",
      'AMap.ToolBar',
      'AMap.Scale',
      'AMap.HawkEye',
      'AMap.MapType',
      'AMap.Geolocation',
    ],
    AMapUI: {
      version: '1.1',
      plugins: []
    },
  }).then(async (AMap) => {
    let lng = 116.3912757;
    let lat = 39.906217;
    await getConfigKey("map_center").then(response => {
      if (response.msg != "") {
        const coordStr = response.msg;
        const [latitude, longitude] = coordStr.split(",").map(item => parseFloat(item.trim()));
        lat = latitude;
        lng = longitude;
      }
    });
    if (activeNameMode.value === 'GBCHANNEL') {
      const latLngList = collectLatLng(data);
      if (latLngList.length > 0) {
        if (latLngList[0].lng && latLngList[0].lat) {
          lng = latLngList[0].lng;
          lat = latLngList[0].lat;
        }
      }
    } else {
      if(data.length > 0){
        if (data[0].lng && data[0].lat) {
          lng = data[0].lng;
          lat = data[0].lat;
        }
      }

    }
    map = new AMap.Map("container", {
      pitch: 50,
      // viewMode: "3D",
      terrain: true,
      zoom: 19,
      center: [lng, lat],
      mapStyle: 'amap://styles/light',
    })
    // var layer1 = new AMap.TileLayer.Satellite();
    var layer2 = new AMap.TileLayer.RoadNet();
    // map.add(layer1);
    map.add(layer2);
    if (activeNameMode.value === 'GBCHANNEL') {
      addDeviceChanneMarkers(AMap, data);
    } else {
      addDeviceMarkers(AMap, data);
    }
  }).catch((e) => {
    console.log(e);
  });
}

function addDeviceChanneMarkers(AMap, data) {
  clearMarkers();
  const latLngList = collectLatLng(data);
  latLngList.forEach((device) => {
    let image = url3;
    if (device.device.status === "OFF") {
      image = url4;
    }
    const icon = new AMap.Icon({
      image: image,
      size: new AMap.Size(64, 45),
      imageSize: new AMap.Size(50, 45),
    });
    const marker = new AMap.Marker({
      position: [parseFloat(device.lng), parseFloat(device.lat)],
      icon: icon,
      extData: device.device.id,
    });
    marker.on("click", async (e) => {
      channelId.value = device.device.gbDeviceId;
      deviceId.value = device.device.gbParentId;
      const res = await sendDevicePush({
        deviceId: device.device.gbParentId,
        channelId: device.device.gbDeviceId
      });
      streamInfo.value = res.data;
      if (location.protocol === "https:") {
        vUrl.value = res.data.https_flv;
        rtcUrl.value = res.data.rtcs;
        wsUrl.value = res.data.wss_flv;
      } else {
        vUrl.value = res.data.flv;
        rtcUrl.value = res.data.rtc;
        wsUrl.value = res.data.ws_flv;
      }
      dialogChannel.value = false;
      openPlay.value = true;
    });
    marker.on('mouseover', (e) => {
      openInfo(device.device, e.target.getPosition())
    });
    marker.on('mouseout', (e) => {
      infoWindow.close();
    });
    map.add(marker);
    markers.push(marker);
  });
}

function collectLatLng(nodes, result = []) {
  nodes.forEach(node => {
    if (node.lat !== undefined && node.lng !== undefined) {
      result.push({lat: node.lat, lng: node.lng, device: node});
    }
    if (node.children && node.children.length > 0) {
      collectLatLng(node.children, result);
    }
  });
  return result;
}

function openInfo(deviceInfo, position) {
  const statusText = deviceInfo.onLine ? "在线" : "离线";
  var info = [];
  info.push("<div><h4>" + deviceInfo.name + "</h4>");
  if (activeNameMode.value === "GB") {
    info.push(`
      <p class='input-item'>
        状态：
        <span>
          ${statusText}
        </span>
      </p>
    `);
    info.push("<p class='input-item'>IP：" + deviceInfo.ip + "</p>");
  } else if (activeNameMode.value === 'ISUP') {
        if (deviceInfo.onLine) {
          info.push(`
      <p class='input-item'>
        状态：在线
      </p>
    `);
        } else {
          info.push(`
      <p class='input-item'>
        状态：离线
      </p>
    `);
    }
    info.push("<p class='input-item'>IP：" + deviceInfo.ipAddress + "</p>");
  } else if (activeNameMode.value === 'GBCHANNEL'){
    info.push("<p class='input-item'>IP：" + deviceInfo.ip + "</p>");
    if (deviceInfo.status === 'ON'){
      info.push(`
      <p class='input-item'>
        状态：在线
      </p>
    `);
    }else {
      info.push(`
      <p class='input-item'>
        状态：离线
      </p>
    `);
    }
  }else {
    info.push("<p class='input-item'>IP：" + deviceInfo.ip + "</p>");
  }

info.push("<p class='input-item'>地址 :" + deviceInfo.addressMap + "</p></div></div>");

infoWindow = new AMap.InfoWindow({
  content: info.join("")
});

infoWindow.open(map, position);
}

const addDeviceMarkers = (AMap, data) => {
  clearMarkers();
  data.forEach((device) => {
    if (!device.lng || !device.lat) return;
    let image = url3;
    if (activeNameMode.value === "GB") {
      if (!device.onLine) {
        image = url4;
      }
    } else if (activeNameMode.value === "ISUP") {
      if (device.status === "OFFLINE") {
        image = url4;
      }
    }
    const icon = new AMap.Icon({
      image: image,
      size: new AMap.Size(64, 45),
      imageSize: new AMap.Size(50, 45),
    });

    const marker = new AMap.Marker({
      position: [parseFloat(device.lng), parseFloat(device.lat)],
      icon: icon,
      title: device.name || "未命名设备",
      extData: device,
    });
    marker.on("click", async (e) => {
      if (activeNameMode.value === "GB") {
        return getDeviceChannelList(device);
      }
      playType.value = device.playType
      deviceData.value = device;
      if (device.playType === '1') {
        if (activeNameMode.value === 'DAHUA') {
          rtspURL.value = device.url.replace(/(channel=)(\d+)/, function (_, p1, p2) {
            return p1 + (parseInt(p2) + 1);
          });
        } else {
          rtspURL.value = device.url;
        }

        dialogVisible.value = true;
        await nextTick(() => {
          webRtcServer.value = new WebRtcStreamer('rtspVideo', rtspAddress.value);
          webRtcServer.value.connect(rtspURL.value)
        })
      } else if (device.playType === '3') {
        rtspURL.value = device.easyNTSUrl
        dialogVisible.value = true;
        await nextTick(() => {
          webRtcServer.value = new WebRtcStreamer('rtspVideo', rtspAddress.value);
          webRtcServer.value.connect(rtspURL.value)
        })
      } else if (device.playType === '2') {
        const ans = await startPlay(device.streamId);
        flvUrl.value = ans.data.flv;
        dialogVisible.value = true;
      }
    });
    marker.on('mouseover', (e) => {
      const deviceInfo = e.target.getExtData();
      openInfo(deviceInfo, e.target.getPosition())
    });
    marker.on('mouseout', (e) => {
      infoWindow.close();
    });
    map.add(marker);
    markers.push(marker);
  });
}

function getDeviceChannelList(device) {
  deviceId.value = device.deviceId;
  listDeviceChannel(
      {
        pageNum: queryParams.value.pageNum,
        pageSize: queryParams.value.pageSize,
        deviceId: device.deviceId,
      }
  ).then(response => {
    channelList.value = response.rows;
    total.value = response.total;
    dialogChannel.value = true;
  })
}

const clearMarkers = () => {
  if (map && markers.length > 0) {
    map.remove(markers);
    markers = [];
  }
};

const queryParams = ref({
  pageNum: 1,
  pageSize: 1000,
});

const getGBList = () => {
  gbListDevice(queryParams.value).then(response => {
    deviceList.value = []
    response.rows.map((item)=>{
      if(item.lat && item.lng){
        deviceList.value.push(item)
      }
    })
    total.value = response.total;
    getKey(deviceList.value);
    loadingShow.value = false;
  });
}

const getKey = async (data) => {
  await getConfigKey("amap.security.key").then(response => {
    AMapSecurityConfig.value = response.msg;
    getConfigKey("amap.key").then(response => {
      map_key.value = response.msg;
      inGaDeMap(data);
    });
  });
}

const copyToClipboard = async (text) => {
  if (!text) {
    ElMessage.error('内容为空，无法复制');
    return;
  }

  try {
    await toClipboard(text)
    ElMessage.success('成功拷贝到粘贴板');
  } catch (e) {
    console.error(e)
  }
};

const ptzCamera = async (command) => {
  const url = {
    deviceId: deviceId.value,
    channelId: channelId.value,
  }
  const params = {
    command: command,
    horizonSpeed: parseInt(controSpeed.value * 255 / 100),
    verticalSpeed: parseInt(controSpeed.value * 255 / 100),
    zoomSpeed: parseInt(controSpeed.value * 16 / 100),
  }
  await getPtzCamera(url, params);
}

const focusCamera = async (command) => {
  const url = {
    deviceId: deviceId.value,
    channelId: channelId.value,
  }
  const params = {
    command: command,
    speed: parseInt(controSpeed.value * 255 / 100),
  }
  await getFocusCamera(url, params);
  ElMessage.success('操作成功！');
}

const irisCamera = async (command) => {
  const url = {
    deviceId: deviceId.value,
    channelId: channelId.value,
  }
  const params = {
    command: command,
    speed: parseInt(controSpeed.value * 255 / 100),
  }
  await getIrIsCamera(url, params);
  ElMessage.success('操作成功！');
}

const broadcastStatusClick = async () => {
  if (broadcastStatus.value == -1) {
    broadcastStatus.value = 0;
    const url = {
      deviceId: deviceId.value,
      channelId: channelId.value,
    }
    await GetBroadcast(url, {timeout: 30, broadcastMode: broadcastMode.value}).then((res) => {
      let streamInfo = res.streamInfo
      if (document.location.protocol.includes("https")) {
        startBroadcast(streamInfo.rtcs);
      } else {
        startBroadcast(streamInfo.rtc);
      }
    }).catch(() => {
      ElMessage({
        showClose: true,
        message: '网络开小差了',
        type: 'error',
      });
    })
  } else if (broadcastStatus.value === 1) {
    broadcastStatus.value = -1;
    broadcastRtc.value.close()
  }
}

const getBroadcastStatus = () => {
  if (broadcastStatus.value == -2) {
    return "primary"
  }
  if (broadcastStatus.value == -1) {
    return "primary"
  }
  if (broadcastStatus.value == 0) {
    return "warning"
  }
  if (broadcastStatus.value == 1) {
    return "danger"
  }
}

const startBroadcast = async (url) => {
  const pushKey = "3e80d1762a324d5b0ff636e0bd16f1e3";
  const sign = CryptoJS.MD5(pushKey).toString(CryptoJS.enc.Hex);
  url += "&sign=" + sign;
  console.log("开始语音喊话： " + url)
  broadcastRtc.value = new ZLMRTCClient.Endpoint({
    debug: true,
    zlmsdpUrl: url,
    simulecast: false,
    useCamera: true,
    audioEnable: true,
    videoEnable: false,
    recvOnly: false,
  })

  broadcastRtc.value.on(ZLMRTCClient.Events.WEBRTC_NOT_SUPPORT, (e) => {
    console.error('offer anwser 交换失败', e);
    ElMessage({
      showClose: true,
      message: 'offer anwser 交换失败' + e,
      type: 'error',
    });
    broadcastStatus.value = -1;
  })

  broadcastRtc.value.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {
    console.log('状态改变', e)
    if (e === "connecting") {
      broadcastStatus.value = 0;
    } else if (e === "connected") {
      broadcastStatus.value = 1;
    } else if (e === "disconnected") {
      broadcastStatus.value = -1;
    }
  });

  broadcastRtc.value.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, (e) => {
    console.error('ICE 协商出错')
    ElMessage({
      showClose: true,
      message: 'ICE 协商出错',
      type: 'error'
    });
    broadcastStatus.value = -1;
  });

  broadcastRtc.value.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (e) => {
    console.error('offer anwser 交换失败', e)
    ElMessage({
      showClose: true,
      message: 'offer anwser 交换失败' + e,
      type: 'error'
    });
    broadcastStatus.value = -1;
  });

  broadcastRtc.value.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {
    console.log('状态改变', e)
    if (e === "connecting") {
      broadcastStatus.value = 0;
    } else if (e === "connected") {
      broadcastStatus.value = 1;
    } else if (e === "disconnected") {
      broadcastStatus.value = -1;
    }
  });

  broadcastRtc.value.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, (e) => {
    console.log('捕获流失败', e)
    ElMessage({
      showClose: true,
      message: '捕获流失败' + e,
      type: 'error'
    });
    broadcastStatus.value = -1;
  });

}

function getConfigKeyFun() {
  getConfigKey("sys_rtsp_address").then((res) => {
    rtspAddress.value = res.msg
  })
}

/**
 * 云台开始
 *
 * @param direction
 */
function onvifPtzCtrlStartFun(direction) {
  onvifPZTStart({
    direction: direction,
    id: deviceData.value.id,
    controSpeed: onvifControSpeed.value,
  });
}

/**
 * 云台结束
 */
function onvifPtzCtrlEndFun() {
  setTimeout(() => {
    onvifPZTEnd({
      id: deviceData.value.id,
    });
  }, 200)
}

/**
 * 海康云台控制（开始）
 */
function ptzCtrlStartFun(direction) {
  ptzCtrlStart(deviceData.value.id, direction, controSpeed.value)
}

/**
 * 海康云台控制（结束）
 */
function ptzCtrlEndFun() {
  ptzCtrlEnd(deviceData.value.id)
}

/**
 * 大华设备云台控制（开始）
 *
 * @param direction
 */
function ptzControlUpStartFun(direction) {
  ptzControlUpStart(deviceData.value.id, direction, dahuaControSpeed.value)
}

/**
 * 大华设备云台控制（开始）
 *
 * @param direction
 */
function ptzControlUpEndFun(direction) {
  setTimeout(() => {
    ptzControlUpEnd(deviceData.value.id, direction)
  }, 200)
}

onMounted(() => {
  getList();
  getConfigKeyFun();
  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 94.5 + "px;";
  };
});

onUnmounted(() => {
  map?.destroy();
});

</script>

<style scoped lang="scss">
.app-card {
  position: relative;

  .el-switch__core .el-switch__inner .is-icon, .el-switch__core .el-switch__inner .is-text {
    color: #0f0756 !important;
  }

  .menu-box {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: bold;
  }

  .theme {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 20px;
    right: 20px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: bold;
  }
}

#container {
  width: 100%;
}

.tree {
  overflow: auto;
  max-height: 720px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.player {
  width: 100%;
  height: 450px;
}

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

.control-panel {
  position: relative;
  top: 0;
  left: 80px; /* 5rem * 16 = 80px */
  height: 176px; /* 11rem * 16 = 176px */
  max-height: 176px; /* 11rem * 16 = 176px */
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
