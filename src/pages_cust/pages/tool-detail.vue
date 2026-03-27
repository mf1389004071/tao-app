<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  addKnowledgeComment,
  addKnowledgeShare,
  addKnowledgeView,
  getKnowledgeActionStatus,
  getKnowledgecontent,
  listKnowledgeComments,
  toggleKnowledgeAction
} from '@/api/cust'
import { formatDateTimeDisplay } from '@/utils/datetime'

declare const uni: any

const id = ref('')
const detail = ref<any>({})

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
const commentTotal = ref(0)
const commentText = ref('')
const commentLoading = ref(false)
const replyingTo = ref<{ id: string; label: string } | null>(null)
const socialBusy = ref(false)

const tagList = computed(() =>
  String(detail.value?.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
)

function openToolListByTag(t: string) {
  uni.navigateTo({
    url: `/pages_cust/pages/knowledge-list?mode=tool&contentType=TOOL&tag=${encodeURIComponent(t)}`
  })
}

function toUserPublic(uid: any) {
  if (uid == null || uid === '') return
  uni.navigateTo({ url: `/pages_cust/pages/user-public?userId=${encodeURIComponent(String(uid))}` })
}

function formatDateTime(v: any): string {
  return formatDateTimeDisplay(v, '{y}-{m}-{d} {h}:{i}')
}

function syncSocialFromDetail() {
  social.value.likeCount = Number(detail.value?.likeCount ?? 0)
  social.value.collectCount = Number(detail.value?.collectCount ?? 0)
  social.value.shareCount = Number(detail.value?.shareCount ?? 0)
  social.value.commentCount = Number(detail.value?.commentCount ?? 0)
  social.value.viewCount = Number(detail.value?.viewCount ?? 0)
}

async function addViewOnce() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  try {
    const res: any = await addKnowledgeView({ contentId: cid })
    const vc = res?.data?.viewCount
    if (vc != null) social.value.viewCount = Number(vc) || 0
  } catch (_) {}
}

async function loadComments() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  commentLoading.value = true
  try {
    const res: any = await listKnowledgeComments({ pageNum: 1, pageSize: 100, contentId: cid })
    commentList.value = Array.isArray(res?.rows) ? res.rows : []
    commentTotal.value = Number(res?.total ?? commentList.value.length) || 0
  } catch (_) {
    commentList.value = []
    commentTotal.value = 0
  } finally {
    commentLoading.value = false
  }
}

async function submitComment() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  if (!commentText.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  try {
    const payload: any = { contentId: cid, content: commentText.value.trim() }
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
  const rid = c && c.id != null ? String(c.id) : ''
  if (!rid) return
  const label = c.userId != null ? `用户${String(c.userId).slice(-4)}` : '该评论'
  replyingTo.value = { id: rid, label }
}

function cancelReply() {
  replyingTo.value = null
}

async function loadActionStatus() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  try {
    const res: any = await getKnowledgeActionStatus({ contentId: cid })
    if (res && res.data) {
      social.value.liked = Boolean(res.data.liked)
      social.value.collected = Boolean(res.data.collected)
    }
  } catch (_) {}
}

async function toggleLike() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  try {
    const res: any = await toggleKnowledgeAction({ contentId: cid, actionType: 'LIKE' })
    social.value.liked = Boolean(res?.data?.enabled)
    if (res?.data?.likeCount != null) social.value.likeCount = Number(res.data.likeCount) || 0
  } catch (_) {
    uni.showToast({ title: '操作失败，请检查登录状态', icon: 'none' })
  }
}

async function toggleCollect() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  try {
    const res: any = await toggleKnowledgeAction({ contentId: cid, actionType: 'COLLECT' })
    social.value.collected = Boolean(res?.data?.enabled)
    if (res?.data?.collectCount != null) social.value.collectCount = Number(res.data.collectCount) || 0
  } catch (_) {
    uni.showToast({ title: '操作失败，请检查登录状态', icon: 'none' })
  }
}

async function onShareClick() {
  const cid = detail.value?.id == null ? '' : String(detail.value.id)
  if (!cid) return
  try {
    const res: any = await addKnowledgeShare({ contentId: cid })
    if (res?.data?.shareCount != null) social.value.shareCount = Number(res.data.shareCount) || 0
  } catch (_) {}
}

function buildGuide(item: any): string[] {
  const source = item?.text1 || item?.content || ''
  const text = String(source)
  if (!text.trim()) return []
  return text
    .split(/[\n。；;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
}

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) || ''
  if (id.value) {
    getKnowledgecontent(id.value).then((res: any) => {
      if (res && res.data) {
        detail.value = { ...res.data }
        syncSocialFromDetail()
        addViewOnce()
        loadActionStatus()
        loadComments()
      }
    }).catch(() => {})
  }
})

function downloadDoc() {
  const docUrl = detail.value?.text2 ? String(detail.value.text2) : ''
  if (!docUrl) {
    uni.showToast({ title: '暂无可下载资料', icon: 'none' })
    return
  }
  uni.setClipboardData({ data: docUrl })
  uni.showToast({ title: '下载链接已复制', icon: 'success' })
}
</script>

