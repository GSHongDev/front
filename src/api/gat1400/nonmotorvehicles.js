import request from '@/utils/request'

// 非机动车-分页列表
export function nonmotorvehiclesPage(query) {
    return request({
        url: '/api/viid/nonmotorvehicles/page',
        method: 'get',
        params: query
    })
}

// 非机动车-详情
export function getNonmotorvehicles(id) {
    return request({
        url: '/api/viid/nonmotorvehicles/' + id,
        method: 'get',
    })
}

// 非机动车-新增
export function addNonmotorvehicles(data) {
    return request({
        url: '/api/viid/nonmotorvehicles',
        method: 'post',
        data: data
    })
}

// 非机动车-修改
export function updateNonmotorvehicles(data) {
    return request({
        url: '/api/viid/nonmotorvehicles',
        method: 'put',
        data: data
    })
}

// 非机动车-删除
export function deleteNonmotorvehicles(id) {
    return request({
        url: '/api/viid/nonmotorvehicles/' + id,
        method: 'delete',
    })
}