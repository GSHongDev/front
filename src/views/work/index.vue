<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-switch v-model="closeDevice" active-text="开启" inactive-text="关闭"/>
      </el-col>

      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            @click="handleSave"
        >保存
        </el-button>
      </el-col>
      <el-button
          type="danger"
          plain
          @click="handleCleanUp"
      >清除
      </el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :xs="24" :sm="24" :md="5" :lg="5" :xl="5" v-show="closeDevice">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>监控列表</span>
            </div>
          </template>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="国标" name="GB">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px"/>
              </div>
              <div class="top">
                <div>通道列表</div>
                <div>
                  <el-switch
                      v-model="activeValue"
                      active-text="行政区划"
                      inactive-text="业务分组"
                      @change="onSwitch"
                  />
                </div>
              </div>
              <div class="tree">
                <el-tree
                    ref="favoritesTreeRef"
                    :data="treeFavoriteData"
                    :props="defaultProps"
                    lazy
                    :load="loadFavoriteNode"
                    @node-click="handleNodeFavoriteClick"
                    :expand-on-click-node="false"
                ></el-tree>
              </div>
              <div class="tree">
                <el-tree
                    ref="markTreeRef"
                    :data="treeMarkData"
                    :props="defaultProps"
                    lazy
                    :load="loadMarkNode"
                    @node-click="handleNodeMarkClick"
                    :expand-on-click-node="false"
                ></el-tree>
              </div>
              <div class="tree">
                <el-tree
                    style="height: 440px;"
                    v-if="activeValue"
                    ref="deviceTreeRef"
                    :data="treeData"
                    :props="defaultProps"
                    node-key="gbId"
                    lazy
                    :load="loadNode"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    @node-contextmenu="handleRightClick"
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <div v-if="!data.dataType">{{ node.label }}</div>
                      <div v-if="data.dataType" style="display:flex;">
                        <svg-icon
                            :icon-class="data.iconClass || 'work-camera-1'"
                            style="margin-right: 6px"
                        />
                        <span
                            style="width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                            :style="{ color: data.iconClass === 'work-camera-2' ? '#409EFF' :
                            data.iconClass === 'work-camera-3' ? '#67C23A' : 'inherit' }"
                        >{{ node.label }}
                        </span>

                      </div>
                      <div v-if="data.dataType" style="display:flex;"
                           :style="{ color: data.iconClass === 'work-camera-2' ? '#409EFF' :
                            data.iconClass === 'work-camera-3' ? '#67C23A' : 'inherit' }">
                        <div>
                          {{ data.gbIpAddress }}
                        </div>
                        <div style="margin-left: 6px" v-if="data.dataType === 1">
                          <el-icon v-if="data.gbStatus === 'ON'" color="#67C23A">
                            <CircleCheckFilled/>
                          </el-icon>
                          <el-icon v-if="data.gbStatus !== 'ON'" color="#F56C6C">
                            <WarningFilled/>
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-tree>

                <el-tree
                    style="height: 440px;"
                    v-if="!activeValue"
                    ref="deviceTreeRef"
                    :data="treeData"
                    :props="defaultProps"
                    node-key="gbId"
                    lazy
                    :load="groupLoadNode"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    :highlight-current="true"
                    @node-contextmenu="handleRightClick"
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <div v-if="!data.dataType">{{ node.label }}</div>
                      <div v-if="data.dataType" style="display:flex;">
                        <svg-icon
                            :icon-class="data.iconClass || 'work-camera-1'"
                            style="margin-right: 6px"
                        />
                        <div :style="{ color: data.iconClass === 'work-camera-2' ? '#409EFF' :
                            data.iconClass === 'work-camera-3' ? '#67C23A' : 'inherit' }">
                          {{ node.label }}
                        </div>
                      </div>
                      <div v-if="data.dataType" style="display:flex;">
                        <div :style="{ color: data.iconClass === 'work-camera-2' ? '#409EFF' :
                            data.iconClass === 'work-camera-3' ? '#67C23A' : 'inherit' }">
                          {{ data.gbIpAddress }}
                        </div>
                        <div style="margin-left: 6px">
                          <el-icon v-if="data.gbStatus === 'ON'" color="#67C23A">
                            <CircleCheckFilled/>
                          </el-icon>
                          <el-icon v-if="data.gbStatus !== 'ON'" color="#F56C6C">
                            <WarningFilled/>
                          </el-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-tree>
              </div>
              <el-divider/>
              <div style="display: flex; justify-content: center">
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
                      <div class="control-btn control-bottom" @mousedown="ptzCamera('down')"
                           @mouseup="ptzCamera('stop')">
                        <el-icon class="icon">
                          <CaretBottom/>
                        </el-icon>
                        <div class="control-inner-btn control-inner"></div>
                      </div>
                      <div class="control-btn control-right" @mousedown="ptzCamera('right')"
                           @mouseup="ptzCamera('stop')">
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
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="ONVIF" name="ONVIF">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>

              <div v-if="listDevice.length >0">
                <InfiniteList
                    v-if="listDevice.length >0"
                    :data="listDevice"
                    :width="'100%'"
                    :height="'470px'"
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
                <el-divider/>
                <div v-if="checkPermi(['dahua:device:ptzCtrl'])" style="display: flex;justify-content: center">
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

              <el-empty v-if="listDevice.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="RTSP" name="RTSP">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>
              <InfiniteList
                  v-if="listDevice.length >0"
                  :data="listDevice"
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

              <el-empty v-if="listDevice.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="海康" name="ISUP">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>

              <div v-if="listDevice.length >0">
                <InfiniteList
                    v-if="listDevice.length >0"
                    :data="listDevice"
                    :width="'100%'"
                    :height="'470px'"
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
                <el-divider/>
                <div v-if="checkPermi(['isup:lsupDevice:ptzCtrl'])" style="display: flex;justify-content: center">
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
                        <div class="control-btn control-left" @mousedown="ptzCtrlStartFun(2)"
                             @mouseup="ptzCtrlEndFun()">
                          <el-icon class="icon">
                            <CaretLeft/>
                          </el-icon>
                          <div class="control-inner-btn control-inner"></div>
                        </div>
                        <div class="control-btn control-bottom" @mousedown="ptzCtrlStartFun(4)"
                             @mouseup="ptzCtrlEndFun()">
                          <el-icon class="icon">
                            <CaretBottom/>
                          </el-icon>
                          <div class="control-inner-btn control-inner"></div>
                        </div>
                        <div class="control-btn control-right" @mousedown="ptzCtrlStartFun(1)"
                             @mouseup="ptzCtrlEndFun()">
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
                          <el-slider v-model="haikangControSpeedFocus" :max="100" :min="-100"
                                     @change="haikangFocusCamera"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <el-empty v-if="listDevice.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

            <el-tab-pane label="大华" name="DAHUA">
              <div class="head-container">
                <el-input v-model="deviceName" placeholder="请输入设备名称" clearable prefix-icon="Search"
                          style="margin-bottom: 20px" @change="deviceChange"/>
              </div>

              <div v-if="listDevice.length >0">
                <InfiniteList
                    :data="listDevice"
                    :width="'100%'"
                    :height="'470px'"
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
                <el-divider/>
                <div v-if="checkPermi(['dahua:device:ptzCtrl'])" style="display: flex;justify-content: center">
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
                          <div @mousedown="ptzControlUpStartFun('zoom+')" @mouseup="ptzControlUpEndFun('zoom+')"
                               title="聚焦+">
                            <i class="iconfont icon-bianjiao-fangda control-zoom-btn" style="font-size: 24px;"></i>
                          </div>
                          <div @mousedown="ptzControlUpStartFun('zoom-')" @mouseup="ptzControlUpEndFun('zoom-')"
                               title="聚焦-">
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

              <el-empty v-if="listDevice.length === 0" :image-size="50" description="暂无数据"/>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="!closeDevice? 24:19" :lg="!closeDevice? 24:19"
              :xl="!closeDevice? 24:19">
        <el-card>
          <template #header>
            <div class="flex">
              分屏:
              <svg-icon :class="['flex-icon', { active: model === 1 }]"
                        icon-class="splitOne" @click="spiltIndex(1)" class="flex-icon"/>
              <svg-icon :class="['flex-icon', { active: model === 4 }]"
                        icon-class="splitFour" @click="spiltIndex(4)" class="flex-icon"/>
              <svg-icon :class="['flex-icon', { active: model === 6 }]"
                        icon-class="splitSix" @click="spiltIndex(6)" class="flex-icon"/>
              <svg-icon :class="['flex-icon', { active: model === 9 }]"
                        icon-class="splitNine" @click="spiltIndex(9)" class="flex-icon"/>
            </div>
          </template>
          <div style="display: flex; flex-wrap: wrap;position: relative">
            <div
                :id="'video' + index"
                v-for="(item, index) in splitLayouts[splitShow]"
                :key="index"
                :style="getCellStyle(splitShow)"
                style="border: 3px solid #409EFF;margin: 1px;"
                :class="['player-cell', { active: activePlayerIndex === index }]"
                @click="setActivePlayer(index)">
              <div v-if="item.data" style="position: absolute;z-index: 999;top: 5px;right: 10px;color: #F56C6C;">
                <el-tooltip
                    effect="dark"
                    content="删除"
                    placement="top"
                >
                  <el-icon @click="deleteVideo(index)">
                    <Delete/>
                  </el-icon>
                </el-tooltip>
              </div>

              <div v-if="item.type === 'GB'" style="width: 100%;height: 100%">
                <Jessibuca v-show="vUrls[index]" :ref="'video' + index" :videoUrl="vUrls[index]" fluent autoplay live
                           :key="'jessibuca-'+index"/>
              </div>

              <div v-else style="width: 100%;height: 100%">
                <div v-if="item.data" style="width: 100%;height: 100%">
                  <div v-if="item.data.playType === '2'" style="width: 100%;height: 100%">
                    <Jessibuca :videoUrl="vUrls[index]" fluent autoplay live
                               :key="'jessibuca-'+index"/>
                  </div>
                  <video v-else :id="'rtspVideo' + index"
                         muted
                         playsinline
                         controls
                         style="width: 100%;height: 100%"
                  ></video>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <el-popover
        ref="popover"
        v-model:visible="contextMenuVisible"
        placement="bottom-start"
        width="80"
        :popper-style="{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px`, position: 'absolute' }"
        trigger="manual">
      <div>
        <div @click="favorites" style="cursor: pointer;">收藏设备</div>
        <div @click="markNode" style="cursor: pointer;">标记设备</div>
      </div>
    </el-popover>

    <FavoriteDialog
        v-model="openFavorites"
        :selected-node="selectedNode"
        @success="handleFavoriteSuccess"
    />

    <MarkDialog
        v-model="openMarks"
        :selected-node="selectedNode"
        @success="handleMarkSuccess"
    />
  </div>
