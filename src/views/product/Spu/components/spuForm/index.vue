<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="活动名称">
      <el-input placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" rows="4" placeholder="描述"></el-input>
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
      <el-button>取消</el-button>
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
  },
};
</script>

<style scoped>
</style>