<template>
  <view class="cust-tool-detail">
    <view class="body">
      <view class="head">
        <view class="icon-wrap">
          <up-icon name="bulb" size="40" color="#ea580c" />
        </view>
        <view>
          <text class="title">{{ detail.title }}</text>
          <text class="version">版本 {{ detail.subtitle || '2.0' }}</text>
          <view v-if="tagList.length" class="head-tags">
            <text
              v-for="t in tagList"
              :key="t"
              class="head-tag"
              @click.stop="openToolListByTag(t)"
            >#{{ t }}</text>
          </view>
        </view>
      </view>

      <view class="card intro">
        <text class="card-label">工具简介</text>
        <text class="card-text">{{ detail.content || detail.aiSummary || '暂无工具说明' }}</text>
        <view class="tool-meta">
          <text class="meta-item">发布：{{ formatDateTime(detail.publishTime || detail.createTime) || '—' }}</text>
          <text class="meta-item">浏览：{{ social.viewCount }}</text>
        </view>
      </view>

      <text class="card-label">使用指南</text>
      <view class="guide-list" v-if="buildGuide(detail).length">
        <view v-for="(g, i) in buildGuide(detail)" :key="i" class="guide-item">
          <text class="guide-num">{{ String(i + 1).padStart(2, '0') }}</text>
          <text class="guide-text">{{ g }}</text>
        </view>
      </view>
      <view v-else class="empty-guide">暂无使用指南</view>

      <view class="card case">
        <text class="card-label">实操案例</text>
        <text class="case-text">「{{ detail.promotionalText || detail.aiSummary || '暂未收录案例。' }}」</text>
        <up-button plain size="small" :text="detail.text3 || '下载高清PDF工作坊'" customStyle="margin-top: 24rpx; border-radius: 20rpx;" @click="downloadDoc" />
      </view>

      <view class="card social">
        <text class="card-label">互动</text>
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

        <view class="comment-box">
          <text class="comment-title">评论（{{ commentTotal }}）</text>
          <view v-if="replyingTo" class="replying-hint">
            <text>回复 {{ replyingTo.label }}</text>
            <text class="cancel-reply" @click="cancelReply">取消</text>
          </view>
          <view class="comment-input-row">
            <input
              v-model="commentText"
              class="comment-input"
              :placeholder="replyingTo ? '输入回复…' : '写下你的想法…'"
            />
            <text class="comment-send" @click="submitComment">发送</text>
          </view>
          <view v-if="commentLoading" class="comment-hint">加载中...</view>
          <view v-else-if="!commentList.length" class="comment-hint">暂无评论</view>
          <view v-else class="comment-list">
            <view v-for="c in commentList" :key="String(c.id)" class="comment-item">
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
.cust-tool-detail {
  min-height: 100vh;
  background: #fff;
  padding: 24rpx 32rpx 80rpx;
}
.body {
  padding-top: 24rpx;
}
.head {
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 40rpx;
}
.icon-wrap {
  width: 128rpx;
  height: 128rpx;
  background: #fff7ed;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  display: block;
}
.version {
  font-size: 24rpx;
  font-weight: 700;
  color: #ea580c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 8rpx;
  display: block;
}
.head-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}
.head-tag {
  font-size: 20rpx;
  font-weight: 800;
  color: #4f46e5;
  padding: 8rpx 16rpx;
  background: #eef2ff;
  border-radius: 999rpx;
}
.card {
  padding: 40rpx;
  border-radius: 48rpx;
  margin-bottom: 40rpx;
  border: 1rpx solid #f1f5f9;
}
.card.intro {
  background: #f8fafc;
}
.card-label {
  font-size: 24rpx;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 24rpx;
}
.card-text {
  font-size: 28rpx;
  color: #475569;
  line-height: 1.7;
}
.guide-list {
  margin-bottom: 40rpx;
}
.empty-guide {
  font-size: 24rpx;
  color: #94a3b8;
  margin-bottom: 40rpx;
}
.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 24rpx 0;
}
.guide-num {
  font-size: 36rpx;
  font-weight: 800;
  color: #c7d2fe;
  flex-shrink: 0;
}
.guide-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.5;
}
.card.case {
  background: linear-gradient(180deg, #fffdfb 0%, #fff7ed 100%);
  border: 1rpx solid #fed7aa;
  color: #1e293b;
}
.card.case .card-label {
  color: #ea580c;
}
.case-text {
  font-size: 28rpx;
  line-height: 1.7;
  font-style: italic;
  display: block;
  margin-bottom: 16rpx;
  color: #334155;
}

.tool-meta {
  display: flex;
  gap: 18rpx;
  flex-wrap: wrap;
  margin-top: 18rpx;
}
.tool-meta .meta-item {
  font-size: 22rpx;
  font-weight: 700;
  color: #94a3b8;
}

.card.social {
  background: #fff;
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
  border-radius: 40rpx;
  padding: 22rpx;
  border: 1rpx solid #f1f5f9;
}
.comment-title {
  font-size: 28rpx;
  font-weight: 900;
  color: #0f172a;
  display: block;
  margin-bottom: 18rpx;
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
      title: '工具内容',
      path: `/pages_cust/pages/tool-detail?id=${id}`
    }
  }
}
</script>
