<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="知识内容ID" prop="contentId">
          <uni-easyinput v-model="form.contentId" placeholder="请输入知识内容ID" />
        </uni-forms-item>
        <uni-forms-item label="评论人ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入评论人ID" />
        </uni-forms-item>
        <uni-forms-item label="父评论ID(回复)" prop="parentId">
          <uni-easyinput v-model="form.parentId" placeholder="请输入父评论ID(回复)" />
        </uni-forms-item>
        <uni-forms-item label="评论正文">
          <!-- <editor v-model="form.content" :min-height="192"/> -->
        </uni-forms-item>
        <uni-forms-item label="点赞数" prop="likeCount">
          <uni-easyinput v-model="form.likeCount" placeholder="请输入点赞数" />
        </uni-forms-item>
        <uni-forms-item label="更新者ID" prop="updateId">
          <uni-easyinput v-model="form.updateId" placeholder="请输入更新者ID" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getKnowledgecomment, delKnowledgecomment, addKnowledgecomment, updateKnowledgecomment } from "@/api/bt10/knowledgecomment";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecomment = ref({
        id: null,
        contentId: null,
        userId: null,
        parentId: null,
        content: null,
        likeCount: null,
        isPinned: [],
        bizStatus: null,
        createId: null,
        updateId: null,
        deleteId: null,
        createTime: null,
        updateTime: null,
        deleteTime: null,
        delFlag: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getKnowledgecomment(params.id).then(res=>{
        knowledgecomment.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delKnowledgecomment(id).then(()=>{
    navigateTo("/pages/bt10/knowledgecomment/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddKnowledgecomment() {
  addKnowledgecomment(knowledgecomment.value).then(()=>{
    navigateTo("/pages/bt10/knowledgecomment/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
