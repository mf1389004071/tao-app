<script setup lang="ts">
import { ref, onMounted } from 'vue'

declare const uni: any
import { listNotices } from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'

const list = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 15

function formatTime(v: any) {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}:{s}')
}

function toDetail(item: any) {
  const id = item?.id == null ? '' : String(item.id)
  if (!id) return
  uni.navigateTo({ url: `/pages_cust/pages/notice-detail?id=${id}` })
}

async function loadMore() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res: any = await listNotices({ pageNum: pageNum.value, pageSize })
    const rows = Array.isArray(res?.rows) ? res.rows : []
    if (pageNum.value === 1) list.value = []
    list.value = [...list.value, ...rows]
    if (rows.length < pageSize) finished.value = true
    else pageNum.value += 1
  } catch (_) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  pageNum.value = 1
  finished.value = false
  loadMore()
})
</script>

<template>
  <view class="notice-list-page">
    <view class="tip">按发布时间倒序，最新在前</view>
    <scroll-view scroll-y class="scroll" lower-threshold="100" @scrolltolower="loadMore">
      <view
        v-for="item in list"
        :key="String(item.id)"
        class="row"
        @click="toDetail(item)"
      >
        <view class="row-main">
          <text v-if="item.isUrgent" class="urgent">急</text>
          <text class="row-title">{{ item.title || '通知' }}</text>
          <text class="row-time">{{ formatTime(item.publishTime || item.createTime) }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view v-if="!loading && !list.length" class="empty">暂无通知公告</view>
      <view v-if="loading" class="hint">加载中…</view>
      <view v-else-if="!finished && list.length" class="hint">上拉加载更多</view>
      <view v-else-if="finished && list.length" class="hint">已加载全部</view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.notice-list-page {
  min-height: 100vh;
  background: #f8fafc;
}
.tip {
  font-size: 22rpx;
  color: #94a3b8;
  padding: 20rpx 28rpx 8rpx;
  font-weight: 600;
}
.scroll {
  height: calc(100vh - 80rpx);
  padding: 0 24rpx 48rpx;
  box-sizing: border-box;
}
.row {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #f1f5f9;
}
.row-main {
  flex: 1;
  min-width: 0;
}
.urgent {
  display: inline-block;
  font-size: 18rpx;
  font-weight: 900;
  color: #fff;
  background: #ea580c;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  margin-right: 10rpx;
  vertical-align: middle;
}
.row-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
}
.row-time {
  display: block;
  font-size: 22rpx;
  color: #94a3b8;
  margin-top: 12rpx;
  font-weight: 600;
}
.arrow {
  font-size: 40rpx;
  color: #cbd5e1;
  margin-left: 12rpx;
  font-weight: 300;
}
.empty,
.hint {
  text-align: center;
  color: #94a3b8;
  font-size: 24rpx;
  padding: 48rpx 0;
  font-weight: 600;
}
</style>
