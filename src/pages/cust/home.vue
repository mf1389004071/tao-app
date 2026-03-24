<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
import { listNotices, listEventinfo } from '@/api/cust'
import config from '@/config'

// uni-app 在运行时提供全局变量；这里只为消除 TS 类型提示，不改运行时取值
declare const uni: any

const noticeList = ref<{ id: number; title: string; isUrgent?: boolean }[]>([])
const eventList = ref<any[]>([])
const ongoingEvent = computed(() => (eventList.value.length ? eventList.value[0] : null))
const loading = ref(false)
const refreshing = ref(false)
const scrolled = ref(false)
/** 右侧预留宽度（微信胶囊占位），rpx */
const navbarRightRpx = ref(160)

onPageScroll((e) => {
  scrolled.value = e.scrollTop > 20
})

function addBaseUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return config.baseUrl + url
}

/** 活动开始时间展示：后端为 ISO 或日期字符串，取日期部分 */
function formatEventDate(val: string | undefined): string {
  if (!val) return ''
  const s = String(val)
  return s.length >= 10 ? s.slice(0, 10) : s
}

function loadNotices() {
  listNotices({ pageNum: 1, pageSize: 5 }).then((res: any) => {
    if (res && res.rows) noticeList.value = res.rows
  }).catch(() => {
    noticeList.value = []
  })
}

function loadEvents() {
  loading.value = true
  listEventinfo({ pageNum: 1, pageSize: 5, bizStatus: 'PUBLISHED' }).then((res: any) => {
    if (res && res.rows) {
      const rows = Array.isArray(res.rows) ? res.rows : []
      // 兜底：即使后端未排序，也按更新时间倒序展示
      rows.sort((a: any, b: any) => {
        const ta = Date.parse(a?.updateTime || a?.createTime || '') || 0
        const tb = Date.parse(b?.updateTime || b?.createTime || '') || 0
        return tb - ta
      })
      eventList.value = rows
    }
  }).catch(() => {
    eventList.value = []
  }).finally(() => {
    loading.value = false
    refreshing.value = false
  })
}

function onRefresh() {
  refreshing.value = true
  loadNotices()
  loadEvents()
}

function toNoticeDetail(n: any) {
  const id = n.id == null ? '' : String(n.id)
  uni.navigateTo({ url: `/pages_cust/pages/notice-detail?id=${id}` })
}

function toEventDetail(e: any) {
  const id = e.id == null ? '' : String(e.id)
  uni.navigateTo({ url: `/pages_cust/pages/event-detail?id=${id}` })
}

function toSearch() {
  uni.navigateTo({ url: '/pages_cust/pages/search' })
}

function toGrowth() {
  uni.switchTab({ url: '/pages/cust/growth' })
}

function toEventsList() {
  uni.navigateTo({ url: '/pages_cust/pages/events-list' })
}

function toOngoingEvent() {
  if (!ongoingEvent.value) return
  toEventDetail(ongoingEvent.value)
}

function scrollToTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 300 })
}

function handleCommunity() {
  uni.switchTab({ url: '/pages/cust/msg' })
}

onMounted(() => {
  loadNotices()
  loadEvents()
  // 微信小程序：根据胶囊按钮位置预留右侧空间，避免搜索/消息被遮挡
  // #ifdef MP-WEIXIN
  try {
    const menu = uni.getMenuButtonBoundingClientRect?.()
    if (menu && menu.left) {
      const sys = uni.getSystemInfoSync()
      const rightPx = sys.windowWidth - menu.left + 8
      const rpx = Math.ceil((rightPx / sys.windowWidth) * 750)
      if (rpx > 0) navbarRightRpx.value = Math.min(rpx, 280)
    }
  } catch (_) {}
  // #endif
})
</script>