</template>

<script setup name="Work">
import {queryForTree} from "@/api/wvp/region";
import {queryListByCivilCode, sendDevicePush} from "@/api/wvp/channel.js";
import {queryForTree as groupQueryForTree} from "@/api/wvp/group.js";
import Jessibuca from "@/components/jessibuca/index-copy.vue";
import {start as playPush} from "@/api/wvp/push.js";
import {start as playProxy} from "@/api/wvp/proxy.js";
import {deviceList as onvifDeviceList, onvifPZTEnd, onvifPZTStart} from "../../api/onvif/device.js";
import {rtspDeviceList} from "../../api/rtsp/RtspDevice.js";
import {lsupDeviceList, ptzCtrlEnd, ptzCtrlFocus, ptzCtrlStart} from "../../api/isup/lsupDevice.js";
import InfiniteList from 'vue3-infinite-list';
import layouts from "./layouts.js";
import {getConfigKey} from "../../api/system/config.js";
import {listWork, updateWork} from "../../api/system/work.js";
import {getFocusCamera, getIrIsCamera, getPtzCamera, queryListByParentId} from "../../api/wvp/channel.js";
import {listDahuaDevice, ptzControlUpEnd, ptzControlUpStart} from "../../api/dahua/device.js";
import {startPlay} from "../../api/wvp/push.js";
import {ElMessage} from "element-plus";
import {checkPermi} from "@/utils/permission";
import {ref} from "vue";
import {listFavoritesAll} from "@/api/wvp/favorites.js";
import {listMarkAll} from "@/api/wvp/mark.js";
import FavoriteDialog from './components/FavoriteDialog.vue'
import MarkDialog from './components/MarkDialog.vue'
import {listFavoritesChannel} from "@/api/wvp/favoritesChannel.js";
import {listWvpMarkChannel} from "@/api/wvp/wvpMarkChannel.js";

