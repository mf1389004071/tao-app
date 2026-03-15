<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="主键" :sub-title="pointproduct.id" type="line"></uni-section>
      <uni-section title="商品名称" :sub-title="pointproduct.name" type="line"></uni-section>
      <uni-section title="类型：优惠券/咨询/实物/会员等" :sub-title="pointproduct.productType" type="line"></uni-section>
      <uni-section title="兑换所需积分" :sub-title="pointproduct.pointsRequired" type="line"></uni-section>
      <uni-section title="库存数量，-1表示不限" :sub-title="pointproduct.stockQuantity" type="line"></uni-section>
      <uni-section title="已兑换数量" :sub-title="pointproduct.soldQuantity" type="line"></uni-section>
      <uni-section title="商品图" :sub-title="pointproduct.imageUrl" type="line"></uni-section>
      <uni-section title="详情正文" :sub-title="pointproduct.detailContent" type="line"></uni-section>
      <uni-section title="有效天数" :sub-title="pointproduct.validDays" type="line"></uni-section>
      <uni-section title="状态：上架/下架/售罄" :sub-title="pointproduct.bizStatus" type="line"></uni-section>
      <uni-section title="排序" :sub-title="pointproduct.orderNum" type="line"></uni-section>
      <uni-section title="状态" :sub-title="pointproduct.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getPointproduct } from "@/api/bt10/pointproduct";
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

onLoad(() => {
})
onShow(params => {
  getPointproduct(params.id).then(res=>{
    pointproduct.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
