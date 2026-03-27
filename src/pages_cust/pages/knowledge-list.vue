<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

declare const uni: any
import { listCustTags, listKnowledgecontent } from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'
import { safeDecodeURIComponent } from '@/utils/querystring'

const list = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10

const keyword = ref('')
const tagFilter = ref('')
const contentType = ref('')
const categoryLabel = ref('')

const pageTitle = ref('内容列表')
const tagKeyword = ref('')
const tagOptions = ref<any[]>([])
const selectedTagName = ref('')
const showTagPicker = ref(false)

function applyRouteQuery() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const q = (page && page.options) || {}
  contentType.value = q.contentType ? safeDecodeURIComponent(String(q.contentType)) : ''
  tagFilter.value = q.tag ? safeDecodeURIComponent(String(q.tag)) : ''
  keyword.value = q.keyword ? safeDecodeURIComponent(String(q.keyword)) : ''
  selectedTagName.value = tagFilter.value
  const mode = q.mode ? String(q.mode) : ''
  if (mode === 'quote') {
    pageTitle.value = '共鸣金句'
    categoryLabel.value = '金句'
  } else if (mode === 'topic' || contentType.value === 'WIKI') {
    pageTitle.value = '话题 Wiki'
    categoryLabel.value = '话题'
  } else if (mode === 'tool' || contentType.value === 'TOOL') {
    pageTitle.value = '工具库'
    categoryLabel.value = '工具'
  } else {
    pageTitle.value = '知识内容'
    categoryLabel.value = ''
  }
}

function formatTime(v: any) {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}:{s}')
}

async function loadTagOptions() {
  try {
    const res: any = await listCustTags({
      pageNum: 1,
      pageSize: 100,
      name: tagKeyword.value.trim()
    })
    tagOptions.value = Array.isArray(res?.rows) ? res.rows : []
  } catch (_) {
    tagOptions.value = []
  }
}

function pickTag(row: any) {
  const name = row?.name == null ? '' : String(row.name).trim()
  if (!name) return
  selectedTagName.value = name
  tagFilter.value = name
  showTagPicker.value = false
  search()
}

function clearTag() {
  selectedTagName.value = ''
  tagFilter.value = ''
  search()
}

function toDetail(row: any) {
  const rid = row?.id == null ? '' : String(row.id)
  if (!rid) return
  const t = String(row.contentType || '').toUpperCase()
  if (t === 'TOOL') {
    uni.navigateTo({ url: `/pages_cust/pages/tool-detail?id=${rid}` })
    return
  }
  uni.navigateTo({ url: `/pages_cust/pages/topic-detail?id=${rid}` })
}

async function search() {
  pageNum.value = 1
  finished.value = false
  list.value = []
  await loadMore()
}

async function loadMore() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const params: any = {
      pageNum: pageNum.value,
      pageSize,
      bizStatus: 'PUBLISHED'
    }
    if (contentType.value) params.contentType = contentType.value
    const res: any = await listKnowledgecontent(params)
    let rows = Array.isArray(res?.rows) ? res.rows : []
    if (keyword.value.trim()) {
      const k = keyword.value.trim().toLowerCase()
      rows = rows.filter(
        (r: any) =>
          String(r.title || '')
            .toLowerCase()
            .includes(k) || String(r.subtitle || '').toLowerCase().includes(k)
      )
    }
    if (tagFilter.value.trim()) {
      const needle = tagFilter.value.trim().toLowerCase()
      rows = rows.filter((r: any) => String(r.tags || '').toLowerCase().includes(needle))
    }
    if (pageNum.value === 1) list.value = []
    list.value = [...list.value, ...rows]
    if (rows.length < pageSize) finished.value = true
    else pageNum.value += 1
  } catch (_) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

onShow(() => {
  applyRouteQuery()
  uni.setNavigationBarTitle({ title: pageTitle.value })
  search()
})
</script>