const contextMenuVisible = ref(false);
const openFavorites = ref(false);
const menuPosition = ref({x: 0, y: 0});
const selectedNode = ref(null);
const formFavorites = ref({
  favoritesId: undefined,
  channelId: undefined,
  gbName: undefined,
  gbParentId: undefined,
  gbDeviceId: undefined,
});
const rulesFavorites = ref({
  channelId: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  gbName: [{ required: true, message: '请输入国标通道名称', trigger: 'blur' }],
  gbParentid: [{ required: true, message: '请输入国标设备id', trigger: 'blur' }],
  gbDeviceid: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  favoritesId: [{ required: true, message: '请选择收藏夹', trigger: 'change' }]
});
const rulesMarks = ref({
  channelId: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  gbName: [{ required: true, message: '请输入国标通道名称', trigger: 'blur' }],
  gbParentid: [{ required: true, message: '请输入国标设备id', trigger: 'blur' }],
  gbDeviceid: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  markId: [{ required: true, message: '请选择标记', trigger: 'change' }]
});
const favoritesOptions = ref([]);
const closeDevice = ref(true);
const deviceName = ref("");
const listDevice = ref([])
const activeName = ref('GB')
const selectDeviceId = ref(null);
const showVideoDialog = ref(false);
const hasAudio = ref(false);
const vUrls = reactive({
  0: '',
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: ''
});

