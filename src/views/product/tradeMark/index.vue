<template>
  <div class="app-container">
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      @click="addTradeMark"
      icon="el-icon-plus"
      style="margin: 15px 0"
      >添加</el-button>

    <!-- 对话框 -->
    <!-- :visible.sync="dialogFormVisible"控制对话框显示与隐藏 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- 表单 -->
      <!-- :model="tmForm"将表单的数据收集到哪个对象身上，表单验证也需要这个属性 -->
      <el-form :model="tmForm">
        <!-- 输入框 -->
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off" ></el-input>
        </el-form-item>

        <!-- 上传框 -->
        <!-- action是上传的地址，必须携带dev-api这个基础路径 -->
        <!-- :show-file-list="false"是否上传已上传的文件列表 -->
        <!-- :on-success="handleAvatarSuccess"上传成功的钩子 -->
        <!-- :before-upload="beforeAvatarUpload"上传之前返回的钩子 -->
        <el-form-item label="上传LOGO">
          <!-- 这里收集数据不能使用v-model -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" >取 消</el-button>
        <el-button type="primary" @click="addOrEditTradeMark"
          >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <!-- table组件展示的数据是以列为单位的 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <!-- 传入的参数row是list每一个对象的信息 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" width="100" height="100" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" @click="editTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- @size-change="handleSizeChange" -->
    <!-- @current-change="handleCurrentChange"会传送选择到的页码 -->
    <!-- :pager-count="6"分页器显示的按钮 -->
    <el-pagination
      align="center"
      style="margin-top: 20px"
      background
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="total, prev, pager, next, jumper,->,sizes"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      // 这是准备传递过去的数据
      // 代表分页器第几页
      page: 1,
      // 当前页数展示的条数
      limit: 3,

      // 这是准备接收的数据
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],

      // 对话框
      dialogFormVisible: false,

      // 表单收集的信息对象
      tmForm:{
        tmName:'',
        logoUrl:''
      }
    };
  },
  mounted() {
    // 加载默认获取page为1的数据，获取商品列表的方法
    this.getPageList();
  },
  methods: {
    // 封装获取数据的业务方法
    async getPageList() {
      // 解构出参数
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      // 如果成功
      if (result.code === 200) {
        console.log(result);
        // 保存数据总条数
        this.total = result.data.total;
        // 保存获取到的list
        this.list = result.data.records;
      }
    },

    // 点击切换分页时调用
    handleCurrentChange(pager) {
      this.page = pager;
      // 再次发起请求
      this.getPageList();
    },

    // 点击切换分页器最多显示条数时变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },

    // 处理dialog的方法
    // 添加功能
    addTradeMark() {
      this.dialogFormVisible = true;
      // 每次点击添加的时候都最好清空一下里面的数据
      this.tmForm.tmName=''
      this.tmForm.logoUrl=''
    },

    // 编辑功能
    editTradeMark(row) {
      // 点击编辑时清空数据
      this.dialogFormVisible = true;
      this.tmForm={...row}
    },

    // 对话框
    // 上传成功后的回调
    // 这个回调返回两个参数
    // res是上传成功后返回的数据，他带有图片的网络路径
    // file是用户上传图片带有的一些属性，如anme，uid，status等
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
      // 收集用户上传的图片的url数据,这是需要带给服务器的真正数据
      this.tmForm.logoUrl=res.data
    },

    // 上传之前的回调
    beforeAvatarUpload(file) {
      // 判断图片是否符合格式
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    // 确定按钮：点击修改或提交
    // 注意：这个可能是添加品牌的按钮，也可能是修改品牌的按钮
    // 通过判断是否传入id来判断是添加还是修改
    async addOrEditTradeMark(){
      // 隐藏dialog
      this.dialogFormVisible=false
      // 发请求（update|edit）
      const result =await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
      // 如果成功
      if(result.code===200){
        // 弹出上传成功的对话框
        this.$message.success(this.tmForm.id?'修改成功':'添加成功')
        // 不论是添加还是修改，都需要重新获取数据
        this.getPageList()
      }
    }
    
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
    border-color: #409EFF;
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
