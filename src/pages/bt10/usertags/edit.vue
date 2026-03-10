<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="标签ID" prop="tagId">
          <uni-easyinput v-model="form.tagId" placeholder="请输入标签ID" />
        </uni-forms-item>
        <uni-forms-item label="权重(0-1或0-100，越大代表相关性越高)" prop="weight">
          <uni-easyinput v-model="form.weight" placeholder="请输入权重(0-1或0-100，越大代表相关性越高)" />
        </uni-forms-item>
        <uni-forms-item label="来源：SYSTEM/SELF/COACH等" prop="source">
          <uni-easyinput v-model="form.source" placeholder="请输入来源：SYSTEM/SELF/COACH等" />
        </uni-forms-item>
        <uni-forms-item label="备注/说明" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUsertags, delUsertags, addUsertags, updateUsertags } from "@/api/bt10/usertags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usertags = ref({
        id: null,
        userId: null,
        tagId: null,
        weight: null,
        source: null,
        remark: null,
        createTime: null,
        delFlag: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getUsertags(params.id).then(res=>{
        usertags.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUsertags(id).then(()=>{
    navigateTo("/pages/bt10/usertags/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUsertags() {
  addUsertags(usertags.value).then(()=>{
    navigateTo("/pages/bt10/usertags/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
