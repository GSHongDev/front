import request from '@/utils/request'

// 查询萤石监控配置列表（不分页）
export function listYsConfigVo(query) {
  return request({
    url: '/yingshi/ysConfig/listYsConfigVo',
    method: 'get',
    params: query
  })
}

// 查询萤石监控配置列表（分页）
export function listYsConfig(query) {
  return request({
    url: '/yingshi/ysConfig/list',
    method: 'get',
    params: query
  })
}

// 查询萤石监控配置详细
export function getYsConfig(id) {
  return request({
    url: '/yingshi/ysConfig/' + id,
    method: 'get'
  })
}

// 新增萤石监控配置
export function addYsConfig(data) {
  return request({
    url: '/yingshi/ysConfig',
    method: 'post',
    data: data
  })
}

// 修改萤石监控配置
export function updateYsConfig(data) {
  return request({
    url: '/yingshi/ysConfig',
    method: 'put',
    data: data
  })
}

// 删除萤石监控配置
export function delYsConfig(id) {
  return request({
    url: '/yingshi/ysConfig/' + id,
    method: 'delete'
  })
}
