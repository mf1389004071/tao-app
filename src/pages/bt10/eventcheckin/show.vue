<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventcheckin.id" type="line"></uni-section>
      <uni-section title="报名记录ID" :sub-title="eventcheckin.joinId" type="line"></uni-section>
      <uni-section title="场次ID(周期活动时用)" :sub-title="eventcheckin.sessionId" type="line"></uni-section>
      <uni-section title="签到时间" :sub-title="eventcheckin.checkInTime" type="line"></uni-section>
      <uni-section title="签到方式：二维码/定位/手动" :sub-title="eventcheckin.checkInMethod" type="line"></uni-section>
      <uni-section title="签到位置" :sub-title="eventcheckin.checkInLocation" type="line"></uni-section>
      <uni-section title="操作人ID(手动签到时)" :sub-title="eventcheckin.operatorId" type="line"></uni-section>
      <uni-section title="状态" :sub-title="eventcheckin.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventcheckin } from "@/api/bt10/eventcheckin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventcheckin = ref({
  id: null,
  joinId: null,
  sessionId: null,
  checkInTime: null,
  checkInMethod: null,
  checkInLocation: null,
  operatorId: null,
  createId: null,
  createBy: null,
  createTime: null,
  updateId: null,
  updateBy: null,
  updateTime: null,
  status: null,
  delFlag: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getEventcheckin(params.id).then(res=>{
    eventcheckin.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
