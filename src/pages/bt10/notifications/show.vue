<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="notifications.id" type="line"></uni-section>
      <uni-section title="接收用户ID" :sub-title="notifications.userId" type="line"></uni-section>
      <uni-section title="标题" :sub-title="notifications.title" type="line"></uni-section>
      <uni-section title="正文" :sub-title="notifications.content" type="line"></uni-section>
      <uni-section title="类型：系统/互动/订阅等" :sub-title="notifications.notificationType" type="line"></uni-section>
      <uni-section title="关联业务类型" :sub-title="notifications.relatedType" type="line"></uni-section>
      <uni-section title="关联业务ID" :sub-title="notifications.relatedId" type="line"></uni-section>
      <uni-section title="是否已读" :sub-title="notifications.isRead" type="line"></uni-section>
      <uni-section title="阅读时间" :sub-title="notifications.readTime" type="line"></uni-section>
      <uni-section title="备注" :sub-title="notifications.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="notifications.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getNotifications } from "@/api/bt10/notifications";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const notifications = ref({
  id: null,
  userId: null,
  title: null,
  content: null,
  notificationType: null,
  relatedType: null,
  relatedId: null,
  isRead: [],
  readTime: null,
  createTime: null,
  remark: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getNotifications(params.id).then(res=>{
    notifications.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
