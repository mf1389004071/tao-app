<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listKnowledgecontent } from '@/api/cust'

const keyword = ref('')
const isSearching = ref(false)
const activeTab = ref<'all' | 'knowledge'>('all')
const searchHistory = ref<string[]>([])
const hotTags = ref(['蛋壳理论', '七圣境', '利他系统', '认知跃迁', '把自己产品化'])
const knowledgeResults = ref<any[]>([])
const searchLoading = ref(false)

const SEARCH_HISTORY_KEY = 'cust_search_history'
const MAX_HISTORY = 10

function loadSearchHistory() {
  try {
    const raw = uni.getStorageSync(SEARCH_HISTORY_KEY)
    searchHistory.value = Array.isArray(raw) ? raw : []
  } catch {
    searchHistory.value = []
  }
}

function saveSearchHistory(k: string) {
  const trim = (k || '').trim()
  if (!trim) return
  let list = searchHistory.value.filter((item: string) => item !== trim)
  list.unshift(trim)
  list = list.slice(0, MAX_HISTORY)
  searchHistory.value = list
  try {
    uni.setStorageSync(SEARCH_HISTORY_KEY, list)
  } catch (_) {}
}

function clearHistory() {
  searchHistory.value = []
  try {
    uni.removeStorageSync(SEARCH_HISTORY_KEY)
  } catch (_) {}
}

function performSearch() {
  const q = keyword.value.trim()
  if (!q) {
    isSearching.value = false
    knowledgeResults.value = []
    return
  }
  isSearching.value = true
  searchLoading.value = true
  saveSearchHistory(q)
  listKnowledgecontent({
    pageNum: 1,
    pageSize: 20,
    title: q,
    bizStatus: 'PUBLISHED'
  })
    .then((res: any) => {
      if (res && res.rows) {
        knowledgeResults.value = res.rows
      } else {
        knowledgeResults.value = []
      }
    })
    .catch(() => {
      knowledgeResults.value = []
    })
    .finally(() => {
      searchLoading.value = false
    })
}

function handleSearch() {
  if (!keyword.value.trim()) return
  performSearch()
}

function handleInput(e: any) {
  const v = (e.detail && e.detail.value != null) ? e.detail.value : (e.target && e.target.value != null) ? e.target.value : ''
  keyword.value = typeof v === 'string' ? v : ''
  if (keyword.value.trim()) {
    isSearching.value = true
    performSearch()
  } else {
    isSearching.value = false
    knowledgeResults.value = []
  }
}

function searchByHistory(item: string) {
  keyword.value = item
  isSearching.value = true
  performSearch()
}

function searchByTag(tag: string) {
  keyword.value = tag
  isSearching.value = true
  performSearch()
}

function clearKeyword() {
  keyword.value = ''
  isSearching.value = false
  knowledgeResults.value = []
}

function switchTab(tab: 'all' | 'knowledge') {
  activeTab.value = tab
}

function goBack() {
  uni.navigateBack()
}

function goToDetail(item: any) {
  const id = item.id
  if (item.contentType === 'TOOL' || item.contentType === 'TOOLBOX') {
    uni.navigateTo({ url: `/pages/cust/tool-detail?id=${id}` })
  } else {
    uni.navigateTo({ url: `/pages/cust/topic-detail?id=${id}` })
  }
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  loadSearchHistory()
})
</script>

