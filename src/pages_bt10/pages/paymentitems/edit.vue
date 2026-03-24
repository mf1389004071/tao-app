<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="支付订单ID" prop="paymentId">
          <uni-easyinput v-model="form.paymentId" placeholder="请输入支付订单ID" />
        </uni-forms-item>
        <uni-forms-item label="明细名称(商品/服务/身份等)" prop="itemName">
          <uni-easyinput v-model="form.itemName" placeholder="请输入明细名称(商品/服务/身份等)" />
        </uni-forms-item>
        <uni-forms-item label="原价(单价)" prop="originalAmount">
          <uni-easyinput v-model="form.originalAmount" placeholder="请输入原价(单价)" />
        </uni-forms-item>
        <uni-forms-item label="实际计价金额(单价，可为0表示赠送)" prop="amount">
          <uni-easyinput v-model="form.amount" placeholder="请输入实际计价金额(单价，可为0表示赠送)" />
        </uni-forms-item>
        <uni-forms-item label="数量" prop="quantity">
          <uni-easyinput v-model="form.quantity" placeholder="请输入数量" />
        </uni-forms-item>
        <uni-forms-item label="发放方式：AUTO/MANUAL/COUPON等" prop="grantMethod">
          <uni-easyinput v-model="form.grantMethod" placeholder="请输入发放方式：AUTO/MANUAL/COUPON等" />
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getPaymentitems, delPaymentitems, addPaymentitems, updatePaymentitems } from "@/api/bt10/paymentitems";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const paymentitems = ref({
        id: null,
        paymentId: null,
        itemType: null,
        itemName: null,
        originalAmount: null,
        amount: null,
        quantity: null,
        isGift: [],
        isTransferable: [],
        canBuyForOthers: [],
        usageStatus: null,
        grantMethod: null,
        relatedType: null,
        relatedId: null,
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
      getPaymentitems(params.id).then(res=>{
        paymentitems.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delPaymentitems(id).then(()=>{
    navigateTo("/pages_bt10/pages/paymentitems/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddPaymentitems() {
  addPaymentitems(paymentitems.value).then(()=>{
    navigateTo("/pages_bt10/pages/paymentitems/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
