<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID(sys_user.user_id)" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID(sys_user.user_id)" />
        </uni-forms-item>
        <uni-forms-item label="原阶段" prop="stageFrom">
          <uni-easyinput v-model="form.stageFrom" placeholder="请输入原阶段" />
        </uni-forms-item>
        <uni-forms-item label="新阶段" prop="stageTo">
          <uni-easyinput v-model="form.stageTo" placeholder="请输入新阶段" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUsergrowth, delUsergrowth, addUsergrowth, updateUsergrowth } from "@/api/bt10/usergrowth";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usergrowth = ref({
        id: null,
        userId: null,
        stageFrom: null,
        stageTo: null,
        triggerType: null,
        triggerData: null,
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
      getUsergrowth(params.id).then(res=>{
        usergrowth.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUsergrowth(id).then(()=>{
    navigateTo("/pages_bt10/pages/usergrowth/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUsergrowth() {
  addUsergrowth(usergrowth.value).then(()=>{
    navigateTo("/pages_bt10/pages/usergrowth/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
