<template>
  <!-- 只有给el-form加上：model属性，才可以收集数据 -->
  <el-form ref="form" label-width="80px" :model="spu">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option  :label="tm.tmName" v-for="(tm,index) in tradeMarkList" :key="tm.id" :value="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="描述"
        v-model="spu.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select placeholder="还有3未选择">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px"
        >添加销售属性</el-button
      >
      <el-table border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名属性名"
          width="260"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="address" label="属性值名称列表" align="center">
        </el-table-column>
        <el-table-column prop="address" label="操作" width="260" align="center">
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">提交</el-button>
      <el-button @click="$emit('changeScene', 0)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      // 照片墙相关属性
      dialogImageUrl: "",
      dialogVisible: false,

      // 存储spu信息属性
      spu: {
        category3Id: 0, //三级分类的id
        tmId: 0, //品牌的id
        description: "", //spu描述
        spuName: "", //spu的名称
        spuImageList: [
          //照片墙的数据
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          },
        ],
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储spu图片
      spuImageList: [],
      // 平台全部的销售属性
      baseSaleAttrList: [],
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 初始化spuForm的数据
    async initSpuFormDate(spu) {
      // 获取spu信息的接口
      const spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }

      // 获取品牌信息的接口
      const tradeMarkResult = await this.$API.spu.reqTradeMark();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取spu图片的接口
      const spuImageListResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageListResult.code == 200) {
        this.spuImageList = spuImageListResult.data;
      }

      // 获取平台全部的销售属性，一共是3个
      const baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListResult.data;
      }
    },
  },
};
</script>

<style scoped></style>
