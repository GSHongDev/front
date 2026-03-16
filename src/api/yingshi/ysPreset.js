import request from '@/utils/request'

// 查询预置点列表（不分页）
export function listYsPreset(query) {
  return request({
    url: '/yingshi/ysPreset/list',
    method: 'get',
    params: query
  })
}
