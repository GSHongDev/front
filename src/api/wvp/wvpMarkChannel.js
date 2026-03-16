import request from '@/utils/request'

// 查询wvp国标通道标记列表
export function listWvpMarkChannel(query) {
  return request({
    url: '/wvp/wvpMarkChannel/list',
    method: 'get',
    params: query
  })
}

// 查询wvp国标通道标记详细
export function getWvpMarkChannel(channelId) {
  return request({
    url: '/wvp/wvpMarkChannel/' + channelId,
    method: 'get'
  })
}

// 新增wvp国标通道标记
export function addWvpMarkChannel(data) {
  return request({
    url: '/wvp/wvpMarkChannel',
    method: 'post',
    data: data
  })
}

// 修改wvp国标通道标记
export function updateWvpMarkChannel(data) {
  return request({
    url: '/wvp/wvpMarkChannel',
    method: 'put',
    data: data
  })
}

// 删除wvp国标通道标记
export function delWvpMarkChannel(channelId) {
  return request({
    url: '/wvp/wvpMarkChannel/' + channelId,
    method: 'delete'
  })
}
