<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="标签编码(同类型内唯一)" prop="code">
          <uni-easyinput v-model="form.code" placeholder="请输入标签编码(同类型内唯一)" />
        </uni-forms-item>
        <uni-forms-item label="标签名称" prop="name">
          <uni-easyinput v-model="form.name" placeholder="请输入标签名称" />
        </uni-forms-item>
        <uni-forms-item label="父标签ID(可选)" prop="parentId">
          <uni-easyinput v-model="form.parentId" placeholder="请输入父标签ID(可选)" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getTags, delTags, addTags, updateTags } from "@/api/bt10/tags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const tags = ref({
        id: null,
        tagType: null,
        code: null,
        name: null,
        parentId: null,
        orderNum: null,
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
  if(params.id){
      getTags(params.id).then(res=>{
        tags.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delTags(id).then(()=>{
    navigateTo("/pages/bt10/tags/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddTags() {
  addTags(tags.value).then(()=>{
    navigateTo("/pages/bt10/tags/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
