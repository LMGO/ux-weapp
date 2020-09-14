<template>
<section class="aui-flexView">
    <div class="aui-well-comm">
        <div class="aui-well-comm-hd">
            <img :src="user_head">
        </div>
        <div class="aui-well-comm-bd">
            <span>{{user_name}}</span>
        </div>
        <!-- <span class="aui-comm-sign">已登录</span> -->
    </div>
    <!-- 订单 -->
    <div class="order">
      <div class="aui-head-access">
        <span class="aui-head-access-hd">我的订单</span>
        <span class="aui-head-access-fr" @click="totalorder('waitpay')">查看全部<img src="../../../static/images/right-arrow.png" alt=""></span>
      </div>
      <div class="threepart">
        <ul v-for="(item,index) in threepart" :key="index">
          <li @click="totalorder(item.value)">
            <!-- 显示消息通知 -->
            <div v-if="item.show" class="aui-head-access-number">{{item.count}}</div>
            <img :src="item.icon" alt="">
            <p>{{item.text}}</p>
          </li>
        </ul>
      </div>
    </div>

        <div class="aui-head-access" v-for="(item,index) in list" :key="index" @click="tomyaddress()">
            <div class="aui-head-access-hd">{{item.name}}</div>
            <span class="aui-head-access-fr"><img src="../../../static/images/right-arrow.png" alt=""></span>
        </div>
</section>
</template>

<script>
import { messageApi} from '@/utils/api'

export default {
  data () {
    return {
      user_head:this.$store.state.myWxInfo.avatarUrl,
      user_name:this.$store.state.myWxInfo.nickName,
      list:[
        {name:"我的收货地址",number:false}
      ],
      daifukuan:11,
      threepart:[
            {icon:"./../../static/images/wait-pay.png", text:"待付款", value:"waitpay",show:true},
            {icon:"./../../static/images/wait-deliver.png",text:"待发货",value:"waitdeliver",show:true},
            {icon:"./../../static/images/wait-receive.png",text:"待收货",value:"waitreceive",show:true},
            {icon:"./../../static/images/finish.png",text:"已完成",value:"finish",show:false}
      ],
    }
  },

  components: {
    
  },

  methods: {
    // 获取消息页面新消息数量角标
    getcount(){
      let self = this;
      let params = {
        uid: self.$store.state.openId
      }
      messageApi.newmessageCount(params).then(res=>{
        console.log(res.data)
        if(res.data.content!=undefined&&res.data.content.length>0){
            let num = res.data.content.length;
            wx.setTabBarBadge({
              index: 2,
              text: num.toString()
            })
        }else{
          wx.removeTabBarBadge({
            index: 2,
          });
        }
      })
    },
    totalorder(e){
      wx.navigateTo({
             url:'../myorders/main?value='+e,
         })
      },
    tomyaddress(){
        wx.navigateTo({
             url:'../myaddress/main'
         })
    },
    getnumber(){
      let self = this;
      let params = {
            uid: self.$store.state.openId
      }
      self.$fly.get(self.url+"/order/getAllTypeNumberOfOrder",self.$qs.stringify(
          params
      ))
      .then(res=>{
        if(res.data.isSuccess)
          self.threepart[0].count = res.data.content.waitingPay;
          self.threepart[1].count = res.data.content.waitingDelivery;
          self.threepart[2].count = res.data.content.waitingReceipt;
          if(self.threepart[0].count==0){
            self.$set(self.threepart[0],"show",false)
          }
          if(self.threepart[1].count==0){
            self.$set(self.threepart[1],"show",false)
          }
          if(self.threepart[2].count==0){
            self.$set(self.threepart[2],"show",false)
          }
      })
      .catch(err=>{
          console.log(err)
      })
    },
    getshopcount(){
      let self = this;
      let params = {
        uid: self.$store.state.openId
      }
      self.$fly.get(self.url+"/shoppingCart/getItemCount",
          params
      )
      .then(res=>{
        if(res.data.content>0){
            let num = res.data.content;
            wx.setTabBarBadge({
              index: 1,
              text: num.toString()
            })
        }else{
          wx.removeTabBarBadge({
            index: 1,
          });
        }
      })
      .catch(err=>{
        console.log(err)
        wx.showToast({
          title: '服务器异常！',
          icon: 'none',
          duration: 1500
        })
      })						   
    },
  },
onShow(){
    // 获取不同类型订单数量
    this.getnumber()
    this.user_head=this.$store.state.myWxInfo.avatarUrl;
    this.user_name=this.$store.state.myWxInfo.nickName;
    this.getcount()
    this.getshopcount()
    
},
  created () {
      
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.aui-flexView{
  background: rgb(240, 238, 238);
  height: 100vh;
}
.aui-comm-sign {
    display: block;
    border: none;
    color: #fff;
    border-radius: 20px;
    font-size: 16px;
    padding: 5px 10px;
    background-color: #fe5a69;
}

.aui-well-comm-bd {
    cursor: pointer;
    margin-top:10px ;
    flex: 1;
    min-width: 0;
}

.aui-well-comm-hd {
    cursor: pointer;
    margin-right: .8em;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    position: relative;
    img {
    cursor: pointer;
    border: solid 1px rgb(236, 232, 232);
    margin-left: 10px;
    width: 100%;
    max-height: 100%;
    vertical-align: middle;
    border-radius: 100%;
    }
    span {
        font-weight: 400;
        font-size: 17px;
        width: auto;
        float: left;
        // margin-left: 20px;
        white-space: nowrap;
    }
}
.aui-well-comm {
    height: 200rpx;
    background: #fff;
    /* background: #fff; */
    padding: 15px;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}


.aui-head-access { 
    background-color: #fff;
    padding: 12px 15px;
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px #e4e2e2 solid;
  .aui-head-access-hd {
    flex: 1;
    font-size: 15px;
    color: #333333;
  }
  .aui-head-access-fr {
      font-size: 15px;
      margin-right: 20rpx;
      color: cornsilk;
      text-align: right;
      color: #a7a2a2;
      position: relative;
      font-size: 16px;
      img{
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
}
}
.order{
  margin: 20rpx auto;
  border-radius: 10%;
  border: 1px solid #e4e2e2 ;
  width: 98vw;
  
}
.threepart{
  z-index: 999;
  background: #fff;
  position: relative;
  // top: 30vh;
  height:150rpx;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  
  ul{
    list-style: none;
    li{
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .aui-head-access-number{
        position: absolute;
        top: -5rpx;
        right: 5rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20rpx;
        color:white;
        background: red;
        width:35rpx ;
        height: 35rpx;
        border-radius: 17.5rpx;
      }
      p{
        margin-top:1vh;
      }
    }
  }
  img {
    height: 6vh;
    width:6vh ;
  }
}

.order-head { 
    background-color: #fff;
    padding: 12px 15px;
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px #e4e2e2 solid;
}
</style>
