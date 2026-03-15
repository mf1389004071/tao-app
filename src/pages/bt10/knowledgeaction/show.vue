<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="knowledgeaction.id" type="line"></uni-section>
      <uni-section title="知识内容ID" :sub-title="knowledgeaction.contentId" type="line"></uni-section>
      <uni-section title="类型：点赞/反对/收藏/分享等" :sub-title="knowledgeaction.actionType" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="knowledgeaction.userId" type="line"></uni-section>
      <uni-section title="状态" :sub-title="knowledgeaction.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getKnowledgeaction } from "@/api/bt10/knowledgeaction";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgeaction = ref({
  id: null,
  contentId: null,
  actionType: null,
  userId: null,
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
  getKnowledgeaction(params.id).then(res=>{
    knowledgeaction.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
