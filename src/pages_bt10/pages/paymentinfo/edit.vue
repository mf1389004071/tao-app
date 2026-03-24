<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="业务订单号" prop="orderNo">
          <uni-easyinput v-model="form.orderNo" placeholder="请输入业务订单号" />
        </uni-forms-item>
        <uni-forms-item label="下单用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入下单用户ID" />
        </uni-forms-item>
        <uni-forms-item label="关联业务ID" prop="relatedId">
          <uni-easyinput v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </uni-forms-item>
        <uni-forms-item label="订单总金额" prop="totalAmount">
          <uni-easyinput v-model="form.totalAmount" placeholder="请输入订单总金额" />
        </uni-forms-item>
        <uni-forms-item label="贡献点支付额" prop="contribAmount">
          <uni-easyinput v-model="form.contribAmount" placeholder="请输入贡献点支付额" />
        </uni-forms-item>
        <uni-forms-item label="积分支付额" prop="pointsAmount">
          <uni-easyinput v-model="form.pointsAmount" placeholder="请输入积分支付额" />
        </uni-forms-item>
        <uni-forms-item label="现金支付额" prop="cashAmount">
          <uni-easyinput v-model="form.cashAmount" placeholder="请输入现金支付额" />
        </uni-forms-item>
        <uni-forms-item label="支付方式：微信/支付宝/贡献点/积分等" prop="paymentMethod">
          <uni-easyinput v-model="form.paymentMethod" placeholder="请输入支付方式：微信/支付宝/贡献点/积分等" />
        </uni-forms-item>
        <uni-forms-item label="第三方支付单号" prop="paymentNo">
          <uni-easyinput v-model="form.paymentNo" placeholder="请输入第三方支付单号" />
        </uni-forms-item>
        <uni-forms-item label="支付成功时间" prop="paidTime">
          <uni-datetime-picker type="datetime" v-model="form.paidTime"/>
        </uni-forms-item>
        <uni-forms-item label="退款金额" prop="refundAmount">
          <uni-easyinput v-model="form.refundAmount" placeholder="请输入退款金额" />
        </uni-forms-item>
        <uni-forms-item label="退款原因" prop="refundReason">
          <uni-easyinput v-model="form.refundReason" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="退款时间" prop="refundedTime">
          <uni-datetime-picker type="datetime" v-model="form.refundedTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getPaymentinfo, delPaymentinfo, addPaymentinfo, updatePaymentinfo } from "@/api/bt10/paymentinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const paymentinfo = ref({
        id: null,
        orderNo: null,
        userId: null,
        orderType: null,
        relatedType: null,
        relatedId: null,
        totalAmount: null,
        contribAmount: null,
        pointsAmount: null,
        cashAmount: null,
        paymentStatus: null,
        paymentMethod: null,
        paymentNo: null,
        paidTime: null,
        refundAmount: null,
        refundReason: null,
        refundedTime: null,
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
      getPaymentinfo(params.id).then(res=>{
        paymentinfo.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delPaymentinfo(id).then(()=>{
    navigateTo("/pages_bt10/pages/paymentinfo/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddPaymentinfo() {
  addPaymentinfo(paymentinfo.value).then(()=>{
    navigateTo("/pages_bt10/pages/paymentinfo/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
