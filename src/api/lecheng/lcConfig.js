import request from '@/utils/request'

// 查询乐橙监控配置列表（不分页）
export function listLcConfigVo(query) {
  return request({
    url: '/lecheng/lcConfig/listLcConfigVo',
    method: 'get',
    params: query
  })
}

// 查询乐橙监控配置列表（分页）
export function listLcConfig(query) {
  return request({
    url: '/lecheng/lcConfig/list',
    method: 'get',
    params: query
  })
}

// 查询乐橙监控配置详细
export function getLcConfig(id) {
  return request({
    url: '/lecheng/lcConfig/' + id,
    method: 'get'
  })
}

// 新增乐橙监控配置
export function addLcConfig(data) {
  return request({
    url: '/lecheng/lcConfig',
    method: 'post',
    data: data
  })
}

// 修改乐橙监控配置
export function updateLcConfig(data) {
  return request({
    url: '/lecheng/lcConfig',
    method: 'put',
    data: data
  })
}

// 删除乐橙监控配置
export function delLcConfig(id) {
  return request({
    url: '/lecheng/lcConfig/' + id,
    method: 'delete'
  })
}
