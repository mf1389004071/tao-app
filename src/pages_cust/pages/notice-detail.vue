<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNotice } from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'

const id = ref('')
const detail = ref<any>({})
const loading = ref(true)

function formatDateTime(v: any): string {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}:{s}')
}

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
      <text class="meta">发布于 {{ formatDateTime(detail.publishTime || detail.createTime) }} · 十倍好成长运营中心</text>
      <view class="content">
        <text class="content-text">{{ detail.content || '暂无公告内容' }}</text>
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
</style>
