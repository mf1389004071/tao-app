<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="${comment}" prop="contentChunk">
          <uni-easyinput v-model="form.contentChunk" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
        <uni-forms-item label="${comment}" prop="sourceId">
          <uni-easyinput v-model="form.sourceId" placeholder="请输入${comment}" />
        </uni-forms-item>
        <uni-forms-item label="${comment}" prop="createdAt">
          <uni-datetime-picker type="datetime" v-model="form.createdAt"/>
        </uni-forms-item>
        <uni-forms-item label="${comment}" prop="updatedAt">
          <uni-datetime-picker type="datetime" v-model="form.updatedAt"/>
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getAivectors, delAivectors, addAivectors, updateAivectors } from "@/api/bt10/aivectors";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const aivectors = ref({
        id: null,
        contentChunk: null,
        embedding: null,
        metadata: null,
        sourceType: null,
        sourceId: null,
        createdAt: null,
        updatedAt: null
      })
onShow(params=>{
  if(params.id){
      getAivectors(params.id).then(res=>{
        aivectors.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delAivectors(id).then(()=>{
    navigateTo("/pages_bt10/pages/aivectors/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddAivectors() {
  addAivectors(aivectors.value).then(()=>{
    navigateTo("/pages_bt10/pages/aivectors/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
