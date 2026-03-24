<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
import { getInfo } from '@/api/login'
import { getUserprofile, listUserinvite } from '@/api/cust'

const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.name || !!userStore.token)
const nickname = computed(() => userStore.name || '访客')
const avatar = ref(userStore.avatar || '')
const identityLabel = ref('创始联创人')
const growthStage = ref('V3 高手')
const contribution = ref(1200)
const ongoing = ref(12)
const growthDays = ref(84)
const inviteCount = ref(0)
const levelProgress = ref(75)
const currentLevel = ref('Level 3')
const nextLevel = ref('Level 4')

uni.$on('refresh', () => {
  avatar.value = userStore.avatar
})

function toLevelGuide() {
  uni.navigateTo({ url: '/pages_cust/pages/level-guide' })
}

function toPointLog() {
  uni.navigateTo({ url: '/pages_cust/pages/point-log' })
}

function toInvite() {
  uni.navigateTo({ url: '/pages_cust/pages/invite' })
}

function toLogin() {
  uni.reLaunch({ url: '/pages_mine/pages/login/index' })
}

function toInfo() {
  if (!isLoggedIn.value) {
    toLogin()
    return
  }
  uni.navigateTo({ url: '/pages_mine/pages/info/index' })
}

function toEditInfo() {
  if (!isLoggedIn.value) {
    toLogin()
    return
  }
  uni.navigateTo({ url: '/pages_mine/pages/info/edit' })
}

function toAvatar() {
  if (!isLoggedIn.value) {
    toLogin()
    return
  }
  uni.navigateTo({ url: '/pages_mine/pages/avatar/index' })
}

function toSetting() {
  uni.navigateTo({ url: '/pages_mine/pages/setting/index' })
}

function toHelp() {
  uni.navigateTo({ url: '/pages_mine/pages/help/index' })
}

function toAbout() {
  uni.navigateTo({ url: '/pages_mine/pages/about/index' })
}

function handleBuilding() {
  uni.navigateTo({ url: '/pages_cust/pages/search' })
}

const functionList = computed(() => [
  { id: 1, label: '编辑资料', icon: 'edit-pen', color: '#6366f1', url: '', action: toEditInfo },
  { id: 2, label: '关系网络 (邀请有礼)', icon: 'account', color: '#6366f1', extra: `${inviteCount.value}位新伙伴`, url: '/pages_cust/pages/invite', action: toInvite },
  { id: 3, label: '我的收藏与实修足迹', icon: 'star', color: '#6366f1', action: handleBuilding },
  { id: 4, label: '贡献值商城', icon: 'integral', color: '#6366f1', action: handleBuilding },
  { id: 5, label: '积分明细', icon: 'list', color: '#6366f1', url: '/pages_cust/pages/point-log', action: toPointLog },
  { id: 6, label: '应用设置', icon: 'setting', color: '#94a3b8', action: toSetting }
])

function handleFunction(item: any) {
  if (item.action) item.action()
}

onMounted(() => {
  avatar.value = userStore.avatar
  if (!userStore.token) return

  getInfo()
    .then((res: any) => {
      const uid = res?.user?.userId
      if (uid == null) return
      return getUserprofile(String(uid))
    })
    .then((res: any) => {
      const p = res?.data
      if (!p) return
      if (p.points != null) contribution.value = Number(p.points) || 0
      if (p.growthStage) growthStage.value = String(p.growthStage)
      if (p.bizRole) identityLabel.value = String(p.bizRole)
    })
    .catch(() => {})

  listUserinvite({ pageNum: 1, pageSize: 1 })
    .then((res: any) => {
      if (res && res.total != null) inviteCount.value = res.total
    })
    .catch(() => {})
})
</script>

<template>
  <view class="profile-page">
    <!-- 头部 -->
    <view class="profile-header">
      <view class="header-bg" />
      <view class="header-content">
        <view class="profile-info">
          <view v-if="!avatar" class="avatar avatar-placeholder" @click="toAvatar">
            <up-icon name="account" size="48" color="rgba(255,255,255,0.8)" />
          </view>
          <image v-else class="avatar" :src="avatar" mode="aspectFill" @click="toAvatar" />
          <view class="user-details">
            <template v-if="!isLoggedIn">
              <text class="user-name" @click="toLogin">点击登录</text>
            </template>
            <template v-else>
              <text class="user-name">{{ nickname }}</text>
              <view class="user-badges">
                <text class="badge">{{ identityLabel }}</text>
                <text class="badge">{{ growthStage }}</text>
              </view>
            </template>
          </view>
          <view class="settings-btn" @click="toSetting">
            <up-icon name="setting" size="24" color="#fff" />
          </view>
        </view>

        <view v-if="isLoggedIn" class="stats-grid" @click="toPointLog">
          <view class="stat-item">
            <text class="stat-value">{{ contribution }}</text>
            <text class="stat-label">贡献值</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-value">{{ ongoing }}</text>
            <text class="stat-label">进行中</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-value">{{ growthDays }}</text>
            <text class="stat-label">实修日</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 成长地图卡片 -->
    <view v-if="isLoggedIn" class="growth-card" @click="toLevelGuide">
      <view class="card-header">
        <view class="card-title-group">
          <text class="card-title">成长进化地图</text>
          <text class="card-subtitle">Growth Blueprint</text>
        </view>
        <view class="level-badge">
          <text>Lv.3 高手</text>
        </view>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: levelProgress + '%' }" />
        <view class="progress-dot" :style="{ left: levelProgress + '%' }" />
      </view>
      <view class="progress-labels">
        <text class="label-current">{{ currentLevel }}</text>
        <text class="label-next">{{ nextLevel }}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view
        v-for="item in functionList"
        :key="item.id"
        class="function-item"
        @click="handleFunction(item)"
      >
        <view class="function-icon">
          <up-icon :name="item.icon" size="36" :color="item.color" />
        </view>
        <text class="function-label">{{ item.label }}</text>
        <view v-if="item.extra" class="function-extra">
          <text class="extra-text">{{ item.extra }}</text>
          <up-icon name="arrow-right" size="16" color="#cbd5e1" />
        </view>
        <template v-else>
          <up-icon name="arrow-right" size="16" color="#cbd5e1" />
        </template>
      </view>
    </view>

    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: env(safe-area-inset-bottom);
}

