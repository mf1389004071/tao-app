<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="userchangelog.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="userchangelog.userId" type="line"></uni-section>
      <uni-section title="变更字段：角色/状态/积分等" :sub-title="userchangelog.changeField" type="line"></uni-section>
      <uni-section title="旧值" :sub-title="userchangelog.oldValue" type="line"></uni-section>
      <uni-section title="新值" :sub-title="userchangelog.newValue" type="line"></uni-section>
      <uni-section title="变更原因" :sub-title="userchangelog.changeReason" type="line"></uni-section>
      <uni-section title="操作人ID" :sub-title="userchangelog.operatorId" type="line"></uni-section>
      <uni-section title="操作人类型" :sub-title="userchangelog.operatorType" type="line"></uni-section>
      <uni-section title="变更时间" :sub-title="userchangelog.changedTime" type="line"></uni-section>
      <uni-section title="扩展信息" :sub-title="userchangelog.metadata" type="line"></uni-section>
      <uni-section title="备注" :sub-title="userchangelog.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="userchangelog.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUserchangelog } from "@/api/bt10/userchangelog";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userchangelog = ref({
  id: null,
  userId: null,
  changeField: null,
  oldValue: null,
  newValue: null,
  changeReason: null,
  operatorId: null,
  operatorType: null,
  changedTime: null,
  metadata: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getUserchangelog(params.id).then(res=>{
    userchangelog.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
