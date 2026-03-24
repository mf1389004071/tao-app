<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="knowledgecomment.id" type="line"></uni-section>
      <uni-section title="知识内容ID" :sub-title="knowledgecomment.contentId" type="line"></uni-section>
      <uni-section title="评论人ID" :sub-title="knowledgecomment.userId" type="line"></uni-section>
      <uni-section title="父评论ID(回复)" :sub-title="knowledgecomment.parentId" type="line"></uni-section>
      <uni-section title="评论正文" :sub-title="knowledgecomment.content" type="line"></uni-section>
      <uni-section title="点赞数" :sub-title="knowledgecomment.likeCount" type="line"></uni-section>
      <uni-section title="是否置顶" :sub-title="knowledgecomment.isPinned" type="line"></uni-section>
      <uni-section title="状态：已发布/隐藏" :sub-title="knowledgecomment.bizStatus" type="line"></uni-section>
      <uni-section title="状态" :sub-title="knowledgecomment.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getKnowledgecomment } from "@/api/bt10/knowledgecomment";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecomment = ref({
  id: null,
  contentId: null,
  userId: null,
  parentId: null,
  content: null,
  likeCount: null,
  isPinned: [],
  bizStatus: null,
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
  getKnowledgecomment(params.id).then(res=>{
    knowledgecomment.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
