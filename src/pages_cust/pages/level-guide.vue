<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getInfo } from '@/api/login'
import { getUserprofile } from '@/api/cust'

const currentName = ref('成长伙伴')
const currentStage = ref('BEGINNER')
const currentPoints = ref(0)
const steps = [
  { key: 'BEGINNER', level: '新人', req: '完成个人模型构建' },
  { key: 'STUDENT', level: '学员', req: '累计贡献 5 份实修内容' },
  { key: 'MASTER', level: '高手', req: '贡献值达到 1000 点' },
  { key: 'MENTOR', level: '导师', req: '发起 1 场城市线下实修站' }
]

const stageIndex = computed(() => {
  const i = steps.findIndex((s) => s.key === currentStage.value)
  return i < 0 ? 0 : i
})

const displaySteps = computed(() =>
  steps.map((s, i) => ({
    ...s,
    status: i < stageIndex.value ? 'completed' : i === stageIndex.value ? 'active' : 'locked'
  }))
)

const nextGoal = computed(() => {
  const i = stageIndex.value
  if (i >= steps.length - 1) return '已达最高等级'
  const target = [200, 500, 1000, 1500][Math.min(i + 1, 3)]
  const need = Math.max(0, target - currentPoints.value)
  return `距离下一等级还需 ${need} 分`
})

onMounted(async () => {
  try {
    const infoRes: any = await getInfo()
    currentName.value = infoRes?.user?.nickName || infoRes?.user?.userName || '成长伙伴'
    const uid = infoRes?.user?.userId
    if (uid == null) return
    const profileRes: any = await getUserprofile(String(uid))
    const p = profileRes?.data
    if (!p) return
    currentStage.value = String(p.growthStage || 'BEGINNER')
    currentPoints.value = Number(p.points || 0)
  } catch (_) {}
})
</script>

<template>
  <view class="cust-level-guide">
    <view class="hero">
      <text class="hero-title">{{ currentName }}的</text>
      <text class="hero-title accent">智慧进化</text>
      <text class="hero-title">路线</text>
    </view>

    <view class="timeline">
      <view v-for="(step, i) in displaySteps" :key="step.level" class="step" :class="{ locked: step.status === 'locked' }">
        <view
          class="step-icon"
          :class="{
            completed: step.status === 'completed',
            active: step.status === 'active',
            locked: step.status === 'locked'
          }"
        >
          <up-icon v-if="step.status === 'completed'" name="checkmark" size="28" color="#fff" />
          <text v-else class="step-num">{{ i + 1 }}</text>
        </view>
        <view class="step-body">
          <view class="step-head">
            <text class="step-level">{{ step.level }}</text>
            <text v-if="step.status === 'active'" class="step-badge">当前阶段</text>
          </view>
          <text class="step-req">{{ step.req }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-cta">
      <text class="cta-sub">下一阶段目标</text>
      <text class="cta-title">{{ nextGoal }}</text>
      <up-button type="primary" text="去打卡获取贡献值" block customStyle="border-radius: 28rpx; margin-top: 24rpx;" @click="uni.navigateBack()" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cust-level-guide {
  min-height: 100vh;
  background: #0f172a;
  color: #fff;
  padding: 24rpx 32rpx 160rpx;
}
.hero {
  margin-bottom: 64rpx;
}
.hero-title {
  font-size: 72rpx;
  font-weight: 800;
  display: block;
  line-height: 1.2;
  color: #e2e8f0;
}
.hero-title.accent {
  color: #818cf8;
}
.timeline {
  position: relative;
  padding-left: 48rpx;
  border-left: 4rpx solid rgba(255, 255, 255, 0.08);
  margin-left: 24rpx;
}
.step {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
  margin-bottom: 64rpx;
  position: relative;
  z-index: 1;
}
.step.locked {
  opacity: 0.5;
}
.step-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -72rpx;
  flex-shrink: 0;
}
.step-icon.completed {
  background: #16a34a;
  border: 4rpx solid #22c55e;
}
.step-icon.active {
  background: #4f46e5;
  border: 4rpx solid #6366f1;
  box-shadow: 0 0 40rpx rgba(99, 102, 241, 0.5);
}
.step-icon.locked {
  background: #1e293b;
  border: 4rpx solid #334155;
}
.step-num {
  font-size: 36rpx;
  font-weight: 800;
  color: #fff;
}
.step-body {
  flex: 1;
}
.step-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}
.step-level {
  font-size: 36rpx;
  font-weight: 800;
  color: #f1f5f9;
}
.step-badge {
  font-size: 18rpx;
  font-weight: 800;
  background: #6366f1;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  text-transform: uppercase;
}
.step-req {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.bottom-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40rpx 32rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  background: linear-gradient(to top, #0f172a 0%, rgba(15, 23, 42, 0.98) 100%);
  text-align: center;
}
.cta-sub {
  font-size: 20rpx;
  font-weight: 800;
  color: #818cf8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
}
.cta-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #fff;
  display: block;
  margin-top: 8rpx;
}
</style>
