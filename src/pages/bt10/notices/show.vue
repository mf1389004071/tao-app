<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="notices.id" type="line"></uni-section>
      <uni-section title="标题" :sub-title="notices.title" type="line"></uni-section>
      <uni-section title="正文" :sub-title="notices.content" type="line"></uni-section>
      <uni-section title="类型：system等" :sub-title="notices.type" type="line"></uni-section>
      <uni-section title="是否紧急" :sub-title="notices.isUrgent" type="line"></uni-section>
      <uni-section title="发布时间" :sub-title="notices.publishTime" type="line"></uni-section>
      <uni-section title="状态" :sub-title="notices.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getNotices } from "@/api/bt10/notices";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const notices = ref({
  id: null,
  title: null,
  content: null,
  type: null,
  isUrgent: [],
  publishTime: null,
  text1: null,
  text2: null,
  text3: null,
  jsonData: null,
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
  getNotices(params.id).then(res=>{
    notices.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
