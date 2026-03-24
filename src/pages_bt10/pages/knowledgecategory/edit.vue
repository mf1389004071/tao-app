<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="分类名称" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入分类名称" />
        </uni-forms-item>
        <uni-forms-item label="URL/唯一标识" prop="slug">
          <uni-easyinput v-model="form.slug" placeholder="请输入URL/唯一标识" />
        </uni-forms-item>
        <uni-forms-item label="父分类ID" prop="parentId">
          <uni-easyinput v-model="form.parentId" placeholder="请输入父分类ID" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
        <uni-forms-item label="图标" prop="icon">
          <uni-easyinput v-model="form.icon" placeholder="请输入图标" />
        </uni-forms-item>
        <uni-forms-item label="主题色" prop="color">
          <uni-easyinput v-model="form.color" placeholder="请输入主题色" />
        </uni-forms-item>
        <uni-forms-item label="可见权限等级1-5" prop="permissionLevel">
          <uni-easyinput v-model="form.permissionLevel" placeholder="请输入可见权限等级1-5" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getKnowledgecategory, delKnowledgecategory, addKnowledgecategory, updateKnowledgecategory } from "@/api/bt10/knowledgecategory";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const knowledgecategory = ref({
        id: null,
        name: null,
        slug: null,
        parentId: null,
        orderNum: null,
        icon: null,
        color: null,
        permissionLevel: null,
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
        deleteId: null,
        deleteTime: null,
        status: null,
        delFlag: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getKnowledgecategory(params.id).then(res=>{
        knowledgecategory.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delKnowledgecategory(id).then(()=>{
    navigateTo("/pages_bt10/pages/knowledgecategory/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddKnowledgecategory() {
  addKnowledgecategory(knowledgecategory.value).then(()=>{
    navigateTo("/pages_bt10/pages/knowledgecategory/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
