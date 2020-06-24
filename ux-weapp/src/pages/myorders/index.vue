<template>
  <div>
    <div class="homeBox">
      <div class="navbar">
          <div :class="{navbar_title:showcolor0,navbar_title_active:!showcolor0}" @click="waitpay()">待付款</div>
          <div :class="{navbar_title:showcolor1,navbar_title_active:!showcolor1}" @click="waitdeliver()">待发货</div>
          <div :class="{navbar_title:showcolor2,navbar_title_active:!showcolor2}" @click="waitreceive()">待收货</div>
          <div :class="{navbar_title:showcolor3,navbar_title_active:!showcolor3}" @click="finished()">已完成</div>        
      </div>
    
    
      <!-- 待付款 -->
      <div v-show="show_waitpay" class="container">
        <div class="orderinfo" v-for="(item,index) in ordersList1" :key="index">
          <div class="status">待付款</div>
          <div class="ordertime">{{item.orderTime}}</div>  
          <div class="iteminfo" v-for="(ite,i) in item.orderItems" :key="i" @click="tocomdetail(ite.cid)">
            <div class="centerimg">
              <img :src="ite.imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{ite.cname}}</span>
                  <div class="price"><i>&yen;</i><span>{{ite.itemPrice}}</span></div>
                </div>
                <div class="r-bot">
                    <div class="add" >x {{ite.number}}</div>
                </div>
            </div>
          </div>
          <div class="totalprice">
            总 价 &yen;{{item.totalPrice}}
          </div>
          <div class="receive-detail"> 
            <div class="lookdetail" @click="toorderdetail(item.oid)">查看详情</div>
            <div class="surerece" @click="tofinishpay(item)">付款</div>
          </div>
        </div>
      </div> 
      <!-- 待发货 -->
      <div v-show="show_waitdeliver" class="container">
                  <div class="orderinfo" v-for="(item,index) in ordersList2" :key="index">
          <div class="status">待发货</div>
          <div class="ordertime">{{item.orderTime}}</div> 
          <div class="iteminfo" v-for="(ite,i) in item.orderItems" :key="i" @click="tocomdetail(ite.cid)">
            <div class="centerimg">
              <img :src="ite.imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{ite.cname}}</span>
                  <div class="price"><i>&yen;</i><span>{{ite.itemPrice}}</span></div>
                </div>
                <div class="r-bot">
                    <div class="add" >x {{ite.number}}</div>
                </div>
            </div>
          </div>
          <div class="totalprice">
            总 价 &yen;{{item.totalPrice}}
          </div>
          <div class="to-detail" @click="toorderdetail(item.oid)">查看详情</div>
        </div>
      </div>
      <!-- 待收货 -->
      <div v-show="show_waitreceive" class="container">
        <div class="orderinfo" v-for="(item,index) in ordersList3" :key="index">
          <div class="status">待收货</div>
          <div class="ordertime">{{item.orderTime}}</div>  
          <div class="iteminfo" v-for="(ite,i) in item.orderItems" :key="i" @click="tocomdetail(ite.cid)">
            <div class="centerimg">
              <img :src="ite.imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{ite.cname}}</span>
                  <div class="price"><i>&yen;</i><span>{{ite.itemPrice}}</span></div>
                </div>
                <div class="r-bot">
                    <div class="add" >x {{ite.number}}</div>
                </div>
            </div>
          </div>
          <div class="totalprice">
            总 价 &yen;{{item.totalPrice}}
          </div>
          <div class="receive-detail"> 
            <div class="lookdetail" @click="toorderdetail(item.oid)">查看详情</div>
            <div class="surerece" @click="surereceive(item)">确认收货</div>
          </div>
        </div>
      </div>
      <!-- 已完成 -->
      <div v-show="show_finished" class="container">
        <div class="orderinfo" v-for="(item,index) in ordersList4" :key="index">
          <div class="status">已完成</div>
          <div class="ordertime">{{item.orderTime}}</div>  
          <div class="iteminfo" v-for="(ite,i) in item.orderItems" :key="i" @click="tocomdetail(ite.cid)">
            <div class="centerimg">
              <img :src="ite.imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{ite.cname}}</span>
                  <div class="price"><i>&yen;</i><span>{{ite.itemPrice}}</span></div>
                </div>
                <div class="r-bot">
                    <div class="add" >x {{ite.number}}</div>
                </div>
            </div>
          </div>
          <div class="totalprice">
            总 价 &yen;{{item.totalPrice}}
          </div>
          <!-- <div class="receive-detail"> 
            <div class="lookdetail" @click="toorderdetail(item.oid)">查看详情</div>
            <div class="surerece">删除订单</div>
          </div> -->
          <div class="to-detail" @click="toorderdetail(item.oid)">查看详情</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { sendMessage } from '@/utils/socket'

