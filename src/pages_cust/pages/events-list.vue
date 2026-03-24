<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listEventinfo } from '@/api/cust'
import config from '@/config'

const events = ref<any[]>([])

// 首次进入页面时应允许发起列表请求
const loading = ref(true)
const refreshing = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)

// 分页：和首页一致的查询逻辑，只是每页 10 条
const pageSize = 10
const pageNum = ref(1)
const bizStatus = 'PUBLISHED'

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

function canShowOnline(e: any) {
  const t = e?.joinType == null ? '' : String(e.joinType)
  return t.toUpperCase() === 'ONLINE'
}

function getJoinDeadlineState(e: any) {
  const d = e?.joinDeadline
  if (!d) return { label: '报名中', isOpen: true }
  const deadline = Date.parse(String(d)) || 0
  if (!deadline) return { label: '报名中', isOpen: true }
  const isOpen = Date.now() <= deadline
  return { label: isOpen ? '报名中' : '已截止', isOpen }
}

function getLocation(e: any) {
  // 优先展示后端更友好的 location；否则兜底 city
  const loc = (e?.location == null ? '' : String(e.location)).trim()
  if (loc) return loc
  const city = (e?.city == null ? '' : String(e.city)).trim()
  return city || '线下'
}

function getPrice(e: any) {
  const p = e?.eventPrice
  if (p == null || p === '') return '0'
  const n = Number(p)
  return Number.isFinite(n) ? String(n) : String(p)
}

function formatParticipant(e: any) {
  const cur = e?.registeredCount
  const max = e?.maxParticipants
  if (cur == null && max == null) return ''
  const curS = cur == null ? '-' : String(cur)
  const maxS = max == null ? '-' : String(max)
  return `已报名 ${curS}/${maxS}`
}

async function fetchList(append: boolean) {
  if (!append) {
    // 下拉刷新时也允许首屏请求；仅避免 loading 重入
    // 首屏时允许请求；仅当已有数据时才避免重复拉取
    if (loading.value && events.value.length) return
    loading.value = !refreshing.value
  } else {
    // 加载更多禁止与下拉刷新/首屏加载并发
    if (loadingMore.value || loading.value || refreshing.value) return
    loadingMore.value = true
  }

  try {
    const params = { pageNum: pageNum.value, pageSize, bizStatus }
    const res: any = await listEventinfo(params)
    const rows = (res && Array.isArray(res.rows)) ? res.rows : []

    if (append) {
      events.value = [...events.value, ...rows]
    } else {
      events.value = rows
    }

    // rows < pageSize 代表没有下一页
    if (!rows.length || rows.length < pageSize) {
      hasMore.value = false
    } else {
      pageNum.value += 1
    }
  } catch (_) {
    // 请求失败则停止继续加载
    hasMore.value = false
    if (!append) events.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
    refreshing.value = false
  }
}

function resetAndReload() {
  events.value = []
  pageNum.value = 1
  hasMore.value = true
  refreshing.value = true
  loading.value = false
  // 走首屏加载逻辑，但用 refresher 显示状态
  fetchList(false)
}

function loadMore() {
  if (!hasMore.value) return
  if (loadingMore.value || loading.value || refreshing.value) return
  fetchList(true)
}

function goToDetail(e: any) {
  const id = e.id == null ? '' : String(e.id)
  uni.navigateTo({ url: `/pages_cust/pages/event-detail?id=${id}` })
}

function onRefresh() {
  resetAndReload()
}

function onScrollToLower() {
  // 用户向下滚动自动加载下一页
  if (hasMore.value) loadMore()
}

onMounted(() => {
  fetchList(false)
})
</script>

<template>
  <view class="events-list-page">
    <scroll-view
      scroll-y
      class="events-scroll"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
    >
      <view class="events-content">
        <view v-if="loading || (refreshing && !events.length)" class="loading-wrap">
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
            <view class="event-overlay" />

            <view class="event-top-badges">
              <text class="badge badge-primary">{{ getJoinDeadlineState(e).label }}</text>
              <text class="badge badge-secondary">
                {{ canShowOnline(e) ? '线上' : getLocation(e) }}
              </text>
            </view>

            <view class="event-info">
              <text class="event-title">{{ e.title }}</text>
              <view class="event-meta">
                <view class="meta-item">
                  <up-icon name="calendar" size="12" color="#6366f1" />
                  <text class="meta-text">{{ formatEventDate(e.startTime) }}</text>
                </view>
                <view v-if="e.eventPrice != null" class="meta-item">
                  <text class="meta-text">￥{{ getPrice(e) }}</text>
                </view>
              </view>

              <text v-if="formatParticipant(e)" class="event-desc">{{ formatParticipant(e) }}</text>
            </view>
          </view>

          <view v-if="!events.length" class="empty">暂无活动</view>

          <view v-if="hasMore" class="load-more-wrap">
            <button class="load-more-btn" :disabled="loadingMore" @click="loadMore">
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
            <text class="load-more-hint">继续向下滚动自动加载下一页</text>
          </view>

          <view v-else class="no-more">没有更多了</view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.events-list-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 24rpx;
}

.events-scroll {
  height: calc(100vh - 24rpx);
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
  position: relative;

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
    position: relative;
    z-index: 2;

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

    .event-meta {
      display: flex;
      gap: 18rpx;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 10rpx;
      margin-bottom: 8rpx;

      .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 8rpx;
      }

      .meta-text {
        font-size: 24rpx;
        font-weight: 600;
        color: #475569;
      }
    }
  }
}

.empty {
  text-align: center;
  padding: 80rpx;
  font-size: 28rpx;
  color: #94a3b8;
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.0) 60%);
  z-index: 1;
  pointer-events: none;
}

.event-top-badges {
  position: absolute;
  top: 28rpx;
  left: 32rpx;
  z-index: 2;
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;

  .badge {
    padding: 12rpx 22rpx;
    border-radius: 999rpx;
    font-size: 20rpx;
    font-weight: 800;
  }

  .badge-primary {
    background: rgba(99, 102, 241, 0.95);
    color: #fff;
  }

  .badge-secondary {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8rpx);
  }
}

.load-more-wrap {
  margin-top: 16rpx;
  padding: 24rpx 0 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
}

.load-more-btn {
  background: #eef2ff;
  color: #3730a3;
  border: 2rpx solid #c7d2fe;
  padding: 18rpx 44rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 900;
}

.load-more-hint {
  font-size: 22rpx;
  color: #94a3b8;
}

.no-more {
  margin-top: 16rpx;
  padding: 24rpx 0 64rpx;
  text-align: center;
  color: #94a3b8;
  font-size: 26rpx;
}
</style>
