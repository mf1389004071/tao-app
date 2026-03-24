<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="本平台用户ID" prop="userId">
          <uni-easyinput v-model="form.userId" placeholder="请输入本平台用户ID" />
        </uni-forms-item>
        <uni-forms-item label="小鹅通用户ID" prop="xiaoeUserId">
          <uni-easyinput v-model="form.xiaoeUserId" placeholder="请输入小鹅通用户ID" />
        </uni-forms-item>
        <uni-forms-item label="匹配置信度0-1" prop="confidenceScore">
          <uni-easyinput v-model="form.confidenceScore" placeholder="请输入匹配置信度0-1" />
        </uni-forms-item>
        <uni-forms-item label="建立映射时间" prop="mappedTime">
          <uni-datetime-picker type="datetime" v-model="form.mappedTime"/>
        </uni-forms-item>
        <uni-forms-item label="备注" prop="remark">
          <uni-easyinput v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getXiaoeusermapping, delXiaoeusermapping, addXiaoeusermapping, updateXiaoeusermapping } from "@/api/bt10/xiaoeusermapping";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const xiaoeusermapping = ref({
        id: null,
        userId: null,
        xiaoeUserId: null,
        mappingType: null,
        confidenceScore: null,
        mappedTime: null,
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
      getXiaoeusermapping(params.id).then(res=>{
        xiaoeusermapping.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delXiaoeusermapping(id).then(()=>{
    navigateTo("/pages_bt10/pages/xiaoeusermapping/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddXiaoeusermapping() {
  addXiaoeusermapping(xiaoeusermapping.value).then(()=>{
    navigateTo("/pages_bt10/pages/xiaoeusermapping/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
