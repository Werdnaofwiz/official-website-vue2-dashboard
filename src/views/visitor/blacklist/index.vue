<template>
  <div class="visitor-blacklist-container">
    <!-- 搜索栏 -->
    <!-- <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchParams" class="search-form">
        <el-form-item label="访客名称">
          <el-input
            v-model="searchParams.createName"
            placeholder="请输入访客名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input
            v-model="searchParams.ip"
            placeholder="请输入IP地址"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="所在地">
          <el-input
            v-model="searchParams.address"
            placeholder="请输入所在地"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh-right" @click="resetSearch"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card> -->

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <div slot="header" class="card-header">
        <span>黑名单列表</span>
        <el-tag size="small" type="danger">共 {{ total }} 条记录</el-tag>
      </div>

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
        <el-table-column prop="createTime" label="加入黑名单时间" width="180" />
        <el-table-column prop="reason" label="拉黑原因" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.reason || "恶意访问" }}
          </template>
        </el-table-column>
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
import { blacklistPage } from "@/api/visitors";

export default {
  name: "VisitorBlacklist",
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
      // 搜索参数
      searchParams: {
        createName: "",
        ip: "",
        address: "",
      },
    };
  },
  mounted() {
    this.fetchBlacklist();
  },
  methods: {
    // 获取黑名单列表
    async fetchBlacklist() {
      this.loading = true;
      try {
        const params = {
          ...this.pageParams,
          ...this.searchParams,
        };
        // 过滤空参数
        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === null) {
            delete params[key];
          }
        });

        const res = await blacklistPage(params);
        console.log("访客黑名单数据:", res);

        if (res && res.code === 0) {
          this.tableData = res.data.records || [];
          this.total = res.data.total || 0;
        } else {
          this.$message.error(res.msg || "获取数据失败");
        }
      } catch (error) {
        console.error("获取黑名单失败:", error);
        this.$message.error("网络错误，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    // 搜索
    handleSearch() {
      this.pageParams.pageNum = 1;
      this.fetchBlacklist();
    },

    // 重置搜索
    resetSearch() {
      this.searchParams = {
        createName: "",
        ip: "",
        address: "",
      };
      this.pageParams.pageNum = 1;
      this.fetchBlacklist();
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.pageParams.pageNum = 1;
      this.fetchBlacklist();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.fetchBlacklist();
    },
  },
};
</script>

<style lang="scss" scoped>
.visitor-blacklist-container {
  padding: 20px;

  .search-card,
  .table-card {
    margin-bottom: 20px;

    ::v-deep .el-card__body {
      padding: 20px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
  }

  .search-form {
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}

@media (max-width: 768px) {
  .visitor-blacklist-container {
    padding: 10px;
  }
}
</style>
