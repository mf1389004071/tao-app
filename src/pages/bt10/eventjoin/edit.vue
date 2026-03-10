<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入活动ID" />
        </uni-forms-item>
        <uni-forms-item label="报名用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入报名用户ID" />
        </uni-forms-item>
        <uni-forms-item label="支付金额" prop="paymentAmount">
          <uni-easyinput v-model="form.paymentAmount" placeholder="请输入支付金额" />
        </uni-forms-item>
        <uni-forms-item label="支付方式：贡献点/积分/混合/现金等" prop="paymentMethod">
          <uni-easyinput v-model="form.paymentMethod" placeholder="请输入支付方式：贡献点/积分/混合/现金等" />
        </uni-forms-item>
        <uni-forms-item label="支付单号" prop="paymentNo">
          <uni-easyinput v-model="form.paymentNo" placeholder="请输入支付单号" />
        </uni-forms-item>
        <uni-forms-item label="签到时间" prop="checkedInTime">
          <uni-datetime-picker type="datetime" v-model="form.checkedInTime"/>
        </uni-forms-item>
        <uni-forms-item label="签到方式：二维码/定位/手动" prop="checkInMethod">
          <uni-easyinput v-model="form.checkInMethod" placeholder="请输入签到方式：二维码/定位/手动" />
        </uni-forms-item>
        <uni-forms-item label="转化产品ID" prop="conversionProductId">
          <uni-easyinput v-model="form.conversionProductId" placeholder="请输入转化产品ID" />
        </uni-forms-item>
        <uni-forms-item label="转化金额" prop="conversionAmount">
          <uni-easyinput v-model="form.conversionAmount" placeholder="请输入转化金额" />
        </uni-forms-item>
        <uni-forms-item label="转化备注" prop="conversionNotes">
          <uni-easyinput v-model="form.conversionNotes" type="textarea" placeholder="请输入内容" />
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
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventjoin, delEventjoin, addEventjoin, updateEventjoin } from "@/api/bt10/eventjoin";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventjoin = ref({
        id: null,
        eventId: null,
        userId: null,
        bizStatus: null,
        joinForm: null,
        paymentStatus: null,
        paymentAmount: null,
        paymentMethod: null,
        paymentNo: null,
        checkedInTime: null,
        checkInMethod: null,
        checkInLocation: null,
        conversionStatus: null,
        conversionProductId: null,
        conversionAmount: null,
        conversionNotes: null,
        createId: null,
        updateId: null,
        deleteId: null,
        createTime: null,
        updateTime: null,
        deleteTime: null,
        delFlag: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
        remark: null,
        status: null
      })
onShow(params=>{
  if(params.id){
      getEventjoin(params.id).then(res=>{
        eventjoin.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventjoin(id).then(()=>{
    navigateTo("/pages/bt10/eventjoin/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventjoin() {
  addEventjoin(eventjoin.value).then(()=>{
    navigateTo("/pages/bt10/eventjoin/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
