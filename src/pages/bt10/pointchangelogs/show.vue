<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="pointchangelogs.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="pointchangelogs.userId" type="line"></uni-section>
      <uni-section title="类型：获得/消耗/过期/调整等" :sub-title="pointchangelogs.changeType" type="line"></uni-section>
      <uni-section title="积分变动量" :sub-title="pointchangelogs.pointsChange" type="line"></uni-section>
      <uni-section title="变动前余额" :sub-title="pointchangelogs.balanceBefore" type="line"></uni-section>
      <uni-section title="变动后余额" :sub-title="pointchangelogs.balanceAfter" type="line"></uni-section>
      <uni-section title="原因说明" :sub-title="pointchangelogs.changeReason" type="line"></uni-section>
      <uni-section title="关联业务类型" :sub-title="pointchangelogs.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="pointchangelogs.relatedId" type="line"></uni-section>
      <uni-section title="操作人ID" :sub-title="pointchangelogs.operatorId" type="line"></uni-section>
      <uni-section title="操作人类型" :sub-title="pointchangelogs.operatorType" type="line"></uni-section>
      <uni-section title="变更时间" :sub-title="pointchangelogs.changedTime" type="line"></uni-section>
      <uni-section title="扩展信息" :sub-title="pointchangelogs.metadata" type="line"></uni-section>
      <uni-section title="备注" :sub-title="pointchangelogs.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="pointchangelogs.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getPointchangelogs } from "@/api/bt10/pointchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const pointchangelogs = ref({
  id: null,
  userId: null,
  changeType: null,
  pointsChange: null,
  balanceBefore: null,
  balanceAfter: null,
  changeReason: null,
  relatedType: null,
  relatedId: null,
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
  getPointchangelogs(params.id).then(res=>{
    pointchangelogs.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
