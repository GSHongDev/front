import request from '@/utils/request';

/**
 * 获取节点信息
 * @returns {*}
 */
export function getNodeConf() {
    return request({
        url: '/api/viid/server/me',
        method: 'get',
    })
}

export function updateServerMe(data) {
    return request({
        url: '/api/viid/server/me',
        method: 'post',
        data: data
    })
}
