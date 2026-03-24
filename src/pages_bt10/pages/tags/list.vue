<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>标签类型：ABILITY/INTEREST/INDUSTRY/RESOURCE/NEED等</uni-th>
        <uni-th>标签编码(同类型内唯一)</uni-th>
        <uni-th>标签名称</uni-th>
        <uni-th>父标签ID(可选)</uni-th>
        <uni-th>排序</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in tagsList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.tagType }}</uni-td>
        <uni-td>{{ item.code }}</uni-td>
        <uni-td>{{ item.name }}</uni-td>
        <uni-td>{{ item.parentId }}</uni-td>
        <uni-td>{{ item.orderNum }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listTags} from "@/api/bt10/tags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 通用标签定义表表格数据
const tagsList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        tagType: null,
        code: null,
        name: null,
        parentId: null,
        orderNum: null,
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
/** 查询通用标签定义表列表 */
function  getList() {
      listTags(queryParams.value).then(response => {
        tagsList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages_bt10/pages/tags/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages_bt10/pages/tags/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages_bt10/pages/tags/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
