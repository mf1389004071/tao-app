<template>
  <view>
    <uni-card :is-shadow="false" is-full>
      <uni-section title="身份编码(如 FOUNDER/PARTNER)" :sub-title="identities.identityCode" type="line"></uni-section>
      <uni-section title="身份数值等级(如 0/10/20/30/50/60)" :sub-title="identities.identityLevel" type="line"></uni-section>
      <uni-section title="身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" :sub-title="identities.name" type="line"></uni-section>
      <uni-section title="身份图标URL或名称" :sub-title="identities.icon" type="line"></uni-section>
      <uni-section title="身份主题色" :sub-title="identities.themeColor" type="line"></uni-section>
      <uni-section title="身份简介" :sub-title="identities.intro" type="line"></uni-section>
      <uni-section title="系统法律说明" :sub-title="identities.legalText" type="line"></uni-section>
      <uni-section title="权利说明" :sub-title="identities.rightsText" type="line"></uni-section>
      <uni-section title="责任说明" :sub-title="identities.dutiesText" type="line"></uni-section>
      <uni-section title="利益说明" :sub-title="identities.benefitsText" type="line"></uni-section>
      <uni-section title="晋升说明" :sub-title="identities.upgradeRulesText" type="line"></uni-section>
      <uni-section title="身份付费金额(人民币)" :sub-title="identities.priceAmount" type="line"></uni-section>
      <uni-section title="备注" :sub-title="identities.remark" type="line"></uni-section>
      <uni-section title="状态" :sub-title="identities.status" type="line"></uni-section>
    </uni-card>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { getIdentities } from "@/api/bt10/identities";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const identities = ref({
  identityCode: null,
  identityLevel: null,
  name: null,
  icon: null,
  themeColor: null,
  intro: null,
  legalText: null,
  rightsText: null,
  dutiesText: null,
  benefitsText: null,
  upgradeRulesText: null,
  priceAmount: null,
  createTime: null,
  updateTime: null,
  remark: null,
  delFlag: null,
  status: null
})

onLoad(() => {
})
onShow(params => {
  getIdentities(params.identityCode).then(res=>{
    identities.value = res.data
  })
})
function addBaseUrl(arr){
  return arr.map(item => config.baseUrl+item)
}
</script>
