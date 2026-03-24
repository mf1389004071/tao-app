<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID(sys_user.user_id)" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID(sys_user.user_id)" />
        </uni-forms-item>
        <uni-forms-item label="本次变动积分(正获得负消耗)" prop="points">
          <uni-easyinput v-model="form.points" placeholder="请输入本次变动积分(正获得负消耗)" />
        </uni-forms-item>
        <uni-forms-item label="变动前积分余额" prop="balanceBefore">
          <uni-easyinput v-model="form.balanceBefore" placeholder="请输入变动前积分余额" />
        </uni-forms-item>
        <uni-forms-item label="变动后积分余额" prop="balanceAfter">
          <uni-easyinput v-model="form.balanceAfter" placeholder="请输入变动后积分余额" />
        </uni-forms-item>
        <uni-forms-item label="关联业务主键" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务主键" />
        </uni-forms-item>
        <uni-forms-item label="该笔积分过期时间" prop="expiredTime">
          <uni-datetime-picker type="datetime" v-model="form.expiredTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUserpointlogs, delUserpointlogs, addUserpointlogs, updateUserpointlogs } from "@/api/bt10/userpointlogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const userpointlogs = ref({
        id: null,
        userId: null,
        actionType: null,
        points: null,
        balanceBefore: null,
        balanceAfter: null,
        relatedType: null,
        relatedId: null,
        expiredTime: null,
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
      getUserpointlogs(params.id).then(res=>{
        userpointlogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUserpointlogs(id).then(()=>{
    navigateTo("/pages_bt10/pages/userpointlogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUserpointlogs() {
  addUserpointlogs(userpointlogs.value).then(()=>{
    navigateTo("/pages_bt10/pages/userpointlogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
