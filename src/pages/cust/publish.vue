<script setup lang="ts">
import { onShow, onUnload } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { getInfo } from '@/api/login'
import { addKnowledgecontent } from '@/api/cust'
import { listTags } from '@/api/bt10/tags'

declare const uni: any

const DRAFT_KEY = 'cust_publish_draft_v1'
const SUBMITTED_FLAG_KEY = 'cust_publish_submitted_ok_v1'

const title = ref('')
const subtitle = ref('')
const content = ref('')
const submitting = ref(false)

const tagKeyword = ref('')
const tagOptions = ref<any[]>([])
const selectedTags = ref<{ id: string; name: string }[]>([])
const showTagPicker = ref(false)

function normTagId(v: any) {
  return v == null ? '' : String(v)
}

function normTagName(v: any) {
  return v == null ? '' : String(v).trim()
}

const selectedTagIds = computed(() => selectedTags.value.map((t) => t.id).filter(Boolean))

function removeSelectedTag(id: string) {
  selectedTags.value = selectedTags.value.filter((t) => t.id !== id)
}

function toggleSelectTag(item: any) {
  const id = normTagId(item?.id)
  const name = normTagName(item?.name)
  if (!id || !name) return
  const exists = selectedTags.value.some((t) => t.id === id)
  if (exists) {
    removeSelectedTag(id)
  } else {
    selectedTags.value = [...selectedTags.value, { id, name }]
  }
}

function isTagSelected(id: any) {
  const sid = normTagId(id)
  if (!sid) return false
  return selectedTags.value.some((t) => t.id === sid)
}

async function loadTagOptions() {
  try {
    const res: any = await listTags({
      pageNum: 1,
      pageSize: 100,
      name: tagKeyword.value.trim()
    })
    tagOptions.value = Array.isArray(res?.rows) ? res.rows : Array.isArray(res?.data?.rows) ? res.data.rows : []
  } catch (_) {
    tagOptions.value = []
  }
}

const uploadedItems = ref<
  { kind: 'image' | 'file'; name: string; path: string; size?: number; ext?: string }[]
>([])

function pickUploadDisplayName(it: any, path: string, kind: 'image' | 'file') {
  // 微信 chooseMessageFile：优先使用服务端/客户端提供的原始文件名
  let n =
    it?.name ||
    it?.fileName ||
    it?.filename ||
    (typeof path === 'string' ? path.split('/').pop() : '') ||
    ''
  n = String(n || '').trim()
  if (!n) return kind === 'image' ? '图片' : '文件'
  // 若误把临时路径当作 name，只取最后一段，避免展示整串 hash
  if (n.length > 160 || /^wxfile:\/\//i.test(n)) {
    const seg = typeof path === 'string' ? path.split('/').pop() : ''
    n = String(seg || '').trim() || n
  }
  return n
}

function addUploads(items: any[], kind: 'image' | 'file') {
  const next = items
    .map((it: any) => {
      const path = it?.path || it?.tempFilePath || ''
      const name = pickUploadDisplayName(it, path, kind)
      const size = it?.size
      return path ? { kind, name: String(name || ''), path: String(path), size } : null
    })
    .filter(Boolean) as any[]
  if (!next.length) return
  uploadedItems.value = [...uploadedItems.value, ...next]
}

function removeUpload(path: string) {
  uploadedItems.value = uploadedItems.value.filter((x) => x.path !== path)
}

function chooseImages() {
  uni.chooseImage({
    count: 9,
    sizeType: ['compressed', 'original'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      const files = (res?.tempFiles || []).map((f: any) => ({ ...f, path: f.path || f.tempFilePath }))
      addUploads(files, 'image')
    }
  })
}

function chooseFiles() {
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 9,
    type: 'file',
    success: (res: any) => {
      const files = res?.tempFiles || []
      addUploads(files, 'file')
    }
  })
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '当前平台暂不支持选择文件', icon: 'none' })
  // #endif
}

function previewUploaded(path: string) {
  const imgs = uploadedItems.value.filter((u) => u.kind === 'image').map((u) => u.path)
  if (!imgs.length) return
  uni.previewImage({ urls: imgs, current: path })
}

function openUploadedFile(path: string) {
  // #ifdef MP-WEIXIN
  uni.openDocument({
    filePath: path,
    showMenu: true,
    fail: () => {
      uni.showToast({ title: '无法打开该文件', icon: 'none' })
    }
  })
  // #endif
}

function saveDraftToStorage() {
  try {
    const payload = {
      title: title.value,
      subtitle: subtitle.value,
      content: content.value,
      tags: selectedTags.value
    }
    if (title.value.trim() || content.value.trim() || selectedTags.value.length) {
      uni.setStorageSync(DRAFT_KEY, payload)
    }
  } catch (_) {}
}

