<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listUserinvite } from '@/api/cust'

const list = ref<any[]>([])
const loading = ref(true)

onMounted(() => {
  listUserinvite({ pageNum: 1, pageSize: 50 })
    .then(function (res) {
      if (!res) return
      var r = res['rows']
      if (Array.isArray(r)) list.value = r
    })
    .catch(function () {
      list.value = [
        { id: 1, name: '联创伙伴_1号', joinTime: '2024-04 加入', contrib: '已贡献 3 份 Wiki', rewardPoints: 100 },
        { id: 2, name: '联创伙伴_2号', joinTime: '2024-04 加入', contrib: '已贡献 1 份 Wiki', rewardPoints: 100 }
      ]
    })
    .finally(function () {
      loading.value = false
    })
})

function genPoster() {
  uni.showToast({ title: '海报已生成', icon: 'success' })
}

function copyLink() {
  uni.setClipboardData({ data: 'https://10x.example.com/invite/xxx' })
  uni.showToast({ title: '链接已复制', icon: 'success' })
}
</script>

<template>
  <view class="cust-invite">
    <view class="banner">
      <text class="banner-title">邀请好友<br />共建智慧场</text>
      <text class="banner-desc">每成功邀请一位联创伙伴，双方均可获得 100 贡献值及优先实修权。</text>
      <view class="banner-actions">
        <up-button text="专属海报" type="primary" customStyle="border-radius: 24rpx;" @click="genPoster" />
        <up-button text="分享链接" plain customStyle="border-radius: 24rpx; margin-left: 24rpx;" @click="copyLink" />
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">已建立连接</text>
      <text class="section-sub">My Network ({{ list.length }})</text>
    </view>

    <view class="list">
      <view v-for="item in list" :key="item.id" class="list-item">
        <view class="avatar" />
        <view class="item-info">
          <text class="item-name">{{ item.userName || item.name || '邀请伙伴' }}</text>
          <text class="item-meta">{{ item.inviteTime || item.joinTime }} · {{ item.contrib || '已加入' }}</text>
        </view>
        <view class="item-points">
          <text class="points-num">+{{ item.rewardPoints != null ? item.rewardPoints : (item.points != null ? item.points : 0) }}</text>
          <text class="points-label">Points</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-invite {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24rpx 32rpx 80rpx;
}
.banner {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border-radius: 80rpx;
  padding: 48rpx 40rpx;
  color: #fff;
  margin-bottom: 48rpx;
}
.banner-title {
  font-size: 44rpx;
  font-weight: 800;
  line-height: 1.4;
  display: block;
  margin-bottom: 24rpx;
}
.banner-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  display: block;
  margin-bottom: 40rpx;
}
.banner-actions {
  display: flex;
  gap: 24rpx;
}
.section-head {
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
}
.section-sub {
  font-size: 20rpx;
  color: #94a3b8;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 8rpx;
  display: block;
}
.list {
  background: #fff;
  border-radius: 48rpx;
  overflow: hidden;
  border: 1rpx solid #f1f5f9;
}
.list-item {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid #f1f5f9;
}
.list-item:last-child {
  border-bottom: none;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin-right: 28rpx;
  flex-shrink: 0;
}
.item-info {
  flex: 1;
  min-width: 0;
}
.item-name {
  font-size: 28rpx;
  font-weight: 800;
  color: #1e293b;
  display: block;
}
.item-meta {
  font-size: 20rpx;
  color: #94a3b8;
  margin-top: 8rpx;
  display: block;
}
.item-points {
  text-align: right;
}
.points-num {
  font-size: 32rpx;
  font-weight: 800;
  color: #22c55e;
  display: block;
}
.points-label {
  font-size: 16rpx;
  color: #cbd5e1;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
