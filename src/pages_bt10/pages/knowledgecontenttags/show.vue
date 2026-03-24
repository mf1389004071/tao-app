<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="knowledgecontenttags.id" type="line"></uni-section>
      <uni-section title="知识内容ID" :sub-title="knowledgecontenttags.contentId" type="line"></uni-section>
      <uni-section title="标签ID" :sub-title="knowledgecontenttags.tagId" type="line"></uni-section>
      <uni-section title="排序" :sub-title="knowledgecontenttags.orderNum" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getKnowledgecontenttags } from "@/api/bt10/knowledgecontenttags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecontenttags = ref({
  id: null,
  contentId: null,
  tagId: null,
  orderNum: null,
  createTime: null
})

onLoad(() => {
})
onShow(params => {
  getKnowledgecontenttags(params.id).then(res=>{
    knowledgecontenttags.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
