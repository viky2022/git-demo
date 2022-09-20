<template>
  <div>
    <el-form :model="spuInfo">
      <el-form-item label="SPU名称" label-width="110px">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称" label-width="110px">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）" label-width="110px">
        <el-input placeholder="价格（元）"  v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）" label-width="110px">
        <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述" label-width="110px">
        <el-input type="textarea" placeholder="规格描述" v-model="skuInfo.skuDesc" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性" label-width="110px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="屏幕尺寸" label-width="110px">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="无线通信" label-width="110px">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" label-width="110px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="颜色" label-width="110px">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" label-width="110px">
        <el-table border style="width: 100%">
          <el-table-column
            prop="date"
            type="selection"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="name" label="图片"> </el-table-column>
          <el-table-column prop="address" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作"> </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="110px">
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      // 存储收到的图片列表
      reqSpuImageListResult: [],
      // 存储获取到的销售属性
      reqSpuSaleAttrListResult: [],
      // 存储获取到的商品属性接口
      reqAttrInfoListResult: [],
      // 收集skuInfo的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的
        category3Id: 0, //三级分类id（新增的属性是需要传参保存的）
        spuId: 0, //类id
        tmId: 0, //品牌id
        // 第二类表单收集的
        price: 0, //价格
        weight: "", //重量
        skuDesc: "", //sku描述
        skuName: "", //sku名称
        // 第三类需要自己去写代码收集的
        skuDefaultImg: "string", //sku默认图片
        skuAttrValueList: [
          //sku属性值列表
          {
            attrId: 0,
            attrName: "string",
            id: 0,
            skuId: 0,
            valueId: 0,
            valueName: "string",
          },
        ],
        skuImageList: [
          //sku图片列表
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          },
        ],
        skuSaleAttrValueList: [
          //sku售卖属性值列表
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          },
        ],
      },
      // 将点击添加后传入的row存储起来
      spu:{},
    };
  },
  methods: {
    // 新增sku时的数据请求
    async getData(category1Id, category2Id, row) {
      // 收集父组件给予的参数
      this.skuInfo.category3Id=row.category3Id
      this.skuInfo.spuId=row.id
      this.skuInfo.tmId=row.tmId
      this.spu=row
      console.log(this.spu);
      // 获取图片数据的请求
      const result1 = await this.$API.sku.reqSpuImageList(row.id);
      if (result1.code == 200) {
        this.reqSpuImageListResult = result1.data;
      }

      // 获取sku销售属性
      const result2 = await this.$API.sku.reqSpuSaleAttrList(row.id);
      if (result2.code == 200) {
        this.reqSpuSaleAttrListResult = result2.data;
      }

      // 获取平台属性的数据
      const result3 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (result3.code == 200) {
        this.reqAttrInfoListResult = result3.data;
      }
    },
  },
};
</script>

<style></style>