<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="eventinfotags.id" type="line"></uni-section>
      <uni-section title="活动ID" :sub-title="eventinfotags.eventId" type="line"></uni-section>
      <uni-section title="标签ID" :sub-title="eventinfotags.tagId" type="line"></uni-section>
      <uni-section title="排序" :sub-title="eventinfotags.orderNum" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getEventinfotags } from "@/api/bt10/eventinfotags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventinfotags = ref({
  id: null,
  eventId: null,
  tagId: null,
  orderNum: null,
  createTime: null
})

onLoad(() => {
})
onShow(params => {
  getEventinfotags(params.id).then(res=>{
    eventinfotags.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
