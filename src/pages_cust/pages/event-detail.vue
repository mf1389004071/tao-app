<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getInfo } from '@/api/login'
import { addEventjoin, ensureMessageThread, getEventinfo, getUserPublic, listCustTags, listEventjoin } from '@/api/cust'
import config from '@/config'
import { formatDateTimeDisplay } from '@/utils/datetime'

const id = ref('')
const detail = ref<any>({})
const loading = ref(true)
const applying = ref(false)
const joined = ref(false)
const showMoreText = ref(false)
const pmUserName = ref('')

const coverUrl = computed(() => {
  const url = detail.value.coverImageUrl
  if (!url) return ''
  return String(url).startsWith('http') ? String(url) : config.baseUrl + String(url)
})

function formatDate(val: string | undefined): string {
  return formatDateTimeDisplay(val, '{y}-{m}-{d} {h}:{i}:{s}')
}

function openKnowledgeSearchByTag(name: string) {
  const t = (name || '').trim()
  if (!t) return
  uni.navigateTo({
    url: `/pages_cust/pages/knowledge-list?tag=${encodeURIComponent(t)}`
  })
}

function formatMoney(val: any): string {
  if (val == null || val === '') return '0'
  const s = String(val)
  // 去掉尾部多余 0（如 365.0000 -> 365；0.5000 -> 0.5）
  return s.includes('.') ? s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '') : s
}

function getJoinTypeText(joinType: any): string {
  const t = joinType == null ? '' : String(joinType)
  const u = t.toUpperCase()
  if (u === 'ONLINE') return '线上'
  if (u === 'OFFLINE') return '线下'
  return t || '线上/线下'
}

const joinDeadlineState = computed(() => {
  const d = detail.value?.joinDeadline
  const bizStatus = String(detail.value?.bizStatus ?? '')
  // 非发布态：以活动状态为准
  if (bizStatus && bizStatus !== 'PUBLISHED') {
    if (bizStatus === 'ENDED') return { label: '已结束', isOpen: false }
    if (bizStatus === 'CANCELLED') return { label: '已取消', isOpen: false }
    return { label: bizStatus, isOpen: false }
  }
  if (!d) return { label: '报名中', isOpen: true }
  const deadline = Date.parse(String(d)) || 0
  if (!deadline) return { label: '报名中', isOpen: true }
  const isOpen = Date.now() <= deadline
  return { label: isOpen ? '报名中' : '已截止', isOpen }
})

const canApply = computed(() => {
  if (joined.value) return false
  const bizStatus = String(detail.value?.bizStatus ?? '')
  if (bizStatus && bizStatus !== 'PUBLISHED') return false
  return joinDeadlineState.value.isOpen
})

function splitCommaIds(v: any): string[] {
  if (v == null) return []
  const s = String(v).trim()
  if (!s) return []
  return s.split(',').map((x) => String(x).trim()).filter(Boolean)
}

const tagIds = computed(() => splitCommaIds(detail.value?.eventTags))
const targetAudienceId = computed(() => (detail.value?.targetAudience == null ? '' : String(detail.value.targetAudience)))

const tagNameMap = ref<Record<string, string>>({})
async function loadTagNames(ids: string[]) {
  const uniq = Array.from(new Set(ids.map((x) => String(x).trim()).filter(Boolean)))
  if (!uniq.length) return
  try {
    // MVP：直接拉取一定数量的 tags，再在前端映射。后续可优化为后端按 ids 批量查询接口。
    const res: any = await listCustTags({ pageNum: 1, pageSize: 2000 })
    const rows = Array.isArray(res?.rows) ? res.rows : Array.isArray(res?.data?.rows) ? res.data.rows : []
    const next: Record<string, string> = {}
    for (const r of rows) {
      const id = r?.id == null ? '' : String(r.id)
      const name = r?.name == null ? '' : String(r.name).trim()
      if (id && name) next[id] = name
    }
    tagNameMap.value = next
  } catch (_) {}
}

const targetAudienceName = computed(() => {
  const id = targetAudienceId.value
  if (!id) return ''
  return tagNameMap.value[id] || id
})

const eventTagNames = computed(() => tagIds.value.map((id) => tagNameMap.value[id] || id))