.profile-header {
  position: relative;
  padding-top: calc(env(safe-area-inset-top) + 16rpx);
  overflow: hidden;

  .header-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

    &::after {
      content: '';
      position: absolute;
      top: -128rpx;
      right: -128rpx;
      width: 640rpx;
      height: 640rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      filter: blur(160rpx);
    }
  }

  .header-content {
    position: relative;
    z-index: 1;
    padding: 40rpx 40rpx 48rpx;
    color: #fff;

    .profile-info {
      display: flex;
      align-items: center;
      gap: 24rpx;
      margin-bottom: 32rpx;

      .avatar {
        width: 144rpx;
        height: 144rpx;
        border-radius: 56rpx;
        border: 6rpx solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
      }

      .avatar-placeholder {
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-details {
        flex: 1;
        min-width: 0;

        .user-name {
          display: block;
          font-size: 40rpx;
          font-weight: 900;
          margin-bottom: 8rpx;
          line-height: 1.2;
        }

        .user-badges {
          display: flex;
          gap: 8rpx;
          flex-wrap: wrap;

          .badge {
            padding: 6rpx 18rpx;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 40rpx;
            font-size: 18rpx;
            font-weight: 700;
            border: 2rpx solid rgba(255, 255, 255, 0.1);
          }
        }
      }

      .settings-btn {
        width: 64rpx;
        height: 64rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid rgba(255, 255, 255, 0.1);
      }
    }

    .stats-grid {
      display: flex;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 64rpx;
      padding: 32rpx 40rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.1);

      .stat-item {
        flex: 1;
        text-align: center;

        .stat-value {
          display: block;
          font-size: 32rpx;
          font-weight: 900;
          margin-bottom: 12rpx;
          line-height: 1;
        }

        .stat-label {
          display: block;
          font-size: 18rpx;
          opacity: 0.7;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      }

      .stat-divider {
        width: 2rpx;
        background: rgba(255, 255, 255, 0.1);
        margin: 0 32rpx;
      }
    }
  }
}

.growth-card {
  margin: -24rpx 32rpx 24rpx;
  padding: 40rpx 32rpx;
  background: #fff;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.08);
  position: relative;
  z-index: 10;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48rpx;

    .card-title-group {
      .card-title {
        display: block;
        font-size: 30rpx;
        font-weight: 900;
        color: #0f172a;
        margin-bottom: 8rpx;
        line-height: 1;
      }

      .card-subtitle {
        display: block;
        font-size: 20rpx;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    }

    .level-badge {
      padding: 8rpx 20rpx;
      background: #eef2ff;
      color: #6366f1;
      border-radius: 40rpx;
      font-size: 20rpx;
      font-weight: 700;
    }
  }

  .progress-bar {
    position: relative;
    height: 4rpx;
    background: #f1f5f9;
    border-radius: 6rpx;
    margin-bottom: 24rpx;
    overflow: visible;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 6rpx;
      transition: width 0.3s;
    }

    .progress-dot {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 28rpx;
      height: 28rpx;
      background: #fff;
      border: 8rpx solid #6366f1;
      border-radius: 50%;
      box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.4);
      transition: left 0.3s;
    }
  }

  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 18rpx;
    font-weight: 700;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.1em;

    .label-current {
      color: #6366f1;
    }
  }
}

.function-list {
  padding: 8rpx 24rpx 0;
}

.function-item {
  margin-bottom: 16rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 40rpx;
  border: 2rpx solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);

  .function-icon {
    width: 72rpx;
    height: 72rpx;
    background: #f8fafc;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .function-label {
    flex: 1;
    font-size: 28rpx;
    font-weight: 700;
    color: #1e293b;
  }

  .function-extra {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .extra-text {
      font-size: 24rpx;
      font-weight: 600;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
}

.safe-bottom {
  height: 180rpx;
}
</style>
