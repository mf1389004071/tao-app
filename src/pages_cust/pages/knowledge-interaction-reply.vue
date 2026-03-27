<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addKnowledgeComment, getKnowledgeComment, getKnowledgecontent } from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'

declare const uni: any

const contentId = ref('')
const commentId = ref('')
const contentRow = ref<any>({})
const targetComment = ref<any>(null)
const replyText = ref('')
const loading = ref(true)
const sending = ref(false)

function formatTime(v: any) {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}:{s}')
}

function toKnowledgeDetail() {
  if (!contentId.value) return
  const t = String(contentRow.value?.contentType || '').toUpperCase()
  if (t === 'TOOL') {
    uni.navigateTo({ url: `/pages_cust/pages/tool-detail?id=${encodeURIComponent(contentId.value)}` })
    return
  }
  uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${encodeURIComponent(contentId.value)}` })
}

async function submitReply() {
  if (!contentId.value || !commentId.value) return
  const t = replyText.value.trim()
  if (!t) {
    uni.showToast({ title: '请输入回复', icon: 'none' })
    return
  }
  if (sending.value) return
  sending.value = true
  try {
    await addKnowledgeComment({
      contentId: contentId.value,
      parentId: commentId.value,
      content: t
    })
    replyText.value = ''
    uni.showToast({ title: '已回复', icon: 'success' })
    uni.navigateBack()
  } catch (_) {
    uni.showToast({ title: '发送失败，请登录后重试', icon: 'none' })
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const q = (page && page.options) || {}
  commentId.value = q.commentId ? String(q.commentId) : ''
  contentId.value = q.contentId ? String(q.contentId) : ''
  if (!commentId.value) {
    loading.value = false
    return
  }
  try {
    const cm: any = await getKnowledgeComment(commentId.value)
    if (cm && cm.data) {
      targetComment.value = cm.data
      if (!contentId.value && cm.data.contentId != null) contentId.value = String(cm.data.contentId)
    }
    if (contentId.value) {
      const kc: any = await getKnowledgecontent(contentId.value)
      if (kc && kc.data) contentRow.value = kc.data
    }
  } catch (_) {}
  loading.value = false
})
</script>

<template>
  <view class="page">
    <view v-if="loading" class="hint">加载中…</view>
    <view v-else class="body">
      <view class="card head" @click="toKnowledgeDetail">
        <text class="h-label">知识内容</text>
        <text class="h-title">{{ contentRow.title || '—' }}</text>
        <text class="h-sub">{{ contentRow.subtitle || '' }}</text>
      </view>
      <view class="card">
        <text class="c-label">收到的评论</text>
        <text class="c-body">{{ targetComment && targetComment.content ? targetComment.content : '—' }}</text>
        <text class="c-time">{{ targetComment ? formatTime(targetComment.createTime) : '' }}</text>
      </view>
      <view class="card input-card">
        <textarea v-model="replyText" class="ta" placeholder="直接回复该评论…" maxlength="1000" />
        <view class="send" :class="{ disabled: sending }" @click="submitReply">发送回复</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}
.hint {
  text-align: center;
  color: #94a3b8;
  padding: 80rpx;
}
.body {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  border: 1rpx solid #e2e8f0;
}
.head .h-label {
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 800;
  display: block;
  margin-bottom: 12rpx;
}
.h-title {
  font-size: 32rpx;
  font-weight: 900;
  color: #0f172a;
  display: block;
}
.h-sub {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #64748b;
  display: block;
}
.c-label {
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 800;
  display: block;
  margin-bottom: 12rpx;
}
.c-body {
  font-size: 28rpx;
  color: #334155;
  line-height: 1.6;
  display: block;
}
.c-time {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #94a3b8;
  display: block;
}
.ta {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  color: #0f172a;
  margin-bottom: 20rpx;
}
.send {
  text-align: center;
  padding: 22rpx;
  background: #4f46e5;
  color: #fff;
  font-weight: 900;
  border-radius: 20rpx;
  font-size: 28rpx;
}
.send.disabled {
  opacity: 0.6;
}
</style>
