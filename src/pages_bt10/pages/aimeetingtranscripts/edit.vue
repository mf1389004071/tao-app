<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="关联活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入关联活动ID" />
        </uni-forms-item>
        <uni-forms-item label="关联场次ID" prop="sessionId">
          <uni-easyinput v-model="form.sessionId" placeholder="请输入关联场次ID" />
        </uni-forms-item>
        <uni-forms-item label="原始音视频文件ID" prop="fileId">
          <uni-easyinput v-model="form.fileId" placeholder="请输入原始音视频文件ID" />
        </uni-forms-item>
        <uni-forms-item label="完整文本" prop="fullText">
          <uni-easyinput v-model="form.fullText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="AI摘要" prop="summary">
          <uni-easyinput v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getAimeetingtranscripts, delAimeetingtranscripts, addAimeetingtranscripts, updateAimeetingtranscripts } from "@/api/bt10/aimeetingtranscripts";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aimeetingtranscripts = ref({
        id: null,
        eventId: null,
        sessionId: null,
        fileId: null,
        transcriptJson: null,
        fullText: null,
        summary: null,
        keyPoints: null,
        actionItems: null,
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
      getAimeetingtranscripts(params.id).then(res=>{
        aimeetingtranscripts.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delAimeetingtranscripts(id).then(()=>{
    navigateTo("/pages_bt10/pages/aimeetingtranscripts/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddAimeetingtranscripts() {
  addAimeetingtranscripts(aimeetingtranscripts.value).then(()=>{
    navigateTo("/pages_bt10/pages/aimeetingtranscripts/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
