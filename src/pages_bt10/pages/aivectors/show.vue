<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="${comment}" :sub-title="aivectors.id" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.contentChunk" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.embedding" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.metadata" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.sourceType" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.sourceId" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.createdAt" type="line"></uni-section>
      <uni-section title="${comment}" :sub-title="aivectors.updatedAt" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getAivectors } from "@/api/bt10/aivectors";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aivectors = ref({
  id: null,
  contentChunk: null,
  embedding: null,
  metadata: null,
  sourceType: null,
  sourceId: null,
  createdAt: null,
  updatedAt: null
})

onLoad(() => {
})
onShow(params => {
  getAivectors(params.id).then(res=>{
    aivectors.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
