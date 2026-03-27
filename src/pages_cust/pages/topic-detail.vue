<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  addKnowledgeComment,
  addKnowledgeShare,
  addKnowledgeView,
  getKnowledgeActionStatus,
  getKnowledgecontent,
  listKnowledgeComments,
  listKnowledgecontent,
  toggleKnowledgeAction
} from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'

declare const uni: any

const id = ref('')
const detail = ref<any>({})
const relatedTool = ref<any>(null)
const social = ref({
  likeCount: 0,
  collectCount: 0,
  shareCount: 0,
  commentCount: 0,
  viewCount: 0,
  liked: false,
  collected: false
})

const commentList = ref<any[]>([])
const commentTree = ref<any[]>([])
const commentTotal = ref(0)
const commentText = ref('')
const commentLoading = ref(false)
const replyingTo = ref<{ id: string; label: string } | null>(null)
const socialBusy = ref(false)

const contentId = computed(() => (detail.value?.id == null ? '' : String(detail.value.id)))

const tagList = computed(() =>
  String(detail.value?.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
)

const relatedToolTags = computed(() =>
  String(relatedTool.value?.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
)

function openTopicListByTag(t: string) {
  uni.navigateTo({
    url: `/pages_cust/pages/knowledge-list?mode=topic&contentType=WIKI&tag=${encodeURIComponent(t)}`
  })
}

function openToolListByTag(t: string) {
  uni.navigateTo({
    url: `/pages_cust/pages/knowledge-list?mode=tool&contentType=TOOL&tag=${encodeURIComponent(t)}`
  })
}

function toUserPublic(uid: any) {
  if (uid == null || uid === '') return
  uni.navigateTo({ url: `/pages_cust/pages/user-public?userId=${encodeURIComponent(String(uid))}` })
}

function pickRelatedTool(d: any, rows: any[]) {
  if (!rows.length) return null
  const topicTags = String(d?.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!topicTags.length) return rows[0]
  for (const r of rows) {
    const rt = String(r.tags || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (rt.some((t) => topicTags.includes(t))) return r
  }
  return rows[0]
}

async function loadRelatedTool() {
  try {
    const res: any = await listKnowledgecontent({
      pageNum: 1,
      pageSize: 40,
      contentType: 'TOOL',
      bizStatus: 'PUBLISHED'
    })
    const rows = Array.isArray(res?.rows) ? res.rows : []
    relatedTool.value = pickRelatedTool(detail.value, rows)
  } catch (_) {
    relatedTool.value = null
  }
}

function formatDateTime(v: any): string {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}:{s}')
}

function buildCommentTree(rows: any[]): any[] {
  const list = Array.isArray(rows) ? rows : []
  const byId: Record<string, any> = {}
  list.forEach((r) => {
    const id = r && r.id != null ? String(r.id) : ''
    if (!id) return
    byId[id] = { ...r, children: [] as any[] }
  })
  const roots: any[] = []
  list.forEach((r) => {
    const id = r && r.id != null ? String(r.id) : ''
    if (!id || !byId[id]) return
    const pid = r.parentId == null || r.parentId === '' ? '' : String(r.parentId)
    if (!pid || !byId[pid]) roots.push(byId[id])
    else byId[pid].children.push(byId[id])
  })
  return roots
}

function flattenCommentTree(nodes: any[], depth = 0): any[] {
  const out: any[] = []
  ;(nodes || []).forEach((n) => {
    out.push({ ...n, _depth: depth })
    if (n.children && n.children.length) out.push(...flattenCommentTree(n.children, depth + 1))
  })
  return out
}

const flatComments = computed(() => flattenCommentTree(commentTree.value))

function syncSocialFromDetail() {
  social.value.likeCount = Number(detail.value?.likeCount ?? 0)
  social.value.collectCount = Number(detail.value?.collectCount ?? 0)
  social.value.shareCount = Number(detail.value?.shareCount ?? 0)
  social.value.commentCount = Number(detail.value?.commentCount ?? 0)
  social.value.viewCount = Number(detail.value?.viewCount ?? 0)
}

async function addViewOnce() {
  if (!contentId.value) return
  try {
    const res: any = await addKnowledgeView({ contentId: contentId.value })
    const vc = res?.data?.viewCount
    if (vc != null) social.value.viewCount = Number(vc) || 0
  } catch (_) {}
}

async function loadComments() {
  if (!contentId.value) return
  commentLoading.value = true
  try {
    const res: any = await listKnowledgeComments({ pageNum: 1, pageSize: 100, contentId: contentId.value })
    const rows = Array.isArray(res?.rows) ? res.rows : []
    rows.sort((a: any, b: any) => {
      const ta = Date.parse(String(a.createTime || '')) || 0
      const tb = Date.parse(String(b.createTime || '')) || 0
      return ta - tb
    })
    commentList.value = rows
    commentTree.value = buildCommentTree(rows)
    commentTotal.value = Number(res?.total ?? commentList.value.length) || 0
  } catch (_) {
    commentList.value = []
    commentTree.value = []
    commentTotal.value = 0
  } finally {
    commentLoading.value = false
  }
}

async function loadActionStatus() {
  if (!contentId.value) return
  try {
    const res: any = await getKnowledgeActionStatus({ contentId: contentId.value })
    if (res && res.data) {
      social.value.liked = Boolean(res.data.liked)
      social.value.collected = Boolean(res.data.collected)
    }
  } catch (_) {}
}

async function submitComment() {
  if (!contentId.value) return
  if (!commentText.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  try {
    const payload: any = { contentId: contentId.value, content: commentText.value.trim() }
    if (replyingTo.value && replyingTo.value.id) payload.parentId = replyingTo.value.id
    const res: any = await addKnowledgeComment(payload)
    const cc = res?.data?.commentCount
    if (cc != null) social.value.commentCount = Number(cc) || social.value.commentCount
    commentText.value = ''
    replyingTo.value = null
    uni.showToast({ title: '评论成功', icon: 'success' })
    loadComments()
  } catch (_) {
    uni.showToast({ title: '评论失败，请检查登录状态', icon: 'none' })
  }
}

function startReply(c: any) {
  const id = c && c.id != null ? String(c.id) : ''
  if (!id) return
  const label = c.userId != null ? `用户${String(c.userId).slice(-4)}` : '该评论'
  replyingTo.value = { id, label }
}

function cancelReply() {
  replyingTo.value = null
}

function scrollToComments() {
  const q = uni.createSelectorQuery()
  q.select('#comment-anchor').boundingClientRect()
  q.selectViewport().scrollOffset()
  q.exec((res: any) => {
    const rect = res && res[0]
    const scroll = res && res[1]
    if (!rect || !scroll) return
    const nextTop = scroll.scrollTop + rect.top - 24
    uni.pageScrollTo({ scrollTop: nextTop < 0 ? 0 : nextTop, duration: 280 })
  })
}

async function toggleLike() {
  if (!contentId.value || socialBusy.value) return
  socialBusy.value = true
  try {
    const res: any = await toggleKnowledgeAction({ contentId: contentId.value, actionType: 'LIKE' })
    social.value.liked = Boolean(res?.data?.enabled)
    if (res?.data?.likeCount != null) social.value.likeCount = Number(res.data.likeCount) || 0
  } catch (_) {
    uni.showToast({ title: '操作失败，请检查登录状态', icon: 'none' })
  } finally {
    socialBusy.value = false
  }
}

async function toggleCollect() {
  if (!contentId.value || socialBusy.value) return
  socialBusy.value = true
  try {
    const res: any = await toggleKnowledgeAction({ contentId: contentId.value, actionType: 'COLLECT' })
    social.value.collected = Boolean(res?.data?.enabled)
    if (res?.data?.collectCount != null) social.value.collectCount = Number(res.data.collectCount) || 0
  } catch (_) {
    uni.showToast({ title: '操作失败，请检查登录状态', icon: 'none' })
  } finally {
    socialBusy.value = false
  }
}

async function onShareClick() {
  if (!contentId.value) return
  try {
    const res: any = await addKnowledgeShare({ contentId: contentId.value })
    if (res?.data?.shareCount != null) social.value.shareCount = Number(res.data.shareCount) || 0
  } catch (_) {}
}

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
        getKnowledgecontent(id.value)
      .then((res: any) => {
        if (res && res.data) {
          detail.value = res.data
          syncSocialFromDetail()
          addViewOnce()
          loadActionStatus()
          loadComments()
          loadRelatedTool()
        }
      })
      .catch(() => {})
  }
})

