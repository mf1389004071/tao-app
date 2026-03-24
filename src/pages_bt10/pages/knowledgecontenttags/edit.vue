<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="知识内容ID" prop="contentId">
          <uni-easyinput v-model="form.contentId" placeholder="请输入知识内容ID" />
        </uni-forms-item>
        <uni-forms-item label="标签ID" prop="tagId">
          <uni-easyinput v-model="form.tagId" placeholder="请输入标签ID" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getKnowledgecontenttags, delKnowledgecontenttags, addKnowledgecontenttags, updateKnowledgecontenttags } from "@/api/bt10/knowledgecontenttags";
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
onShow(params=>{
  if(params.id){
      getKnowledgecontenttags(params.id).then(res=>{
        knowledgecontenttags.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delKnowledgecontenttags(id).then(()=>{
    navigateTo("/pages_bt10/pages/knowledgecontenttags/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddKnowledgecontenttags() {
  addKnowledgecontenttags(knowledgecontenttags.value).then(()=>{
    navigateTo("/pages_bt10/pages/knowledgecontenttags/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
