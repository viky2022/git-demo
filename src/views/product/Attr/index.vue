<template>
  <div class="app-container">
    <!-- card是带有阴影的卡片 -->
    <el-card style="margin: 20px 0" class="box-card">
      <!-- 三级联动组件 -->
      <!-- 给CategorySelect绑定一个自定义事件，需要后续接收三级分类发起请求后的数据渲染到本页 -->
      <!-- 这个回调的作用是将选中的参数向父组件传递 -->
      <CategorySelect
        :isShowTable="isShowAttrTable"
        @getCategoryId="getCategoryId"
      ></CategorySelect>
    </el-card>
    <el-card class="box-card">
      <!-- 展示attr列表 -->
      <div v-show="isShowAttrTable">
        <!-- 添加按钮 -->
        <!-- 点击按钮后，需要数据展示列表，显示新增数据的表格 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 0"
          :disabled="!category3Id"
          @click="updateAttr"
          >添加属性值</el-button
        >
        <!-- 展示数据表格 -->
        <el-table :data="AttrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="240">
          </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(item, index) in row.attrValueList"
                :key="index"
                type="success"
                style="margin: 0 8px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="320"
            align="center"
          >
            <!-- 因为这两个按钮都需要传入id，所以必须写到插槽里面去 -->
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="editAttr(row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteAttr(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改attr -->
      <div v-show="!isShowAttrTable">
        <el-form :inline="true" :model="attrInfo" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              :disabled="!attrInfo.attrName"
              @click="updateValue"
              >新增属性</el-button
            >
            <el-button @click="isShowAttrTable = true">取消</el-button>
          </el-form-item>
        </el-form>

        <el-table
          height="250"
          :data="attrInfo.attrValueList"
          border
          style="width: 100%; margin-bottom: 20px"
        >
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性名"
                v-if="row.flag"
                @blur="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="editInp(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" align="center">
            <template slot-scope="{ $index }">
              <el-popconfirm
                title="是否确认删除？"
                @onConfirm="deleteValueName($index)"
              >
                <el-button icon="el-icon-delete" type="danger" slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="updateOrEditAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowAttrTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 接收子组件传入的id
      category1Id: "",
      category2Id: "",
      category3Id: "",

      // 获取到的商品属性数据
      AttrList: [],

      // 展示表格的显示与隐藏
      isShowAttrTable: true,

      // 收集新增的attr属性数据
      attrInfo: {
        attrName: "",
        attrValueList: [
          // 每一个属性值都是一个对象
        ],
        // 三级分类的id
        categoryId: 0,
        // 服务器也要分清楚是几级id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(id) {
      if (id.level === 1) {
        this.category1Id = id.categoryId;
        // 当重新获取一级分类的id的时候，需要清除二、三级分类的id
        this.category2Id = "";
        this.category3Id = "";
        // 数据也最好为空
        this.AttrList = [];
      } else if (id.level === 2) {
        this.category2Id = id.categoryId;
        // 当重新获取二级分类的id的时候，需要清除三级分类的id
        this.category3Id = "";
        // 数据也最好为空
        this.AttrList = [];
      } else {
        this.category3Id = id.categoryId;
        // 当获得到三级分类id的时候，就说明可以发起请求获取attrList展示的数据了
        this.getAttrList();
      }
    },

    async getAttrList() {
      let result = await this.$API.attr.reqAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (result.code === 200) {
        // 保存获取到的商品数据
        this.AttrList = result.data;
      }
    },

    // 点击新增按钮
    updateAttr() {
      this.isShowAttrTable = false;
      // 清空之前写好的表单数据

      (this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 三级分类的id
        categoryId: 0,
        // 服务器也要分清楚是几级id
        categoryLevel: 3,
      }),
        // 保存三级分类的id
        (this.attrInfo.categoryId = this.category3Id);
    },

    // 点击编辑按钮
    editAttr(row) {
      // 点击编辑按钮也应该隐藏展示列表
      this.isShowAttrTable = false;
      // 必须深拷贝，可以使用lodash的深拷贝
      this.attrInfo = cloneDeep(row);
      // 给已有的属性值添加flag，默认为查看模式，所以flag=false
      this.attrInfo.attrValueList.forEach((item) => {
        // 这样书写虽然可以给添加一个属性，但是他不是响应式的，必须使用$set设置
        this.$set(item, "flag", false);
      });
    },

    // 点击删除按钮
    deleteAttr(row) {
      console.log(id);
    },

    // 点击添加属性值按钮
    updateValue() {
      this.attrInfo.attrValueList.push({
        // 相应属性名的id
        attrId: this.attrInfo.id, //在已有属性值的基础上新增属性
        valueName: "", //如果是直接新增的，则后台会自己新增id
        flag: true,
      });

      // 让新增的属性自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },

    // 点击查看
    toLook(row) {
      // row是相对于attrValueList的内容
      // 切换编辑和查看模式，这里需要做一个判断，如果输入的属性值有空，则需要进行判断
      console.log(row);
      // 判断新增的属性值不能为空与不能重复添加相同的属性
      if (row.valueName.trim() === "") {
        this.$message({ message: "输入不能为空,请重新输入", type: "error" });
      }
      const isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 注意，这里的判断是将item与row当作object来判断，所以只要都是对象返回都是true
        if (item !== row) {
          return item.valueName == row.valueName;
        }
      });
      if (isRepeat) {
        this.$message({
          message: "不能添加相同的属性，请重新输入",
          type: "error",
        });
        return;
      }

      row.flag = false;
    },

    // 点击span的回调
    editInp(row, index) {
      row.flag = true;
      // 注意此处不能马上获取到，而是要在下一次渲染的时候才会被重新获取,所以需要使用$nextTick
      // this.$nextTick的作用是当所以的DOM渲染完后立马执行一次
      this.$nextTick(() => {
        // console.log(this.$refs[index]);
        this.$refs[index].focus();
      });
    },

    // 点击删除属性值的按钮回调
    deleteValueName(index) {
      // 注意低版本的回调是onConfirm
      // 最新版本的才是confirm
      // 当前是不发起请求的,而是等到后续保存的时候再发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },

    // 点击保存更新或新增attr数据请求
    async updateOrEditAttr() {
      // 整理参数
      // 不要提交多余的flag字段
      // 不要提交空数据
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 带着参数发起请求
        await this.$API.attr.reqAttr(this.attrInfo);
        this.$message.success("保存成功");
        // 切换为展示列表
        this.isShowAttrTable = true;
        // 重新获取数据
        this.getAttrList();
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
  },
};
</script>

<style>
</style>