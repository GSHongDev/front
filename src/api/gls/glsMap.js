import request from '@/utils/request';

/**
 * 获取国标通道列表
 * @returns {*}
 */
export function gbChannelList() {
    return request({
        url: `/gls/gb/channel/list`,
        method: 'get',
    })
}

/**
 * 业务分组获取树列表
 * @returns {*}
 */
export function queryGroupForTree(query) {
    return request({
        url: `/gls/group/tree/list`,
        method: 'get',
        params: query
    })
}


/**
 * 业务分组获取树列表
 * @returns {*}
 */
export function queryRegionForTree(query) {
    return request({
        url: `/gls/region/tree/list`,
        method: 'get',
        params: query
    })
}

export function listByParentId(query) {
    return request({
        url: `/gls/channel/parent/list`,
        method: 'get',
        params: query
    })
}

export function listByCivilCode(query) {
    return request({
        url: `/gls/civilcode/list`,
        method: 'get',
        params: query
    })
}

