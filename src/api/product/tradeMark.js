// 需要使用二次封装好的函数
import request from "@/utils/request"

// 获取商品分类的接口GET /admin/product/baseTrademark/{page}/{limit}
// {}为需要传递的参数
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})

// 新增商品接口POST /admin/product/baseTrademark/save
// 需要传递参数图片logoUrl 商品名称tmName

// 编辑商品接口PUT /admin/product/baseTrademark/update
// 需要传递参数图片logoUrl 商品名称tmName
export const reqUpdateOrEditTradeMark = (tradeMark) => {
  // 通过判断传入的参数是否有id来判断是修改还是新增
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: tradeMark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data: tradeMark
    })
  }
}

// 删除商品接口DELETE /admin/product/baseTrademark/remove/{id}
// 需要传递参数商品id
export const reqDeleteTradeMark = (id) => {
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}