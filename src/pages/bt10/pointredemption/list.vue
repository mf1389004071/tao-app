<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>兑换商品ID</uni-th>
        <uni-th>消耗积分</uni-th>
        <uni-th>状态：待发放/已完成/已取消/已过期</uni-th>
        <uni-th>兑换码</uni-th>
        <uni-th>使用/核销时间</uni-th>
        <uni-th>过期时间</uni-th>
        <uni-th>扩展文本1</uni-th>
        <uni-th>扩展文本2</uni-th>
        <uni-th>扩展文本3</uni-th>
        <uni-th>扩展JSON</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in pointredemptionList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.productId }}</uni-td>
        <uni-td>{{ item.pointsUsed }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.redemptionCode }}</uni-td>
        <uni-td>{{ item.usedTime }}</uni-td>
        <uni-td>{{ item.expiredTime }}</uni-td>
        <uni-td>{{ item.text1 }}</uni-td>
        <uni-td>{{ item.text2 }}</uni-td>
        <uni-td>{{ item.text3 }}</uni-td>
        <uni-td>{{ item.jsonData }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listPointredemption} from "@/api/bt10/pointredemption";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户积分兑换记录表格数据
const pointredemptionList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        productId: null,
        pointsUsed: null,
        bizStatus: null,
        redemptionCode: null,
        usedTime: null,
        expiredTime: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null,
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
/** 查询用户积分兑换记录列表 */
function  getList() {
      listPointredemption(queryParams.value).then(response => {
        pointredemptionList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/pointredemption/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/pointredemption/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/pointredemption/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
