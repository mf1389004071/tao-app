<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="接收用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入接收用户ID" />
        </uni-forms-item>
        <uni-forms-item label="标题" prop="title">
          <uni-easyinput v-model="form.title" placeholder="请输入标题" />
        </uni-forms-item>
        <uni-forms-item label="正文">
          <!-- <editor v-model="form.content" :min-height="192"/> -->
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </uni-forms-item>
        <uni-forms-item label="阅读时间" prop="readTime">
          <uni-datetime-picker type="datetime" v-model="form.readTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getNotifications, delNotifications, addNotifications, updateNotifications } from "@/api/bt10/notifications";
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
onShow(params=>{
  if(params.id){
      getNotifications(params.id).then(res=>{
        notifications.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delNotifications(id).then(()=>{
    navigateTo("/pages/bt10/notifications/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddNotifications() {
  addNotifications(notifications.value).then(()=>{
    navigateTo("/pages/bt10/notifications/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