<template>
  <view class="search-page">
    <!-- 搜索栏（系统导航已显示「搜索」+ 返回） -->
    <view class="search-bar-wrap">
      <view class="search-box">
        <up-icon name="search" size="20" color="#94a3b8" />
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索话题、金句、伙伴..."
          confirm-type="search"
          @confirm="handleSearch"
          @input="handleInput"
        />
        <view v-if="keyword" class="clear-btn" @click="clearKeyword">
          <up-icon name="close" size="16" color="#94a3b8" />
        </view>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view v-if="!keyword && searchHistory.length > 0" class="block search-history">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <text class="clear-history" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <text
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-tag"
          @click="searchByHistory(item)"
        >{{ item }}</text>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view v-if="!keyword && !isSearching" class="block hot-search">
      <view class="section-header">
        <text class="section-title">热门搜索</text>
      </view>
      <view class="hot-tags">
        <text
          v-for="(tag, index) in hotTags"
          :key="index"
          class="hot-tag"
          @click="searchByTag(tag)"
        >{{ tag }}</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="keyword && isSearching" class="search-results">
      <view class="result-tabs">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'all' }"
          @click="switchTab('all')"
        >
          <text>全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'knowledge' }"
          @click="switchTab('knowledge')"
        >
          <text>知识</text>
        </view>
      </view>

      <view class="result-list">
        <view v-if="searchLoading" class="loading-wrap">
          <up-loading-icon mode="circle" size="36" />
          <text class="loading-text">搜索中...</text>
        </view>
        <template v-else>
          <view
            v-for="item in knowledgeResults"
            :key="item.id"
            class="result-item"
            @click="goToDetail(item)"
          >
            <text class="result-title">{{ item.title }}</text>
            <text class="result-summary">{{ item.subtitle || item.aiSummary || item.slogan || '' }}</text>
            <view class="result-meta">
              <text class="result-time">{{ formatTime(item.publishTime || item.createTime) }}</text>
              <text v-if="item.viewCount != null" class="result-views">{{ item.viewCount }} 阅读</text>
            </view>
          </view>
          <view v-if="!searchLoading && knowledgeResults.length === 0" class="empty-state">
            <up-icon name="search" size="120" color="#cbd5e1" />
            <text class="empty-text">暂无搜索结果</text>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 24rpx;
}

.search-bar-wrap {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 0 32rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f1f5f9;

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 20rpx 28rpx;
    background: #f8fafc;
    border-radius: 40rpx;

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #1e293b;
    }

    .clear-btn {
      padding: 8rpx;
    }
  }

  .cancel-btn {
    font-size: 28rpx;
    color: #6366f1;
    font-weight: 600;
  }
}

.block {
  padding: 32rpx 48rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 900;
    color: #0f172a;
  }

  .clear-history {
    font-size: 24rpx;
    color: #94a3b8;
  }
}

.history-tags,
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag,
.hot-tag {
  padding: 16rpx 32rpx;
  background: #fff;
  border-radius: 40rpx;
  font-size: 26rpx;
  color: #475569;
  border: 2rpx solid #f1f5f9;
}

.search-results {
  .result-tabs {
    display: flex;
    padding: 0 48rpx;
    background: #fff;
    border-bottom: 2rpx solid #f1f5f9;

    .tab-item {
      padding: 24rpx 32rpx;
      font-size: 28rpx;
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 4rpx solid transparent;

      &.active {
        color: #6366f1;
        border-bottom-color: #6366f1;
      }
    }
  }

  .result-list {
    padding: 32rpx 48rpx;
  }

  .loading-wrap {
    padding: 60rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;
  }

  .loading-text {
    font-size: 26rpx;
    color: #94a3b8;
  }

  .result-item {
    padding: 32rpx;
    background: #fff;
    border-radius: 48rpx;
    margin-bottom: 24rpx;
    border: 2rpx solid #f1f5f9;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);

    .result-title {
      display: block;
      font-size: 32rpx;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12rpx;
    }

    .result-summary {
      display: block;
      font-size: 26rpx;
      color: #64748b;
      margin-bottom: 16rpx;
      line-height: 1.6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .result-meta {
      display: flex;
      gap: 24rpx;
      font-size: 22rpx;
      color: #94a3b8;
    }
  }

  .empty-state {
    padding: 120rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;

    .empty-text {
      font-size: 28rpx;
      color: #cbd5e1;
    }
  }
}
</style>
