<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getKnowledgecontent } from '@/api/cust'

const id = ref('')
const detail = ref<any>({ title: '蛋壳理论', tags: '自我认知,方法论', content: '从内打破是生命，从外打破是食物。探讨个体成长的内生动力。' })

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
    getKnowledgecontent(id.value).then((res: any) => {
      if (res && res.data) detail.value = res.data
    }).catch(() => {})
  }
})

function toToolDetail() {
  uni.navigateTo({ url: '/pages_cust/pages/tool-detail?id=1' })
}

function toPublish() {
  uni.navigateTo({ url: '/pages/cust/publish' })
}
</script>

<template>
  <view class="cust-topic-detail">
    <view class="hero">
      <view class="hero-content">
        <text class="topic-title">{{ detail.title }}</text>
        <view class="topic-tags">
          <text v-for="t in (detail.tags || '').split(',').filter(Boolean)" :key="t" class="tag">#{{ t }}</text>
        </view>
      </view>
    </view>

    <view class="body">
      <view class="wiki-card">
        <text class="wiki-label">Official Wiki</text>
        <text class="wiki-desc">{{ detail.content || detail.promotionalText || '暂无官方解读' }}</text>
        <view class="doc-link" @click="uni.showToast({ title: '正在拉取 PDF', icon: 'none' })">
          <view class="doc-icon">
            <up-icon name="file-text" size="20" color="#4f46e5" />
          </view>
          <text class="doc-title">实操手册 V3.2</text>
          <up-icon name="arrow-right" size="16" color="#a5b4fc" />
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">关联工具库</text>
        </view>
        <view class="tool-item" @click="toToolDetail">
          <view class="tool-icon">
            <up-icon name="bulb" size="28" color="#f97316" />
          </view>
          <view class="tool-info">
            <text class="tool-name">七圣境扫描</text>
            <text class="tool-desc">用于自检当前能量场状态</text>
          </view>
          <up-icon name="arrow-right" size="18" color="#e2e8f0" />
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">共创实修案例</text>
          <text class="section-action" @click="toPublish">我要投稿</text>
        </view>
        <view class="case-card">
          <view class="case-header">
            <view class="case-avatar" />
            <view>
              <text class="case-user">学员_021</text>
              <text class="case-time">2小时前 · 广东深圳</text>
            </view>
          </view>
          <text class="case-content">「应用了{{ detail.title }}后，我学会了诚实地面对内心的恐惧。内生动力的释放需要先打破陈旧的认知壁垒...」</text>
          <view class="case-actions">
            <text class="action-item">❤ 24</text>
            <text class="action-item">💬 8</text>
            <text class="action-item">👁 1.2k</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-topic-detail {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 80rpx;
}
.hero {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  padding: 24rpx 32rpx 80rpx;
  border-radius: 0 0 80rpx 80rpx;
  color: #fff;
}
.hero-content {
  text-align: center;
  padding-top: 24rpx;
}
.topic-title {
  font-size: 52rpx;
  font-weight: 800;
  display: block;
  margin-bottom: 24rpx;
}
.topic-tags {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
}
.tag {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 800;
}
.body {
  padding: 0 32rpx;
  margin-top: -48rpx;
  position: relative;
  z-index: 1;
}
.wiki-card {
  background: #fff;
  border-radius: 48rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #f1f5f9;
}
.wiki-label {
  font-size: 24rpx;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 24rpx;
}
.wiki-desc {
  font-size: 30rpx;
  color: #475569;
  line-height: 1.7;
  display: block;
  margin-bottom: 32rpx;
}
.doc-link {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #eef2ff;
  border-radius: 32rpx;
}
.doc-icon {
  width: 72rpx;
  height: 72rpx;
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}
.doc-title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 800;
  color: #312e81;
}
.section {
  margin-bottom: 40rpx;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #0f172a;
}
.section-action {
  font-size: 26rpx;
  font-weight: 700;
  color: #4f46e5;
}
.tool-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-radius: 48rpx;
  border: 1rpx solid #f1f5f9;
}
.tool-icon {
  width: 96rpx;
  height: 96rpx;
  background: #fff7ed;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}
.tool-info {
  flex: 1;
}
.tool-name {
  font-size: 32rpx;
  font-weight: 800;
  color: #1e293b;
  display: block;
}
.tool-desc {
  font-size: 24rpx;
  color: #94a3b8;
  margin-top: 8rpx;
  display: block;
}
.case-card {
  background: #fff;
  border-radius: 48rpx;
  padding: 40rpx;
  border: 1rpx solid #f1f5f9;
}
.case-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.case-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin-right: 24rpx;
}
.case-user {
  font-size: 28rpx;
  font-weight: 800;
  color: #1e293b;
  display: block;
}
.case-time {
  font-size: 20rpx;
  color: #94a3b8;
  margin-top: 4rpx;
  display: block;
}
.case-content {
  font-size: 28rpx;
  color: #475569;
  line-height: 1.6;
  display: block;
  margin-bottom: 24rpx;
}
.case-actions {
  display: flex;
  gap: 32rpx;
  color: #cbd5e1;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
