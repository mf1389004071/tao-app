<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="身份编码" prop="identityCode">
          <uni-easyinput v-model="form.identityCode" placeholder="请输入身份编码" />
        </uni-forms-item>
        <uni-forms-item label="获得时间" prop="acquiredTime">
          <uni-datetime-picker type="datetime" v-model="form.acquiredTime"/>
        </uni-forms-item>
        <uni-forms-item label="到期时间(可为空)" prop="expiredTime">
          <uni-datetime-picker type="datetime" v-model="form.expiredTime"/>
        </uni-forms-item>
        <uni-forms-item label="来源业务ID(如支付订单ID)" prop="sourceId">
          <uni-easyinput v-model="form.sourceId" placeholder="请输入来源业务ID(如支付订单ID)" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getUseridentities, delUseridentities, addUseridentities, updateUseridentities } from "@/api/bt10/useridentities";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const useridentities = ref({
        id: null,
        userId: null,
        identityCode: null,
        isPrimary: [],
        bizStatus: null,
        acquiredTime: null,
        expiredTime: null,
        sourceType: null,
        sourceId: null,
        createTime: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getUseridentities(params.id).then(res=>{
        useridentities.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delUseridentities(id).then(()=>{
    navigateTo("/pages/bt10/useridentities/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddUseridentities() {
  addUseridentities(useridentities.value).then(()=>{
    navigateTo("/pages/bt10/useridentities/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
