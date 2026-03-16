import request from '@/utils/request'

// 查询设备抓拍列表（不分页）
export function listYsCapture(query) {
  return request({
    url: '/yingshi/ysCapture/list',
    method: 'get',
    params: query
  })
}

// 删除设备抓拍
export function delYsCapture(id) {
  return request({
    url: '/yingshi/ysCapture/' + id,
    method: 'delete'
  })
}