const {proxy} = getCurrentInstance();

const queryParams = ref({
  pageNum: 1,
  pageSize: 200,
})

const video = ref(null);
const webRtcServer = ref();
const treeData = ref([]);
const rtspAddress = ref('');

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'leaf'
};
const splitLayouts = ref(JSON.parse(JSON.stringify(layouts)));


const handleFavoriteSuccess = () => {
  proxy.$modal.msgSuccess("收藏成功")
}

const handleMarkSuccess = () => {
  proxy.$modal.msgSuccess("标记成功")
}

function loadFavoritesOptions() {
  listFavoritesAll().then(res => {
    favoritesOptions.value = res.data;
  });
}

function favorites() {
  if (selectedNode.value) {
    formFavorites.value = {};
    loadFavoritesOptions();
    formFavorites.value.gbName = selectedNode.value.gbName;
    formFavorites.value.gbParentid = selectedNode.value.gbParentId;
    formFavorites.value.gbDeviceid = selectedNode.value.gbDeviceId;
    formFavorites.value.channelId = selectedNode.value.gbId;
    contextMenuVisible.value = false;
    openFavorites.value = true;
  } else {
    proxy.$modal.msgError("请先选择国标通道");
  }
}

const formMarks = ref({});
const markOptions = ref([]);
const openMarks = ref(false);

function loadMarksOptions() {
  listMarkAll().then(res => {
    markOptions.value = res.data;
  });
}

function markNode(event, node, treeNode) {
  if (selectedNode.value) {
    formMarks.value = {};
    loadMarksOptions();
    formMarks.value.gbName = selectedNode.value.gbName;
    formMarks.value.gbParentid = selectedNode.value.gbParentId;
    formMarks.value.gbDeviceid = selectedNode.value.gbDeviceId;
    formMarks.value.channelId = selectedNode.value.gbId;
    contextMenuVisible.value = false;
    openMarks.value = true;
  } else {
    proxy.$modal.msgError("请先选择国标通道");
  }
}


function handleRightClick(event, node, treeNode) {
  if (node.dataType) {
    event.preventDefault();
    selectedNode.value = node;
    menuPosition.value = {x: event.clientX, y: event.clientY};
    contextMenuVisible.value = true;
  }
}


async function onSwitch(e) {
  treeData.value = []
  if (activeValue.value) {
    await getTreeData();
  } else {
    await getGroupQueryForTree();
  }
}

const groupLoadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve([{
      treeId: "",
      deviceId: "",
      name: "根资源组",
      isLeaf: false,
      type: 0
    }]);
  } else {
    if (node.data.leaf) {
      return resolve([])
    }
    let res = await groupQueryForTree({
      query: '',
      parent: node.data.id,
      hasChannel: ''
    });
    queryParams.value.groupDeviceId = node.data.deviceId;
    const response = await queryListByParentId(queryParams.value);
    const children = response.rows.map(item => ({
      ...item,
      leaf: true,
      name: item.gbName,
      iconClass: 'work-camera-1'
    }));
    let terr = [...proxy.handleTree(res.data, "id"), ...children]
    resolve(terr);
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
      name: item.gbName,
      iconClass: 'work-camera-1'
    }));
    let terr = [...proxy.handleTree(res.data, "id"), ...children]
    resolve(terr);
  } else {
    resolve([]);
  }
};

const highlightedNodeId = ref([]);

