<script setup lang="ts">
import { ref } from 'vue'

const topicTag = ref('蛋壳理论')
const content = ref('')

function submit() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请填写心得内容', icon: 'none' })
    return
  }
  uni.showToast({ title: '发布成功！贡献值 +10', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<template>
  <view class="cust-publish">
    <view class="form">
      <view class="field">
        <text class="label">关联当前研究话题</text>
        <view class="tags">
          <text class="tag active"># {{ topicTag }}</text>
          <text class="tag add">+ 添加关联话题</text>
        </view>
      </view>

      <view class="field textarea-wrap">
        <text class="label">我的观察与顿悟</text>
        <textarea
          v-model="content"
          class="textarea"
          placeholder="分享此时此刻的真实思考，利他是最高级的学习..."
          maxlength="2000"
        />
      </view>

      <view class="field">
        <view class="upload-area">
          <up-icon name="camera" size="48" color="#cbd5e1" />
          <text class="upload-text">上传现场快照</text>
        </view>
        <view class="visibility">
          <text class="v-label">公开程度</text>
          <view class="v-options">
            <text class="v-opt active">所有人可见</text>
            <text class="v-opt">匿名发布</text>
          </view>
        </view>
      </view>

      <up-button
        type="primary"
        text="存入 Wiki 知识库并赚分"
        block
        customStyle="margin-top: 48rpx; border-radius: 32rpx; height: 96rpx; font-weight: 800;"
        @click="submit"
      />
    </view>
    <!-- 底部安全区，避免被调试条/胶囊遮挡 -->
    <view class="safe-bottom" />
  </view>
</template>

<style lang="scss" scoped>
.cust-publish {
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
.label {
  font-size: 20rpx;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 20rpx;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag {
  padding: 20rpx 32rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 800;
}
.tag.active {
  background: #4f46e5;
  color: #fff;
}
.tag.add {
  background: #f1f5f9;
  color: #94a3b8;
  border: 1rpx solid #e2e8f0;
}
.textarea-wrap .label {
  margin-bottom: 16rpx;
}
.textarea {
  width: 100%;
  min-height: 280rpx;
  padding: 32rpx;
  background: #f8fafc;
  border: 1rpx solid #e2e8f0;
  border-radius: 32rpx;
  font-size: 30rpx;
  color: #334155;
  box-sizing: border-box;
}
.upload-area {
  width: 224rpx;
  height: 224rpx;
  background: #f8fafc;
  border: 2rpx dashed #e2e8f0;
  border-radius: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.upload-text {
  font-size: 20rpx;
  font-weight: 800;
  color: #cbd5e1;
}
.visibility {
  margin-top: 16rpx;
}
.v-label {
  font-size: 24rpx;
  font-weight: 700;
  color: #94a3b8;
  display: block;
  margin-bottom: 12rpx;
}
.v-options {
  display: flex;
  gap: 16rpx;
}
.v-opt {
  font-size: 20rpx;
  font-weight: 800;
  padding: 12rpx 24rpx;
  border-radius: 16rpx;
}
.v-opt.active {
  background: #dcfce7;
  color: #16a34a;
}
.v-opt:not(.active) {
  background: #f1f5f9;
  color: #94a3b8;
}
</style>
