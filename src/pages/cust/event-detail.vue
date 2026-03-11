<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getEventinfo } from '@/api/cust'
import config from '@/config'

const id = ref('')
const detail = ref<any>({})
const loading = ref(true)

const coverUrl = computed(() => {
  const url = detail.value.coverImageUrl
  if (!url) return ''
  return url.startsWith('http') ? url : config.baseUrl + url
})

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
    getEventinfo(id.value).then((res: any) => {
      if (res && res.data) detail.value = res.data
    }).catch(() => {
      detail.value = {
        title: '把自己产品化 · 深圳站',
        city: '深圳',
        startTime: '2026-05-20',
        eventPrice: 2999,
        coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        curriculum: ['产品化思维底层逻辑', '个人商业画布拆解', '流量与信任的转换', '实战方案演练'],
        learningObjectives: '线下闭门分享、终身校友会、1对1方案诊断'
      }
    }).finally(() => { loading.value = false })
  } else {
    detail.value = {
      title: '把自己产品化 · 深圳站',
      city: '深圳',
      startTime: '2026-05-20',
      eventPrice: 2999,
      coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      curriculum: ['产品化思维底层逻辑', '个人商业画布拆解', '流量与信任的转换', '实战方案演练'],
      learningObjectives: '线下闭门分享、终身校友会、1对1方案诊断'
    }
    loading.value = false
  }
})

const curriculumList = ref<string[]>([])

function getCurriculum() {
  const c = detail.value.curriculum
  if (Array.isArray(c)) return c
  if (typeof c === 'string') return c.split(',').map((s: string) => s.trim()).filter(Boolean)
  return []
}

function apply() {
  uni.showToast({ title: '报名申请已提交', icon: 'success' })
}
</script>

<template>
  <view class="cust-event-detail">
    <view class="cover-wrap">
      <image v-if="coverUrl" class="cover" :src="coverUrl" mode="aspectFill" lazy-load />
      <view v-else class="cover placeholder" />
    </view>

    <view class="body">
      <view class="title-row">
        <text class="title">{{ detail.title }}</text>
        <text class="price">￥{{ detail.eventPrice || 0 }}</text>
      </view>

      <view class="features">
        <view v-for="(f, i) in (detail.learningObjectives || '').split(/[,，、]/).filter(Boolean)" :key="i" class="feature">
          <up-icon name="checkmark-circle" size="32" color="#22c55e" />
          <text>{{ f }}</text>
        </view>
      </view>

      <text class="section-label">课程大纲</text>
      <view class="curriculum">
        <view v-for="(item, i) in getCurriculum()" :key="i" class="curriculum-item">
          <text class="curriculum-num">{{ String(i + 1).padStart(2, '0') }}</text>
          <text class="curriculum-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <view class="footer-bar">
      <up-button plain text="线上咨询" customStyle="flex: 1; border-radius: 32rpx;" @click="uni.showToast({ title: '咨询已接通', icon: 'none' })" />
      <up-button type="primary" text="立即报名锁定席位" customStyle="flex: 2.5; border-radius: 32rpx; margin-left: 24rpx;" @click="apply" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-event-detail {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 160rpx;
}
.cover-wrap {
  width: 100%;
  height: 560rpx;
  background: #e2e8f0;
}
.cover {
  width: 100%;
  height: 100%;
}
.cover.placeholder {
  background: linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%);
}
.body {
  padding: 32rpx;
  margin-top: -48rpx;
  background: #fff;
  border-radius: 48rpx 48rpx 0 0;
  position: relative;
  z-index: 1;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32rpx;
}
.title {
  flex: 1;
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  margin-right: 24rpx;
}
.price {
  font-size: 44rpx;
  font-weight: 800;
  color: #0f172a;
}
.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  margin-bottom: 48rpx;
}
.feature {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 28rpx;
  background: #f8fafc;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #334155;
}
.section-label {
  font-size: 28rpx;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 24rpx;
}
.curriculum {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.curriculum-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: #f8fafc;
  border-radius: 32rpx;
}
.curriculum-num {
  font-size: 48rpx;
  font-weight: 800;
  color: #c7d2fe;
}
.curriculum-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
}
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  border-top: 1rpx solid #f1f5f9;
  display: flex;
  align-items: center;
}
</style>
