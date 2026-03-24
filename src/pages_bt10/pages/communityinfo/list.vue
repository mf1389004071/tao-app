<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>社群名称</uni-th>
        <uni-th>创建者(合伙人)用户ID</uni-th>
        <uni-th>是否公开可见</uni-th>
        <uni-th>最大成员数</uni-th>
        <uni-th>当前成员数</uni-th>
        <uni-th>封面图</uni-th>
        <uni-th>所在城市</uni-th>
        <uni-th>状态：正常/已归档/已解散</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in communityinfoList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.name }}</uni-td>
        <uni-td>{{ item.ownerId }}</uni-td>
        <uni-td>{{ item.isPublic }}</uni-td>
        <uni-td>{{ item.maxMembers }}</uni-td>
        <uni-td>{{ item.memberCount }}</uni-td>
        <uni-td>{{ item.coverImageUrl }}</uni-td>
        <uni-td>{{ item.city }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listCommunityinfo} from "@/api/bt10/communityinfo";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 合伙人创建的社群表格数据
const communityinfoList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        name: null,
        ownerId: null,
        isPublic: null,
        maxMembers: null,
        memberCount: null,
        coverImageUrl: null,
        city: null,
        bizStatus: null,
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
/** 查询合伙人创建的社群列表 */
function  getList() {
      listCommunityinfo(queryParams.value).then(response => {
        communityinfoList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/communityinfo/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/communityinfo/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/communityinfo/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