const handleNodeClick = async (data) => {
  if (!data.dataType) {
    return
  }
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (activeName.value === 'GB') {
    layoutData.type = 'GB'
    selectDeviceId.value = data.deviceId;
    layoutData.data = data
  }
  if (data.dataType === 1) {
    if (data.gbDeviceId && data.gbParentId) {
      const params = {
        deviceId: data.gbParentId,
        channelId: data.gbDeviceId
      }
      const res = await sendDevicePush(params);
      if (location.protocol === "https:") {
        vUrls[activePlayerIndex.value] = res.data.https_flv;
      } else {
        vUrls[activePlayerIndex.value] = res.data.flv;
      }

    } else {
      proxy.$modal.msgError('通道或设备不存在')
    }
  }

  if (data.dataType === 2) {
    const ans = await playPush({id: data.dataDeviceId});
    if (location.protocol === "https:") {
      vUrls[activePlayerIndex.value] = ans.https_flv;
    } else {
      vUrls[activePlayerIndex.value] = ans.flv;
    }
  }

  if (data.dataType === 3) {
    const ans = await playProxy({id: data.dataDeviceId});
    if (location.protocol === "https:") {
      vUrls[activePlayerIndex.value] = ans.https_flv;
    } else {
      vUrls[activePlayerIndex.value] = ans.flv;
    }
  }

  const highlightedNodeIds = ref(Array(9).fill(''));
  if (splitShow.value === 1) {
    if (highlightedNodeId.value.length === 0) {
      highlightedNodeId.value.push(data.gbId);
      const node = proxy.$refs["deviceTreeRef"].getNode(data.gbId);
      if (node && node.data) {
        node.data.iconClass = "work-camera-2";
      }
    } else {
      const node1 = proxy.$refs["deviceTreeRef"].getNode(highlightedNodeId.value[0]);
      if (node1 && node1.data) {
        node1.data.iconClass = "work-camera-1";
      }
      highlightedNodeId.value = [];
      highlightedNodeId.value.push(data.gbId);
      const node = proxy.$refs["deviceTreeRef"].getNode(data.gbId);
      if (node && node.data) {
        node.data.iconClass = "work-camera-2";
      }
    }
  } else if (splitShow.value === 4) {
    const activeIndex = activePlayerIndex.value;
    if (activeIndex === null || activeIndex >= 4) return;
    const previousId = highlightedNodeIds.value[activeIndex];
    if (previousId) {
      const previousNode = proxy.$refs["deviceTreeRef"].getNode(previousId);
      if (previousNode && previousNode.data) {
        previousNode.data.iconClass = "work-camera-1";
      }
    }
    highlightedNodeIds.value[activeIndex] = data.gbId;
    const currentNode = proxy.$refs["deviceTreeRef"].getNode(data.gbId);
    if (currentNode && currentNode.data) {
      currentNode.data.iconClass = "work-camera-2";
    }
  } else if (splitShow.value === 6) {
    const activeIndex = activePlayerIndex.value;
    if (activeIndex === null || activeIndex >= 6) return;
    const previousId = highlightedNodeIds.value[activeIndex];
    if (previousId) {
      const previousNode = proxy.$refs["deviceTreeRef"].getNode(previousId);
      if (previousNode && previousNode.data) {
        previousNode.data.iconClass = "work-camera-1";
      }
    }
    highlightedNodeIds.value[activeIndex] = data.gbId;
    const currentNode = proxy.$refs["deviceTreeRef"].getNode(data.gbId);
    if (currentNode && currentNode.data) {
      currentNode.data.iconClass = "work-camera-2";
    }
  } else if (splitShow.value === 9) {
    const activeIndex = activePlayerIndex.value;
    if (activeIndex === null || activeIndex >= 9) return;
    const previousId = highlightedNodeIds.value[activeIndex];
    if (previousId) {
      const previousNode = proxy.$refs["deviceTreeRef"].getNode(previousId);
      if (previousNode && previousNode.data) {
        previousNode.data.iconClass = "work-camera-1";
      }
    }
    highlightedNodeIds.value[activeIndex] = data.gbId;
    const currentNode = proxy.$refs["deviceTreeRef"].getNode(data.gbId);
    if (currentNode && currentNode.data) {
      currentNode.data.iconClass = "work-camera-2";
    }
  }
};

const splitShow = ref(1)
const borderWidth = ref(2)
const activePlayerIndex = ref(null);
const model = ref(1);
const activeValue = ref(true);

function getCellStyle(splitMode) {
  model.value = splitMode;
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    boxSizing: "border-box",
  };

  if (splitMode === 1) {
    style.width = "100%";
    style.height = "800px";
  } else if (splitMode === 4) {
    style.width = "49.5%";
    style.height = "400px";
    style.margin = "-2px";
  } else if (splitMode === 6) {
    style.width = "33%";
    style.height = "400px";
    style.margin = "-2px";
  } else if (splitMode === 9) {
    style.width = "33%";
    style.height = "300px";
    style.margin = "-2px";
  }

  return style;
}

const chooseId = ref(null);

function setActivePlayer(index) {
  activePlayerIndex.value = index;

  let layoutData = splitLayouts.value[splitShow.value][index];

  if (!layoutData || !layoutData.data) {
    return;
  }

  if (activeName.value === 'GB') {
    if (chooseId.value === null) {
      const targetId = layoutData.data.gbId;
      chooseId.value = targetId;
      const node = proxy.$refs["deviceTreeRef"].getNode(targetId);
      if (node && node.data) {
        node.data.iconClass = "work-camera-3";
      }
    } else {
      const node2 = proxy.$refs["deviceTreeRef"].getNode(chooseId.value);
      if (node2 && node2.data) {
        node2.data.iconClass = "work-camera-2";
      }
      const targetId = layoutData.data.gbId;
      chooseId.value = targetId;
      const node = proxy.$refs["deviceTreeRef"].getNode(targetId);
      if (node && node.data) {
        node.data.iconClass = "work-camera-3";
      }
    }


  }

}