function coverOrEmpty(url: any): string {
  const u = url == null ? '' : String(url)
  if (!u) return ''
  return u.startsWith('http') ? u : config.baseUrl + u
}

function getLocationText() {
  const loc = (detail.value?.location == null ? '' : String(detail.value.location)).trim()
  const addr = (detail.value?.address == null ? '' : String(detail.value.address)).trim()
  if (loc) return addr ? `${loc} · ${addr}` : loc
  const city = (detail.value?.city == null ? '' : String(detail.value.city)).trim()
  return city || '—'
}

function splitList(val: any): string[] {
  if (!val) return []
  const s = typeof val === 'string' ? val : String(val)
  return s.split(/[,，、]/).map((x) => String(x).trim()).filter(Boolean)
}

const learningObjectivesList = computed(() => splitList(detail.value?.learningObjectives))

/** 课程大纲：后端 curriculum 为字符串（换行或逗号分隔），转为数组 */
function getCurriculum(): string[] {
  const c = detail.value.curriculum
  if (Array.isArray(c)) return c.map((s: string) => String(s).trim()).filter(Boolean)
  if (typeof c === 'string') {
    return c.split(/[\n,，、]/).map((s: string) => s.trim()).filter(Boolean)
  }
  return []
}

function htmlToPlainText(html: string): string {
  if (!html) return ''
  let s = String(html)

  // 基础实体处理（避免直接显示 &nbsp; 等）
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&quot;/g, '"')
  s = s.replace(/&#39;/g, "'")

  // 将 ul/li 结构尽量转换为可读换行
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/li>\s*<li[^>]*>/gi, '\n• ')
  s = s.replace(/<li[^>]*>/gi, '• ')
  s = s.replace(/<\/li>/gi, '\n')
  s = s.replace(/<\/p>/gi, '\n')

  // 去除其它 HTML 标签
  s = s.replace(/<[^>]+>/g, '')

  // 统一换行间距
  s = s.replace(/\n{3,}/g, '\n\n').trim()
  return s
}

const detailTextPlain = computed(() => htmlToPlainText(detail.value?.text1 ?? ''))
const detailTextPreview = computed(() => {
  const t = detailTextPlain.value
  if (!t) return ''
  const max = 240
  if (showMoreText.value) return t
  return t.length > max ? t.slice(0, max) + '...' : t
})

const detailImages = computed(() => {
  const s = detail.value?.detailImageUrl
  if (s == null) return []
  const fromDetail = String(s)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((u) => coverOrEmpty(u))
    .filter(Boolean)
  if (fromDetail.length) return fromDetail

  const res: string[] = []
  const poster = detail.value?.posterImageUrl
  if (poster) res.push(coverOrEmpty(poster))
  const listImg = detail.value?.listImageUrl
  if (listImg) res.push(coverOrEmpty(listImg))
  return res.filter(Boolean)
})

function getPriceText() {
  const p = detail.value?.eventPrice
  return `￥${formatMoney(p)}`
}

async function onConsultClick() {
  const url = detail.value?.meetingUrl
  const meeting = url == null ? '' : String(url).trim()
  if (meeting) {
    uni.showModal({ title: '会议链接', content: meeting, showCancel: false })
    return
  }
  const pm = detail.value?.pmUserId
  if (pm == null || pm === '') {
    uni.showToast({ title: '暂无活动负责人，无法私信', icon: 'none' })
    return
  }
  try {
    const infoRes: any = await getInfo()
    if (infoRes?.user?.userId == null) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    const res: any = await ensureMessageThread({ targetUserId: String(pm) })
    const tid = res?.data?.threadId
    if (!tid) {
      uni.showToast({ title: '创建会话失败', icon: 'none' })
      return
    }
    const titleEnc = encodeURIComponent('活动咨询')
    uni.navigateTo({ url: `/pages_cust/pages/dm-chat?threadId=${tid}&title=${titleEnc}` })
  } catch (_) {
    uni.showToast({ title: '请登录后重试', icon: 'none' })
  }
}

