<template>
  <div class="app-container">
    <el-card style="margin: 20px 0">
      <!-- 不要直接使用这个，而是使用之前的 -->
      <!-- <CategorySelect></CategorySelect> -->
      <CategorySelect
        :isShowTable="scene==0"
        @getCategoryId="getCategoryId"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 根据几部分变换来控制是展示还是隐藏（3种变换，三个div） -->
      <!-- 展示spuList -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          @click="updateSpuList"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                title="添加"
                icon="el-icon-plus"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                title="编辑"
                icon="el-icon-edit"
                @click="editSpuList(row)"
              ></el-button>
              <el-button
                type="info"
                title="查看"
                icon="el-icon-info"
              ></el-button>
              <el-button
                type="danger"
                title="删除"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          align="center"
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="total, prev, pager, next, jumper, ->, sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 修改或添加spuList -->
      <spuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></spuForm>
      <skuForm v-show="scene == 2" ref="sku"></skuForm>
    </el-card>
  </div>
</template>

<script>
// 引入子组件
import spuForm from "@/views/product/Spu/components/spuForm";
import skuForm from "@/views/product/Spu/components/skuForm";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",


      // 分页器相关,默认展示第一页，默认展示数据最大值为3
      page: 1,
      limit: 3,
      spuList: [],
      total: "",

      // 是展示spuList还是修改编辑spuList
      scene: 0, // 0是展示spu列表数据  1是新增或编辑spu 2是新增sku
    };
  },

  methods: {
    // 传给三级联动的自定义事件,可以把子组件相应的id传给父组件
    getCategoryId(id) {
      // id.level是代表是第几级传来的id
      // id.categoryId是传入的id值
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
        // 当获得到三级分类id的时候，就说明可以发起请求获取展示spuList的数据了
        this.getSpuList();
      }
    },

    // 获取spu列表的方法
    async getSpuList() {
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 分页器回调
    handleSizeChange(limit) {
      // 保存当前的limit
      this.limit = limit;
      // 重新发起数据请求
      this.getSpuList();
    },
    handleCurrentChange(page) {
      // 保存当前的limit
      this.page = page;
      // 重新发起数据请求
      this.getSpuList();
    },

    // 新增spuList的数据
    updateSpuList() {
      // 需要先通知子组件先清空数据
      this.scene = 1;
    },
    // 修改spuList的数据
    editSpuList(row) {
      this.scene = 1;
      // 获取到spu组件来发起请求
      // 使用直接获取到子组件对象来发请求，可以往子组件身上传参数
      this.$refs.spu.initSpuFormDate(row)
    },

    changeScene(num){
      this.scene=num,
      // 传入现在的page，请求数据就不会换行
      this.getSpuList(this.page)
    },

    // 点击添加SKU按钮的回调
    addSku(row){
      // 点击切换场景为2
      this.scene=2
      // console.log(row);
      // 获取子组件，让子组件发送请求
      this.$refs.sku.getData(this.category1Id,this.category2Id,row);
    }
    
  },

  components: {
    spuForm,
    skuForm,
  },
};
</script>

<style>
</style>