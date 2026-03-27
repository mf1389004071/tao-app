<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { ensureMessageThread, listDmMessages, markDmRead, sendDmMessage } from '@/api/cust'
import { getInfo } from '@/api/login'
import { formatDateTimeDisplay } from '@/utils/datetime'

const threadId = ref('')
const targetUserId = ref('')
const title = ref('私信')
const myUid = ref('')
const messages = ref([])
const inputText = ref('')
const loading = ref(false)

function formatTime(v) {
  return formatDateTimeDisplay(v, '{m}-{d} {h}:{i}')
}

async function resolveThread() {
  if (threadId.value) return
  if (!targetUserId.value) return
  try {
    const res = await ensureMessageThread({ targetUserId: targetUserId.value })
    const tid = res?.data?.threadId
    if (tid) threadId.value = String(tid)
  } catch (_) {}
}

async function loadMessages() {
  if (!threadId.value) return
  loading.value = true
  try {
    const res = await listDmMessages({ pageNum: 1, pageSize: 100, threadId: threadId.value })
    const rows = Array.isArray(res?.rows) ? res.rows : []
    messages.value = [...rows].reverse()
    await markDmRead({ threadId: threadId.value })
  } catch (_) {
    messages.value = []
  } finally {
    loading.value = false
  }
}

async function send() {
  const t = inputText.value.trim()
  if (!t || !threadId.value) return
  try {
    await sendDmMessage({ threadId: threadId.value, content: t })
    inputText.value = ''
    await loadMessages()
  } catch (_) {
    uni.showToast({ title: '发送失败，请登录后重试', icon: 'none' })
  }
}

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] || {}
  const q = (page && page.options) || {}
  threadId.value = q.threadId ? String(q.threadId) : ''
  targetUserId.value = q.targetUserId ? String(q.targetUserId) : ''
  if (q.title) {
    try {
      title.value = decodeURIComponent(String(q.title))
    } catch (_) {
      title.value = String(q.title)
    }
  }
  try {
    const info = await getInfo()
    myUid.value = info?.user?.userId != null ? String(info.user.userId) : ''
  } catch (_) {}
  if (!threadId.value && targetUserId.value) {
    await resolveThread()
  }
  if (threadId.value) {
    uni.setNavigationBarTitle({ title: title.value })
    await loadMessages()
  } else {
    uni.showToast({ title: '无法打开会话', icon: 'none' })
  }
})

onShow(() => {
  if (threadId.value) {
    loadMessages()
  }
})
</script>

<template>
  <view class="dm-chat">
    <scroll-view scroll-y class="msg-scroll" :scroll-into-view="`m-${messages.length - 1}`">
      <view v-if="loading && !messages.length" class="hint">加载中…</view>
      <view
        v-for="(m, idx) in messages"
        :key="String(m.id || idx)"
        :id="`m-${idx}`"
        class="msg-row"
        :class="{ mine: myUid && String(m.senderId) === myUid }"
      >
        <view class="bubble">
          <text class="txt">{{ m.content }}</text>
          <text class="tm">{{ formatTime(m.sentTime) }}</text>
        </view>
      </view>
      <view v-if="!loading && !messages.length" class="hint">暂无消息，发送第一条吧</view>
    </scroll-view>
    <view class="input-bar">
      <input v-model="inputText" class="inp" placeholder="输入消息…" confirm-type="send" @confirm="send" />
      <text class="send" @click="send">发送</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dm-chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f1f5f9;
}
.msg-scroll {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}
.msg-row {
  display: flex;
  margin-bottom: 20rpx;
  justify-content: flex-start;
}
.msg-row.mine {
  justify-content: flex-end;
}
.bubble {
  max-width: 80%;
  background: #fff;
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  border: 1rpx solid #e2e8f0;
}
.msg-row.mine .bubble {
  background: #4f46e5;
  border-color: #4f46e5;
}
.txt {
  font-size: 28rpx;
  color: #334155;
  font-weight: 600;
  line-height: 1.5;
}
.msg-row.mine .txt {
  color: #fff;
}
.tm {
  display: block;
  margin-top: 8rpx;
  font-size: 18rpx;
  color: #94a3b8;
  font-weight: 600;
}
.msg-row.mine .tm {
  color: rgba(255, 255, 255, 0.75);
}
.hint {
  text-align: center;
  color: #94a3b8;
  font-size: 24rpx;
  padding: 40rpx 0;
}
.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #e2e8f0;
}
.inp {
  flex: 1;
  height: 72rpx;
  padding: 0 20rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  font-size: 28rpx;
}
.send {
  font-size: 28rpx;
  font-weight: 900;
  color: #4f46e5;
  padding: 12rpx 8rpx;
}
</style>
