<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>社群ID</uni-th>
        <uni-th>用户ID</uni-th>
        <uni-th>角色：群主/管理员/成员</uni-th>
        <uni-th>状态：在群/已退出/被移出</uni-th>
        <uni-th>加入时间</uni-th>
        <uni-th>离开时间</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in communitymemberList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.communityId }}</uni-td>
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.role }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.joinedTime }}</uni-td>
        <uni-td>{{ item.leftTime }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listCommunitymember} from "@/api/bt10/communitymember";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 社群与用户的成员关系表格数据
const communitymemberList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        communityId: null,
        userId: null,
        role: null,
        bizStatus: null,
        joinedTime: null,
        leftTime: null,
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
/** 查询社群与用户的成员关系列表 */
function  getList() {
      listCommunitymember(queryParams.value).then(response => {
        communitymemberList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/communitymember/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/communitymember/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/communitymember/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