async function apply() {
  if (!canApply.value) {
    uni.showToast({ title: joined.value ? '您已报名该活动' : joinDeadlineState.value.label, icon: 'none' })
    return
  }
  if (!id.value) return
  applying.value = true
  try {
    const infoRes: any = await getInfo()
    const uid = infoRes?.user?.userId
    if (uid == null) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    const existsRes: any = await listEventjoin({
      pageNum: 1,
      pageSize: 1,
      eventId: String(id.value),
      userId: String(uid)
    })
    if ((existsRes?.total || 0) > 0) {
      joined.value = true
      uni.showToast({ title: '您已报名该活动', icon: 'none' })
      return
    }
    await addEventjoin({
      eventId: String(id.value),
      userId: String(uid),
      bizStatus: 'CONFIRMED',
      paymentStatus: 'PENDING',
      paymentAmount: detail.value?.eventPrice == null ? 0 : detail.value.eventPrice
    })
    joined.value = true
    uni.showToast({ title: '报名申请已提交', icon: 'success' })
  } catch (_) {
    uni.showToast({ title: '报名失败，请检查权限', icon: 'none' })
  } finally {
    applying.value = false
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  id.value = (page.options && page.options.id) ? String(page.options.id) : ''
  if (id.value) {
    getEventinfo(id.value)
      .then((res: any) => {
        if (res && res.data) detail.value = res.data
        const ids: string[] = []
        const ta = res?.data?.targetAudience
        if (ta != null && String(ta).trim()) ids.push(String(ta))
        const et = res?.data?.eventTags
        ids.push(...splitCommaIds(et))
        loadTagNames(ids)
        const pm = res?.data?.pmUserId
        pmUserName.value = ''
        if (pm != null && String(pm).trim()) {
          getUserPublic(String(pm))
            .then((pr: any) => {
              const p = pr?.data
              if (p && p.nickName) pmUserName.value = String(p.nickName)
            })
            .catch(() => {})
        }
      })
      .catch(() => {
        detail.value = {}
      })
      .finally(() => { loading.value = false })
    getInfo()
      .then((infoRes: any) => {
        const uid = infoRes?.user?.userId
        if (uid == null) return null
        return listEventjoin({
          pageNum: 1,
          pageSize: 1,
          eventId: String(id.value),
          userId: String(uid)
        })
      })
      .then((joinRes: any) => {
        if (joinRes && (joinRes.total || 0) > 0) joined.value = true
      })
      .catch(() => {})
  } else {
    loading.value = false
  }
})
</script>

