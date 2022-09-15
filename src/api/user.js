import request from '@/utils/request'

// 处理登录业务接口
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

// 处理收集用户信息接口
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// 处理登出业务接口
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
