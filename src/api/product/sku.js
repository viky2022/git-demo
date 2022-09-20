import request from "@/utils/request"

// 获取sku商品图片的请求
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList =(spuId)=>request({
    url:`/admin/product/spuImageList/${spuId}`,
    method:"GET"
})

// 获取sku销售属性
// GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId)=>request({
    url:`/admin/product/spuSaleAttrList/${spuId}`,
    method:"GET"
})

// 获取商品属性接口
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'GET'
})

// 保存sku时发起请求接口
// 添加接口
// POST /admin/product/saveSkuInfo
// 更新接口
// POST /admin/product/updateSkuInfo
export const reqSaveSkuInfo =(data)=>{
    if(data.id){
        // 更新请求
        return request({
            url:"/admin/product/saveSkuInfo",
            method:"POST",
            data
        })
    }else{
        // 添加请求
        return request({
            url:"/admin/product/updateSkuInfo",
            method:"POST",
            data
        })
    }
}
/* {
    "category3Id": 0, //三级分类id（新增的属性是需要传参保存的）
    "createTime": "2022-09-20T08:31:56.477Z", //当前时间
    "isSale": 0, //售卖状态
    "price": 0, //价格
    "spuId": 0, 
    "tmId": 0,
    "weight": "string", //重量
    "skuDefaultImg": "string", //sku默认图片
    "skuDesc": "string", //sku描述
    "skuName": "string", //sku名称
    "skuAttrValueList": [ //sku属性值列表
      {
        "attrId": 0,
        "attrName": "string",
        "id": 0,
        "skuId": 0,
        "valueId": 0,
        "valueName": "string"
      }
    ],
    "skuImageList": [ //sku图片列表
      {
        "id": 0,
        "imgName": "string",
        "imgUrl": "string",
        "isDefault": "string",
        "skuId": 0,
        "spuImgId": 0
      }
    ],
    "skuSaleAttrValueList": [ //sku售卖属性值列表
      {
        "id": 0,
        "saleAttrId": 0,
        "saleAttrName": "string",
        "saleAttrValueId": 0,
        "saleAttrValueName": "string",
        "skuId": 0,
        "spuId": 0
      }
    ],
  } */