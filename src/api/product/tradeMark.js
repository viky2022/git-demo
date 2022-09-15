// 获取商品分类的接口GET /admin/product/baseTrademark/{page}/{limit}
// {}为需要传递的参数
import request from "@/utils/request"

export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})
  // 需要使用二次封装好的函数

