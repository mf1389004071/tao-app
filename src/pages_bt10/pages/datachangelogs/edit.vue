<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="被变更表名" prop="tableName">
          <uni-easyinput v-model="form.tableName" placeholder="请输入被变更表名" />
        </uni-forms-item>
        <uni-forms-item label="被变更记录ID" prop="recordId">
          <uni-easyinput v-model="form.recordId" placeholder="请输入被变更记录ID" />
        </uni-forms-item>
        <uni-forms-item label="变更字段(更新时)" prop="fieldName">
          <uni-easyinput v-model="form.fieldName" placeholder="请输入变更字段(更新时)" />
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
        <uni-forms-item label="操作人用户ID" prop="operatorId">
          <uni-easyinput v-model="form.operatorId" placeholder="请输入操作人用户ID" />
        </uni-forms-item>
        <uni-forms-item label="操作IP" prop="ipAddress">
          <uni-easyinput v-model="form.ipAddress" placeholder="请输入操作IP" />
        </uni-forms-item>
        <uni-forms-item label="UA" prop="userAgent">
          <uni-easyinput v-model="form.userAgent" type="textarea" placeholder="请输入内容" />
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
import { getDatachangelogs, delDatachangelogs, addDatachangelogs, updateDatachangelogs } from "@/api/bt10/datachangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const datachangelogs = ref({
        id: null,
        tableName: null,
        recordId: null,
        changeType: null,
        fieldName: null,
        oldValue: null,
        newValue: null,
        changeReason: null,
        operatorId: null,
        operatorType: null,
        ipAddress: null,
        userAgent: null,
        changedTime: null,
        metadata: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getDatachangelogs(params.id).then(res=>{
        datachangelogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delDatachangelogs(id).then(()=>{
    navigateTo("/pages_bt10/pages/datachangelogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddDatachangelogs() {
  addDatachangelogs(datachangelogs.value).then(()=>{
    navigateTo("/pages_bt10/pages/datachangelogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
