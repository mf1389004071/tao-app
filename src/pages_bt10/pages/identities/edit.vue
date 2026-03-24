<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="身份数值等级(如 0/10/20/30/50/60)" prop="identityLevel">
          <uni-easyinput v-model="form.identityLevel" placeholder="请输入身份数值等级(如 0/10/20/30/50/60)" />
        </uni-forms-item>
        <uni-forms-item label="身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" />
        </uni-forms-item>
        <uni-forms-item label="身份图标URL或名称" prop="icon">
          <uni-easyinput v-model="form.icon" placeholder="请输入身份图标URL或名称" />
        </uni-forms-item>
        <uni-forms-item label="身份主题色" prop="themeColor">
          <uni-easyinput v-model="form.themeColor" placeholder="请输入身份主题色" />
        </uni-forms-item>
        <uni-forms-item label="身份简介" prop="intro">
          <uni-easyinput v-model="form.intro" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="系统法律说明" prop="legalText">
          <uni-easyinput v-model="form.legalText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="权利说明" prop="rightsText">
          <uni-easyinput v-model="form.rightsText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="责任说明" prop="dutiesText">
          <uni-easyinput v-model="form.dutiesText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="利益说明" prop="benefitsText">
          <uni-easyinput v-model="form.benefitsText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="晋升说明" prop="upgradeRulesText">
          <uni-easyinput v-model="form.upgradeRulesText" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="身份付费金额(人民币)" prop="priceAmount">
          <uni-easyinput v-model="form.priceAmount" placeholder="请输入身份付费金额(人民币)" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getIdentities, delIdentities, addIdentities, updateIdentities } from "@/api/bt10/identities";
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
  if(params.identityCode){
      getIdentities(params.identityCode).then(res=>{
        identities.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(identityCode) {
  delIdentities(identityCode).then(()=>{
    navigateTo("/pages_bt10/pages/identities/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddIdentities() {
  addIdentities(identities.value).then(()=>{
    navigateTo("/pages_bt10/pages/identities/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
