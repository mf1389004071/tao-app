<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="知识内容ID" prop="contentId">
          <uni-easyinput v-model="form.contentId" placeholder="请输入知识内容ID" />
        </uni-forms-item>
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getKnowledgeaction, delKnowledgeaction, addKnowledgeaction, updateKnowledgeaction } from "@/api/bt10/knowledgeaction";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgeaction = ref({
        id: null,
        contentId: null,
        actionType: null,
        userId: null,
        createTime: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getKnowledgeaction(params.id).then(res=>{
        knowledgeaction.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delKnowledgeaction(id).then(()=>{
    navigateTo("/pages/bt10/knowledgeaction/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddKnowledgeaction() {
  addKnowledgeaction(knowledgeaction.value).then(()=>{
    navigateTo("/pages/bt10/knowledgeaction/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
