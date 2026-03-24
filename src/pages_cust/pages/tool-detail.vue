<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getKnowledgecontent } from '@/api/cust'

const id = ref('')
const detail = ref<any>({})

function buildGuide(item: any): string[] {
  const source = item?.text1 || item?.content || ''
  const text = String(source)
  if (!text.trim()) return []
  return text
    .split(/[\n。；;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
}

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
    getKnowledgecontent(id.value).then((res: any) => {
      if (res && res.data) detail.value = { ...res.data }
    }).catch(() => {})
  }
})

function downloadDoc() {
  const docUrl = detail.value?.text2 ? String(detail.value.text2) : ''
  if (!docUrl) {
    uni.showToast({ title: '暂无可下载资料', icon: 'none' })
    return
  }
  uni.setClipboardData({ data: docUrl })
  uni.showToast({ title: '下载链接已复制', icon: 'success' })
}
</script>

<template>
  <view class="cust-tool-detail">
    <view class="body">
      <view class="head">
        <view class="icon-wrap">
          <up-icon name="bulb" size="40" color="#ea580c" />
        </view>
        <view>
          <text class="title">{{ detail.title }}</text>
          <text class="version">Version {{ detail.subtitle || '2.0' }}</text>
        </view>
      </view>

      <view class="card intro">
        <text class="card-label">工具简介</text>
        <text class="card-text">{{ detail.content || detail.aiSummary || '暂无工具说明' }}</text>
      </view>

      <text class="card-label">使用指南</text>
      <view class="guide-list" v-if="buildGuide(detail).length">
        <view v-for="(g, i) in buildGuide(detail)" :key="i" class="guide-item">
          <text class="guide-num">{{ String(i + 1).padStart(2, '0') }}</text>
          <text class="guide-text">{{ g }}</text>
        </view>
      </view>
      <view v-else class="empty-guide">暂无使用指南</view>

      <view class="card case">
        <text class="card-label">实操案例</text>
        <text class="case-text">「{{ detail.promotionalText || detail.aiSummary || '暂未收录案例。' }}」</text>
        <up-button plain size="small" :text="detail.text3 || '下载高清PDF工作坊'" customStyle="margin-top: 24rpx; border-radius: 20rpx;" @click="downloadDoc" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-tool-detail {
  min-height: 100vh;
  background: #fff;
  padding: 24rpx 32rpx 80rpx;
}
.body {
  padding-top: 24rpx;
}
.head {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 40rpx;
}
.icon-wrap {
  width: 128rpx;
  height: 128rpx;
  background: #fff7ed;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
}
.version {
  font-size: 24rpx;
  font-weight: 700;
  color: #ea580c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 8rpx;
  display: block;
}
.card {
  padding: 40rpx;
  border-radius: 48rpx;
  margin-bottom: 40rpx;
  border: 1rpx solid #f1f5f9;
}
.card.intro {
  background: #f8fafc;
}
.card-label {
  font-size: 24rpx;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 24rpx;
}
.card-text {
  font-size: 28rpx;
  color: #475569;
  line-height: 1.7;
}
.guide-list {
  margin-bottom: 40rpx;
}
.empty-guide {
  font-size: 24rpx;
  color: #94a3b8;
  margin-bottom: 40rpx;
}
.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 24rpx 0;
}
.guide-num {
  font-size: 36rpx;
  font-weight: 800;
  color: #c7d2fe;
  flex-shrink: 0;
}
.guide-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.5;
}
.card.case {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
}
.card.case .card-label {
  color: rgba(255, 255, 255, 0.8);
}
.case-text {
  font-size: 28rpx;
  line-height: 1.7;
  font-style: italic;
  display: block;
  margin-bottom: 16rpx;
}
</style>
