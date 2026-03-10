<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="报名记录ID" prop="joinId">
          <uni-easyinput v-model="form.joinId" placeholder="请输入报名记录ID" />
        </uni-forms-item>
        <uni-forms-item label="活动角色ID" prop="roleId">
          <uni-easyinput v-model="form.roleId" placeholder="请输入活动角色ID" />
        </uni-forms-item>
        <uni-forms-item label="分配时间" prop="assignedTime">
          <uni-datetime-picker type="datetime" v-model="form.assignedTime"/>
        </uni-forms-item>
        <uni-forms-item label="确认时间" prop="confirmedTime">
          <uni-datetime-picker type="datetime" v-model="form.confirmedTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventjoinerrole, delEventjoinerrole, addEventjoinerrole, updateEventjoinerrole } from "@/api/bt10/eventjoinerrole";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventjoinerrole = ref({
        id: null,
        joinId: null,
        roleId: null,
        assignedTime: null,
        confirmedTime: null,
        bizStatus: null,
        delFlag: null,
        remark: null
      })
onShow(params=>{
  if(params.id){
      getEventjoinerrole(params.id).then(res=>{
        eventjoinerrole.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventjoinerrole(id).then(()=>{
    navigateTo("/pages/bt10/eventjoinerrole/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventjoinerrole() {
  addEventjoinerrole(eventjoinerrole.value).then(()=>{
    navigateTo("/pages/bt10/eventjoinerrole/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
