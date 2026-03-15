<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入用户ID" />
        </uni-forms-item>
        <uni-forms-item label="兑换商品ID" prop="productId">
          <uni-easyinput v-model="form.productId" placeholder="请输入兑换商品ID" />
        </uni-forms-item>
        <uni-forms-item label="消耗积分" prop="pointsUsed">
          <uni-easyinput v-model="form.pointsUsed" placeholder="请输入消耗积分" />
        </uni-forms-item>
        <uni-forms-item label="兑换码" prop="redemptionCode">
          <uni-easyinput v-model="form.redemptionCode" placeholder="请输入兑换码" />
        </uni-forms-item>
        <uni-forms-item label="使用/核销时间" prop="usedTime">
          <uni-datetime-picker type="datetime" v-model="form.usedTime"/>
        </uni-forms-item>
        <uni-forms-item label="过期时间" prop="expiredTime">
          <uni-datetime-picker type="datetime" v-model="form.expiredTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getPointredemption, delPointredemption, addPointredemption, updatePointredemption } from "@/api/bt10/pointredemption";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const pointredemption = ref({
        id: null,
        userId: null,
        productId: null,
        pointsUsed: null,
        bizStatus: null,
        redemptionCode: null,
        usedTime: null,
        expiredTime: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
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
      getPointredemption(params.id).then(res=>{
        pointredemption.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delPointredemption(id).then(()=>{
    navigateTo("/pages/bt10/pointredemption/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddPointredemption() {
  addPointredemption(pointredemption.value).then(()=>{
    navigateTo("/pages/bt10/pointredemption/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
