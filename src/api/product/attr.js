// 这是属性管理修改的api文件
import request from "@/utils/request"

// 获取一级商品分类的接口
// GET /admin/product/getCategory1
// 不需要携带参数
export const reqCategory1List = () => request({
  url: "/admin/product/getCategory1",
  method: "GET"
})



// 获取二级商品分类的接口
// GET /admin/product/getCategory2/{category1Id}
// 需要携带一级商品分类的id
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: "GET"
})

// 获取三级级商品分类的接口
// GET /admin/product/getCategory3/{category2Id}
// 需要携带二级商品分类的id
export const reqCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: "GET"
})

// 获取商品属性列表的接口
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: "GET"
})

// 新增商品属性名与属性值的接口
// POST /admin/product/saveAttrInfo
// 携带的参数
/* {
  属性名
  "attrName": "string",
  属性值列表
  "attrValueList": [
    {
      属性值的id
      "attrId": 0,
      属性值
      "valueName": "string"
    }
  ],
  商品id
  "categoryId": 0,
  分类等级
  "categoryLevel": 3,
} */
export const reqAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'POST',
  data: data
})