<template>
  <view class="cust-home">
    <!-- 固定顶栏：与小程序标题头一行对齐，留出状态栏+标题栏空间 -->
    <view class="custom-navbar" :class="{ scrolled }">
      <view class="navbar-content" :style="{ paddingRight: `calc(12rpx + ${navbarRightRpx}rpx)` }">
        <view class="logo-section" @click="scrollToTop">
          <view class="logo-box">
            <text class="logo-text">10X</text>
          </view>
          <text class="logo-title">智慧成长</text>
        </view>
        <view class="navbar-actions">
          <view class="action-btn" @click="toSearch">
            <up-icon name="search" size="22" color="#475569" />
          </view>
          <view class="action-btn" @click="uni.switchTab({ url: '/pages/cust/msg' })">
            <up-icon name="bell" size="22" color="#475569" />
          </view>
        </view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="scroll-wrap"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 公告：横向滚动最小样式 -->
      <view v-if="noticeList.length" class="notice-bar" @click="toNoticeDetail(noticeList[0])">
        <up-icon name="volume-fill" color="#ea580c" size="12" />
        <scroll-view scroll-x class="notice-scroll" :show-scrollbar="false">
          <text class="notice-text">{{ noticeList[0].title }}</text>
        </scroll-view>
        <up-icon name="arrow-right" size="12" color="#fb923c" />
      </view>

      <!-- 快速入口 -->
      <view class="quick-actions">
        <view class="action-grid">
          <view class="action-item" @click="toGrowth">
            <view class="action-icon growth">🗺️</view>
            <text class="action-label">成长地图</text>
          </view>
          <view class="action-item" @click="toGrowth">
            <view class="action-icon knowledge">📚</view>
            <text class="action-label">知识库</text>
          </view>
          <view class="action-item" @click="handleCommunity">
            <view class="action-icon community">👥</view>
            <text class="action-label">社区</text>
          </view>
          <view class="action-item" @click="toEventsList">
            <view class="action-icon events">🎯</view>
            <text class="action-label">活动</text>
          </view>
        </view>
      </view>

      <!-- 近期热门 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title-group">
            <text class="section-title">近期热门</text>
            <text class="section-subtitle">Trending</text>
          </view>
          <text class="section-action" @click="toEventsList">更多</text>
        </view>
        <view v-if="loading && !eventList.length" class="loading-wrap">
          <up-loading-icon mode="circle" size="40" />
          <text class="loading-text">加载中...</text>
        </view>
        <scroll-view v-else scroll-x class="courses-scroll" :show-scrollbar="false" enhanced>
          <view class="courses-list">
            <view
              v-for="e in eventList"
              :key="e.id"
              class="course-card"
              @click="toEventDetail(e)"
            >
              <image
                v-if="e.coverImageUrl"
                class="course-image"
                :src="addBaseUrl(e.coverImageUrl)"
                mode="aspectFill"
                lazy-load
              />
              <view v-else class="course-image course-image-placeholder" />
              <view class="course-overlay" />
              <view class="course-badges">
                <text class="badge-primary">报名中</text>
                <text class="badge-secondary">{{ (e.city && String(e.city).trim()) ? e.city : '线下' }}</text>
              </view>
              <view class="course-info">
                <text class="course-title">{{ e.title }}</text>
                <view class="course-meta">
                  <up-icon name="calendar" size="12" color="rgba(255,255,255,0.7)" />
                  <text class="course-date">{{ formatEventDate(e.startTime) }}</text>
                </view>
                <view class="course-footer">
                  <text class="course-price">￥{{ e.eventPrice != null ? e.eventPrice : 0 }}</text>
                  <view class="course-arrow">
                    <up-icon name="arrow-right" size="20" color="#fff" />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-if="!loading && !eventList.length" class="empty-tip">暂无活动</view>
        </scroll-view>
      </view>

      <!-- 进行中的活动 -->
      <view class="section" v-if="ongoingEvent">
        <view class="section-header">
          <view class="section-title-group">
            <text class="section-title">进行中的活动</text>
            <text class="section-subtitle">Happening Now</text>
          </view>
        </view>
        <view class="activity-card" @click="toOngoingEvent">
          <view class="activity-time-box">
            <text class="activity-time">{{ formatEventDate(ongoingEvent.startTime).slice(5) || '--' }}</text>
            <view class="activity-dot" />
          </view>
          <view class="activity-content">
            <text class="activity-title">{{ ongoingEvent.title }}</text>
            <view class="activity-meta">
              <up-icon name="account" size="10" color="#94a3b8" />
              <text class="activity-count">{{ ongoingEvent.registeredCount != null ? ongoingEvent.registeredCount : 0 }} 人已报名</text>
            </view>
          </view>
          <view class="activity-action">
            <up-button type="primary" size="small" text="查看详情" customStyle="border-radius: 16rpx; font-size: 20rpx; padding: 16rpx 32rpx" />
          </view>
        </view>
      </view>

      <!-- 知识库全景 -->
      <view class="knowledge-banner" @click="toGrowth">
        <view class="banner-content">
          <view class="banner-header">
            <view class="banner-icon">
              <up-icon name="file-text" size="40" color="#fff" />
            </view>
            <text class="banner-title">知识库全景</text>
          </view>
          <text class="banner-desc">深度链接人与知识，让每一次成长都有迹可循。</text>
          <view class="banner-tags">
            <text v-for="t in ['蛋壳理论', '利他系统', '七圣境', '认知跃迁']" :key="t" class="tag">#{{ t }}</text>
          </view>
          <up-button type="primary" text="开启探索" block customStyle="border-radius: 48rpx; margin-top: 32rpx; font-size: 28rpx; font-weight: bold" />
        </view>
        <view class="banner-bg" />
      </view>

      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.cust-home {
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
}

