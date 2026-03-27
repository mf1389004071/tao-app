<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { listKnowledgecontent } from '@/api/cust'

const topicList = ref<any[]>([])
const loading = ref(false)
const quoteItem = ref<any>(null)

function loadTopics() {
  loading.value = true
  listKnowledgecontent({ pageNum: 1, pageSize: 20, contentType: 'WIKI', bizStatus: 'PUBLISHED' }).then((res: any) => {
    if (res && res.rows) topicList.value = res.rows
  }).catch(() => {
    topicList.value = []
  }).finally(() => { loading.value = false })
}

function loadQuote() {
  listKnowledgecontent({ pageNum: 1, pageSize: 20, bizStatus: 'PUBLISHED', contentType: 'QUOTE' }).then((res: any) => {
    const rows = Array.isArray(res?.rows) ? res.rows : []
    if (rows.length) {
      quoteItem.value = rows[Math.floor(Math.random() * rows.length)]
    }
  }).catch(() => {})
}

const quoteMainText = computed(() => {
  const q = quoteItem.value
  if (!q) return '「真正的成长，是你在面对世界的复杂时，依然能找到自己内心的那个『十倍好』的内核。」'
  const body = (q.content && String(q.content).trim()) || (q.title && String(q.title).trim()) || ''
  return body ? `「${body}」` : '「真正的成长，是你在面对世界的复杂时，依然能找到自己内心的那个『十倍好』的内核。」'
})

const quoteSubText = computed(() => {
  const q = quoteItem.value
  if (!q) return '选自 · 王建硕线下私享会'
  return q.subtitle ? `选自 · ${q.subtitle}` : q.promotionalText ? `选自 · ${q.promotionalText}` : '十倍好 · 共鸣金句'
})

function toTopicDetail(t: any) {
  uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${t.id}` })
}

function toTopicMore() {
  uni.navigateTo({ url: '/pages_cust/pages/knowledge-list?mode=topic&contentType=WIKI' })
}

function toQuoteMore() {
  uni.navigateTo({ url: '/pages_cust/pages/knowledge-list?mode=quote&contentType=QUOTE' })
}

function toPublish() {
  uni.switchTab({ url: '/pages/cust/publish' })
}

onMounted(() => {
  loadTopics()
  loadQuote()
})
onShow(() => { loadTopics() })
</script>

<template>
  <view class="cust-growth">
    <view class="page-head">
      <text class="page-title">学习中心</text>
      <text class="page-subtitle">知识与实践</text>
    </view>

    <!-- 实修看板 -->
    <view class="card progress-card">
      <view class="progress-head">
        <view>
          <text class="progress-label">当前重点</text>
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
          <text class="section-sub">知识网络</text>
        </view>
        <text class="more-link" @click.stop="toTopicMore">更多</text>
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
          <text class="section-sub">每日灵感</text>
        </view>
        <text class="more-link" @click.stop="toQuoteMore">更多</text>
      </view>
      <view class="quote-card">
        <text class="quote-text">{{ quoteMainText }}</text>
        <view class="quote-footer">
          <text class="quote-from">{{ quoteSubText }}</text>
          <view class="quote-actions">
            <up-icon name="star" size="32" color="rgba(120,53,15,0.45)" />
            <up-icon name="share-square" size="32" color="rgba(120,53,15,0.45)" style="margin-left: 24rpx;" />
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 32rpx;
  padding: 0 0 8rpx;
}
.more-link {
  font-size: 28rpx;
  font-weight: 800;
  color: #4f46e5;
  flex-shrink: 0;
  padding-bottom: 4rpx;
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
  background: linear-gradient(165deg, #fffbeb 0%, #fef3c7 42%, #fff7ed 100%);
  border-radius: 72rpx;
  padding: 48rpx 40rpx;
  color: #78350f;
  border: 1rpx solid #fde68a;
  box-shadow: 0 12rpx 40rpx rgba(120, 53, 15, 0.08);
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
  color: rgba(120, 53, 15, 0.55);
  font-weight: 700;
}
.quote-actions {
  display: flex;
  align-items: center;
}
.safe-bottom {
  height: 180rpx;
}

/* 移动端 UI 规范覆盖：控制字号层级、卡片圆角与间距 */
.cust-growth {
  --c-text: #0f172a;
  --c-muted: #64748b;
  --c-subtle: #94a3b8;
  --c-border: #e2e8f0;
  --c-card: #ffffff;
  padding: 24rpx 28rpx;
  padding-top: calc(24rpx + env(safe-area-inset-top));
}
.page-title {
  font-size: 44rpx;
  line-height: 1.2;
}
.page-subtitle,
.section-title-group .section-sub {
  font-size: 22rpx;
  color: var(--c-subtle);
  letter-spacing: 0.04em;
}
.card {
  border-radius: 28rpx;
  padding: 30rpx;
  border: 1rpx solid var(--c-border);
}
.section-title-group .section-title {
  font-size: 34rpx;
  line-height: 1.25;
}
.topic-item {
  border-radius: 24rpx;
  border: 1rpx solid var(--c-border);
  padding: 24rpx;
}
.topic-title {
  font-size: 30rpx;
  color: var(--c-text);
}
.tag {
  font-size: 22rpx;
  color: var(--c-muted);
}
.quote-card {
  border-radius: 28rpx;
  padding: 30rpx;
}
.quote-text {
  font-size: 30rpx;
  line-height: 1.7;
}
.quote-from {
  font-size: 22rpx;
}
</style>