function toToolDetail() {
  if (!relatedTool.value?.id) return
  uni.navigateTo({ url: `/pages_cust/pages/tool-detail?id=${String(relatedTool.value.id)}` })
}

function toPublish() {
  // tabbar 页面必须用 switchTab
  uni.switchTab({ url: '/pages/cust/publish' })
}

function openDoc() {
  const docUrl = detail.value?.text2 ? String(detail.value.text2) : ''
  if (!docUrl) {
    uni.showToast({ title: '暂无资料下载链接', icon: 'none' })
    return
  }
  uni.setClipboardData({ data: docUrl })
  uni.showToast({ title: '资料链接已复制', icon: 'success' })
}
</script>

<template>
  <view class="cust-topic-detail">
    <view class="hero">
      <view class="hero-content">
        <text class="topic-title">{{ detail.title }}</text>
        <view class="topic-tags">
          <view
            v-for="t in tagList"
            :key="t"
            class="tag tap"
            @click.stop="openTopicListByTag(t)"
          >
            <text>#{{ t }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="body">
      <view class="wiki-card">
        <text class="wiki-label">官方解读</text>
        <text class="wiki-desc">{{ detail.content || detail.promotionalText || '暂无官方解读' }}</text>
        <view class="wiki-meta">
          <text class="meta-item">发布：{{ formatDateTime(detail.publishTime || detail.createTime) || '—' }}</text>
          <text class="meta-item">浏览：{{ social.viewCount }}</text>
        </view>
        <view class="doc-link" @click="openDoc">
          <view class="doc-icon">
            <up-icon name="file-text" size="20" color="#4f46e5" />
          </view>
          <text class="doc-title">{{ detail.text3 || '实操手册' }}</text>
          <up-icon name="arrow-right" size="16" color="#a5b4fc" />
        </view>
      </view>

      <view v-if="relatedTool" class="section">
        <view class="section-head">
          <text class="section-title">关联工具库</text>
        </view>
        <view class="tool-item" @click="toToolDetail">
          <view class="tool-icon">
            <up-icon name="bulb" size="28" color="#f97316" />
          </view>
          <view class="tool-info">
            <text class="tool-name">{{ relatedTool.title || '工具箱' }}</text>
            <text class="tool-desc">{{ relatedTool.subtitle || relatedTool.aiSummary || '点击查看工具详情' }}</text>
            <view v-if="relatedToolTags.length" class="tool-tags">
              <text
                v-for="tg in relatedToolTags"
                :key="tg"
                class="tool-tag"
                @click.stop="openToolListByTag(tg)"
              >#{{ tg }}</text>
            </view>
          </view>
          <up-icon name="arrow-right" size="18" color="#e2e8f0" />
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">共创实修案例</text>
          <text class="section-action" @click="toPublish">我要投稿</text>
        </view>
        <view class="case-card">
          <view class="case-header">
            <view class="case-avatar" />
            <view>
              <text class="case-user">学员_021</text>
              <text class="case-time">2小时前 · 广东深圳</text>
            </view>
          </view>
          <text class="case-content">「{{ detail.aiSummary || detail.promotionalText || '欢迎提交你的实修案例，共建知识网络。' }}」</text>
          <view class="case-actions">
            <view class="action-item" @click.stop="toggleLike">
              <text class="action-ico">{{ social.liked ? '❤️' : '🤍' }}</text>
              <text class="action-txt">{{ social.likeCount }}</text>
            </view>
            <view class="action-item" @click.stop="scrollToComments">
              <text class="action-ico">💬</text>
              <text class="action-txt">{{ social.commentCount }}</text>
            </view>
            <view class="action-item">
              <text class="action-ico">👁</text>
              <text class="action-txt">{{ social.viewCount }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <text class="section-title">互动</text>
        </view>
        <view class="social-bar">
          <view class="social-btn" @click="toggleLike">
            <text class="b-ico">{{ social.liked ? '❤️' : '🤍' }}</text>
            <text class="b-txt">点赞 {{ social.likeCount }}</text>
          </view>
          <view class="social-btn" @click="toggleCollect">
            <text class="b-ico">{{ social.collected ? '⭐' : '☆' }}</text>
            <text class="b-txt">收藏 {{ social.collectCount }}</text>
          </view>
          <button class="social-btn share" open-type="share" @click="onShareClick">
            <text class="b-ico">↗</text>
            <text class="b-txt">分享 {{ social.shareCount }}</text>
          </button>
        </view>

        <view id="comment-anchor" class="comment-box">
          <text class="comment-title">评论（{{ commentTotal }}）</text>
          <view v-if="replyingTo" class="replying-hint">
            <text>回复 {{ replyingTo.label }}</text>
            <text class="cancel-reply" @click="cancelReply">取消</text>
          </view>
          <view class="comment-input-row">
            <input v-model="commentText" class="comment-input" :placeholder="replyingTo ? '输入回复…' : '写下你的想法…'" />
            <text class="comment-send" @click="submitComment">发送</text>
          </view>
          <view v-if="commentLoading" class="comment-hint">加载中...</view>
          <view v-else-if="!commentList.length" class="comment-hint">暂无评论</view>
          <view v-else class="comment-list">
            <view
              v-for="c in flatComments"
              :key="String(c.id)"
              class="comment-item"
              :style="{ marginLeft: (c._depth || 0) * 24 + 'rpx' }"
            >
              <view class="c-head">
                <text class="c-user" @click.stop="toUserPublic(c.userId)">用户 {{ String(c.userId || '').slice(-4) }}</text>
                <text class="c-time">{{ formatDateTime(c.createTime) }}</text>
              </view>
              <text class="c-content">{{ c.content }}</text>
              <text class="c-reply" @click.stop="startReply(c)">回复</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-topic-detail {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 80rpx;
}
.hero {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  padding: 24rpx 32rpx 80rpx;
  border-radius: 0 0 80rpx 80rpx;
  color: #fff;
}
.hero-content {
  text-align: center;
  padding-top: 24rpx;
}
.topic-title {
  font-size: 52rpx;
  font-weight: 800;
  display: block;
  margin-bottom: 24rpx;
}
.topic-tags {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
}
.tag {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 800;
}
.tag.tap:active {
  opacity: 0.85;
}
.replying-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  font-size: 22rpx;
  color: #64748b;
  font-weight: 700;
}
.cancel-reply {
  color: #4f46e5;
  font-weight: 900;
}
.c-reply {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #4f46e5;
  font-weight: 900;
}
.body {
  padding: 0 32rpx;
  margin-top: -48rpx;
  position: relative;
  z-index: 1;
}
.wiki-card {
  background: #fff;
  border-radius: 48rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #f1f5f9;
}
.wiki-label {
  font-size: 24rpx;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 24rpx;
}
.wiki-desc {
  font-size: 30rpx;
  color: #475569;
  line-height: 1.7;
  display: block;
  margin-bottom: 32rpx;
}
.wiki-meta {
  display: flex;
  gap: 18rpx;
  flex-wrap: wrap;
  margin-top: -12rpx;
  margin-bottom: 24rpx;
}
.wiki-meta .meta-item {
  font-size: 22rpx;
  font-weight: 700;
  color: #94a3b8;
}
.doc-link {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #eef2ff;
  border-radius: 32rpx;
}
.doc-icon {
  width: 72rpx;
  height: 72rpx;
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}
.doc-title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 800;
  color: #312e81;
}
.section {
  margin-bottom: 40rpx;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #0f172a;
}
.section-action {
  font-size: 26rpx;
  font-weight: 700;
  color: #4f46e5;
}
.tool-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: #fff;
  border-radius: 48rpx;
  border: 1rpx solid #f1f5f9;
}
.tool-icon {
  width: 96rpx;
  height: 96rpx;
  background: #fff7ed;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}
.tool-info {
  flex: 1;
}
.tool-name {
  font-size: 32rpx;
  font-weight: 800;
  color: #1e293b;
  display: block;
}
.tool-desc {
  font-size: 24rpx;
  color: #94a3b8;
  margin-top: 8rpx;
  display: block;
}
.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 12rpx;
}
.tool-tag {
  font-size: 20rpx;
  font-weight: 800;
  color: #4f46e5;
  padding: 6rpx 14rpx;
  background: #eef2ff;
  border-radius: 12rpx;
}
.tag.tap:active {
  opacity: 0.85;
}
.case-card {
  background: #fff;
  border-radius: 48rpx;
  padding: 40rpx;
  border: 1rpx solid #f1f5f9;
}
.case-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.case-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #e2e8f0;
  margin-right: 24rpx;
}
.case-user {
  font-size: 28rpx;
  font-weight: 800;
  color: #1e293b;
  display: block;
}
.case-time {
  font-size: 20rpx;
  color: #94a3b8;
  margin-top: 4rpx;
  display: block;
}
.case-content {
  font-size: 28rpx;
  color: #475569;
  line-height: 1.6;
  display: block;
  margin-bottom: 24rpx;
}
.case-actions {
  display: flex;
  gap: 32rpx;
  color: #cbd5e1;
  font-size: 24rpx;
  font-weight: 800;
  align-items: center;
}
.case-actions .action-item {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
}
.action-ico {
  font-size: 28rpx;
}
.action-txt {
  font-size: 24rpx;
}

