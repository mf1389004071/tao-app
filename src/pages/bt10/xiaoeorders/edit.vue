<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="小鹅通订单号" prop="xiaoeOrderNo">
          <uni-easyinput v-model="form.xiaoeOrderNo" placeholder="请输入小鹅通订单号" />
        </uni-forms-item>
        <uni-forms-item label="关联本平台用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入关联本平台用户ID" />
        </uni-forms-item>
        <uni-forms-item label="小鹅通订单状态" prop="orderState">
          <uni-easyinput v-model="form.orderState" placeholder="请输入小鹅通订单状态" />
        </uni-forms-item>
        <uni-forms-item label="实际支付金额" prop="actualFee">
          <uni-easyinput v-model="form.actualFee" placeholder="请输入实际支付金额" />
        </uni-forms-item>
        <uni-forms-item label="商品名称" prop="goodsName">
          <uni-easyinput v-model="form.goodsName" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="支付状态" prop="payState">
          <uni-easyinput v-model="form.payState" placeholder="请输入支付状态" />
        </uni-forms-item>
        <uni-forms-item label="第三方交易号" prop="tradeNo">
          <uni-easyinput v-model="form.tradeNo" placeholder="请输入第三方交易号" />
        </uni-forms-item>
        <uni-forms-item label="小鹅通侧创建时间" prop="xiaoeCreateTime">
          <uni-datetime-picker type="datetime" v-model="form.xiaoeCreateTime"/>
        </uni-forms-item>
        <uni-forms-item label="最近同步时间" prop="lastSyncTime">
          <uni-datetime-picker type="datetime" v-model="form.lastSyncTime"/>
        </uni-forms-item>
        <uni-forms-item label="本地订单号" prop="orderNo">
          <uni-easyinput v-model="form.orderNo" placeholder="请输入本地订单号" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" placeholder="请输入备注" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本1" prop="text1">
          <uni-easyinput v-model="form.text1" placeholder="请输入扩展文本1" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本2" prop="text2">
          <uni-easyinput v-model="form.text2" placeholder="请输入扩展文本2" />
        </uni-forms-item>
        <uni-forms-item label="扩展文本3" prop="text3">
          <uni-easyinput v-model="form.text3" placeholder="请输入扩展文本3" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getXiaoeorders, delXiaoeorders, addXiaoeorders, updateXiaoeorders } from "@/api/bt10/xiaoeorders";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const xiaoeorders = ref({
        id: null,
        xiaoeOrderNo: null,
        userId: null,
        orderState: null,
        actualFee: null,
        goodsName: null,
        goodsType: null,
        spuType: null,
        payState: null,
        payType: null,
        tradeNo: null,
        xiaoeCreateTime: null,
        studentInfo: null,
        invoiceInfo: null,
        syncStatus: null,
        lastSyncTime: null,
        createTime: null,
        updateTime: null,
        orderNo: null,
        remark: null,
        processStatus: null,
        delFlag: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getXiaoeorders(params.id).then(res=>{
        xiaoeorders.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delXiaoeorders(id).then(()=>{
    navigateTo("/pages/bt10/xiaoeorders/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddXiaoeorders() {
  addXiaoeorders(xiaoeorders.value).then(()=>{
    navigateTo("/pages/bt10/xiaoeorders/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
