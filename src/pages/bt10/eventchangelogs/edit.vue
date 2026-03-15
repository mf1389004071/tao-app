<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入活动ID" />
        </uni-forms-item>
        <uni-forms-item label="变更字段名" prop="changeField">
          <uni-easyinput v-model="form.changeField" placeholder="请输入变更字段名" />
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
import { getEventchangelogs, delEventchangelogs, addEventchangelogs, updateEventchangelogs } from "@/api/bt10/eventchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventchangelogs = ref({
        id: null,
        eventId: null,
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
      getEventchangelogs(params.id).then(res=>{
        eventchangelogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventchangelogs(id).then(()=>{
    navigateTo("/pages/bt10/eventchangelogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventchangelogs() {
  addEventchangelogs(eventchangelogs.value).then(()=>{
    navigateTo("/pages/bt10/eventchangelogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
