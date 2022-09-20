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

// 以下是获取spuForm初始化的请求（点击编辑spuList后发起）
// 获取spu信息的接口（spu名称，spu描述等）
// 获取某一个spu信息GET /admin/product/getSpuById/{spuId}
export const reqSpu =(spuId)=>request({
  url:`/admin/product/getSpuById/${spuId}`,
  method:"GET"
})

// 获取品牌信息的接口
// GET /admin/product/baseTrademark/getTrademarkList
export const reqTradeMark =()=>request({
  url:'/admin/product/baseTrademark/getTrademarkList',
  method:"GET"
})

// 获取spu图片的接口
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList=(spuId)=>request({
  url:`/admin/product/spuImageList/${spuId}`,
  method:"GET"
})

// 获取平台全部的销售属性，一共是3个
// GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList=()=>request({
  url:"/admin/product/baseSaleAttrList",
  method:"GET"
})

// 保存上传或更新spu的数据
// POST /admin/product/saveSpuInfo保存接口
// POST /admin/product/updateSpuInfo更新接口
// spu的修改和上传收集数据的位置是不一样的，点击编辑进去的时候，可以把数据收到spu中，但是新增的则是个空数据
// 收集数据的时候需要那些字段呢
/* {
  "category3Id": 0,  三级分类的id
  "tmId": 0   品牌的id
  "description": "string",  spu描述
  "spuName": "string",  spu的名称
  "spuImageList": [ 照片墙的数据
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
} */
export const reqUpdateOrEditSpuInfo=(data)=>{
  if(data.id){
    // 更新接口
    return request({
      url:"/admin/product/updateSpuInfo",
      method:"POST",
      data
    })
  }else{
    // 添加接口
    return request({
      url:"/admin/product/saveSpuInfo",
      method:"POST",
      data
    })
  }
}