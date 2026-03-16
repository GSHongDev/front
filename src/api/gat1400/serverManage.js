import request from '@/utils/request'

export function serverManagePage(query) {
    return request({
        url: '/api/viid/server/page',
        method: 'get',
        params: query
    })
}

export function changeServerEnableApi(data) {
    return request({
        url: '/api/viid/server/change/enable',
        method: 'put',
        data: data
    })
}

export function changeServerKeepaliveApi(data) {
    return request({
        url: '/api/viid/server/change/keepalive',
        method: 'put',
        data: data
    })
}

export function delServers(ids) {
    return request({
        url: '/api/viid/server/' + ids,
        method: 'delete'
    })
}

export function upsertServer(data) {
    return request({
        url: '/api/viid/server/upsert',
        method: 'post',
        data: data
    })
}

export function getServer(id) {
    return request({
        url: '/api/viid/server/' + id,
        method: 'get'
    })
}