async function getTreeData() {
  const res = await queryForTree();
  let data = [
    {
      treeId: "",
      deviceId: "",
      name: "根资源组",
      isLeaf: false,
      type: 0,
      children: []
    }
  ]
  data[0].children = proxy.handleTree(res.data, "id")
  treeData.value = data;
  getFavoriteTreeData();
  getMarkTreeData();
}

const treeFavoriteData = ref([]);
const queryParamsFavorite = ref({
  pageNum: 1,
  pageSize: 1000,
  favoritesId: null,
});
async function getFavoriteTreeData(){
  let data = [
    {
      treeId: 0,
      deviceId: "",
      name: "收藏",
      isLeaf: false,
      type: 0,
      children: []
    }
  ]
  treeFavoriteData.value = data;
}



const loadFavoriteNode = async (node, resolve) => {
  if (node.level === 0) {
    let data = [
      {
        treeId: 0,
        deviceId: "",
        name: "收藏夹",
        isLeaf: false,
        type: 0,
        children: []
      }
    ]
    resolve(data);
  } else {
    if (node.data.treeId === 0){
      const res = await listFavoritesAll();
      const dataWithNames = res.data.map(item => ({
        ...item,
        name: item.favoritesName,
        isLeaf: false,
        leaf: false,
      }));
      resolve(proxy.handleTree(dataWithNames, "id"));
    } else {
      queryParamsFavorite.value.favoritesId = node.data.id;
      const ans = await listFavoritesChannel(queryParamsFavorite.value);
      const o = ans.rows.map(item => ({
        ...item,
        name: item.gbName,
        isLeaf: true,
        leaf: true,
      }));
      resolve(proxy.handleTree(o, "channelId"));
    }
  }
}

const handleNodeFavoriteClick = async (data) => {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  const params = {
    deviceId: data.gbParentid,
    channelId: data.gbDeviceid
  }
  const res = await sendDevicePush(params);
  if (location.protocol === "https:") {
    vUrls[activePlayerIndex.value] = res.data.https_flv;
  } else {
    vUrls[activePlayerIndex.value] = res.data.flv;
    console.log(vUrls)
  }
}

const treeMarkData = ref([]);
const queryParamsMark = ref({
  pageNum: 1,
  pageSize: 10,
  markId: null,
});
function getMarkTreeData() {
  let data = [
    {
      treeId: 0,
      deviceId: "",
      name: "标记",
      isLeaf: false,
      type: 0,
      children: []
    }
  ]
  treeMarkData.value = data;
}

const loadMarkNode = async (node, resolve) => {
  if (node.level === 0) {
    let data = [
      {
        treeId: 0,
        deviceId: "",
        name: "收藏夹",
        isLeaf: false,
        type: 0,
        children: []
      }
    ]
    resolve(data);
  } else {
    if (node.data.treeId === 0){
      const res = await listMarkAll();
      const o = res.data.map(item => ({
        ...item,
        name: item.markName,
        isLeaf: false,
        leaf: false,
      }));
      resolve(proxy.handleTree(o, "id"));
    } else {
      queryParamsMark.value.markId = node.data.id;
      const ans = await listWvpMarkChannel(queryParamsMark.value);
      const o = ans.rows.map(item => ({
        ...item,
        name: item.gbName,
        isLeaf: true,
        leaf: true,
      }));
      resolve(proxy.handleTree(o, "channelId"));
    }
  }
}

const handleNodeMarkClick = async (data) => {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  const params = {
    deviceId: data.gbParentid,
    channelId: data.gbDeviceid
  }
  const res = await sendDevicePush(params);
  if (location.protocol === "https:") {
    vUrls[activePlayerIndex.value] = res.data.https_flv;
  } else {
    vUrls[activePlayerIndex.value] = res.data.flv;
    console.log(vUrls)
  }
}

async function getGroupQueryForTree() {
  const res = await groupQueryForTree();
  let data = [
    {
      treeId: "",
      deviceId: "",
      name: "根资源组",
      isLeaf: false,
      type: 0,
      children: []
    }
  ]
  data[0].children = proxy.handleTree(res.data, "id")
  treeData.value = data;
}

function spiltIndex(index) {
  splitLayouts.value = JSON.parse(JSON.stringify(layouts));
  splitShow.value = index;
  activePlayerIndex.value = null;
  selectDeviceId.value = null;
}

