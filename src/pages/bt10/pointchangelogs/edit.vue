<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="积分变动量" prop="pointsChange">
          <uni-easyinput v-model="form.pointsChange" placeholder="请输入积分变动量" />
        </uni-forms-item>
        <uni-forms-item label="变动前余额" prop="balanceBefore">
          <uni-easyinput v-model="form.balanceBefore" placeholder="请输入变动前余额" />
        </uni-forms-item>
        <uni-forms-item label="变动后余额" prop="balanceAfter">
          <uni-easyinput v-model="form.balanceAfter" placeholder="请输入变动后余额" />
        </uni-forms-item>
        <uni-forms-item label="原因说明" prop="changeReason">
          <uni-easyinput v-model="form.changeReason" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
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
import { getPointchangelogs, delPointchangelogs, addPointchangelogs, updatePointchangelogs } from "@/api/bt10/pointchangelogs";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const pointchangelogs = ref({
        id: null,
        userId: null,
        changeType: null,
        pointsChange: null,
        balanceBefore: null,
        balanceAfter: null,
        changeReason: null,
        relatedType: null,
        relatedId: null,
        operatorId: null,
        operatorType: null,
        changedTime: null,
        metadata: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getPointchangelogs(params.id).then(res=>{
        pointchangelogs.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delPointchangelogs(id).then(()=>{
    navigateTo("/pages/bt10/pointchangelogs/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddPointchangelogs() {
  addPointchangelogs(pointchangelogs.value).then(()=>{
    navigateTo("/pages/bt10/pointchangelogs/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
