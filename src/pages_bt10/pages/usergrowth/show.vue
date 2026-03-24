<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="usergrowth.id" type="line"></uni-section>
      <uni-section title="用户ID(sys_user.user_id)" :sub-title="usergrowth.userId" type="line"></uni-section>
      <uni-section title="原阶段" :sub-title="usergrowth.stageFrom" type="line"></uni-section>
      <uni-section title="新阶段" :sub-title="usergrowth.stageTo" type="line"></uni-section>
      <uni-section title="触发方式：自动/手动/任务完成等" :sub-title="usergrowth.triggerType" type="line"></uni-section>
      <uni-section title="触发上下文数据" :sub-title="usergrowth.triggerData" type="line"></uni-section>
      <uni-section title="状态" :sub-title="usergrowth.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUsergrowth } from "@/api/bt10/usergrowth";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usergrowth = ref({
  id: null,
  userId: null,
  stageFrom: null,
  stageTo: null,
  triggerType: null,
  triggerData: null,
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
  getUsergrowth(params.id).then(res=>{
    usergrowth.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
