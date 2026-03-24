<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="优先级1-10" prop="priority">
          <uni-easyinput v-model="form.priority" placeholder="请输入优先级1-10" />
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </uni-forms-item>
        <uni-forms-item label="进度0-100" prop="progressPercentage">
          <uni-easyinput v-model="form.progressPercentage" placeholder="请输入进度0-100" />
        </uni-forms-item>
        <uni-forms-item label="失败原因" prop="errorMessage">
          <uni-easyinput v-model="form.errorMessage" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="费用" prop="costAmount">
          <uni-easyinput v-model="form.costAmount" placeholder="请输入费用" />
        </uni-forms-item>
        <uni-forms-item label="消耗token数" prop="tokensUsed">
          <uni-easyinput v-model="form.tokensUsed" placeholder="请输入消耗token数" />
        </uni-forms-item>
        <uni-forms-item label="使用模型" prop="modelUsed">
          <uni-easyinput v-model="form.modelUsed" placeholder="请输入使用模型" />
        </uni-forms-item>
        <uni-forms-item label="开始时间" prop="startTime">
          <uni-datetime-picker type="datetime" v-model="form.startTime"/>
        </uni-forms-item>
        <uni-forms-item label="完成时间" prop="completeTime">
          <uni-datetime-picker type="datetime" v-model="form.completeTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getAitasks, delAitasks, addAitasks, updateAitasks } from "@/api/bt10/aitasks";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aitasks = ref({
        id: null,
        taskType: null,
        bizStatus: null,
        priority: null,
        relatedType: null,
        relatedId: null,
        config: null,
        result: null,
        progressPercentage: null,
        errorMessage: null,
        costAmount: null,
        tokensUsed: null,
        modelUsed: null,
        startTime: null,
        completeTime: null,
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
      getAitasks(params.id).then(res=>{
        aitasks.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delAitasks(id).then(()=>{
    navigateTo("/pages_bt10/pages/aitasks/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddAitasks() {
  addAitasks(aitasks.value).then(()=>{
    navigateTo("/pages_bt10/pages/aitasks/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
