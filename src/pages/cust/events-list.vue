<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listEventinfo } from '@/api/cust'
import config from '@/config'

const events = ref<any[]>([])
const loading = ref(true)

function addBaseUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return config.baseUrl + url
}

/** 活动开始时间展示：后端为 ISO 或日期字符串，取日期部分 */
function formatEventDate(val: string | undefined): string {
  if (!val) return ''
  const s = String(val)
  return s.length >= 10 ? s.slice(0, 10) : s
}

onMounted(() => {
  listEventinfo({ pageNum: 1, pageSize: 50, bizStatus: 'OPEN' })
    .then((res: any) => {
      if (res && res.rows) events.value = res.rows
    })
    .catch(() => {
      events.value = []
    })
    .finally(() => { loading.value = false })
})

function goBack() {
  uni.navigateBack()
}

function goToDetail(e: any) {
  const id = e.id == null ? '' : String(e.id)
  uni.navigateTo({ url: `/pages/cust/event-detail?id=${id}` })
}
</script>

<template>
  <view class="events-list-page">
    <view class="events-content">
      <view v-if="loading" class="loading-wrap">
        <up-loading-icon mode="circle" size="40" />
        <text class="loading-text">加载中...</text>
      </view>
      <template v-else>
        <view
          v-for="e in events"
          :key="e.id"
          class="event-card"
          @click="goToDetail(e)"
        >
          <image
            v-if="e.coverImageUrl"
            :src="addBaseUrl(e.coverImageUrl)"
            mode="aspectFill"
            class="event-image"
          />
          <view v-else class="event-image event-image-placeholder" />
          <view class="event-info">
            <text class="event-title">{{ e.title }}</text>
            <text class="event-time">{{ formatEventDate(e.startTime) }}</text>
            <text v-if="e.city" class="event-desc">{{ e.city }}</text>
          </view>
        </view>
        <view v-if="!events.length" class="empty">暂无活动</view>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.events-list-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 24rpx;
}

.events-content {
  padding: 48rpx;
}

.loading-wrap {
  padding: 80rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #94a3b8;
}

.event-card {
  background: #fff;
  border-radius: 48rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  border: 2rpx solid #f1f5f9;

  .event-image {
    width: 100%;
    height: 400rpx;
    background: #e2e8f0;
  }

  .event-image-placeholder {
    background: linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%);
  }

  .event-info {
    padding: 32rpx;

    .event-title {
      display: block;
      font-size: 36rpx;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 12rpx;
    }

    .event-time {
      display: block;
      font-size: 24rpx;
      color: #6366f1;
      margin-bottom: 8rpx;
    }

    .event-desc {
      display: block;
      font-size: 26rpx;
      color: #64748b;
      line-height: 1.6;
    }
  }
}

.empty {
  text-align: center;
  padding: 80rpx;
  font-size: 28rpx;
  color: #94a3b8;
}
</style>
