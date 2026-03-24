<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="所属活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入所属活动ID" />
        </uni-forms-item>
        <uni-forms-item label="场次日期" prop="sessionDate">
          <uni-datetime-picker type="datetime" v-model="form.sessionDate"/>
        </uni-forms-item>
        <uni-forms-item label="场次开始时间" prop="startTime">
          <uni-datetime-picker type="datetime" v-model="form.startTime"/>
        </uni-forms-item>
        <uni-forms-item label="场次结束时间" prop="endTime">
          <uni-datetime-picker type="datetime" v-model="form.endTime"/>
        </uni-forms-item>
        <uni-forms-item label="本场签到人数" prop="checkInCount">
          <uni-easyinput v-model="form.checkInCount" placeholder="请输入本场签到人数" />
        </uni-forms-item>
        <uni-forms-item label="AI生成场次总结" prop="summaryText">
          <uni-easyinput v-model="form.summaryText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="本场会议链接" prop="meetingUrl">
          <uni-easyinput v-model="form.meetingUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventsession, delEventsession, addEventsession, updateEventsession } from "@/api/bt10/eventsession";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventsession = ref({
        id: null,
        eventId: null,
        sessionDate: null,
        startTime: null,
        endTime: null,
        bizStatus: null,
        checkInCount: null,
        summaryText: null,
        meetingUrl: null,
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
      getEventsession(params.id).then(res=>{
        eventsession.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventsession(id).then(()=>{
    navigateTo("/pages_bt10/pages/eventsession/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventsession() {
  addEventsession(eventsession.value).then(()=>{
    navigateTo("/pages_bt10/pages/eventsession/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
