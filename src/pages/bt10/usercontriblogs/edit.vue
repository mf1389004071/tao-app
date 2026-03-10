<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID(sys_user.user_id)" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID(sys_user.user_id)" />
        </uni-forms-item>
        <uni-forms-item label="本次变动金额" prop="amount">
          <uni-easyinput v-model="form.amount" placeholder="请输入本次变动金额" />
        </uni-forms-item>
        <uni-forms-item label="变动前贡献点余额" prop="balanceBefore">
          <uni-easyinput v-model="form.balanceBefore" placeholder="请输入变动前贡献点余额" />
        </uni-forms-item>
        <uni-forms-item label="变动后贡献点余额" prop="balanceAfter">
          <uni-easyinput v-model="form.balanceAfter" placeholder="请输入变动后贡献点余额" />
        </uni-forms-item>
        <uni-forms-item label="说明" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </uni-forms-item>
        <uni-forms-item label="支付单号" prop="paymentNo">
          <uni-easyinput v-model="form.paymentNo" placeholder="请输入支付单号" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUsercontriblogs, delUsercontriblogs, addUsercontriblogs, updateUsercontriblogs } from "@/api/bt10/usercontriblogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const usercontriblogs = ref({
        id: null,
        userId: null,
        actionType: null,
        amount: null,
        balanceBefore: null,
        balanceAfter: null,
        remark: null,
        relatedType: null,
        relatedId: null,
        paymentNo: null,
        delFlag: null,
        createTime: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getUsercontriblogs(params.id).then(res=>{
        usercontriblogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUsercontriblogs(id).then(()=>{
    navigateTo("/pages/bt10/usercontriblogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUsercontriblogs() {
  addUsercontriblogs(usercontriblogs.value).then(()=>{
    navigateTo("/pages/bt10/usercontriblogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
