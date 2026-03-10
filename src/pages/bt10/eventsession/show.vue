<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventsession.id" type="line"></uni-section>
      <uni-section title="所属活动ID" :sub-title="eventsession.eventId" type="line"></uni-section>
      <uni-section title="场次日期" :sub-title="eventsession.sessionDate" type="line"></uni-section>
      <uni-section title="场次开始时间" :sub-title="eventsession.startTime" type="line"></uni-section>
      <uni-section title="场次结束时间" :sub-title="eventsession.endTime" type="line"></uni-section>
      <uni-section title="状态：已排期/进行中/已结束/已取消" :sub-title="eventsession.bizStatus" type="line"></uni-section>
      <uni-section title="本场签到人数" :sub-title="eventsession.checkInCount" type="line"></uni-section>
      <uni-section title="AI生成场次总结" :sub-title="eventsession.summaryText" type="line"></uni-section>
      <uni-section title="本场会议链接" :sub-title="eventsession.meetingUrl" type="line"></uni-section>
      <uni-section title="状态" :sub-title="eventsession.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventsession } from "@/api/bt10/eventsession";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventsession = ref({
  id: null,
  eventId: null,
  sessionDate: null,
  startTime: null,
  endTime: null,
  bizStatus: null,
  checkInCount: null,
  summaryText: null,
  meetingUrl: null,
  createId: null,
  updateId: null,
  createTime: null,
  updateTime: null,
  delFlag: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getEventsession(params.id).then(res=>{
    eventsession.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
