import request from '@/utils/request'

// 分页查询设备详细信息
export function listDeviceDetailsByPage(query) {
    return request({
        url: '/lecheng/lc/listDeviceDetailsByPage',
        method: 'get',
        params: query
    })
}

// 批量查询设备详细信息
export function listDeviceDetailsByIds(data) {
    return request({
        url: '/lecheng/lc/listDeviceDetailsByIds',
        method: 'post',
        data: data
    })
}

// 获取设备在线状态
export function deviceOnline(query) {
    return request({
        url: '/lecheng/lc/deviceOnline',
        method: 'get',
        params: query
    })
}

// 未绑定设备信息获取
export function unBindDeviceInfo(query) {
    return request({
        url: '/lecheng/lc/unBindDeviceInfo',
        method: 'get',
        params: query
    })
}

// 查询设备绑定情况
export function checkDeviceBindOrNot(query) {
    return request({
        url: '/lecheng/lc/checkDeviceBindOrNot',
        method: 'get',
        params: query
    })
}

// 获取设备升级状态和进度
export function upgradeProcessDevice(query) {
    return request({
        url: '/lecheng/lc/upgradeProcessDevice',
        method: 'get',
        params: query
    })
}

// 绑定设备
export function bindDevice(data) {
    return request({
        url: '/lecheng/lc/bindDevice',
        method: 'post',
        data: data
    })
}

// 解绑设备
export function unBindDevice(data) {
    return request({
        url: '/lecheng/lc/unBindDevice',
        method: 'post',
        data: data
    })
}

// 设备升级
export function upgradeDevice(data) {
    return request({
        url: '/lecheng/lc/upgradeDevice',
        method: 'post',
        data: data
    })
}

// 修改设备或通道名称
export function modifyDeviceName(data) {
    return request({
        url: '/lecheng/lc/modifyDeviceName',
        method: 'post',
        data: data
    })
}

// 设备或通道封面刷新
export function refreshDeviceCover(data) {
    return request({
        url: '/lecheng/lc/refreshDeviceCover',
        method: 'post',
        data: data
    })
}

// 验证设备密码
export function verifyPassword(data) {
    return request({
        url: '/lecheng/lc/verifyPassword',
        method: 'post',
        data: data
    })
}

// 修改设备密码
export function modifyPassword(data) {
    return request({
        url: '/lecheng/lc/modifyPassword',
        method: 'post',
        data: data
    })
}

// 获取轻应用播放 token
export function getKitToken(data) {
    return request({
        url: '/lecheng/lc/getKitToken',
        method: 'post',
        data: data
    })
}

// 创建设备flv直播地址
export function createDeviceFlvLive(data) {
    return request({
        url: '/lecheng/lc/createDeviceFlvLive',
        method: 'post',
        data: data
    })
}

// 校准设备UTC时间
export function calibrationDeviceTime(data) {
    return request({
        url: '/lecheng/lc/calibrationDeviceTime',
        method: 'post',
        data: data
    })
}

// 查询设备UTC时间
export function getDeviceTime(data) {
    return request({
        url: '/lecheng/lc/getDeviceTime',
        method: 'post',
        data: data
    })
}

// 重启设备
export function restartDevice(data) {
    return request({
        url: '/lecheng/lc/restartDevice',
        method: 'post',
        data: data
    })
}

// 云台移动控制
export function controlMovePTZ(data) {
    return request({
        url: '/lecheng/lc/controlMovePTZ',
        method: 'post',
        data: data
    })
}

// 获取设备云台控制接口
export function devicePTZInfo(data) {
    return request({
        url: '/lecheng/lc/devicePTZInfo',
        method: 'post',
        data: data
    })
}

// 云台定位接口
export function controlLocationPTZ(data) {
    return request({
        url: '/lecheng/lc/controlLocationPTZ',
        method: 'post',
        data: data
    })
}

// setDeviceSnap设备抓图
export function setDeviceSnap(data) {
    return request({
        url: '/lecheng/lc/setDeviceSnap',
        method: 'post',
        data: data
    })
}

// setDeviceSnapEnhanced设备抓图
export function setDeviceSnapEnhanced(data) {
    return request({
        url: '/lecheng/lc/setDeviceSnapEnhanced',
        method: 'post',
        data: data
    })
}

// 设备SD卡格式化
export function recoverSDCard(data) {
    return request({
        url: '/lecheng/lc/recoverSDCard',
        method: 'post',
        data: data
    })
}

// 获取设备存储介质容量信息
export function deviceStorage(data) {
    return request({
        url: '/lecheng/lc/deviceStorage',
        method: 'post',
        data: data
    })
}

// 获取设备SD卡状态
export function deviceSdcardStatus(data) {
    return request({
        url: '/lecheng/lc/deviceSdcardStatus',
        method: 'post',
        data: data
    })
}

// 新增收藏点
export function setCollection(data) {
    return request({
        url: '/lecheng/lc/setCollection',
        method: 'post',
        data: data
    })
}

// 删除收藏点
export function deleteCollection(data) {
    return request({
        url: '/lecheng/lc/deleteCollection',
        method: 'post',
        data: data
    })
}

// 获取收藏点信息
export function getCollection(data) {
    return request({
        url: '/lecheng/lc/getCollection',
        method: 'post',
        data: data
    })
}

// 修改收藏点名称
export function modifyCollection(data) {
    return request({
        url: '/lecheng/lc/modifyCollection',
        method: 'post',
        data: data
    })
}

// 转动到收藏点
export function turnCollection(data) {
    return request({
        url: '/lecheng/lc/turnCollection',
        method: 'post',
        data: data
    })
}
