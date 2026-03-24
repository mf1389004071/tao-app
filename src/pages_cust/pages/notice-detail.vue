<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNotice } from '@/api/cust'

const id = ref('')
const detail = ref<any>({ title: '紧急通告', content: '五一期间「把自己产品化」线下站席位变动详情...', publishTime: '刚刚' })
const loading = ref(true)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
    getNotice(id.value).then((res: any) => {
      if (res && res.data) detail.value = res.data
    }).catch(() => {}).finally(() => { loading.value = false })
  } else {
    loading.value = false
  }
})
</script>

<template>
  <view class="cust-notice-detail">
    <view class="body">
      <text class="title">{{ detail.title }}</text>
      <text class="meta">发布于 {{ detail.publishTime || detail.createTime }} · 十倍好成长运营中心</text>
      <view class="content">
        <text class="content-text">{{ detail.content }}</text>
        <text class="content-text">我们始终致力于为每一位伙伴提供最高质量的实修场域。本次席位调整旨在优化线下互动体验，确保每位参与者都能获得深度的 1 对 1 导师连接。</text>
        <view class="highlight">
          <text class="highlight-title">关键节点调整：</text>
          <text class="highlight-item">· 深圳站：增加 5 个特邀共创席位</text>
          <text class="highlight-item">· 线上直播：全程同步开启 AI 实验室</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-notice-detail {
  min-height: 100vh;
  background: #fff;
  padding: 24rpx 32rpx 80rpx;
}
.body {
  padding-top: 24rpx;
}
.title {
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.3;
}
.meta {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 700;
  display: block;
  margin-bottom: 48rpx;
}
.content {
  font-size: 30rpx;
  color: #475569;
  line-height: 1.8;
}
.content-text {
  display: block;
  margin-bottom: 24rpx;
}
.highlight {
  margin-top: 48rpx;
  padding: 40rpx;
  background: #f8fafc;
  border-radius: 48rpx;
  border: 1rpx solid #e2e8f0;
}
.highlight-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
  margin-bottom: 24rpx;
}
.highlight-item {
  display: block;
  font-size: 28rpx;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 12rpx;
}
</style>
