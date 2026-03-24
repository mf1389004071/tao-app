<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="商品名称" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入商品名称" />
        </uni-forms-item>
        <uni-forms-item label="兑换所需积分" prop="pointsRequired">
          <uni-easyinput v-model="form.pointsRequired" placeholder="请输入兑换所需积分" />
        </uni-forms-item>
        <uni-forms-item label="库存数量，-1表示不限" prop="stockQuantity">
          <uni-easyinput v-model="form.stockQuantity" placeholder="请输入库存数量，-1表示不限" />
        </uni-forms-item>
        <uni-forms-item label="已兑换数量" prop="soldQuantity">
          <uni-easyinput v-model="form.soldQuantity" placeholder="请输入已兑换数量" />
        </uni-forms-item>
        <uni-forms-item label="商品图" prop="imageUrl">
          <uni-easyinput v-model="form.imageUrl" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="详情正文">
          <!-- <editor v-model="form.detailContent" :min-height="192"/> -->
        </uni-forms-item>
        <uni-forms-item label="有效天数" prop="validDays">
          <uni-easyinput v-model="form.validDays" placeholder="请输入有效天数" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getPointproduct, delPointproduct, addPointproduct, updatePointproduct } from "@/api/bt10/pointproduct";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const pointproduct = ref({
        id: null,
        name: null,
        productType: null,
        pointsRequired: null,
        stockQuantity: null,
        soldQuantity: null,
        imageUrl: null,
        detailContent: null,
        validDays: null,
        bizStatus: null,
        orderNum: null,
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
      getPointproduct(params.id).then(res=>{
        pointproduct.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delPointproduct(id).then(()=>{
    navigateTo("/pages_bt10/pages/pointproduct/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddPointproduct() {
  addPointproduct(pointproduct.value).then(()=>{
    navigateTo("/pages_bt10/pages/pointproduct/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
