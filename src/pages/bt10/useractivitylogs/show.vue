<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="useractivitylogs.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="useractivitylogs.userId" type="line"></uni-section>
      <uni-section title="发生时间" :sub-title="useractivitylogs.occurredTime" type="line"></uni-section>
      <uni-section title="IP 地址" :sub-title="useractivitylogs.ipAddress" type="line"></uni-section>
      <uni-section title="终端设备信息" :sub-title="useractivitylogs.device" type="line"></uni-section>
      <uni-section title="事件类型：LOGIN/LOGOUT/SIGNIN/LIKE/COMMENT/SHARE/REGISTER_EVENT等" :sub-title="useractivitylogs.eventType" type="line"></uni-section>
      <uni-section title="事件来源业务类型：EVENT/CONTENT/USER等" :sub-title="useractivitylogs.eventSourceType" type="line"></uni-section>
      <uni-section title="事件来源业务ID" :sub-title="useractivitylogs.eventSourceId" type="line"></uni-section>
      <uni-section title="事件标签列表(JSON)" :sub-title="useractivitylogs.eventTags" type="line"></uni-section>
      <uni-section title="本次积分变化(可为空，无变更为NULL)" :sub-title="useractivitylogs.pointChange" type="line"></uni-section>
      <uni-section title="变更前积分余额" :sub-title="useractivitylogs.pointBalanceBefore" type="line"></uni-section>
      <uni-section title="变更后积分余额" :sub-title="useractivitylogs.pointBalanceAfter" type="line"></uni-section>
      <uni-section title="本次贡献点变化" :sub-title="useractivitylogs.contribChange" type="line"></uni-section>
      <uni-section title="变更前贡献点余额" :sub-title="useractivitylogs.contribBalanceBefore" type="line"></uni-section>
      <uni-section title="变更后贡献点余额" :sub-title="useractivitylogs.contribBalanceAfter" type="line"></uni-section>
      <uni-section title="额外上下文(如停留时长、入口渠道等)" :sub-title="useractivitylogs.extra" type="line"></uni-section>
      <uni-section title="状态" :sub-title="useractivitylogs.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUseractivitylogs } from "@/api/bt10/useractivitylogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const useractivitylogs = ref({
  id: null,
  userId: null,
  occurredTime: null,
  ipAddress: null,
  device: null,
  eventType: null,
  eventSourceType: null,
  eventSourceId: null,
  eventTags: null,
  pointChange: null,
  pointBalanceBefore: null,
  pointBalanceAfter: null,
  contribChange: null,
  contribBalanceBefore: null,
  contribBalanceAfter: null,
  extra: null,
  createId: null,
  createBy: null,
  createTime: null,
  status: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getUseractivitylogs(params.id).then(res=>{
    useractivitylogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