const handleClick = (tab, event) => {
  nextTick(async () => {
    deviceName.value = '';
    await getList();
  })
}

function getListWork() {
  listWork().then(async (res) => {
    if (res.data && res.data.layoutList) {
      splitLayouts.value = JSON.parse(res.data.layoutList);
      splitLayouts.value[Number(res.data.index)].forEach((item, index) => {
        if (item.type !== '') {
          if (item.type === 'ONVIF') {
            playVideo(item.data.playType, item.data.url, item.data.easyNTSUrl, item.data.streamId, index)
          } else if (item.type === 'RTSP') {
            playVideo(item.data.playType, item.data.url, item.data.easyNTSUrl, item.data.streamId, index)
          } else if (item.type === 'ISUP') {
            playVideo(item.data.playType, item.data.url, item.data.easyNTSUrl, item.data.streamId, index)
          } else if (item.type === 'GB') {
            nextTick(() => {
              playGB(item.data, index)
            })
          } else if (item.type === 'DAHUA') {
            playVideo(item.data.playType, item.data.url, item.data.easyNTSUrl, item.data.streamId, index)
          }
        }
      })
    }

    if (res.data && res.data.index) {
      splitShow.value = Number(res.data.index)
    }
  })
}

function playVideo(playType, url, easyNTSUrl, streamId, index) {
  nextTick(async () => {
    if (playType === '1') {
      webRtcServer.value = new WebRtcStreamer('rtspVideo' + index, rtspAddress.value);
      webRtcServer.value.connect(url)
    } else if (playType === '3') {
      webRtcServer.value = new WebRtcStreamer('rtspVideo' + index, rtspAddress.value);
      webRtcServer.value.connect(easyNTSUrl)
    } else if (playType === '2') {
      const ans = await startPlay(streamId);
      if (location.protocol === "https:") {
        vUrls[index] = ans.data.https_flv;
      } else {
        vUrls[index] = ans.data.flv;
      }
    }
  })
}

async function playGB(data, index) {
  if (data.dataType === 1) {
    if (data.gbDeviceId && data.gbParentId) {
      const params = {
        deviceId: data.gbParentId,
        channelId: data.gbDeviceId
      }
      const res = await sendDevicePush(params);
      if (location.protocol === "https:") {
        vUrls[index] = res.data.https_flv;
      } else {
        vUrls[index] = res.data.flv;
      }
    } else {
      proxy.$modal.msgError('通道或设备不存在')
    }
  }

  if (data.dataType === 2) {
    const ans = await playPush({id: data.dataDeviceId});
    if (location.protocol === "https:") {
      vUrls[index] = ans.https_flv;
    } else {
      vUrls[index] = ans.flv;
    }
  }

  if (data.dataType === 3) {
    const ans = await playProxy({id: data.dataDeviceId});
    if (location.protocol === "https:") {
      vUrls[index] = ans.https_flv;
    } else {
      vUrls[index] = ans.flv;
    }
  }


}

async function getList() {
  listDevice.value = []
  if (activeName.value === 'GB') {
    await getTreeData();
  } else if (activeName.value === 'ONVIF') {
    onvifDeviceList({
      name: deviceName.value
    }).then(res => {
      listDevice.value = res.data
    })
  } else if (activeName.value === 'RTSP') {
    rtspDeviceList({
      name: deviceName.value
    }).then(res => {
      listDevice.value = res.data
    })
  } else if (activeName.value === 'ISUP') {
    lsupDeviceList({
      name: deviceName.value
    }).then(res => {
      listDevice.value = res.data
    })
  } else if (activeName.value === 'DAHUA') {
    listDahuaDevice({
      name: deviceName.value
    }).then(res => {
      listDevice.value = res.data
    })
  }
}

async function deviceClick(data) {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }

  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]

  if (activeName.value === 'ONVIF') {
    layoutData.type = 'ONVIF'
  } else if (activeName.value === 'RTSP') {
    layoutData.type = 'RTSP'
  } else if (activeName.value === 'ISUP') {
    layoutData.type = 'ISUP'
  } else if (activeName.value === 'DAHUA') {
    layoutData.type = 'DAHUA'
    selectDeviceId.value = data.id;

    let newUrl = data.url.replace(/(channel=)(\d+)/, function (_, p1, p2) {
      return p1 + (parseInt(p2) + 1);
    });

    layoutData.data = data;
    playVideo(data.playType, newUrl, data.easyNTSUrl, data.streamId, activePlayerIndex.value)
    return
  }

  selectDeviceId.value = data.id;
  layoutData.data = data;

  playVideo(data.playType, data.url, data.easyNTSUrl, data.streamId, activePlayerIndex.value)
}

