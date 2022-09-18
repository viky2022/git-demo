<template>
  <div class="app-container">
    <!-- 按钮 -->
    <el-button type="primary" style="margin: 10px 0" @click="updateTradeMark"
      >提交</el-button
    >

    <!-- 点击按钮后显示的表单 -->
    <el-dialog
      :title="this.tmForm.id ? '编辑品牌' : '新增品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmForm" ref="tmForm" :rules="rules">
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input
            v-model="tmForm.tmName"
            autocomplete="off"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="上传LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateOrEditTradeMark('tmForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" height="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="editTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="open(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- @size-change="handleSizeChange"改变当页展示后的回调 -->
    <!-- @current-change="handleCurrentChange"改变当前展示页的回调 -->
    <el-pagination
      align="center"
      style="margin-top: 20px"
      background
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="total, prev, pager, next, jumper,->,sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      // 分页器修改数据
      // 代表分页器第几页
      page: 1,
      // 当前页数展示的条数
      limit: 3,
      // 保存数据
      list: "",
      // 数据总条数
      total: "",

      // dialog收集信息
      tmForm: {
        id: "",
        tmName: "",
        logoUrl: "",
      },
      // 隐藏dialog
      dialogFormVisible: false,

      // 表单验证
      rules: {
        // 品牌名称的验证规则
        // 验证的字段必须是v-model收集的数据，不能另外起
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "长度在 2 到 8 个字符",
            trigger: "change",
          },
        ],
        // 品牌logo的验证规则
        logoUrl: [
          {
            required: true,
            message: "请选择需要上传的品牌LOGO",
          },
        ],
      },
    };
  },
  mounted() {
    // 获取商品列表的方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 解构出参数
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        // 将获取的数据保存下来
        this.list = result.data.records;
        this.total = result.data.total;
      }
    },

    // 切换单页显示最大数量
    // 传入一个参数，当前希望展示最大的页数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },

    // 点击第几页之后跳转
    // 传入一个参数，跳转页数
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },

    // 上传图片后成功的回调
    handleAvatarSuccess(row, file) {
      console.log(row);
      if (row.code === 200) {
        this.tmForm.logoUrl = row.data;
      }
    },

    // 点击添加,显示dialog
    updateTradeMark() {
      this.tmForm.id = "";
      this.tmForm.tmName = "";
      this.tmForm.logoUrl = "";
      this.dialogFormVisible = true;
    },

    // 确定按钮，新增或编辑
    handleUpdateOrEditTradeMark(formName) {
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 如果符合表单验证
          // 隐藏dialog
          this.dialogFormVisible = false;
          const result = await this.$API.tradeMark.reqUpdateOrEditTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            this.$message.success(this.tmForm.id ? "编辑成功" : "上传成功");
          }
          // 修改后重新获取数据
          this.getPageList();
        } else {
          // 如果不符合表单验证
          return false;
        }
      });
    },

    // 点击编辑按钮，编辑图片
    editTradeMark(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
      // 修改后重新获取数据
      this.getPageList();
    },

    // 点击删除
    open(row) {
      this.$confirm(`确定删除名称为“${row.tmName}”的品牌数据`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取数据，需要进行判断，如果当前页数小于1，则需要回到上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>