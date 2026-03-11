<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listUserpointlogs } from '@/api/cust'

const balance = ref(1280)
const list = ref<any[]>([])

onMounted(() => {
  listUserpointlogs({ pageNum: 1, pageSize: 50 }).then((res: any) => {
    if (res && res.rows) list.value = res.rows
  }).catch(() => {
    list.value = [
      { id: 1, actionType: '发布优质实修心得', points: 10, createTime: '今天 10:20', type: 'earn' },
      { id: 2, actionType: '受邀好友完成注册', points: 50, createTime: '昨天', type: 'earn' },
      { id: 3, actionType: '兑换线下课优惠券', points: -200, createTime: '3天前', type: 'spend' }
    ]
  })
})

function pointStr(item: any) {
  const p = item.points != null ? item.points : (item.type === 'spend' ? -Math.abs(item.points || 0) : Math.abs(item.points || 0))
  return p >= 0 ? `+${p}` : `${p}`
}

function isEarn(item: any) {
  return (item.points != null && item.points > 0) || item.type === 'earn'
}
</script>

<template>
  <view class="cust-point-log">
    <view class="header">
      <text class="label">My Contribution</text>
      <text class="balance">{{ balance }} <text class="unit">Points</text></text>
    </view>

    <view class="card">
      <view class="card-head">
        <text class="card-title">积分明细</text>
        <up-icon name="list" size="16" color="#94a3b8" />
      </view>
      <view v-for="item in list" :key="item.id" class="log-item">
        <view class="log-info">
          <text class="log-title">{{ item.actionType || item.title }}</text>
          <text class="log-time">{{ item.createTime || item.create_time }}</text>
        </view>
        <text class="log-point" :class="{ earn: isEarn(item) }">{{ pointStr(item) }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-point-log {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 80rpx;
}
.header {
  background: #0f172a;
  color: #fff;
  padding: 24rpx 32rpx 80rpx;
  border-radius: 0 0 80rpx 80rpx;
}
.label {
  font-size: 24rpx;
  font-weight: 800;
  color: #818cf8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 16rpx;
}
.balance {
  font-size: 64rpx;
  font-weight: 800;
}
.unit {
  font-size: 28rpx;
  font-weight: 700;
  opacity: 0.6;
  margin-left: 16rpx;
  text-transform: uppercase;
}
.card {
  background: #fff;
  border-radius: 48rpx;
  margin: -48rpx 32rpx 0;
  padding: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #f1f5f9;
  position: relative;
  z-index: 1;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f1f5f9;
  margin-bottom: 24rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #1e293b;
}
.log-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f1f5f9;
}
.log-item:last-child {
  border-bottom: none;
}
.log-info {
  flex: 1;
  min-width: 0;
}
.log-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  display: block;
}
.log-time {
  font-size: 20rpx;
  color: #94a3b8;
  font-weight: 700;
  margin-top: 8rpx;
  display: block;
}
.log-point {
  font-size: 34rpx;
  font-weight: 800;
  color: #1e293b;
}
.log-point.earn {
  color: #22c55e;
}
</style>
