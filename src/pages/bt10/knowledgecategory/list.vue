<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>分类名称</uni-th>
        <uni-th>URL/唯一标识</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>父分类ID</uni-th>
        <uni-th>排序</uni-th>
        <uni-th>状态</uni-th>
        <uni-th>图标</uni-th>
        <uni-th>主题色</uni-th>
        <uni-th>可见权限等级1-5</uni-th>
        <uni-th>扩展文本1</uni-th>
        <uni-th>扩展文本2</uni-th>
        <uni-th>扩展文本3</uni-th>
        <uni-th>扩展JSON</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in knowledgecategoryList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.name }}</uni-td>
        <uni-td>{{ item.slug }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.parentId }}</uni-td>
        <uni-td>{{ item.orderNum }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
        <uni-td>{{ item.icon }}</uni-td>
        <uni-td>{{ item.color }}</uni-td>
        <uni-td>{{ item.permissionLevel }}</uni-td>
        <uni-td>{{ item.text1 }}</uni-td>
        <uni-td>{{ item.text2 }}</uni-td>
        <uni-td>{{ item.text3 }}</uni-td>
        <uni-td>{{ item.jsonData }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listKnowledgecategory} from "@/api/bt10/knowledgecategory";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 知识库分类表格数据
const knowledgecategoryList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        name: null,
        slug: null,
        parentId: null,
        orderNum: null,
        status: null,
        icon: null,
        color: null,
        permissionLevel: null,
        text1: null,
        text2: null,
        text3: null,
        jsonData: null
      })
onLoad(()=>{
})
onShow(()=>{
  getList();
})

function addBaseUrl(arr){
	return arr.map(item => config.baseUrl+item)
}
/** 查询知识库分类列表 */
function  getList() {
      listKnowledgecategory(queryParams.value).then(response => {
        knowledgecategoryList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/knowledgecategory/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/knowledgecategory/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/knowledgecategory/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
