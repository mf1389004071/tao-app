<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

function toTopicDetail() {
  uni.navigateTo({ url: '/pages_cust/pages/topic-detail?id=1' })
}

onMounted(() => {
  systemList.value = [
    { id: 1, title: '积分商城正式上线', content: '现在可以使用贡献值兑换权益啦！', time: '10:24', read: false },
    { id: 2, title: '实修打卡挑战赛开启', content: '累计打卡21天，赢取王老师亲笔签名书。', time: '昨天', read: true }
  ]
  interactionList.value = [
    { id: 1, user: '张帆', action: '赞了你的心得', target: '《关于蛋壳理论的3点思考》', time: '2分钟前', avatar: '' },
    { id: 2, user: '陈默', action: '回复了你的评论', target: '非常赞同，内生力量才是持久的...', time: '1小时前', avatar: '' }
  ]
  topicFeedList.value = [
    { id: 1, topic: '蛋壳理论', content: '王建硕发布了新的官方指南：如何识别外力的干扰？', time: '10分钟前' },
    { id: 2, topic: '极致利他', content: '社群内新增 5 份关于《极致利他》的高分实修报告', time: '3小时前' }
  ]
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
      <view v-for="i in interactionList" :key="i.id" class="msg-row interaction">
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
      <view
        v-for="f in topicFeedList"
        :key="f.id"
        class="msg-row"
        @click="toTopicDetail"
      >
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
    </view>

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
</style>