.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s;
  background: transparent;
  /* 状态栏 + 小程序标题栏整行 + 约 24rpx 间距，让自定义顶栏整体落在胶囊按钮下方一行 */
  padding-top: calc(env(safe-area-inset-top) + 72rpx);

  &.scrolled {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20rpx);
    box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.05);
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 72rpx;
    padding: 10rpx 32rpx 10rpx;
    /* 预留微信右上角胶囊区域，避免搜索/消息图标被遮挡（具体值由 navbarRightRpx 动态设置） */

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .logo-box {
        width: 60rpx;
        height: 60rpx;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.3);

        .logo-text {
          color: #fff;
          font-size: 22rpx;
          font-weight: 900;
        }
      }

      .logo-title {
        font-size: 32rpx;
        font-weight: 900;
        color: #0f172a;
      }
    }

    .navbar-actions {
      display: flex;
      gap: 12rpx;

      .action-btn {
        width: 56rpx;
        height: 56rpx;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.scroll-wrap {
  height: 100vh;
  /* 避开顶栏：状态栏 + 标题栏 + 自定义栏高 */
  padding-top: calc(env(safe-area-inset-top) + 88rpx + 72rpx + 40rpx);
  padding-bottom: env(safe-area-inset-bottom);
}

.notice-bar {
  margin: 6rpx 32rpx 10rpx;
  padding: 8rpx 10rpx;
  background: #fff7ed;
  border: 1rpx solid #fed7aa;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 56rpx;
}

.notice-scroll {
  flex: 1;
  white-space: nowrap;
  max-width: 100%;
}

.notice-bar .notice-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #9a3412;
  display: inline-block;
  padding-right: 24rpx;
}

.quick-actions {
  margin: 0 40rpx 24rpx;

  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;

      .action-icon {
        width: 96rpx;
        height: 96rpx;
        border-radius: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 56rpx;

        &.growth {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }

        &.knowledge {
          background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
        }

        &.community {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        &.events {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        }
      }

      .action-label {
        font-size: 22rpx;
        font-weight: 600;
        color: #475569;
      }
    }
  }
}

.section {
  margin: 48rpx 0;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 48rpx 32rpx;

    .section-title-group {
      .section-title {
        display: block;
        font-size: 44rpx;
        font-weight: 900;
        color: #0f172a;
        line-height: 1;
        margin-bottom: 8rpx;
      }

      .section-subtitle {
        display: block;
        font-size: 20rpx;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    }

    .section-action {
      font-size: 24rpx;
      font-weight: 700;
      color: #6366f1;
      padding: 12rpx 24rpx;
      background: #eef2ff;
      border-radius: 40rpx;
    }
  }
}

