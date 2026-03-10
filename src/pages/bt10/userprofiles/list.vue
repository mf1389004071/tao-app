<template>
  <view>
    <uni-table border stripe type="selection" emptyText="暂无更多数据" :loading="loading">
      <uni-tr>
        <uni-th>用户ID(主键且外键)</uni-th>
        <uni-th>真实姓名</uni-th>
        <uni-th>当前积分余额</uni-th>
        <uni-th>历史累计获得积分</uni-th>
        <uni-th>贡献点余额(1:1人民币)</uni-th>
        <uni-th>历史累计贡献点</uni-th>
        <uni-th>成长阶段：入门/学员/高手/导师</uni-th>
        <uni-th>加入/注册日期</uni-th>
        <uni-th>最后活跃时间</uni-th>
        <uni-th>微信开放平台 unionid</uni-th>
        <uni-th>微信开放平台 openid</uni-th>
        <uni-th>小程序 openid</uni-th>
        <uni-th>企业微信用户ID</uni-th>
        <uni-th>小鹅通用户ID(同步)</uni-th>
        <uni-th>小鹅通原始数据快照</uni-th>
        <uni-th>邀请人用户ID(sys_user.user_id)</uni-th>
        <uni-th>本人邀请码，用于邀请好友</uni-th>
        <uni-th>业务角色：创始人/联创/合伙人/高手/城市主理人/会员</uni-th>
        <uni-th>最美照片URL</uni-th>
        <uni-th>微信头像URL(同步用)</uni-th>
        <uni-th>宣传用头像URL</uni-th>
        <uni-th>个人宣传图URL</uni-th>
        <uni-th>心树图URL(商业定位成果)</uni-th>
        <uni-th>心钥图URL(商业定位成果)</uni-th>
        <uni-th>商业定位文案(探索本质)</uni-th>
        <uni-th>天赋解读与能力总结</uni-th>
        <uni-th>可交流时段描述</uni-th>
        <uni-th>可约状态：可约/已约/不约</uni-th>
        <uni-th>额外画像信息(JSON)，如家庭成员/挑战列表等</uni-th>
        <uni-th>备注</uni-th>
        <uni-th>扩展文本1</uni-th>
        <uni-th>扩展文本2</uni-th>
        <uni-th>扩展文本3</uni-th>
        <uni-th>扩展JSON</uni-th>
        <uni-th>状态</uni-th>
      </uni-tr>
      <uni-tr v-for="(item,index) in userprofilesList" :key="index">
        <uni-td>{{ item.userId }}</uni-td>
        <uni-td>{{ item.realName }}</uni-td>
        <uni-td>{{ item.points }}</uni-td>
        <uni-td>{{ item.totalPoints }}</uni-td>
        <uni-td>{{ item.contributionPoints }}</uni-td>
        <uni-td>{{ item.totalContributionPoints }}</uni-td>
        <uni-td>{{ item.growthStage }}</uni-td>
        <uni-td>{{ item.joinDate }}</uni-td>
        <uni-td>{{ item.lastActiveAt }}</uni-td>
        <uni-td>{{ item.wechatUnionid }}</uni-td>
        <uni-td>{{ item.wechatOpenid }}</uni-td>
        <uni-td>{{ item.miniappOpenid }}</uni-td>
        <uni-td>{{ item.workUserid }}</uni-td>
        <uni-td>{{ item.xiaoeUserId }}</uni-td>
        <uni-td>{{ item.xiaoeData }}</uni-td>
        <uni-td>{{ item.inviterId }}</uni-td>
        <uni-td>{{ item.invitationCode }}</uni-td>
        <uni-td>{{ item.bizRole }}</uni-td>
        <uni-td>{{ item.bestPhotoUrl }}</uni-td>
        <uni-td>{{ item.avatarWechatUrl }}</uni-td>
        <uni-td>{{ item.avatarPromoUrl }}</uni-td>
        <uni-td>{{ item.promoImageUrl }}</uni-td>
        <uni-td>{{ item.heartTreeUrl }}</uni-td>
        <uni-td>{{ item.heartKeyUrl }}</uni-td>
        <uni-td>{{ item.businessPositioning }}</uni-td>
        <uni-td>{{ item.talentSummary }}</uni-td>
        <uni-td>{{ item.availableTimeSlots }}</uni-td>
        <uni-td>{{ item.appointmentStatus }}</uni-td>
        <uni-td>{{ item.extraProfile }}</uni-td>
        <uni-td>{{ item.remark }}</uni-td>
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
import { listUserprofiles} from "@/api/bt10/userprofiles";
import {onLoad,onShow} from "@dcloudio/uni-app";
import { ref } from "vue";

// 总条数
const total = ref(0);
const loading = ref(true)
// 用户信息画像扩展表表格数据
const userprofilesList = ref([])
// 查询参数
const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
        realName: null,
        points: null,
        totalPoints: null,
        contributionPoints: null,
        totalContributionPoints: null,
        growthStage: null,
        joinDate: null,
        lastActiveAt: null,
        wechatUnionid: null,
        wechatOpenid: null,
        miniappOpenid: null,
        workUserid: null,
        xiaoeUserId: null,
        xiaoeData: null,
        inviterId: null,
        invitationCode: null,
        bizRole: null,
        bestPhotoUrl: null,
        avatarWechatUrl: null,
        avatarPromoUrl: null,
        promoImageUrl: null,
        heartTreeUrl: null,
        heartKeyUrl: null,
        businessPositioning: null,
        talentSummary: null,
        availableTimeSlots: null,
        appointmentStatus: null,
        extraProfile: null,
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
/** 查询用户信息画像扩展表列表 */
function  getList() {
      listUserprofiles(queryParams.value).then(response => {
        userprofilesList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      });
}
/** 查看详情按钮操作 */
function handleShow(userId) {
  tab.navigateTo("/pages/bt10/userprofiles/show?userId=" + userId)
}
/** 查看详情按钮操作 */
function handleEdit(userId) {
  tab.navigateTo("/pages/bt10/userprofiles/edit?userId=" + userId)
}
function handleAdd(userId) {
  tab.navigateTo("/pages/bt10/userprofiles/edit")
}
function navigateTo(url){
  tab.navigateTo(url)
}
</script>