onUnmounted(() => {
  if (webRtcServer.value) {
    webRtcServer.value.disconnect()
    webRtcServer.value = null
  }
})

function getConfigKeyFun() {
  getConfigKey("sys_rtsp_address").then((res) => {
    rtspAddress.value = res.msg
  })
}

function handleSave() {
  updateWork({
    layoutList: JSON.stringify(splitLayouts.value),
    index: splitShow.value
  }).then(() => {
    proxy.$modal.msgSuccess("保存成功");
  })
}

function handleCleanUp() {
  proxy.$modal.confirm('是否清除显示的分屏？').then(function () {
    splitLayouts.value = JSON.parse(JSON.stringify(layouts));
    return
  }).then(() => {
    handleSave()
  }).catch(() => {
  });

}

function deleteVideo(index) {
  proxy.$modal.confirm('是否删除该分屏').then(function () {
    let layoutData = splitLayouts.value[splitShow.value][index]
    layoutData.data = null
    layoutData.type = ''
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}


/** 根据名称筛选部门树 */
watch(deviceName, val => {
  proxy.$refs["deviceTreeRef"].filter(val);
});

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

const deviceChange = () => {
  getList()
}


// 云台
const controSpeed = ref(30);
const dahuaControSpeed = ref(5);
const haikangControSpeed = ref(5);
const haikangControSpeedFocus = ref(0);
const onvifControSpeed = ref(0.1);

const ptzCamera = async (command) => {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  const url = {
    deviceId: layoutData.data.gbParentId,
    channelId: layoutData.data.gbDeviceId,
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
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  const url = {
    deviceId: layoutData.data.gbParentId,
    channelId: layoutData.data.gbDeviceId,
  }
  const params = {
    command: command,
    speed: parseInt(controSpeed.value * 255 / 100),
  }
  await getFocusCamera(url, params);
  ElMessage.success('操作成功！');
}

const irisCamera = async (command) => {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  const url = {
    deviceId: layoutData.data.gbParentId,
    channelId: layoutData.data.gbDeviceId,
  }
  const params = {
    command: command,
    speed: parseInt(controSpeed.value * 255 / 100),
  }
  await getIrIsCamera(url, params);
  ElMessage.success('操作成功！');
}

/**
 * 大华设备云台控制（开始）
 *
 * @param direction
 */
function ptzControlUpStartFun(direction) {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  ptzControlUpStart(layoutData.data.id, direction, dahuaControSpeed.value)
}

/**
 * 大华设备云台控制（开始）
 *
 * @param direction
 */
function ptzControlUpEndFun(direction) {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  setTimeout(() => {
    ptzControlUpEnd(layoutData.data.id, direction)
  }, 200)
}


/**
 * 海康云台控制（开始）
 */
function ptzCtrlStartFun(direction) {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  ptzCtrlStart(layoutData.data.id, direction, controSpeed.value)
}

/**
 * 海康云台控制（结束）
 */
function ptzCtrlEndFun() {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  ptzCtrlEnd(layoutData.data.id)
}

/**
 * 海康聚焦
 */
function haikangFocusCamera() {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  ptzCtrlFocus(layoutData.data.id, haikangControSpeedFocus.value)
}

/**
 * 云台开始
 *
 * @param direction
 */
function onvifPtzCtrlStartFun(direction) {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  onvifPZTStart({
    direction: direction,
    id: layoutData.data.id,
    controSpeed: onvifControSpeed.value,
  });
}

/**
 * 云台结束
 */
function onvifPtzCtrlEndFun() {
  if (activePlayerIndex.value == null) {
    proxy.$modal.msgError("请先选择一个播放窗口");
    return
  }
  let layoutData = splitLayouts.value[splitShow.value][activePlayerIndex.value]
  if (!layoutData.data) {
    proxy.$modal.msgError("该窗口没有播放视频");
    return
  }
  setTimeout(() => {
    onvifPZTEnd({
      id: layoutData.data.id,
    });
  }, 200)
}

onMounted(async () => {
  await getConfigKeyFun()
  await getList()
  await getListWork()
})

</script>

<style scoped>
.el-tree {
  min-width: 100%;
  display: inline-block;
}

.tree {
  overflow: auto;
  max-height: 440px;
}

.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex {
  width: 100%;
  display: flex;
  align-items: center;
}

.player-cell {
  position: relative;
  transition: border-color 0.3s ease;
}

.player-cell:hover {
  cursor: pointer;
}

.player-cell.active {
  border-color: #67C23A !important;
}

.flex-icon {
  margin-left: 10px;
}

.flex-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.flex-icon.active {
  color: #409EFF;
  transform: scale(1.2);
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


