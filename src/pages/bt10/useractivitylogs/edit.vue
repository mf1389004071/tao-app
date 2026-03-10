<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="发生时间" prop="occurredTime">
          <uni-datetime-picker type="datetime" v-model="form.occurredTime"/>
        </uni-forms-item>
        <uni-forms-item label="IP 地址" prop="ipAddress">
          <uni-easyinput v-model="form.ipAddress" placeholder="请输入IP 地址" />
        </uni-forms-item>
        <uni-forms-item label="终端设备信息" prop="device">
          <uni-easyinput v-model="form.device" placeholder="请输入终端设备信息" />
        </uni-forms-item>
        <uni-forms-item label="事件来源业务ID" prop="eventSourceId">
          <uni-easyinput v-model="form.eventSourceId" placeholder="请输入事件来源业务ID" />
        </uni-forms-item>
        <uni-forms-item label="本次积分变化(可为空，无变更为NULL)" prop="pointChange">
          <uni-easyinput v-model="form.pointChange" placeholder="请输入本次积分变化(可为空，无变更为NULL)" />
        </uni-forms-item>
        <uni-forms-item label="变更前积分余额" prop="pointBalanceBefore">
          <uni-easyinput v-model="form.pointBalanceBefore" placeholder="请输入变更前积分余额" />
        </uni-forms-item>
        <uni-forms-item label="变更后积分余额" prop="pointBalanceAfter">
          <uni-easyinput v-model="form.pointBalanceAfter" placeholder="请输入变更后积分余额" />
        </uni-forms-item>
        <uni-forms-item label="本次贡献点变化" prop="contribChange">
          <uni-easyinput v-model="form.contribChange" placeholder="请输入本次贡献点变化" />
        </uni-forms-item>
        <uni-forms-item label="变更前贡献点余额" prop="contribBalanceBefore">
          <uni-easyinput v-model="form.contribBalanceBefore" placeholder="请输入变更前贡献点余额" />
        </uni-forms-item>
        <uni-forms-item label="变更后贡献点余额" prop="contribBalanceAfter">
          <uni-easyinput v-model="form.contribBalanceAfter" placeholder="请输入变更后贡献点余额" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUseractivitylogs, delUseractivitylogs, addUseractivitylogs, updateUseractivitylogs } from "@/api/bt10/useractivitylogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const useractivitylogs = ref({
        id: null,
        userId: null,
        occurredTime: null,
        ipAddress: null,
        device: null,
        eventType: null,
        eventSourceType: null,
        eventSourceId: null,
        eventTags: null,
        pointChange: null,
        pointBalanceBefore: null,
        pointBalanceAfter: null,
        contribChange: null,
        contribBalanceBefore: null,
        contribBalanceAfter: null,
        extra: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getUseractivitylogs(params.id).then(res=>{
        useractivitylogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUseractivitylogs(id).then(()=>{
    navigateTo("/pages/bt10/useractivitylogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUseractivitylogs() {
  addUseractivitylogs(useractivitylogs.value).then(()=>{
    navigateTo("/pages/bt10/useractivitylogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
