<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventchangelogs.id" type="line"></uni-section>
      <uni-section title="活动ID" :sub-title="eventchangelogs.eventId" type="line"></uni-section>
      <uni-section title="变更字段名" :sub-title="eventchangelogs.changeField" type="line"></uni-section>
      <uni-section title="旧值" :sub-title="eventchangelogs.oldValue" type="line"></uni-section>
      <uni-section title="新值" :sub-title="eventchangelogs.newValue" type="line"></uni-section>
      <uni-section title="变更原因" :sub-title="eventchangelogs.changeReason" type="line"></uni-section>
      <uni-section title="操作人ID" :sub-title="eventchangelogs.operatorId" type="line"></uni-section>
      <uni-section title="操作人类型" :sub-title="eventchangelogs.operatorType" type="line"></uni-section>
      <uni-section title="变更时间" :sub-title="eventchangelogs.changedTime" type="line"></uni-section>
      <uni-section title="扩展信息" :sub-title="eventchangelogs.metadata" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventchangelogs } from "@/api/bt10/eventchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventchangelogs = ref({
  id: null,
  eventId: null,
  changeField: null,
  oldValue: null,
  newValue: null,
  changeReason: null,
  operatorId: null,
  operatorType: null,
  changedTime: null,
  metadata: null,
  remark: null
})

onLoad(() => {
})
onShow(params => {
  getEventchangelogs(params.id).then(res=>{
    eventchangelogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
