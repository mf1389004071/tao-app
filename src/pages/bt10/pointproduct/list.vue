<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>主键</uni-th>
        <uni-th>商品名称</uni-th>
        <uni-th>描述</uni-th>
        <uni-th>类型：优惠券/咨询/实物/会员等</uni-th>
        <uni-th>兑换所需积分</uni-th>
        <uni-th>库存数量，-1表示不限</uni-th>
        <uni-th>已兑换数量</uni-th>
        <uni-th>商品图</uni-th>
        <uni-th>详情正文</uni-th>
        <uni-th>有效天数</uni-th>
        <uni-th>状态：上架/下架/售罄</uni-th>
        <uni-th>排序</uni-th>
        <uni-th>扩展文本1</uni-th>
        <uni-th>扩展文本2</uni-th>
        <uni-th>扩展文本3</uni-th>
        <uni-th>扩展JSON</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in pointproductList" :key="index">
        <uni-td>{{ item.id }}</uni-td>
        <uni-td>{{ item.name }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
        <uni-td>{{ item.productType }}</uni-td>
        <uni-td>{{ item.pointsRequired }}</uni-td>
        <uni-td>{{ item.stockQuantity }}</uni-td>
        <uni-td>{{ item.soldQuantity }}</uni-td>
        <uni-td>{{ item.imageUrl }}</uni-td>
        <uni-td>{{ item.detailContent }}</uni-td>
        <uni-td>{{ item.validDays }}</uni-td>
        <uni-td>{{ item.bizStatus }}</uni-td>
        <uni-td>{{ item.orderNum }}</uni-td>
        <uni-td>{{ item.text1 }}</uni-td>
        <uni-td>{{ item.text2 }}</uni-td>
        <uni-td>{{ item.text3 }}</uni-td>
        <uni-td>{{ item.jsonData }}</uni-td>
        <uni-td>{{ item.status }}</uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
import  config  from "@/config"
import { listPointproduct} from "@/api/bt10/pointproduct";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 积分商城商品表格数据
const pointproductList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        name: null,
        productType: null,
        pointsRequired: null,
        stockQuantity: null,
        soldQuantity: null,
        imageUrl: null,
        detailContent: null,
        validDays: null,
        bizStatus: null,
        orderNum: null,
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
/** 查询积分商城商品列表 */
function  getList() {
      listPointproduct(queryParams.value).then(response => {
        pointproductList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(id) {
  tab.navigateTo("/pages/bt10/pointproduct/show?id=" + id)
}
/** 查看详情按钮操作 */
function handleEdit(id) {
  tab.navigateTo("/pages/bt10/pointproduct/edit?id=" + id)
}
function handleAdd(id) {
  tab.navigateTo("/pages/bt10/pointproduct/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
