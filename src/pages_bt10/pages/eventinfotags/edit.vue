<template>
  <view>
        <uni-forms ref="form" :model="form" :rules="rules" label-width="80px">
        <uni-forms-item label="活动ID" prop="eventId">
          <uni-easyinput v-model="form.eventId" placeholder="请输入活动ID" />
        </uni-forms-item>
        <uni-forms-item label="标签ID" prop="tagId">
          <uni-easyinput v-model="form.tagId" placeholder="请输入标签ID" />
        </uni-forms-item>
        <uni-forms-item label="排序" prop="orderNum">
          <uni-easyinput v-model="form.orderNum" placeholder="请输入排序" />
        </uni-forms-item>
      </uni-forms>
  </view>
</template>

<script setup>
import { getEventinfotags, delEventinfotags, addEventinfotags, updateEventinfotags } from "@/api/bt10/eventinfotags";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 表单参数
const eventinfotags = ref({
        id: null,
        eventId: null,
        tagId: null,
        orderNum: null,
        createTime: null
      })
onShow(params=>{
  if(params.id){
      getEventinfotags(params.id).then(res=>{
        eventinfotags.value = res.data
      })
    }
})
onLoad(()=> {
})

/** 删除按钮操作 */
function handleDelete(id) {
  delEventinfotags(id).then(()=>{
    navigateTo("/pages_bt10/pages/eventinfotags/list")
  })
}
/** ${subTable.functionName}添加按钮操作 */
function handleAddEventinfotags() {
  addEventinfotags(eventinfotags.value).then(()=>{
    navigateTo("/pages_bt10/pages/eventinfotags/list")
  })
}
function navigateTo(url){
    tab.navigateTo(url)
}
</script>