export default {
  components: {
    
  },

  data () {
    return {
      showcolor0:false,
      showcolor1:true,
      showcolor2:true,
      showcolor3:true,
      show_waitpay: true,
      show_waitdeliver: false,
      show_waitreceive: false,
      show_finished: false,
      ordersList1:[
      //   {
      //     oid:"0",
      //     totalPrice:'79.80',
      //     status:'',
      //     orderTime:"",
      //     deliverTime:'',
      //     "address": {
      //       "sid": 7,
      //       "uid": "o6ADs4ntkX4EHTllQSpPktUu_elg",
      //       "name": "沐雙惜",
      //       "telephone": "18487315400",
      //       "address": "昆明市云南大学楸苑三栋",
      //       "default": true,
      //       "delete": false
      //     },
      //     orderItems:[{ 
      //       itemId:'',     
      //       imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
      //       cid:"0",
      //       cname:"布诺芬",
      //       type:2,
      //       number:2,
      //       itemPrice:39.9
      //     }]
      // }
      ],
      ordersList2:[],
      ordersList3:[],
      ordersList4:[],
    }
  },
  methods:{
    waitpay(){
      this.showcolor0 = false;
      this.showcolor1 = this.showcolor2 = this.showcolor3 = true;
      this.show_waitdeliver = this.show_waitreceive = this.show_finished = false;
      this.show_waitpay = true;
      let self = this;
      let params = {
        uid: self.$store.state.openId,
        status:1
      }
      self.$fly.get(self.url+'/order/getOrderByStatus',
        params
      )
      .then(res=>{
        this.ordersList1 = res.data.content
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 支付
    tofinishpay(e){
      console.log(e)
      let self = this;
      wx.showModal({
            title: '确认支付？',
            content: "合计："+e.totalPrice,
            success: function (res) {
                if (res.confirm) { 
                  let params = {
                    oid:e.oid,
                    status:2,//此时为带发货状态
                  }
                  self.$fly.request(self.url+"/order/updateOrderStatus",  self.$qs.stringify(params), {method:"PUT"})
                  .then(res=>{
                  console.log(res)
                  if(res.data.isSuccess){
                      let params = {
                        toUserId:"manage",
                        contentText:true
                      }
                      let data = JSON.stringify(params)
                      sendMessage(data)
                      wx.showToast({
                        title: '支付成功！',
                        icon: 'success',
                        duration: 1500
                      })
                      let e = 'waitdeliver'
                     wx.redirectTo({
                          url:'../myorders/main?value='+e,
                     })
                  }
                  })
                  .catch(err=>{
                    console.log(err)
                  })
                }else{

                }
            }
        })
    },
    waitdeliver(){
      this.showcolor1 = false;
      this.showcolor0 = this.showcolor2 = this.showcolor3 = true;
      this.show_waitpay = this.show_waitreceive = this.show_finished = false;
      this.show_waitdeliver = true;
      let self = this;
      let params = {
        uid: self.$store.state.openId,
        status:2
      }
      self.$fly.get(self.url+'/order/getOrderByStatus',
        params
      )
      .then(res=>{
        this.ordersList2 = res.data.content
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    waitreceive(){
      this.showcolor2 = false;
      this.showcolor0 = this.showcolor1 = this.showcolor3 = true;
      this.show_waitpay = this.show_waitdeliver = this.show_finished = false;
      this.show_waitreceive = true;
      let self = this;
      let params = {
        uid: self.$store.state.openId,
        status:3
      }
      self.$fly.get(self.url+'/order/getOrderByStatus',
        params
      )
      .then(res=>{
        this.ordersList3 = res.data.content
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    //确认收货
    surereceive(e){
      let self = this;
        let params = {
          oid:e.oid,
          status:4,//此时为已完成状态
        }
        self.$fly.put(self.url+"/order/updateOrderStatus",self.$qs.stringify(
              params
          ))
        .then(res=>{
        console.log(res)
        if(res.data.isSuccess){
            wx.showToast({
              title: '确认收货成功！',
              icon: 'success',
              duration: 1500
            })
            let e = 'finish'
            wx.redirectTo({
                url:'../myorders/main?value='+e,
            })
        }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    finished(){
      this.showcolor3 = false;
      this.showcolor0 = this.showcolor1 = this.showcolor2 = true;
      this.show_waitpay = this.show_waitdeliver = this.show_waitreceive = false;
      this.show_finished = true;
      let self = this;
      let params = {
        uid: self.$store.state.openId,
        status:4
      }
      self.$fly.get(self.url+'/order/getOrderByStatus',
        params
      )
      .then(res=>{
        this.ordersList4 = res.data.content
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    tocomdetail(e){
      console.log(e)
      wx.navigateTo({
        url:'../com-detail/main?id='+e,
      })
    },
    toorderdetail(e){
      console.log(e)
      wx.navigateTo({
        url:'../order-detail/main?id='+e,
      })
    }
  },      
  created () {
  },
  onLoad: function(options){
    if(options.value=='waitpay'){
      this.waitpay()
    }else if (options.value=='waitdeliver'){
      this.waitdeliver()
    }else if(options.value=='waitreceive'){
      this.waitreceive()
    }else{
      this.finished()
    }
  }
}
</script>

<style lang="scss" scoped>
.homeBox {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgb(247, 250, 243);
    overflow-y: scroll;
    z-index: -999; //背景
}
 .navbar {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
    position: fixed;
    z-index: 9999;
    top: 0;
    height: 100rpx;
    border-bottom: 1px solid rgb(235, 232, 232);
    background-color: rgb(247, 250, 243);
  }
  .navbar_title {
    color: #000;
    font-size: 25rpx;
    max-width: 100%;
    height: 80rpx;
    box-sizing: border-box;
    line-height: 80rpx;
    max-width: 100%;
    border-bottom:none;
    transition: border-bottom 1000ms ease-in 0ms;
    opacity: 1;
  }
   .navbar_title_active {
    font-size: 28rpx;
    color: red;
    height: 80rpx;
    box-sizing: border-box;
    line-height: 80rpx;
    max-width: 100%;
    border-bottom: 1px solid red;
    transition: border-bottom 1000ms ease-in 0ms;
    opacity: 1;
  }
.container{
  margin-top:120rpx ;
}
  .orderinfo{
    background-color: #fff;
    margin: 20rpx 0;
    padding: 0 20rpx 10rpx 20rpx;
    .ordertime{
      font-size: 20rpx;
      color:gray;
    }
    .status{
      float: right;
      margin: 15rpx;
      font-size: 25rpx;
      letter-spacing: 5rpx;
      color: red;
    }
    .iteminfo{
      clear: both;
      background-color: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 10rpx auto;
      padding:0 10rpx ;
      border-radius: 5%;
      .centerimg{
        img{
          height: 160rpx;
          width: 160rpx;
          border-radius: 5%;
        }
      }
      .right{
        align-self: start;
        flex:1;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        padding-left: 15rpx;
        height: 180rpx;
        .r-top{
          margin-top: 15rpx;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .title{
            align-self: flex-start;
            font-size: 30rpx;
          }
          .price{
            font-size: 30rpx;
            font-family:Arial;
            color: rgb(43, 42, 42);
            display: flex;
            i{
              font-size: 30rpx;
              align-self: center;
            }
            span{
              margin-left: 10rpx;
            }
          }
        }
        .r-bot{
          flex: 1;
          position: relative;
          margin-bottom: 10rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          .add{
            position: absolute;
            right: 10rpx;
            color: gray;
            font-size: 30rpx;
          }

        }
      
      }
    }
    .totalprice{
      margin: 15rpx 0;
      box-sizing: border-box;
      width: 300rpx;
      height: 50rpx;
      color: rgb(80, 79, 79);
      font-size: 25rpx;
      line-height: 50rpx;
      margin-left: 400rpx;
      border-radius: 10%;
      text-align: center;
    }
    .receive-detail{
      // background-color: blue;
      margin-left: 360rpx;
      box-sizing: border-box;
      display: flex;
      .lookdetail{
        box-sizing: border-box;
        width: 150rpx;
        height: 60rpx;
        font-size: 30rpx;
        line-height: 60rpx;
        background-color: #ffffff;
        border:1px solid black;
        margin-left: 20rpx;
        border-radius: 10%;
        text-align: center;  
      }
      .surerece{
        box-sizing: border-box;
        width: 150rpx;
        height: 60rpx;
        font-size: 30rpx;
        line-height: 60rpx;
        background-color: #ffffff;
        border:1px solid red;
        color: red;
        margin-left: 20rpx;
        border-radius: 10%;
        text-align: center;        
      }
    }
    .to-detail{
      box-sizing: border-box;
      width: 150rpx;
      height: 60rpx;
      font-size: 30rpx;
      line-height: 60rpx;
      background-color: #ffffff;
      border:1px solid black;
      margin-left: 550rpx;
      border-radius: 10%;
      text-align: center;
    }
}
</style>
