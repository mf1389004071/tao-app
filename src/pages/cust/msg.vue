<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listNotices, listNotifications } from '@/api/cust'

type MsgTab = 'system' | 'interaction' | 'subscription'

const activeTab = ref<MsgTab>('system')
const systemList = ref<any[]>([])
const interactionList = ref<any[]>([])
const topicFeedList = ref<any[]>([])

const tabs = [
  { id: 'system' as MsgTab, label: '系统通知' },
  { id: 'interaction' as MsgTab, label: '互动回复' },
  { id: 'subscription' as MsgTab, label: '话题更新' }
]

function setTab(id: MsgTab) {
  activeTab.value = id
}

function toNoticeDetail(item: any) {
  uni.navigateTo({ url: `/pages_cust/pages/notice-detail?id=${item.id}` })
}

function toTopicDetail(item?: any) {
  const id = item?.relatedId ? String(item.relatedId) : '920001'
  uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${id}` })
}

function toInteractionDetail(item: any) {
  const relatedType = String(item?.relatedType || '').toUpperCase()
  const relatedId = item?.relatedId ? String(item.relatedId) : ''
  if (relatedType === 'KNOWLEDGE_CONTENT' && relatedId) {
    uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${relatedId}` })
    return
  }
  if (relatedType === 'NOTICE' && relatedId) {
    uni.navigateTo({ url: `/pages_cust/pages/notice-detail?id=${relatedId}` })
    return
  }
  uni.showToast({ title: '该消息暂无可跳转详情', icon: 'none' })
}

function formatTime(v: any) {
  if (!v) return ''
  const s = String(v)
  if (s.length >= 16) return s.slice(0, 16).replace('T', ' ')
  return s
}

onMounted(async () => {
  let noticeRows: any[] = []
  let notifyRows: any[] = []
  try {
    const noticeRes: any = await listNotices({ pageNum: 1, pageSize: 20 })
    noticeRows = Array.isArray(noticeRes?.rows) ? noticeRes.rows : []
  } catch (_) {}
  try {
    const notifyRes: any = await listNotifications({ pageNum: 1, pageSize: 20 })
    notifyRows = Array.isArray(notifyRes?.rows) ? notifyRes.rows : []
  } catch (_) {}

  systemList.value = noticeRows.map((n: any) => ({
    id: String(n.id),
    title: n.title || '系统通知',
    content: n.content || '',
    time: formatTime(n.publishTime || n.createTime),
    read: true
  }))

  interactionList.value = notifyRows
    .filter((n: any) => String(n.notificationType || '').toLowerCase() === 'interaction')
    .map((n: any) => ({
      id: String(n.id),
      user: '系统',
      action: n.title || '互动消息',
      target: n.content || '',
      time: formatTime(n.createTime),
      avatar: '',
      relatedType: n.relatedType == null ? '' : String(n.relatedType),
      relatedId: n.relatedId == null ? '' : String(n.relatedId)
    }))

  topicFeedList.value = notifyRows
    .filter((n: any) => {
      const t = String(n.notificationType || '').toLowerCase()
      return t === 'subscription' || t === 'topic' || t === 'system'
    })
    .map((n: any) => ({
      id: String(n.id),
      topic: n.title || '话题更新',
      content: n.content || '',
      time: formatTime(n.createTime),
      relatedId: n.relatedId == null ? '' : String(n.relatedId)
    }))
})
</script>

<template>
  <view class="cust-msg">
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="setTab(tab.id)"
      >
        <text class="tab-label">{{ tab.label }}</text>
        <view v-if="activeTab === tab.id" class="tab-line" />
      </view>
    </view>

    <!-- 系统通知 -->
    <view v-show="activeTab === 'system'" class="list">
      <view
        v-for="m in systemList"
        :key="m.id"
        class="msg-row"
        @click="toNoticeDetail(m)"
      >
        <view class="dot" :class="{ unread: !m.read }" />
        <view class="msg-body">
          <view class="msg-head">
            <text class="msg-title">{{ m.title }}</text>
            <text class="msg-time">{{ m.time }}</text>
          </view>
          <text class="msg-content">{{ m.content }}</text>
        </view>
        <up-icon name="arrow-right" size="16" color="#e2e8f0" />
      </view>
    </view>

    <!-- 互动回复 -->
    <view v-show="activeTab === 'interaction'" class="list">
      <view v-for="i in interactionList" :key="i.id" class="msg-row interaction" @click="toInteractionDetail(i)">
        <view class="avatar" />
        <view class="msg-body">
          <view class="msg-head">
            <text class="msg-title">{{ i.user }}</text>
            <text class="msg-time">{{ i.time }}</text>
          </view>
          <text class="msg-content">{{ i.action }} "{{ i.target }}"</text>
        </view>
        <up-icon name="chat" size="16" color="#c7d2fe" />
      </view>
    </view>

    <!-- 话题更新 -->
    <view v-show="activeTab === 'subscription'" class="list">
      <view v-for="f in topicFeedList" :key="f.id" class="msg-row" @click="toTopicDetail(f)">
        <view class="topic-avatar">#</view>
        <view class="msg-body">
          <view class="msg-head">
            <text class="msg-title">{{ f.topic }}</text>
            <text class="msg-time">{{ f.time }}</text>
          </view>
          <text class="msg-content">{{ f.content }}</text>
        </view>
        <up-icon name="arrow-right" size="16" color="#e2e8f0" />
      </view>
      <view v-if="!topicFeedList.length" class="empty-row">暂无话题更新</view>
    </view>

    <view v-if="activeTab === 'system' && !systemList.length" class="empty-row">暂无系统通知</view>
    <view v-if="activeTab === 'interaction' && !interactionList.length" class="empty-row">暂无互动回复</view>

    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.cust-msg {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24rpx 32rpx;
  padding-top: calc(24rpx + env(safe-area-inset-top));
  padding-bottom: env(safe-area-inset-bottom);
}
.tabs {
  display: flex;
  gap: 48rpx;
  margin-bottom: 32rpx;
  border-bottom: 2rpx solid #f1f5f9;
}
.tab-item {
  padding-bottom: 24rpx;
  position: relative;
}
.tab-item.active .tab-label {
  color: #4f46e5;
  font-weight: 700;
}
.tab-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #4f46e5;
  border-radius: 2rpx;
}
.tab-label {
  font-size: 28rpx;
  color: #94a3b8;
}
.list {
  padding-top: 16rpx;
}
.msg-row {
  display: flex;
  align-items: flex-start;
  padding: 32rpx;
  background: #fff;
  border-radius: 48rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid #f1f5f9;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}
.msg-row.interaction {
  align-items: center;
}
.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin-top: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}
.dot.unread {
  background: #ef4444;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin-right: 24rpx;
  flex-shrink: 0;
}
.topic-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 800;
  color: #4f46e5;
  margin-right: 24rpx;
  flex-shrink: 0;
}
.msg-body {
  flex: 1;
  min-width: 0;
}
.msg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}
.msg-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #1e293b;
}
.msg-time {
  font-size: 20rpx;
  color: #cbd5e1;
  font-weight: 700;
}
.msg-content {
  font-size: 24rpx;
  color: #64748b;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.safe-bottom {
  height: 180rpx;
}
.empty-row {
  margin-top: 48rpx;
  text-align: center;
  color: #94a3b8;
  font-size: 24rpx;
  font-weight: 700;
}
</style>
