<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="标题" prop="title">
          <uni-easyinput v-model="form.title" placeholder="请输入标题" />
        </uni-forms-item>
        <uni-forms-item label="正文">
          <!-- <editor v-model="form.content" :min-height="192"/> -->
        </uni-forms-item>
        <uni-forms-item label="发布时间" prop="publishTime">
          <uni-datetime-picker type="datetime" v-model="form.publishTime"/>
        </uni-forms-item>
        <uni-forms-item label="扩展文本1" prop="text1">
          <uni-easyinput v-model="form.text1" placeholder="请输入扩展文本1" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本2" prop="text2">
          <uni-easyinput v-model="form.text2" placeholder="请输入扩展文本2" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本3" prop="text3">
          <uni-easyinput v-model="form.text3" placeholder="请输入扩展文本3" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getNotices, delNotices, addNotices, updateNotices } from "@/api/bt10/notices";
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
        createId: null,
        updateId: null,
        createTime: null,
        updateTime: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getNotices(params.id).then(res=>{
        notices.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delNotices(id).then(()=>{
    navigateTo("/pages/bt10/notices/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddNotices() {
  addNotices(notices.value).then(()=>{
    navigateTo("/pages/bt10/notices/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