function loadDraftFromStorage() {
  try {
    const raw = uni.getStorageSync(DRAFT_KEY)
    if (!raw || typeof raw !== 'object') return
    if (raw.title) title.value = String(raw.title)
    if (raw.subtitle != null) subtitle.value = String(raw.subtitle)
    if (raw.content) content.value = String(raw.content)
    if (Array.isArray(raw.tags)) {
      selectedTags.value = raw.tags
        .filter((t: any) => t && t.id && t.name)
        .map((t: any) => ({ id: String(t.id), name: String(t.name) }))
    }
  } catch (_) {}
}

function clearForm() {
  title.value = ''
  subtitle.value = ''
  content.value = ''
  selectedTags.value = []
  uploadedItems.value = []
}

onShow(() => {
  const justSubmitted = uni.getStorageSync(SUBMITTED_FLAG_KEY)
  if (justSubmitted) {
    try {
      uni.removeStorageSync(SUBMITTED_FLAG_KEY)
    } catch (_) {}
    clearForm()
    try {
      uni.removeStorageSync(DRAFT_KEY)
    } catch (_) {}
    return
  }
  // 表单仍为空时恢复未提交草稿，避免覆盖正在编辑的内容
  if (!title.value.trim() && !content.value.trim() && !selectedTags.value.length) {
    loadDraftFromStorage()
  }
})

onUnload(() => {
  saveDraftToStorage()
})

