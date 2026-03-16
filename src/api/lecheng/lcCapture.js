import request from '@/utils/request'

// 查询设备抓拍列表
export function listLcCapture(query) {
  return request({
    url: '/lecheng/lcCapture/list',
    method: 'get',
    params: query
  })
}

// 查询设备抓拍详细
export function getLcCapture(id) {
  return request({
    url: '/lecheng/lcCapture/' + id,
    method: 'get'
  })
}

// 新增设备抓拍
export function addLcCapture(data) {
  return request({
    url: '/lecheng/lcCapture',
    method: 'post',
    data: data
  })
}

// 修改设备抓拍
export function updateLcCapture(data) {
  return request({
    url: '/lecheng/lcCapture',
    method: 'put',
    data: data
  })
}

// 删除设备抓拍
export function delLcCapture(id) {
  return request({
    url: '/lecheng/lcCapture/' + id,
    method: 'delete'
  })
}
