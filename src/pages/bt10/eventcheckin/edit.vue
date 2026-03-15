<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="报名记录ID" prop="joinId">
          <uni-easyinput v-model="form.joinId" placeholder="请输入报名记录ID" />
        </uni-forms-item>
        <uni-forms-item label="场次ID(周期活动时用)" prop="sessionId">
          <uni-easyinput v-model="form.sessionId" placeholder="请输入场次ID(周期活动时用)" />
        </uni-forms-item>
        <uni-forms-item label="签到时间" prop="checkInTime">
          <uni-datetime-picker type="datetime" v-model="form.checkInTime"/>
        </uni-forms-item>
        <uni-forms-item label="签到方式：二维码/定位/手动" prop="checkInMethod">
          <uni-easyinput v-model="form.checkInMethod" placeholder="请输入签到方式：二维码/定位/手动" />
        </uni-forms-item>
        <uni-forms-item label="操作人ID(手动签到时)" prop="operatorId">
          <uni-easyinput v-model="form.operatorId" placeholder="请输入操作人ID(手动签到时)" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventcheckin, delEventcheckin, addEventcheckin, updateEventcheckin } from "@/api/bt10/eventcheckin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventcheckin = ref({
        id: null,
        joinId: null,
        sessionId: null,
        checkInTime: null,
        checkInMethod: null,
        checkInLocation: null,
        operatorId: null,
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
      getEventcheckin(params.id).then(res=>{
        eventcheckin.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventcheckin(id).then(()=>{
    navigateTo("/pages/bt10/eventcheckin/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventcheckin() {
  addEventcheckin(eventcheckin.value).then(()=>{
    navigateTo("/pages/bt10/eventcheckin/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
