<template>
  <!-- 只有给el-form加上：model属性，才可以收集数据 -->
  <el-form ref="form" label-width="80px" :model="spu">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          :label="tm.tmName"
          v-for="(tm, index) in tradeMarkList"
          :key="tm.id"
          :value="tm.id"
        ></el-option>
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
    <el-form-item label="SPU图片" >
      <!-- 上传图片 -->
      <!-- :on-preview="handlePictureCardPreview"预览的回调 -->
      <!-- :on-remove="handleRemove"移除的回调 -->
      <!-- list-type="picture-card"文件列表的类型 -->
      <!-- file-list上传的文件列表,这个数组必须要有url与name字段 -->
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleAvatarSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select placeholder="还有3未选择">
        <el-option
          :label="item.name"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px"
        >添加销售属性</el-button
      >
      <el-table
        :data="spu.spuSaleAttrList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="属性名"
          width="260"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="address" label="属性值名称列表">
          <template slot-scope="{ row }">
            <el-tag
              :key="item.id"
              v-for="(item,index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index,1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              class="button-new-tag"
              size="small"
             
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="260" align="center">
          <template slot-scope="{ row,$index }">
            <el-button type="danger" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice($index,1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateOrEditSpuInfo">提交</el-button>
      <el-button @click="clearAllData">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      // el-tag相关
     
      inputValue: "",

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
    // 删除图片，file是删除的图片，fileList参数是剩下的其余图片
    handleRemove(file, fileList) {
      // 收集照片墙图片的数据
      this.spuImageList=fileList
    },
    // 预览图片，file是预览的图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片成功时
    handleAvatarSuccess(response, file, fileList){
      // response是返回的图片信息
      // file是本地的图片信息
      // fileList是所有的图片序列，注：上传的图片是带有response属性的，方便后期我们获取并保存修改的图片路径
      console.log(response, file, fileList);
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
        // 由于展示的图片列表需要url与name属性，服务器返回的是imgUrl与imgName属性，需要处理
        let listAttr = spuImageListResult.data;
        listAttr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listAttr;
      }

      // 获取平台全部的销售属性，一共是3个
      const baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListResult.data;
      }
    },

    /* // el-tag相关
    showInput() {
      // 切换为输入模式
      this.inputVisible = true;
      this.$nextTick(() => {
        this.spu.spuSaleAttrList.spuSaleAttrValueList.push()
      });
    }, */

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 点击提交按钮的回调
    async updateOrEditSpuInfo(){
    // 如果参数比较多而杂，必须整理参数
    // 如收集的图片并没有存放到spu中，且携带的字段是url与name，并非imgUrl与imgName
    this.spu.spuImageList=this.spuImageList.map(item=>{
      return {
        imgName:item.name,
        imgUrl:(item.response&&item.response.data)||item.url
      }
    })

    // 发起请求
    const result= await this.$API.spu.reqUpdateOrEditSpuInfo(this.spu)
    if(result.code==200){
      this.$message.success('提交成功')
      // 通知父亲，将scene变为0，之后还要再次获取列表的数据
      this.$emit('changeScene',0)
    }
    },

    // 清空数据
    clearAllData(){
      // 在这里清空数据
      this.$emit('changeScene', 0)
       // 存储spu信息属性
       this.spu= {
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
      }
      // 存储品牌信息
      this.tradeMarkList= []
      // 存储spu图片
      this.spuImageList= []
      // 平台全部的销售属性
      this.baseSaleAttrList= []
    }
  },

  computed: {
    unSelectSaleAttr() {
      // 整个平台的销售属性
      let result = this.baseSaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style scoped>
/* el-tag */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