.loading-wrap {
  padding: 60rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #94a3b8;
}

.courses-scroll {
  white-space: nowrap;
}

.courses-list {
  display: inline-flex;
  gap: 40rpx;
  padding: 0 48rpx;
}

.course-card {
  position: relative;
  width: 520rpx;
  height: 520rpx;
  border-radius: 40rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);
  border: 1rpx solid rgba(0, 0, 0, 0.04);

  .course-image {
    width: 100%;
    height: 100%;
    background: #f1f5f9;
  }

  .course-image-placeholder {
    background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
  }

  .course-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.05) 55%, transparent 100%);
  }

  .course-badges {
    position: absolute;
    top: 32rpx;
    left: 32rpx;
    display: flex;
    gap: 16rpx;

    .badge-primary {
      padding: 12rpx 24rpx;
      background: #6366f1;
      color: #fff;
      font-size: 20rpx;
      font-weight: 700;
      border-radius: 40rpx;
    }

    .badge-secondary {
      padding: 12rpx 24rpx;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 20rpx;
      font-weight: 600;
      border-radius: 40rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.2);
    }
  }

  .course-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 32rpx 28rpx;
    color: #fff;

    .course-title {
      display: block;
      font-size: 34rpx;
      font-weight: 800;
      margin-bottom: 12rpx;
      line-height: 1.25;
    }

    .course-meta {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-bottom: 24rpx;
      opacity: 0.8;

      .course-date {
        font-size: 24rpx;
        font-weight: 500;
      }
    }

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .course-price {
        font-size: 36rpx;
        font-weight: 900;
      }

      .course-arrow {
        width: 64rpx;
        height: 64rpx;
        background: #fff;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.empty-tip {
  display: inline-block;
  padding: 80rpx 48rpx;
  font-size: 28rpx;
  color: #94a3b8;
}

.activity-card {
  margin: 0 40rpx 20rpx;
  padding: 36rpx 40rpx;
  background: #fff;
  border-radius: 40rpx;
  border: 1rpx solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(15, 23, 42, 0.04);

  .activity-time-box {
    position: relative;
    width: 112rpx;
    height: 112rpx;
    background: #eef2ff;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .activity-time {
      font-size: 24rpx;
      font-weight: 900;
      color: #6366f1;
    }

    .activity-dot {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 12rpx;
      height: 12rpx;
      background: #ef4444;
      border-radius: 50%;
    }
  }

  .activity-content {
    flex: 1;

    .activity-title {
      display: block;
      font-size: 28rpx;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12rpx;
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .activity-count {
        font-size: 20rpx;
        font-weight: 600;
        color: #94a3b8;
      }
    }
  }
}

.knowledge-banner {
  margin: 36rpx 40rpx;
  padding: 56rpx 48rpx;
  background: linear-gradient(145deg, #1e293b 0%, #334155 100%);
  border-radius: 40rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.12);

  .banner-bg {
    position: absolute;
    right: -100rpx;
    bottom: -100rpx;
    width: 360rpx;
    height: 360rpx;
    background: rgba(99, 102, 241, 0.15);
    border-radius: 50%;
    filter: blur(80rpx);
  }

  .banner-content {
    position: relative;
    z-index: 1;
    color: #fff;

    .banner-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 24rpx;

      .banner-icon {
        width: 64rpx;
        height: 64rpx;
        background: rgba(99, 102, 241, 0.9);
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .banner-title {
        font-size: 34rpx;
        font-weight: 800;
      }
    }

    .banner-desc {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.55;
      margin-bottom: 24rpx;
    }

    .banner-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;

      .tag {
        padding: 10rpx 24rpx;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 32rpx;
        font-size: 22rpx;
        font-weight: 600;
        border: 1rpx solid rgba(255, 255, 255, 0.08);
      }
    }
  }
}

.safe-bottom {
  height: 180rpx;
}
</style>