<template>
  <view class="cust-event-detail">
    <view v-if="loading" class="loading-wrap">
      <up-loading-icon mode="circle" size="40" />
      <text class="loading-text">加载中...</text>
    </view>
    <view v-else-if="!id || !detail.title" class="empty-wrap">
      <text class="empty-text">活动不存在或已下架</text>
    </view>
    <template v-else>
      <view class="cover-wrap">
        <image v-if="coverUrl" class="cover" :src="coverUrl" mode="aspectFill" lazy-load />
        <view v-else class="cover placeholder" />

        <view class="cover-badges">
          <text class="badge badge-deadline">{{ joinDeadlineState.label }}</text>
          <text class="badge badge-type">
            {{ getJoinTypeText(detail.joinType) }}{{ detail.eventType ? ' · ' + String(detail.eventType) : '' }}
          </text>
        </view>
      </view>

      <view class="body">
        <view class="title-row">
          <text class="title">{{ detail.title }}</text>
          <text class="price">{{ getPriceText() }}</text>
        </view>

        <view class="meta-grid">
          <view class="meta-item">
            <text class="meta-label">时间</text>
            <view class="meta-value-lines">
              <text class="meta-value">{{ formatDate(detail.startTime) || '—' }}</text>
              <text v-if="formatDate(detail.endTime)" class="meta-value">{{ formatDate(detail.endTime) }}</text>
            </view>
          </view>
          <view class="meta-item">
            <text class="meta-label">地点</text>
            <text class="meta-value">{{ getLocationText() }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">报名截止</text>
            <text class="meta-value">{{ formatDate(detail.joinDeadline) || '—' }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">已报名</text>
            <text class="meta-value">
              {{ detail.registeredCount != null ? detail.registeredCount : 0 }}/{{ detail.maxParticipants != null ? detail.maxParticipants : '-' }}
            </text>
          </view>
          <view class="meta-item">
            <text class="meta-label">已签到</text>
            <text class="meta-value">{{ detail.checkedInCount != null ? detail.checkedInCount : 0 }}</text>
          </view>
        </view>

        <view v-if="learningObjectivesList.length" class="section">
          <text class="section-title">课程亮点</text>
          <view class="features">
            <view v-for="(f, i) in learningObjectivesList" :key="i" class="feature">
              <up-icon name="checkmark-circle" size="28" color="#22c55e" />
              <text class="feature-text">{{ f }}</text>
            </view>
          </view>
        </view>

        <view v-if="getCurriculum().length" class="section">
          <view class="section-head">
            <text class="section-title">课程大纲</text>
          </view>
          <view class="curriculum">
            <view v-for="(item, i) in getCurriculum()" :key="i" class="curriculum-item">
              <text class="curriculum-num">{{ String(i + 1).padStart(2, '0') }}</text>
              <text class="curriculum-text">{{ item }}</text>
            </view>
          </view>
        </view>

        <view v-if="detailImages.length" class="section">
          <view class="section-head">
            <text class="section-title">图片展示</text>
            <text class="section-subtitle">详情一览</text>
          </view>
          <swiper class="detail-swiper" :indicator-dots="true" :autoplay="false" circular>
            <swiper-item v-for="(img, i) in detailImages" :key="i">
              <image class="detail-image" :src="img" mode="aspectFill" lazy-load />
            </swiper-item>
          </swiper>
        </view>

        <view v-if="targetAudienceId || tagIds.length" class="section">
          <view class="section-head">
            <text class="section-title">人群与标签</text>
            <text class="section-subtitle">帮助你判断是否适配</text>
          </view>
          <view class="tag-grid">
            <view v-if="targetAudienceId" class="tag-item">
              <text class="tag-k">目标学员画像</text>
              <view class="tag-v tap" @click="openKnowledgeSearchByTag(targetAudienceName)">
                <text>#{{ targetAudienceName }}</text>
              </view>
            </view>
            <view v-if="tagIds.length" class="tag-item">
              <text class="tag-k">活动标签</text>
              <view class="tag-list">
                <view v-for="t in eventTagNames" :key="t" class="tag tap" @click="openKnowledgeSearchByTag(t)">
                  <text>#{{ t }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="detailTextPlain" class="section">
          <view class="section-head">
            <text class="section-title">活动详情</text>
            <view class="section-actions">
              <text v-if="detailTextPlain.length > 240" class="more-link" @click="showMoreText = !showMoreText">
                {{ showMoreText ? '收起' : '展开' }}
              </text>
            </view>
          </view>
          <view class="detail-text">
            <text class="detail-text-pre">{{ detailTextPreview }}</text>
          </view>
        </view>

        <view v-if="detail.joinType && detail.joinType === 'ONLINE' && detail.meetingUrl" class="section">
          <text class="section-title">线上参会信息</text>
          <view class="info-card">
            <text class="info-label">会议链接</text>
            <text class="info-value">{{ detail.meetingUrl }}</text>
          </view>
        </view>

        <view v-if="detail.contact || detail.organizer || detail.pmUserId" class="section">
          <view class="section-head">
            <text class="section-title">主办与联系</text>
          </view>
          <view class="info-grid">
            <view v-if="detail.organizer" class="info-card">
              <text class="info-label">主办方</text>
              <text class="info-value">{{ detail.organizer }}</text>
            </view>
            <view v-if="detail.pmUserId" class="info-card">
              <text class="info-label">活动负责人</text>
              <text class="info-value">{{ pmUserName || ('用户 ' + String(detail.pmUserId).slice(-4)) }}</text>
            </view>
            <view v-if="detail.contact" class="info-card">
              <text class="info-label">联系方式</text>
              <text class="info-value">{{ detail.contact }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="footer-bar">
        <up-button plain text="线上咨询" customStyle="flex: 1; border-radius: 32rpx;" @click="onConsultClick" />
        <up-button
          type="primary"
          :disabled="!canApply || applying"
          :loading="applying"
          :text="joined ? '已报名' : (canApply ? '立即报名锁定席位' : joinDeadlineState.label)"
          customStyle="flex: 2.5; border-radius: 32rpx; margin-left: 24rpx;"
          @click="apply"
        />
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.cust-event-detail {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 160rpx;
}
.loading-wrap, .empty-wrap {
  padding: 120rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}
.loading-text, .empty-text {
  font-size: 28rpx;
  color: #94a3b8;
}
.cover-wrap {
  width: 100%;
  height: 560rpx;
  background: #e2e8f0;
  position: relative;
}
.cover {
  width: 100%;
  height: 100%;
}
.cover.placeholder {
  background: linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%);
}
.cover-badges {
  position: absolute;
  top: 28rpx;
  left: 32rpx;
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  z-index: 2;
}
.badge {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 900;
}
.badge-deadline {
  background: rgba(99, 102, 241, 0.95);
  color: #fff;
}
.badge-type {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}
.body {
  padding: 32rpx;
  margin-top: -48rpx;
  background: #fff;
  border-radius: 48rpx 48rpx 0 0;
  position: relative;
  z-index: 1;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32rpx;
}
.title {
  flex: 1;
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  margin-right: 24rpx;
}
.price {
  font-size: 44rpx;
  font-weight: 800;
  color: #0f172a;
}
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx 24rpx;
  margin-bottom: 32rpx;
}
.meta-item {
  background: #f8fafc;
  border-radius: 32rpx;
  padding: 22rpx 24rpx;
}
.meta-label {
  display: block;
  font-size: 22rpx;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 8rpx;
}
.meta-value {
  display: block;
  font-size: 28rpx;
  font-weight: 900;
  color: #0f172a;
}
.meta-value-lines {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.section {
  margin-bottom: 40rpx;
}
.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 22rpx;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16rpx;
  margin-bottom: 22rpx;
}
.section-subtitle {
  font-size: 22rpx;
  font-weight: 800;
  color: #94a3b8;
}
.section-actions {
  display: flex;
  align-items: center;
}
.more-link {
  font-size: 24rpx;
  font-weight: 900;
  color: #4f46e5;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}
.feature {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx 24rpx;
  background: #f8fafc;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #334155;
}
.feature-text {
  flex: 1;
  line-height: 1.4;
}
.curriculum {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.curriculum-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  background: #f8fafc;
  border-radius: 32rpx;
}
.curriculum-num {
  font-size: 48rpx;
  font-weight: 800;
  color: #c7d2fe;
}
.curriculum-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #1e293b;
}
.detail-swiper {
  width: 100%;
  height: 420rpx;
  border-radius: 28rpx;
  overflow: hidden;
  background: #f8fafc;
  border: 2rpx solid #f1f5f9;
}
.detail-image {
  width: 100%;
  height: 420rpx;
}
.tag-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.tag-item {
  background: #f8fafc;
  border-radius: 32rpx;
  padding: 22rpx 24rpx;
}
.tag-k {
  display: block;
  font-size: 22rpx;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 10rpx;
}
.tag-v {
  display: inline-flex;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 900;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.1);
  border: 2rpx solid rgba(99, 102, 241, 0.2);
}
.tag-v.tap:active,
.tag.tap:active {
  opacity: 0.85;
}
.tag-list {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}
.tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 900;
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  border: 2rpx solid rgba(99, 102, 241, 0.2);
}
.detail-text {
  background: #f8fafc;
  border-radius: 32rpx;
  padding: 22rpx 24rpx;
  border: 2rpx solid #f1f5f9;
}
.detail-text-pre {
  font-size: 26rpx;
  font-weight: 650;
  color: #0f172a;
  white-space: pre-wrap;
  line-height: 1.75;
}
.info-card {
  background: #f8fafc;
  border-radius: 32rpx;
  padding: 22rpx 24rpx;
  border: 2rpx solid #f1f5f9;
}
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.info-label {
  display: block;
  font-size: 22rpx;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 10rpx;
}
.info-value {
  display: block;
  font-size: 28rpx;
  font-weight: 900;
  color: #0f172a;
  word-break: break-all;
}
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  border-top: 1rpx solid #f1f5f9;
  display: flex;
  align-items: center;
}
</style>
