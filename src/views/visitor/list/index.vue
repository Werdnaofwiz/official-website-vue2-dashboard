<template>
  <div class="visitor-list-container">
    <!-- 卡片容器 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">访客列表</span>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="createName" label="访客名称" width="120" />
        <el-table-column prop="ip" label="IP地址" width="160" />
        <el-table-column prop="address" label="所在地" width="150" />
        <el-table-column prop="createTime" label="访问时间" width="180" />
        <el-table-column
          prop="userAgent"
          label="浏览器信息"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.userAgent || "-" }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="pageParams.pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { visitorsPage } from "@/api/visitors";

export default {
  name: "VisitorList",
  data() {
    return {
      // 表格数据
      tableData: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 分页参数
      pageParams: {
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    // 获取列表数据
    async fetchList() {
      this.loading = true;
      try {
        const res = await visitorsPage(this.pageParams);
        console.log("接口返回数据:", res);

        // 根据你的数据结构解析
        if (res && res.code === 0) {
          this.tableData = res.data.records || [];
          this.total = res.data.total || 0;
        } else {
          this.$message.error(res.msg || "获取数据失败");
        }
      } catch (error) {
        console.error("获取访客列表失败:", error);
        this.$message.error("网络错误，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.pageParams.pageNum = 1; // 重置为第一页
      this.fetchList();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.fetchList();
    },
  },
};
</script>

<style lang="scss" scoped>
.visitor-list-container {
  padding: 20px;

  .box-card {
    .card-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 36px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
