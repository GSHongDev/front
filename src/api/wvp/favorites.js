import request from '@/utils/request'

// 查询国标通道收藏列表
export function listFavorites(query) {
  return request({
    url: '/wvp/favorites/list',
    method: 'get',
    params: query
  })
}

// 查询国标通道收藏列表
export function listFavoritesAll(query) {
  return request({
    url: '/wvp/favorites/listAll',
    method: 'get',
    params: query
  })
}

// 查询国标通道收藏详细
export function getFavorites(id) {
  return request({
    url: '/wvp/favorites/' + id,
    method: 'get'
  })
}

// 新增国标通道收藏
export function addFavorites(data) {
  return request({
    url: '/wvp/favorites',
    method: 'post',
    data: data
  })
}

// 修改国标通道收藏
export function updateFavorites(data) {
  return request({
    url: '/wvp/favorites',
    method: 'put',
    data: data
  })
}

// 删除国标通道收藏
export function delFavorites(id) {
  return request({
    url: '/wvp/favorites/' + id,
    method: 'delete'
  })
}
