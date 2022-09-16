  // 需要使用二次封装好的函数
import request from "@/utils/request"

// 1.请求tradeMark列表的api
// 获取商品分类的接口GET /admin/product/baseTrademark/{page}/{limit}
// {}为需要传递的参数
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})

// 2.添加图片请求的api
// POST /admin/product/baseTrademark/save
// 需要携带两个参数：品牌名称，品牌logo，不需要传递ID

// 3.请求接口
// PUT /admin/product/baseTrademark/update
// 需要携带三个参数：品牌名称，品牌logo，ID

// tradeMark是传递参数的对象，包含名称，url，或则可能带有id
export const reqAddOrUpdateTradeMark = (tradeMark) =>{
  // 通过传入的对象是否带有id来判断是修改还是新增
  if(tradeMark.id){
    // 这里编写修改接口
    return request({
      url:'/admin/product/baseTrademark/update',
      method:'PUT',
      data:tradeMark
  })
  }else{
    // 这里编写新增接口
    return request({
      url:'/admin/product/baseTrademark/save',
      method:'POST',
      data:tradeMark
    })
  }
}