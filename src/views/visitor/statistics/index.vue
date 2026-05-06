<template>
  <div class="visitor-statistics-container">
    <!-- 顶部关键指标卡片 -->
    <el-row :gutter="20" class="stat-cards-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-content">
            <div class="stat-icon today-icon">
              <i class="el-icon-timer"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statisticsData.today || 0 }}</div>
              <div class="stat-label">今日访客</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-content">
            <div class="stat-icon yesterday-icon">
              <i class="el-icon-date"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statisticsData.yesterday || 0 }}</div>
              <div class="stat-label">昨日访客</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-content">
            <div class="stat-icon week-icon">
              <i class="el-icon-refresh"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statisticsData.thisWeek || 0 }}</div>
              <div class="stat-label">本周访客</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-card-content">
            <div class="stat-icon month-icon">
              <i class="el-icon-date"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statisticsData.thisMonth || 0 }}</div>
              <div class="stat-label">本月访客</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对比数据区域 -->
    <el-row :gutter="20">
      <!-- 昨日 vs 今日对比 -->
      <el-col :xs="24" :md="12">
        <el-card class="compare-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>📊 近两日对比</span>
          </div>
          <div class="compare-content">
            <div class="compare-item">
              <div class="compare-label">今日访客</div>
              <div
                class="compare-value"
                :class="getCompareClass('today', 'yesterday')"
              >
                {{ statisticsData.today || 0 }}
                <span
                  v-if="getTrend('today', 'yesterday') !== 0"
                  class="compare-trend"
                >
                  <i :class="getTrendIcon('today', 'yesterday')"></i>
                  {{ Math.abs(getTrend("today", "yesterday")) }}%
                </span>
              </div>
            </div>
            <div class="compare-divider">
              <i class="el-icon-right"></i>
            </div>
            <div class="compare-item">
              <div class="compare-label">昨日访客</div>
              <div class="compare-value">
                {{ statisticsData.yesterday || 0 }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 本周 vs 上周对比 -->
      <el-col :xs="24" :md="12">
        <el-card class="compare-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>📈 周环比对比</span>
          </div>
          <div class="compare-content">
            <div class="compare-item">
              <div class="compare-label">本周访客</div>
              <div
                class="compare-value"
                :class="getCompareClass('thisWeek', 'lastWeek')"
              >
                {{ statisticsData.thisWeek || 0 }}
                <span
                  v-if="getTrend('thisWeek', 'lastWeek') !== 0"
                  class="compare-trend"
                >
                  <i :class="getTrendIcon('thisWeek', 'lastWeek')"></i>
                  {{ Math.abs(getTrend("thisWeek", "lastWeek")) }}%
                </span>
              </div>
            </div>
            <div class="compare-divider">
              <i class="el-icon-right"></i>
            </div>
            <div class="compare-item">
              <div class="compare-label">上周访客</div>
              <div class="compare-value">
                {{ statisticsData.lastWeek || 0 }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 访客地址分布 -->
    <el-row :gutter="20">
      <!-- 今日访客地址 -->
      <el-col :xs="24" :lg="12">
        <el-card class="address-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>📍 今日访客地址分布</span>
            <el-tag size="small" type="info"
              >共
              {{ (statisticsData.todayAddress || []).length }} 个地区</el-tag
            >
          </div>
          <div
            v-if="(statisticsData.todayAddress || []).length > 0"
            class="address-content"
          >
            <el-tag
              v-for="(address, index) in statisticsData.todayAddress"
              :key="index"
              class="address-tag"
              type="success"
              effect="plain"
            >
              {{ address }}
            </el-tag>
          </div>
          <div v-else class="empty-data">
            <i class="el-icon-location-outline"></i>
            <p>暂无今日访客数据</p>
          </div>
        </el-card>
      </el-col>

      <!-- 昨日访客地址 -->
      <el-col :xs="24" :lg="12">
        <el-card class="address-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>📍 昨日访客地址分布</span>
            <el-tag size="small" type="info"
              >共
              {{ (statisticsData.yesterdayAddress || []).length }}
              个地区</el-tag
            >
          </div>
          <div
            v-if="(statisticsData.yesterdayAddress || []).length > 0"
            class="address-content"
          >
            <el-tag
              v-for="(address, index) in statisticsData.yesterdayAddress"
              :key="index"
              class="address-tag"
              type="warning"
              effect="plain"
            >
              {{ address }}
            </el-tag>
          </div>
          <div v-else class="empty-data">
            <i class="el-icon-location-outline"></i>
            <p>暂无昨日访客数据</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 月度数据对比 -->
    <el-card class="month-compare-card" shadow="hover">
      <div slot="header" class="card-header">
        <span>📅 月度数据对比</span>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <div class="month-item">
            <div class="month-label">本月访客</div>
            <div class="month-value">{{ statisticsData.thisMonth || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="month-item">
            <div class="month-label">上月访客</div>
            <div class="month-value">{{ statisticsData.lastMonth || 0 }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="8">
          <div class="month-item">
            <div class="month-label">前月访客</div>
            <div class="month-value">{{ statisticsData.beforeMonth || 0 }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { visitorsStatistics } from "@/api/visitors";

export default {
  name: "VisitorStatistics",
  data() {
    return {
      statisticsData: {
        today: 0,
        todayAddress: [],
        yesterday: 0,
        yesterdayAddress: [],
        beforeYesterday: 0,
        beforeYesterdayAddress: [],
        thisWeek: 0,
        lastWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
        beforeMonth: 0,
      },
      loading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await visitorsStatistics();
        console.log("统计数据:", res);

        if (res && res.code === 0) {
          this.statisticsData = res.data;
        } else {
          this.$message.error(res.msg || "获取统计数据失败");
        }
      } catch (error) {
        console.error("获取访客统计失败:", error);
        this.$message.error("网络错误，请稍后重试");
      } finally {
        this.loading = false;
      }
    },

    // 计算增长率
    getTrend(currentKey, lastKey) {
      const current = this.statisticsData[currentKey] || 0;
      const last = this.statisticsData[lastKey] || 0;
      if (last === 0) {
        return current > 0 ? 100 : 0;
      }
      return Math.round(((current - last) / last) * 100);
    },

    // 获取趋势图标
    getTrendIcon(currentKey, lastKey) {
      const trend = this.getTrend(currentKey, lastKey);
      if (trend > 0) return "el-icon-caret-top";
      if (trend < 0) return "el-icon-caret-bottom";
      return "";
    },

    // 获取对比样式类
    getCompareClass(currentKey, lastKey) {
      const trend = this.getTrend(currentKey, lastKey);
      if (trend > 0) return "trend-up";
      if (trend < 0) return "trend-down";
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.visitor-statistics-container {
  padding: 20px;

  // 统计卡片样式
  .stat-cards-row {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-card-content {
      display: flex;
      align-items: center;
      padding: 10px 0;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;

        i {
          font-size: 28px;
          color: #fff;
        }

        &.today-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.yesterday-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.week-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.month-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 5px;
        }
      }
    }
  }

  // 卡片通用样式
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
  }

  // 对比卡片样式
  .compare-card {
    margin-bottom: 20px;

    .compare-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20px;

      .compare-item {
        text-align: center;
        flex: 1;

        .compare-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 10px;
        }

        .compare-value {
          font-size: 32px;
          font-weight: bold;
          color: #303133;

          &.trend-up {
            color: #67c23a;
          }
          &.trend-down {
            color: #f56c6c;
          }

          .compare-trend {
            font-size: 14px;
            margin-left: 8px;
          }
        }
      }

      .compare-divider {
        color: #dcdfe6;
        font-size: 24px;
        padding: 0 20px;
      }
    }
  }

  // 地址卡片样式
  .address-card {
    margin-bottom: 20px;

    .address-content {
      padding: 15px;
      min-height: 100px;

      .address-tag {
        margin: 0 10px 10px 0;
      }
    }

    .empty-data {
      text-align: center;
      padding: 20px;
      color: #909399;

      i {
        font-size: 48px;
        margin-bottom: 10px;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }
  }

  // 月度对比卡片样式
  .month-compare-card {
    .month-item {
      text-align: center;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;

      .month-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .month-value {
        font-size: 36px;
        font-weight: bold;
        color: #409eff;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .visitor-statistics-container {
    padding: 10px;

    .stat-card .stat-card-content .stat-value {
      font-size: 20px;
    }

    .compare-card .compare-content .compare-item .compare-value {
      font-size: 24px;
    }
  }
}
</style>
