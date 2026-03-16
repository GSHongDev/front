import request from '@/utils/request'

// 查询萤石监控配置列表
export function listYsDevice(query) {
    return request({
        url: '/yingshi/ys/listDevice',
        method: 'get',
        params: query
    })
}

/**
 * 添加设备
 *
 * @param data
 */
export const addDevice = (data) => {
    return request({
        url: '/yingshi/ys/addDevice',
        method: 'post',
        data: data
    });
};


/**
 * 删除设备
 *
 * @param deviceSerial
 * @param configId
 */
export const delDevice = (deviceSerial,configId) => {
    return request({
        url: `/yingshi/ys/delDevice/${deviceSerial}/${configId}`,
        method: 'delete'
    });
};

/**
 * 查询设备是否支持萤石协议
 *
 * @param data
 */
export const equipmentSupport = (data) => {
    return request({
        url: '/yingshi/ys/equipmentSupport',
        method: 'post',
        data: data
    });
};

/**
 * 获取播放地址
 *
 * @param data
 */
export const getAddressDevice = (data) => {
    return request({
        url: '/yingshi/ys/getAddressDevice',
        method: 'post',
        data: data
    });
};

/**
 * 获取指定设备的通道信息
 *
 * @param data
 */
export const getCameraDevice = (data) => {
    return request({
        url: '/yingshi/ys/cameraDevice',
        method: 'post',
        data: data
    });
};

/**
 * 开始云台控制
 *
 * @param data
 */
export const startControl = (data) => {
    return request({
        url: '/yingshi/ys/startControl',
        method: 'post',
        data: data
    });
};

/**
 * 结束云台控制
 *
 * @param data
 */
export const endControl = (data) => {
    return request({
        url: '/yingshi/ys/endControl',
        method: 'post',
        data: data
    });
};

/**
 * 镜像翻转
 *
 * @param data
 */
export const mirrorFlip = (data) => {
    return request({
        url: '/yingshi/ys/mirrorFlip',
        method: 'post',
        data: data
    });
};

/**
 * 添加预置点
 *
 * @param data
 */
export const presetAdd = (data) => {
    return request({
        url: '/yingshi/ys/presetAdd',
        method: 'post',
        data: data
    });
};

/**
 * 清除预置点
 *
 * @param data
 */
export const presetClear = (data) => {
    return request({
        url: '/yingshi/ys/presetClear',
        method: 'post',
        data: data
    });
};

/**
 * 调用预置点
 *
 * @param data
 */
export const presetMove = (data) => {
    return request({
        url: '/yingshi/ys/presetMove',
        method: 'post',
        data: data
    });
};

/**
 * 设备抓拍图片
 *
 * @param data
 */
export const capture = (data) => {
    return request({
        url: '/yingshi/ys/capture',
        method: 'post',
        data: data
    });
};

/**
 * 修改云端设备名称
 *
 * @param data
 */
export const updateDeviceName = (data) => {
    return request({
        url: '/yingshi/ys/updateDeviceName',
        method: 'post',
        data: data
    });
};

/**
 * 修改云端通道名称
 *
 * @param data
 */
export const cameraNameUpdate = (data) => {
    return request({
        url: '/yingshi/ys/cameraNameUpdate',
        method: 'post',
        data: data
    });
};

/**
 * 获取单个设备信息
 *
 * @param data
 */
export const deviceInfo = (data) => {
    return request({
        url: '/yingshi/ys/deviceInfo',
        method: 'post',
        data: data
    });
};

/**
 * 关闭设备视频加密
 *
 * @param data
 */
export const deviceEncryptOff = (data) => {
    return request({
        url: '/yingshi/ys/deviceEncryptOff',
        method: 'post',
        data: data
    });
};

/**
 * 开启设备视频加密
 *
 * @param data
 */
export const deviceEncryptOn = (data) => {
    return request({
        url: '/yingshi/ys/deviceEncryptOn',
        method: 'post',
        data: data
    });
};

/**
 * 修改设备视频加密密码
 *
 * @param data
 */
export const devicePasswordUpdate = (data) => {
    return request({
        url: '/yingshi/ys/devicePasswordUpdate',
        method: 'post',
        data: data
    });
};

/**
 * 获取设备版本信息
 *
 * @param data
 */
export const deviceVersionInfo = (data) => {
    return request({
        url: '/yingshi/ys/deviceVersionInfo',
        method: 'post',
        data: data
    });
};

/**
 * 设备升级固件
 *
 * @param data
 */
export const deviceUpgrade = (data) => {
    return request({
        url: '/yingshi/ys/deviceUpgrade',
        method: 'post',
        data: data
    });
};

/**
 * 获取设备升级状态
 *
 * @param data
 */
export const deviceUpgradeStatus = (data) => {
    return request({
        url: '/yingshi/ys/deviceUpgradeStatus',
        method: 'post',
        data: data
    });
};

/**
 * 设置设备撤/布防
 *
 * @param data
 */
export const deviceDefenceSet = (data) => {
    return request({
        url: '/yingshi/ys/deviceDefenceSet',
        method: 'post',
        data: data
    });
};

/**
 * 获取设备布撤防时间计划
 *
 * @param data
 */
export const deviceDefencePlanGet = (data) => {
    return request({
        url: '/yingshi/ys/deviceDefencePlanGet',
        method: 'post',
        data: data
    });
};

/**
 * 设置布撤防时间计划
 *
 * @param data
 */
export const deviceDefencePlanSet = (data) => {
    return request({
        url: '/yingshi/ys/deviceDefencePlanSet',
        method: 'post',
        data: data
    });
};