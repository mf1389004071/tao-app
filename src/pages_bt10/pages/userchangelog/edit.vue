<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="变更字段：角色/状态/积分等" prop="changeField">
          <uni-easyinput v-model="form.changeField" placeholder="请输入变更字段：角色/状态/积分等" />
        </uni-forms-item>
        <uni-forms-item label="旧值" prop="oldValue">
          <uni-easyinput v-model="form.oldValue" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="新值" prop="newValue">
          <uni-easyinput v-model="form.newValue" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="变更原因" prop="changeReason">
          <uni-easyinput v-model="form.changeReason" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="操作人ID" prop="operatorId">
          <uni-easyinput v-model="form.operatorId" placeholder="请输入操作人ID" />
        </uni-forms-item>
        <uni-forms-item label="变更时间" prop="changedTime">
          <uni-datetime-picker type="datetime" v-model="form.changedTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUserchangelog, delUserchangelog, addUserchangelog, updateUserchangelog } from "@/api/bt10/userchangelog";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userchangelog = ref({
        id: null,
        userId: null,
        changeField: null,
        oldValue: null,
        newValue: null,
        changeReason: null,
        operatorId: null,
        operatorType: null,
        changedTime: null,
        metadata: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getUserchangelog(params.id).then(res=>{
        userchangelog.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUserchangelog(id).then(()=>{
    navigateTo("/pages_bt10/pages/userchangelog/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUserchangelog() {
  addUserchangelog(userchangelog.value).then(()=>{
    navigateTo("/pages_bt10/pages/userchangelog/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
