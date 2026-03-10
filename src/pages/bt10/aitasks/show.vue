<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="aitasks.id" type="line"></uni-section>
      <uni-section title="任务类型：转写/摘要/向量化/对话等" :sub-title="aitasks.taskType" type="line"></uni-section>
      <uni-section title="状态：待处理/处理中/完成/失败/已取消" :sub-title="aitasks.bizStatus" type="line"></uni-section>
      <uni-section title="优先级1-10" :sub-title="aitasks.priority" type="line"></uni-section>
      <uni-section title="关联业务类型" :sub-title="aitasks.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="aitasks.relatedId" type="line"></uni-section>
      <uni-section title="任务配置" :sub-title="aitasks.config" type="line"></uni-section>
      <uni-section title="任务结果" :sub-title="aitasks.result" type="line"></uni-section>
      <uni-section title="进度0-100" :sub-title="aitasks.progressPercentage" type="line"></uni-section>
      <uni-section title="失败原因" :sub-title="aitasks.errorMessage" type="line"></uni-section>
      <uni-section title="费用" :sub-title="aitasks.costAmount" type="line"></uni-section>
      <uni-section title="消耗token数" :sub-title="aitasks.tokensUsed" type="line"></uni-section>
      <uni-section title="使用模型" :sub-title="aitasks.modelUsed" type="line"></uni-section>
      <uni-section title="开始时间" :sub-title="aitasks.startTime" type="line"></uni-section>
      <uni-section title="完成时间" :sub-title="aitasks.completeTime" type="line"></uni-section>
      <uni-section title="备注" :sub-title="aitasks.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="aitasks.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getAitasks } from "@/api/bt10/aitasks";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aitasks = ref({
  id: null,
  taskType: null,
  bizStatus: null,
  priority: null,
  relatedType: null,
  relatedId: null,
  config: null,
  result: null,
  progressPercentage: null,
  errorMessage: null,
  costAmount: null,
  tokensUsed: null,
  modelUsed: null,
  startTime: null,
  completeTime: null,
  createId: null,
  updateId: null,
  deleteId: null,
  createTime: null,
  updateTime: null,
  deleteTime: null,
  delFlag: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getAitasks(params.id).then(res=>{
    aitasks.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
