import request from '@/utils/request'

// 查询收藏夹国标通道列表
export function listFavoritesChannel(query) {
  return request({
    url: '/wvp/favoritesChannel/list',
    method: 'get',
    params: query
  })
}

// 查询收藏夹国标通道详细
export function getFavoritesChannel(favoritesId) {
  return request({
    url: '/wvp/favoritesChannel/' + favoritesId,
    method: 'get'
  })
}

// 新增收藏夹国标通道
export function addFavoritesChannel(data) {
  return request({
    url: '/wvp/favoritesChannel',
    method: 'post',
    data: data
  })
}

// 修改收藏夹国标通道
export function updateFavoritesChannel(data) {
  return request({
    url: '/wvp/favoritesChannel',
    method: 'put',
    data: data
  })
}

// 删除收藏夹国标通道
export function delFavoritesChannel(favoritesId) {
  return request({
    url: '/wvp/favoritesChannel/' + favoritesId,
    method: 'delete'
  })
}
