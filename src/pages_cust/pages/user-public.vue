<script setup>
import { ref, onMounted } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { getInfo } from '@/api/login'
import { getUserPublic, shareUserProfile, toggleUserSocial } from '@/api/cust'
import config from '@/config'

const userId = ref('')
const loading = ref(true)
const socialBusy = ref(false)
const detail = ref({})
const currentUid = ref('')

function coverUrl(u) {
  if (!u) return ''
  return String(u).startsWith('http') ? String(u) : config.baseUrl + String(u)
}

async function load() {
  if (!userId.value) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await getUserPublic(userId.value)
    if (res && res.data) detail.value = res.data
  } catch (_) {
    detail.value = {}
  } finally {
    loading.value = false
  }
}

async function onShareTap() {
  if (!userId.value) return
  try {
    await shareUserProfile({ targetUserId: userId.value })
    await load()
  } catch (_) {}
}

async function toggleLike() {
  if (!userId.value || socialBusy.value) return
  socialBusy.value = true
  try {
    const res = await toggleUserSocial({ targetUserId: userId.value, actionType: 'LIKE' })
    if (res?.data) {
      detail.value.liked = Boolean(res.data.enabled)
      detail.value.profileReceivedLikeCount = res.data.profileReceivedLikeCount
    }
  } catch (_) {
    uni.showToast({ title: '请先登录', icon: 'none' })
  } finally {
    socialBusy.value = false
  }
}

async function toggleCollect() {
  if (!userId.value || socialBusy.value) return
  socialBusy.value = true
  try {
    const res = await toggleUserSocial({ targetUserId: userId.value, actionType: 'COLLECT' })
    if (res?.data) {
      detail.value.collected = Boolean(res.data.enabled)
      detail.value.profileReceivedCollectCount = res.data.profileReceivedCollectCount
    }
  } catch (_) {
    uni.showToast({ title: '请先登录', icon: 'none' })
  } finally {
    socialBusy.value = false
  }
}

function toDm() {
  if (!userId.value) return
  uni.navigateTo({
    url: `/pages_cust/pages/dm-chat?targetUserId=${encodeURIComponent(userId.value)}`
  })
}

onShareAppMessage(() => {
  if (userId.value) {
    shareUserProfile({ targetUserId: userId.value }).catch(() => {})
  }
  return {
    title: detail.value.nickName ? `${detail.value.nickName} 的学员主页` : '学员主页',
    path: `/pages_cust/pages/user-public?userId=${encodeURIComponent(userId.value)}`
  }
})

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] || {}
  userId.value = (page.options && page.options.userId) || ''
  getInfo()
    .then((r) => {
      currentUid.value = r?.user?.userId != null ? String(r.user.userId) : ''
    })
    .catch(() => {})
  load()
})
</script>

<template>
  <view class="user-public">
    <view v-if="loading" class="loading">加载中…</view>
    <view v-else class="body">
      <view class="hero">
        <image
          v-if="coverUrl(detail.bestPhotoUrl || detail.avatarPromoUrl)"
          class="avatar"
          :src="coverUrl(detail.bestPhotoUrl || detail.avatarPromoUrl)"
          mode="aspectFill"
        />
        <view v-else class="avatar avatar-ph" />
        <text class="name">{{ detail.nickName || '学员' }}</text>
        <text class="sub">{{ detail.growthStage || 'MEMBER' }}</text>
      </view>
      <view class="stats">
        <view class="st">
          <text class="n">{{ detail.profileReceivedLikeCount ?? 0 }}</text>
          <text class="l">获赞</text>
        </view>
        <view class="st">
          <text class="n">{{ detail.profileReceivedCollectCount ?? 0 }}</text>
          <text class="l">被收藏</text>
        </view>
        <view class="st">
          <text class="n">{{ detail.profileReceivedShareCount ?? 0 }}</text>
          <text class="l">被分享</text>
        </view>
      </view>
      <view class="card">
        <text class="label">商业定位</text>
        <text class="txt">{{ detail.businessPositioning || '暂无' }}</text>
      </view>
      <view class="card">
        <text class="label">能力与天赋</text>
        <text class="txt">{{ detail.talentSummary || '暂无' }}</text>
      </view>
      <view class="actions">
        <view class="btn" @click="toggleLike">
          <text>{{ detail.liked ? '已赞' : '点赞' }}</text>
        </view>
        <view class="btn" @click="toggleCollect">
          <text>{{ detail.collected ? '已收藏' : '收藏' }}</text>
        </view>
        <button class="btn share" open-type="share" @click="onShareTap">分享</button>
        <view v-if="currentUid && userId && currentUid !== userId" class="btn primary" @click="toDm">
          <text>私信</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-public {
  min-height: 100vh;
  background: #f8fafc;
}
.loading {
  padding: 80rpx;
  text-align: center;
  color: #94a3b8;
}
.body {
  padding: 32rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}
.hero {
  background: #fff;
  border-radius: 40rpx;
  padding: 40rpx;
  align-items: center;
  text-align: center;
  border: 1rpx solid #f1f5f9;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  background: #e2e8f0;
}
.avatar-ph {
  margin: 0 auto;
}
.name {
  display: block;
  margin-top: 20rpx;
  font-size: 40rpx;
  font-weight: 900;
  color: #0f172a;
}
.sub {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 700;
}
.stats {
  display: flex;
  justify-content: space-around;
  margin: 24rpx 0;
  padding: 28rpx;
  background: #fff;
  border-radius: 32rpx;
  border: 1rpx solid #f1f5f9;
}
.st {
  text-align: center;
}
.n {
  display: block;
  font-size: 36rpx;
  font-weight: 900;
  color: #4f46e5;
}
.l {
  font-size: 20rpx;
  color: #94a3b8;
  font-weight: 700;
}
.card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #f1f5f9;
}
.label {
  font-size: 22rpx;
  font-weight: 800;
  color: #94a3b8;
  display: block;
  margin-bottom: 12rpx;
}
.txt {
  font-size: 28rpx;
  color: #334155;
  line-height: 1.6;
  font-weight: 600;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
}
.btn {
  flex: 1;
  min-width: 200rpx;
  text-align: center;
  padding: 22rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid #e2e8f0;
  font-size: 26rpx;
  font-weight: 800;
  color: #475569;
}
.btn.primary {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}
.btn.share {
  line-height: 1.2;
  margin: 0;
}
</style>
