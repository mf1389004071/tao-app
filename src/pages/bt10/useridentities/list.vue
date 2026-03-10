<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>身份编码</uni-th>
        <uni-th>是否当前主身份</uni-th>
        <uni-th>状态：ACTIVE/EXPIRED/REVOKED</uni-th>
        <uni-th>获得时间</uni-th>
        <uni-th>到期时间(可为空)</uni-th>
        <uni-th>来源类型：PAYMENT/EVENT/MANUAL等</uni-th>
        <uni-th>来源业务ID(如支付订单ID)</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in useridentitiesList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.identityCode }}</uni-td>
        <uni-td>{{ item.isPrimary }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.acquiredTime }}</uni-td>
        <uni-td>{{ item.expiredTime }}</uni-td>
        <uni-td>{{ item.sourceType }}</uni-td>
        <uni-td>{{ item.sourceId }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listUseridentities} from "@/api/bt10/useridentities";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户身份关系表表格数据
const useridentitiesList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        identityCode: null,
        isPrimary: null,
        bizStatus: null,
        acquiredTime: null,
        expiredTime: null,
        sourceType: null,
        sourceId: null,
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
/** 查询用户身份关系表列表 */
function  getList() {
      listUseridentities(queryParams.value).then(response => {
        useridentitiesList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/useridentities/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/useridentities/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/useridentities/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