async function submit() {
  if (!title.value.trim()) {
    uni.showToast({ title: '请填写标题', icon: 'none' })
    return
  }
  if (!content.value.trim()) {
    uni.showToast({ title: '请填写正文内容', icon: 'none' })
    return
  }
  if (!selectedTags.value.length) {
    uni.showToast({ title: '请至少选择一个标签', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    const infoRes: any = await getInfo()
    const uid = infoRes?.user?.userId
    if (uid == null) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    await addKnowledgecontent({
      title: title.value.trim(),
      subtitle: subtitle.value.trim() || '来自小程序发布',
      content: content.value.trim(),
      contentType: 'ARTICLE',
      authorId: String(uid),
      tags: selectedTags.value.map((t) => t.name).join(','),
      bizStatus: 'PUBLISHED',
      publishTime: new Date().toISOString()
    })
    try {
      uni.setStorageSync(SUBMITTED_FLAG_KEY, '1')
      uni.removeStorageSync(DRAFT_KEY)
    } catch (_) {}
    uni.showToast({ title: '发布成功', icon: 'success' })
    clearForm()
    setTimeout(() => {
      uni.switchTab({ url: '/pages/cust/growth' })
    }, 600)
  } catch (_) {
    uni.showToast({ title: '发布失败，请检查权限与网络', icon: 'none' })
    saveDraftToStorage()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="cust-publish">
    <view class="form">
      <view class="field">
        <text class="label">标题 <text class="req">*</text></text>
        <input
          v-model="title"
          class="single-line"
          placeholder="一句话概括本次分享"
          placeholder-style="color:#94a3b8;font-size:26rpx;"
          maxlength="120"
        />
      </view>
      <view class="field">
        <text class="label">副标题</text>
        <input
          v-model="subtitle"
          class="single-line"
          placeholder="可选：补充说明"
          placeholder-style="color:#94a3b8;font-size:26rpx;"
          maxlength="200"
        />
      </view>

      <view class="field">
        <view class="row-head">
          <text class="label">标签 <text class="req">*</text>（至少一个）</text>
          <text class="link" @click="showTagPicker = !showTagPicker; if (showTagPicker) loadTagOptions()">
            {{ showTagPicker ? '收起' : '去添加' }}
          </text>
        </view>

        <view v-if="selectedTags.length" class="selected-tags">
          <view v-for="t in selectedTags" :key="t.id" class="sel-tag">
            <text class="sel-tag-text">#{{ t.name }}</text>
            <view class="sel-tag-del" @click="removeSelectedTag(t.id)">
              <up-icon name="close" size="12" color="#64748b" />
            </view>
          </view>
        </view>
        <view v-else class="hint">请至少选择一个标签，便于检索与推荐</view>

        <view v-if="showTagPicker" class="tag-picker">
          <view class="tag-search">
            <up-icon name="search" size="18" color="#94a3b8" />
            <input
              v-model="tagKeyword"
              class="tag-input"
              placeholder="搜索标签"
              placeholder-style="color:#94a3b8;font-size:24rpx;"
              confirm-type="search"
              @confirm="loadTagOptions"
            />
            <text class="tag-search-btn" @click="loadTagOptions">搜索</text>
          </view>
          <view class="tag-options">
            <view
              v-for="opt in tagOptions"
              :key="String(opt.id)"
              class="tag-opt"
              :class="{ active: isTagSelected(opt.id) }"
              @click="toggleSelectTag(opt)"
            >
              # {{ String(opt.name || '') }}
            </view>
            <view v-if="!tagOptions.length" class="hint">暂无匹配标签</view>
          </view>
        </view>
      </view>

      <view class="field textarea-wrap">
        <text class="label">正文 <text class="req">*</text></text>
        <textarea
          v-model="content"
          class="textarea"
          placeholder="分享此时此刻的真实思考，利他是最高级的学习..."
          placeholder-style="color:#94a3b8;font-size:26rpx;"
          maxlength="2000"
        />
      </view>

      <view class="field">
        <text class="label">图片 / 附件（可选）</text>
        <view class="upload-actions">
          <view class="upload-area" @click="chooseImages">
            <up-icon name="photo" size="44" color="#94a3b8" />
            <text class="upload-text">选择图片</text>
          </view>
          <view class="upload-area" @click="chooseFiles">
            <up-icon name="file-text" size="44" color="#94a3b8" />
            <text class="upload-text">选择文件</text>
          </view>
        </view>
        <view v-if="uploadedItems.length" class="upload-list">
          <view v-for="u in uploadedItems" :key="u.path" class="upload-item">
            <view class="u-left" @click="u.kind === 'image' ? previewUploaded(u.path) : openUploadedFile(u.path)">
              <image v-if="u.kind === 'image'" :src="u.path" class="u-thumb" mode="aspectFill" />
              <up-icon v-else name="file-text" size="18" color="#64748b" />
              <text class="u-name">{{ u.name }}</text>
            </view>
            <text class="u-del" @click.stop="removeUpload(u.path)">删除</text>
          </view>
        </view>
        <view v-else class="hint">图片可点击预览；文件点击尝试打开（受平台与格式限制）</view>
      </view>

      <up-button
        type="primary"
        text="发布"
        block
        :loading="submitting"
        customStyle="margin-top: 48rpx; border-radius: 32rpx; height: 96rpx; font-weight: 800;"
        @click="submit"
      />
    </view>
    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.cust-publish {
  --c-text: #0f172a;
  --c-muted: #64748b;
  --c-placeholder: #94a3b8;
  --c-border: #dbe3ef;
  --c-bg-soft: #f8fafc;
  --c-primary: #4f46e5;
  min-height: 100vh;
  background: #fff;
  padding: 24rpx 32rpx;
  padding-bottom: 0;
}
.form {
  padding-top: 24rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}
.safe-bottom {
  height: calc(48rpx + env(safe-area-inset-bottom));
}
.field {
  margin-bottom: 40rpx;
}
.req {
  color: #ef4444;
}
.single-line {
  width: 100%;
  min-height: 96rpx;
  padding: 22rpx 28rpx;
  background: var(--c-bg-soft);
  border-radius: 24rpx;
  border: 1rpx solid var(--c-border);
  font-size: 28rpx;
  color: var(--c-text);
  line-height: 44rpx;
  box-sizing: border-box;
}
.row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.link {
  font-size: 24rpx;
  font-weight: 800;
  color: #4f46e5;
}
.label {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 20rpx;
}
.hint {
  font-size: 22rpx;
  color: var(--c-placeholder);
  font-weight: 600;
}
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 8rpx;
}
.sel-tag {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  border-radius: 18rpx;
  background: #eef2ff;
  border: 1rpx solid #e0e7ff;
}
.sel-tag-text {
  font-size: 22rpx;
  font-weight: 800;
  color: #312e81;
}
.sel-tag-del {
  width: 28rpx;
  height: 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tag-picker {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 28rpx;
  background: var(--c-bg-soft);
  border: 1rpx solid var(--c-border);
}
.tag-search {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 18rpx;
  background: #fff;
  border-radius: 20rpx;
  border: 1rpx solid #e2e8f0;
}
.tag-input {
  flex: 1;
  min-height: 72rpx;
  font-size: 26rpx;
  color: var(--c-text);
}
.tag-search-btn {
  font-size: 24rpx;
  font-weight: 800;
  color: #4f46e5;
}
.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 16rpx;
}
.tag-opt {
  padding: 14rpx 18rpx;
  border-radius: 18rpx;
  background: #fff;
  border: 1rpx solid #e2e8f0;
  font-size: 22rpx;
  font-weight: 800;
  color: #475569;
}
.tag-opt.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}
.textarea-wrap .label {
  margin-bottom: 16rpx;
}
.textarea {
  width: 100%;
  min-height: 320rpx;
  padding: 32rpx;
  background: var(--c-bg-soft);
  border: 1rpx solid var(--c-border);
  border-radius: 32rpx;
  font-size: 28rpx;
  color: var(--c-text);
  line-height: 1.7;
  box-sizing: border-box;
}
.upload-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.upload-area {
  height: 160rpx;
  background: #f8fafc;
  border: 2rpx dashed #e2e8f0;
  border-radius: 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.upload-text {
  font-size: 20rpx;
  font-weight: 800;
  color: #cbd5e1;
}
.upload-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 8rpx;
}
.upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 18rpx;
  border-radius: 22rpx;
  background: #fff;
  border: 1rpx solid #f1f5f9;
}
.u-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 0;
  flex: 1;
}
.u-thumb {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.u-name {
  font-size: 24rpx;
  color: #334155;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 420rpx;
}
.u-del {
  font-size: 22rpx;
  color: #ef4444;
  font-weight: 800;
  flex-shrink: 0;
}
</style>
