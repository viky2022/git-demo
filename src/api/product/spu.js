import request from "@/utils/request"

// 请求spuList的接口
// GET /admin/product/{page}/{limit}
// 携带三个参数page limit 三级分类的id
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: "GET",
  // 参数发送params参数
  params: { category3Id }
})