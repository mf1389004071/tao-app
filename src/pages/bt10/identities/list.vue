<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>身份编码(如 FOUNDER/PARTNER)</uni-th>
        <uni-th>身份数值等级(如 0/10/20/30/50/60)</uni-th>
        <uni-th>身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方</uni-th>
        <uni-th>身份图标URL或名称</uni-th>
        <uni-th>身份主题色</uni-th>
        <uni-th>身份简介</uni-th>
        <uni-th>系统法律说明</uni-th>
        <uni-th>权利说明</uni-th>
        <uni-th>责任说明</uni-th>
        <uni-th>利益说明</uni-th>
        <uni-th>晋升说明</uni-th>
        <uni-th>身份付费金额(人民币)</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in identitiesList" :key="index">
        <uni-td>{{ item.identityCode }}</uni-td>
        <uni-td>{{ item.identityLevel }}</uni-td>
        <uni-td>{{ item.name }}</uni-td>
        <uni-td>{{ item.icon }}</uni-td>
        <uni-td>{{ item.themeColor }}</uni-td>
        <uni-td>{{ item.intro }}</uni-td>
        <uni-td>{{ item.legalText }}</uni-td>
        <uni-td>{{ item.rightsText }}</uni-td>
        <uni-td>{{ item.dutiesText }}</uni-td>
        <uni-td>{{ item.benefitsText }}</uni-td>
        <uni-td>{{ item.upgradeRulesText }}</uni-td>
        <uni-td>{{ item.priceAmount }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listIdentities} from "@/api/bt10/identities";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 系统身份定义表表格数据
const identitiesList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
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
        status: null
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询系统身份定义表列表 */
function  getList() {
      listIdentities(queryParams.value).then(response => {
        identitiesList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(identityCode) {
  tab.navigateTo("/pages/bt10/identities/show?identityCode=" + identityCode)
}
/** 查看详情按钮操作 */
function handleEdit(identityCode) {
  tab.navigateTo("/pages/bt10/identities/edit?identityCode=" + identityCode)
}
function handleAdd(identityCode) {
  tab.navigateTo("/pages/bt10/identities/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
