<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>本平台用户ID</uni-th>
        <uni-th>小鹅通用户ID</uni-th>
        <uni-th>映射方式：自动/手动</uni-th>
        <uni-th>匹配置信度0-1</uni-th>
        <uni-th>建立映射时间</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in xiaoeusermappingList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.xiaoeUserId }}</uni-td>
        <uni-td>{{ item.mappingType }}</uni-td>
        <uni-td>{{ item.confidenceScore }}</uni-td>
        <uni-td>{{ item.mappedTime }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listXiaoeusermapping} from "@/api/bt10/xiaoeusermapping";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 本平台用户与小鹅通用户ID映射表格数据
const xiaoeusermappingList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        userId: null,
        xiaoeUserId: null,
        mappingType: null,
        confidenceScore: null,
        mappedTime: null,
        status: null,
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询本平台用户与小鹅通用户ID映射列表 */
function  getList() {
      listXiaoeusermapping(queryParams.value).then(response => {
        xiaoeusermappingList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/xiaoeusermapping/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/xiaoeusermapping/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/xiaoeusermapping/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