<template>
  <view class="knowledge-list-page">
    <view v-if="categoryLabel" class="cat-strip">分类：{{ categoryLabel }}</view>
    <view class="filters">
      <input
        v-model="keyword"
        class="inp"
        placeholder="标题关键词"
        placeholder-style="color:#94a3b8;font-size:26rpx;"
        confirm-type="search"
        @confirm="search"
      />
      <view class="tag-row">
        <view class="tag-display" @click="showTagPicker = !showTagPicker; if (showTagPicker) loadTagOptions()">
          <text class="tag-display-text">{{ selectedTagName || '选择标签筛选' }}</text>
          <text class="tag-display-action">{{ showTagPicker ? '收起' : '选择' }}</text>
        </view>
        <text v-if="selectedTagName" class="tag-clear" @click="clearTag">清除</text>
      </view>
      <view v-if="showTagPicker" class="tag-panel">
        <view class="tag-search">
          <input
            v-model="tagKeyword"
            class="tag-inp"
            placeholder="搜索标签"
            placeholder-style="color:#94a3b8;font-size:24rpx;"
            confirm-type="search"
            @confirm="loadTagOptions"
          />
          <text class="tag-search-btn" @click="loadTagOptions">搜</text>
        </view>
        <view class="tag-chips">
          <view v-for="opt in tagOptions" :key="String(opt.id)" class="chip" @click="pickTag(opt)">
            {{ String(opt.name || '') }}
          </view>
          <view v-if="!tagOptions.length" class="empty-tags">无匹配标签</view>
        </view>
      </view>
      <view class="search-btn" @click="search">检索</view>
    </view>
    <scroll-view scroll-y class="scroll" lower-threshold="100" @scrolltolower="loadMore">
      <view v-for="row in list" :key="String(row.id)" class="row" @click="toDetail(row)">
        <text class="row-title">{{ row.title || '未命名' }}</text>
        <view class="row-meta">
          <text class="meta">作者 ID {{ row.authorId != null ? String(row.authorId) : '—' }}</text>
          <text class="meta">{{ formatTime(row.publishTime || row.createTime) }}</text>
          <text class="meta">浏览 {{ row.viewCount ?? 0 }}</text>
        </view>
      </view>
      <view v-if="!loading && !list.length" class="empty">暂无内容，试试调整筛选条件</view>
      <view v-if="loading" class="hint">加载中…</view>
      <view v-else-if="!finished && list.length" class="hint">上拉加载更多</view>
      <view v-else-if="finished && list.length" class="hint">已加载全部</view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.knowledge-list-page {
  min-height: 100vh;
  background: #f8fafc;
}
.cat-strip {
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  font-weight: 800;
  color: #4f46e5;
  background: #eef2ff;
  border-bottom: 1rpx solid #e0e7ff;
}
.filters {
  padding: 20rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f1f5f9;
}
.inp {
  height: 80rpx;
  padding: 0 20rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  font-size: 28rpx;
  margin-bottom: 16rpx;
  box-sizing: border-box;
}
.tag-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.tag-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 22rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  border: 1rpx solid #e2e8f0;
}
.tag-display-text {
  font-size: 26rpx;
  color: #334155;
  font-weight: 700;
}
.tag-display-action {
  font-size: 22rpx;
  color: #4f46e5;
  font-weight: 900;
}
.tag-clear {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 800;
}
.tag-panel {
  margin-bottom: 16rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  background: #fff;
  border: 1rpx solid #e2e8f0;
}
.tag-search {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.tag-inp {
  flex: 1;
  height: 72rpx;
  padding: 0 16rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  font-size: 26rpx;
}
.tag-search-btn {
  font-size: 24rpx;
  font-weight: 900;
  color: #4f46e5;
}
.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.chip {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #eef2ff;
  color: #312e81;
  font-size: 22rpx;
  font-weight: 800;
  border: 1rpx solid #e0e7ff;
}
.empty-tags {
  font-size: 22rpx;
  color: #94a3b8;
}
.search-btn {
  text-align: center;
  padding: 20rpx;
  background: #4f46e5;
  color: #fff;
  font-weight: 800;
  border-radius: 20rpx;
  font-size: 28rpx;
}
.scroll {
  height: calc(100vh - 380rpx);
  padding: 16rpx 24rpx 48rpx;
  box-sizing: border-box;
}
.row {
  background: #fff;
  border-radius: 28rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #f1f5f9;
}
.row-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
}
.row-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 24rpx;
  margin-top: 16rpx;
}
.meta {
  font-size: 22rpx;
  color: #94a3b8;
  font-weight: 600;
}
.empty,
.hint {
  text-align: center;
  color: #94a3b8;
  font-size: 24rpx;
  padding: 40rpx 0;
  font-weight: 600;
}
</style>
