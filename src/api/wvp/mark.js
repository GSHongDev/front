import request from '@/utils/request'

// 查询wvp通道标记列表
export function listMark(query) {
  return request({
    url: '/wvp/mark/list',
    method: 'get',
    params: query
  })
}
export function listMarkAll(query) {
  return request({
    url: '/wvp/mark/listAll',
    method: 'get',
    params: query
  })
}

// 查询wvp通道标记详细
export function getMark(id) {
  return request({
    url: '/wvp/mark/' + id,
    method: 'get'
  })
}

// 新增wvp通道标记
export function addMark(data) {
  return request({
    url: '/wvp/mark',
    method: 'post',
    data: data
  })
}

// 修改wvp通道标记
export function updateMark(data) {
  return request({
    url: '/wvp/mark',
    method: 'put',
    data: data
  })
}

// 删除wvp通道标记
export function delMark(id) {
  return request({
    url: '/wvp/mark/' + id,
    method: 'delete'
  })
}
