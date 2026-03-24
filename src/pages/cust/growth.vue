<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { listKnowledgecontent } from '@/api/cust'

const topicList = ref<any[]>([])
const loading = ref(false)

function loadTopics() {
  loading.value = true
  listKnowledgecontent({ pageNum: 1, pageSize: 20, contentType: 'WIKI', bizStatus: 'PUBLISHED' }).then((res: any) => {
    if (res && res.rows) topicList.value = res.rows
  }).catch(() => {
    topicList.value = []
  }).finally(() => { loading.value = false })
}

function toTopicDetail(t: any) {
  uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${t.id}` })
}

function toPublish() {
  uni.navigateTo({ url: '/pages/cust/publish' })
}

onMounted(() => { loadTopics() })
onShow(() => { loadTopics() })
</script>

<template>
  <view class="cust-growth">
    <view class="page-head">
      <text class="page-title">学习中心</text>
      <text class="page-subtitle">Knowledge & Practice</text>
    </view>

    <!-- 实修看板 -->
    <view class="card progress-card">
      <view class="progress-head">
        <view>
          <text class="progress-label">Current Focus</text>
          <text class="progress-name">把自己产品化</text>
        </view>
        <text class="progress-pct">75%</text>
      </view>
      <view class="progress-bar-wrap">
        <view class="progress-bar" style="width: 75%" />
      </view>
      <up-button type="primary" text="打卡心得发布" block customStyle="margin-top: 24rpx; border-radius: 28rpx;" @click="toPublish" />
    </view>

    <!-- 话题 Wiki -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-group">
          <text class="section-title">话题 Wiki</text>
          <text class="section-sub">Knowledge Graph</text>
        </view>
      </view>
      <view v-for="t in topicList" :key="t.id" class="topic-item" @click="toTopicDetail(t)">
        <view class="topic-icon">{{ (t.title && t.title.slice(0, 1)) || '#' }}</view>
        <view class="topic-info">
          <text class="topic-title">{{ t.title }}</text>
          <view class="topic-tags">
            <text v-for="tag in (t.tags || '').split(',').filter(Boolean)" :key="tag" class="tag">#{{ tag }}</text>
          </view>
        </view>
        <up-icon name="arrow-right" size="18" color="#cbd5e1" />
      </view>
      <view v-if="!loading && !topicList.length" class="topic-empty">暂无已发布话题</view>
    </view>

    <!-- 金句库 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-group">
          <text class="section-title">共鸣金句库</text>
          <text class="section-sub">Daily Wisdom</text>
        </view>
      </view>
      <view class="quote-card">
        <text class="quote-text">「真正的成长，是你在面对世界的复杂时，依然能找到自己内心的那个『十倍好』的内核。」</text>
        <view class="quote-footer">
          <text class="quote-from">选自 · 王建硕线下私享会</text>
          <view class="quote-actions">
            <up-icon name="star" size="32" color="rgba(255,255,255,0.8)" />
            <up-icon name="share-square" size="32" color="rgba(255,255,255,0.8)" style="margin-left: 24rpx;" />
          </view>
        </view>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.cust-growth {
  min-height: 100vh;
  background: #f8fafc;
  padding: 32rpx 48rpx;
  padding-top: calc(32rpx + env(safe-area-inset-top));
  padding-bottom: env(safe-area-inset-bottom);
}
.page-head {
  margin-bottom: 48rpx;
}
.page-title {
  font-size: 56rpx;
  font-weight: 900;
  color: #0f172a;
  display: block;
  line-height: 1.1;
}
.page-subtitle {
  font-size: 20rpx;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 8rpx;
  display: block;
}
.card {
  background: #fff;
  border-radius: 64rpx;
  padding: 48rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid #f1f5f9;
}
.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24rpx;
}
.progress-label {
  font-size: 20rpx;
  color: #94a3b8;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}
.progress-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #1e293b;
}
.progress-pct {
  font-size: 44rpx;
  font-weight: 800;
  color: #4f46e5;
}
.progress-bar-wrap {
  height: 24rpx;
  background: #f1f5f9;
  border-radius: 999rpx;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  border-radius: 999rpx;
}
.section {
  margin-bottom: 48rpx;
}
.section-header {
  margin-bottom: 32rpx;
  padding: 0 0 8rpx;
}
.section-title-group .section-title {
  font-size: 44rpx;
  font-weight: 900;
  color: #0f172a;
  display: block;
  line-height: 1;
  margin-bottom: 8rpx;
}
.section-title-group .section-sub {
  font-size: 20rpx;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.topic-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-radius: 48rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #f1f5f9;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}
.topic-empty {
  text-align: center;
  color: #94a3b8;
  font-size: 24rpx;
  font-weight: 700;
  padding: 24rpx 0;
}
.topic-icon {
  width: 96rpx;
  height: 96rpx;
  background: #f1f5f9;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  font-weight: 800;
  color: #64748b;
  margin-right: 28rpx;
}
.topic-info {
  flex: 1;
}
.topic-title {
  font-size: 34rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
}
.topic-tags {
  margin-top: 12rpx;
}
.tag {
  font-size: 18rpx;
  color: #94a3b8;
  margin-right: 16rpx;
}
.quote-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  border-radius: 72rpx;
  padding: 48rpx 40rpx;
  color: #fff;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.2);
}
.quote-text {
  font-size: 36rpx;
  font-style: italic;
  line-height: 1.6;
  display: block;
  margin-bottom: 32rpx;
}
.quote-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.quote-from {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
}
.quote-actions {
  display: flex;
  align-items: center;
}
.safe-bottom {
  height: 180rpx;
}
</style>
