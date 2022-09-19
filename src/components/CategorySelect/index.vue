<template>
  <!-- :inline="true"代表行内表单 -->
  <el-form :inline="true" :model="cForm" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select
        :disabled="!isShowTable"
        placeholder="请选择"
        v-model="cForm.category1Id"
        @change="handleCategory1"
      >
        <!-- 注意三级分类收集的数据是id，使用v-model收集 -->
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="(c1, index) in category1List"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        :disabled="!isShowTable"
        placeholder="请选择"
        v-model="cForm.category2Id"
        @change="handleCategory2"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="(c2, index) in category2List"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        :disabled="!isShowTable"
        placeholder="请选择"
        v-model="cForm.category3Id"
        @change="handleCategory3"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="(c3, index) in category3List"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["isShowTable"],
  data() {
    return {
      // 获取到的一级分类数据
      category1List: "",
      // 获取到的二级分类数据
      category2List: "",
      // 获取到的三级分类数据
      category3List: "",

      // 收集一级、二级、三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    // 组件一挂载完就必须获取一级分类数据
    this.getCategory1List();
  },
  methods: {
    // 点击提交按钮后的回调
    onSubmit() {
      console.log(123);
    },
    // 获取一级分类的api请求
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 获取到一级分类数据后的回调
    async handleCategory1() {
      // 获取一级分类的数据时要清空二、三级分类的数据,并且需要清除掉二、三级分类的id
      this.category2List = [];
      this.category3List = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";

      // 解构出一级分类id
      const { category1Id } = this.cForm;
      // 将一级分类的id传递给父组件(必须区分发送的id是几级id)
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });

      // 传入一级分类的id，获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 获取到二级分类后的回调
    async handleCategory2() {
      // 获取二级分类的数据时要清空三级分类的数据,并且需要清除掉三级分类的id
      this.category3List = [];
      this.cForm.category3Id = "";

      const { category2Id } = this.cForm;
      // 将二级分类的id传递给父组件
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });

      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    // 获取到三级分类后的回调后，需要再一次发起请求,用于渲染最终数据
    handleCategory3() {
      const { category3Id } = this.cForm;
      // 将三级分类的id传递给父组件
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>