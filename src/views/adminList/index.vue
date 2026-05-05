<template>
  <div class="admin-list">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="账号">
        <el-input
          v-model="searchForm.account"
          placeholder="请输入账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="account" label="账号" width="150" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="address" label="地址" width="150" />
      <el-table-column prop="loginIp" label="登录IP" width="150" />
      <el-table-column prop="lastLoginTime" label="最后登录时间" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="createName" label="创建人" width="120" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      :page-sizes="[5, 10, 20, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getPage } from "@/api/user";

export default {
  name: "AdminList",
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      searchForm: {
        account: "",
        name: "",
      },
    };
  },
  mounted() {
    this.getAdminList();
  },
  methods: {
    async getAdminList() {
      this.loading = true;
      try {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.searchForm,
        };
        // 过滤空值
        Object.keys(params).forEach((key) => {
          if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        const res = await getPage(params);
        this.tableData = res.data.records || [];
        this.total = res.data.total || 0;
      } catch (error) {
        console.error("获取管理员列表失败:", error);
        this.$message.error("获取列表失败");
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.pageNum = 1;
      this.getAdminList();
    },

    resetSearch() {
      this.searchForm = {
        account: "",
        name: "",
      };
      this.pageNum = 1;
      this.getAdminList();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getAdminList();
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAdminList();
    },
  },
};
</script>

<style scoped>
.admin-list {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
