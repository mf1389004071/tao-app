<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="usertags.id" type="line"></uni-section>
      <uni-section title="用户ID" :sub-title="usertags.userId" type="line"></uni-section>
      <uni-section title="标签ID" :sub-title="usertags.tagId" type="line"></uni-section>
      <uni-section title="权重(0-1或0-100，越大代表相关性越高)" :sub-title="usertags.weight" type="line"></uni-section>
      <uni-section title="来源：SYSTEM/SELF/COACH等" :sub-title="usertags.source" type="line"></uni-section>
      <uni-section title="备注/说明" :sub-title="usertags.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="usertags.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getUsertags } from "@/api/bt10/usertags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usertags = ref({
  id: null,
  userId: null,
  tagId: null,
  weight: null,
  source: null,
  remark: null,
  createTime: null,
  delFlag: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getUsertags(params.id).then(res=>{
    usertags.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
