<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="aimeetingtranscripts.id" type="line"></uni-section>
      <uni-section title="关联活动ID" :sub-title="aimeetingtranscripts.eventId" type="line"></uni-section>
      <uni-section title="关联场次ID" :sub-title="aimeetingtranscripts.sessionId" type="line"></uni-section>
      <uni-section title="原始音视频文件ID" :sub-title="aimeetingtranscripts.fileId" type="line"></uni-section>
      <uni-section title="转写JSON(时间戳与说话人)" :sub-title="aimeetingtranscripts.transcriptJson" type="line"></uni-section>
      <uni-section title="完整文本" :sub-title="aimeetingtranscripts.fullText" type="line"></uni-section>
      <uni-section title="AI摘要" :sub-title="aimeetingtranscripts.summary" type="line"></uni-section>
      <uni-section title="关键点" :sub-title="aimeetingtranscripts.keyPoints" type="line"></uni-section>
      <uni-section title="行动清单" :sub-title="aimeetingtranscripts.actionItems" type="line"></uni-section>
      <uni-section title="状态" :sub-title="aimeetingtranscripts.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getAimeetingtranscripts } from "@/api/bt10/aimeetingtranscripts";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aimeetingtranscripts = ref({
  id: null,
  eventId: null,
  sessionId: null,
  fileId: null,
  transcriptJson: null,
  fullText: null,
  summary: null,
  keyPoints: null,
  actionItems: null,
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
  getAimeetingtranscripts(params.id).then(res=>{
    aimeetingtranscripts.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