.social-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.social-btn {
  height: 84rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 1rpx solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 0 12rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  font-weight: 800;
  color: #334155;
  outline: none;
}
.social-btn.share {
  line-height: 84rpx;
}
.b-ico {
  font-size: 26rpx;
}
.b-txt {
  font-size: 22rpx;
}

.comment-box {
  background: #fff;
  border-radius: 48rpx;
  padding: 28rpx;
  border: 1rpx solid #f1f5f9;
}
.comment-title {
  font-size: 28rpx;
  font-weight: 900;
  color: #0f172a;
  display: block;
  margin-bottom: 18rpx;
}
.comment-input-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 18rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  border: 1rpx solid #e2e8f0;
  margin-bottom: 18rpx;
}
.comment-input {
  flex: 1;
  font-size: 26rpx;
  color: #0f172a;
}
.comment-send {
  font-size: 24rpx;
  font-weight: 900;
  color: #4f46e5;
}
.comment-hint {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 700;
  padding: 14rpx 0;
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.comment-item {
  padding: 18rpx 16rpx;
  border-radius: 24rpx;
  background: #f8fafc;
  border: 1rpx solid #f1f5f9;
}
.c-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.c-user {
  font-size: 22rpx;
  font-weight: 900;
  color: #334155;
}
.c-time {
  font-size: 20rpx;
  font-weight: 700;
  color: #94a3b8;
}
.c-content {
  font-size: 26rpx;
  color: #0f172a;
  line-height: 1.6;
  display: block;
  white-space: pre-wrap;
}
</style>

<script lang="ts">
export default {
  onShareAppMessage() {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as any
    const id = (page?.options && page.options.id) ? String(page.options.id) : ''
    return {
      title: '话题内容',
      path: `/pages_cust/pages/topic-detail?id=${id}`
    }
  }
}
</script>
