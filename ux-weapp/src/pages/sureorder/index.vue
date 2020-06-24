<template>
  <div>
    <div class="homeBox" v-for="(item,index) in orderdetail" :key="index">
      <!-- 收货人信息 -->
      <div class="myinfo">
        <div class="title">收货人信息</div>
        <div class="receinfo">
          <span class="name">收货人：{{item.address.name}}</span>
          <span class="tele">电&ensp; 话：{{item.address.telephone}}</span>
          <span class="changeinfo" @click="change()" >{{changeoradd}}</span>
        </div>
        <div class="address">地&ensp; 址：{{item.address.address}}</div>
      </div>
      <!-- 线条 -->
      <div class="back"></div>
      <!-- 订单项信息 -->
      <div class="orderinfo">
        <div class="iteminfo" v-for="(ite,i) in item.orderItems" :key="i">
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
        <div class="aui-head-access">
          <div class="aui-head-access-hd">商品总数</div>
          <span class="aui-head-access-fr">{{item.orderItems.length}}</span>
        </div>
        <div class="aui-head-access" v-for="(i,k) in list" :key="k">
          <div class="aui-head-access-hd">{{i.name}}</div>
          <span class="aui-head-access-fr">&yen;{{item.totalPrice}}</span>
        </div>
      </div>
      <!-- 底部确认 -->
      <div class="botnav">
        <div class="compute">
          合计：
          <span class="yen">&yen;</span>
          <span class="price">{{totalPrice}}</span>
        </div>
        <div class="btn" @click="topay()">确认订单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { sendMessage } from '@/utils/socket'

export default {
  data () {
    return {
      changeoradd: '切换',
      orderitems:[],//购物车选中的信息
      totalPrice:0.00,
      orderdetail:[
      //   {
      //   address:{
      //     sid:7,
      //     uid:'',
      //     name:"马义行",//默认的收货人信息
      //     telephone:"18487315405",
      //     address:"云南省昭通",
      //   },
      //   orderItems:[{//用户选取的商品列表信息
      //       checked: false,
      //       cid:"0",//商品id
      //       cname:'布诺芬',
      //       imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
      //       type:1,//商品类型
      //       itemId: 51,
      //       itemPrice:5.6,//商品单价
      //       number:4,//选中的商品数量
      //       }]
      // }
      ],
      list:[//订单内部信息
        {name:"商品总价"},
        {name:"实际付款"}
      ],

    }
  },

  components: {
    // card
  },

  methods: {
    change(){
      console.log(this.changeoradd)
      if(this.changeoradd=="切换"){
        // 修改默认地址页
        wx.navigateTo({
          url:'../myaddress/main'
        })
      }
      else{
        // 新增地址页
          wx.navigateTo({
          url:'../addaddress/main'
        })
      }
    },
    topay(){
      let self = this;
      let num = '';
      for (let i = 0; i < 5; i++) {
        num += Math.floor(Math.random() * 10);
      }
      console.log(num);
      const time = new Date()
      const ordertime = formatTime(time);
      const oid = time.getTime().toString() + num.toString();
      console.log('订单号'+oid);
      console.log('下单时间'+ordertime)
          wx.showModal({
            title: '确认支付？',
            content: self.totalPrice,
            success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  //提交订单
                  self.$fly.request({
                    method:'post',
                    url:self.url+'/order/generateOrder',
                    body:{
                            itemList:self.orderitems,
                            order:{
                              'deliveryTime':'',//空，管理端负责
                              'oid':oid,
                              'orderTime':ordertime,
                              'sid':self.orderdetail[0].address.sid,
                              'status':2,//此时为待发货状态
                              'totalPrice':self.totalPrice
                            }
                            
                        }
                  })
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
                     //删除订单项
                      for (const i of self.orderitems) {
                        self.del(i)
                      }
                  }
                  })
                  .catch(err=>{
                    console.log(err)
                  })

                }else{
                  console.log('用户点击取消')
                  //提交订单
                  self.$fly.request({
                    method:'post',
                    url:self.url+'/order/generateOrder',
                    body:{
                            itemList:self.orderitems,
                             order:{
                              oid:oid,
                              deliveryTime:'',//空，管理端负责
                              orderTime:ordertime,
                              sid:self.orderdetail[0].address.sid,
                              status:1,//此时为已待付款状态
                              totalPrice:self.totalPrice
                            }
                        }
                  })
                  .then(res=>{
                    console.log(res)
                   if(res.data.isSuccess){
                      wx.showToast({
                        title: '取消支付！',
                        icon: 'success',
                        duration: 1500
                      })
                  let e = 'waitpay'
                     wx.redirectTo({
                          url:'../myorders/main?value='+e,
                     })
                     //删除订单项
                      for (const i of self.orderitems) {
                        self.del(i)
                      }
                  }
                  })
                  .catch(err=>{
                    console.log(err)
                  })
                }
 
            }
      })
    }, 
    //删除订单项
    async del(e){
      console.log(e)
      let self = this;
      // for(let i = 0;i<self.List.length;i++){
      //   if(self.List[i].checked){
      //     this.$set(e,"checked",false);
      //   }
      // }
      //删除接口
      let params = {
        itemId: i
      }
      self.$fly.delete(self.url+"/shoppingCart/deleteShoppingItem",
          params
      )
      .then(async res=>{
        if(res.data.isSuccess){
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
      
    
    new(){
      wx.showLoading({ title: '拼命加载中...' })
      console.log(this.orderitems+"数组")
      // 获取订单信息
      let self = this;
      self.$fly.request({
        method:'post',
        url:self.url+'/order/getOrderBody',
        body:{
                itemList:self.orderitems,
                uid:self.$store.state.openId
              
            }
      })
      .then(res=>{
        console.log(res.data)
        if(res.data.isSuccess){
          this.orderdetail[0] = res.data.content;
          console.log(this.orderdetail)
          wx.hideLoading()
          if(this.orderdetail[0].address.sid!=null){
            wx.hideLoading()
            this.changeoradd="切换"
                // 隐藏电话号码，可使用截取字符方法
            this. orderdetail[0].address.telephone.toString();
            let tele = this.orderdetail[0].address.telephone[0]+this.orderdetail[0].address.telephone[1]+this.orderdetail[0].address.telephone[2]+'****'+this.orderdetail[0].address.telephone[7]+this.orderdetail[0].address.telephone[8]+this.orderdetail[0].address.telephone[9]+this.orderdetail[0].address.telephone[10];
            this.$set(this.orderdetail[0].address,"telephone",tele);
          }else{
            his.changeoradd="添加"
          }
          this.$forceUpdate();

        }
      })
      .catch(err=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
                        title: '系统异常！',
                        icon: 'none',
                        duration: 1500
                      })
        
      })

    },

  },
  onLoad: function(options){
    let items = JSON.parse(options.items);
    this.totalPrice = options.totalPrice
    this.orderitems = items;
    //请求订单内容
    console.log(this.orderitems)

    // 根据订单中收货人信息是否为空更改按钮文字
  },
  created () {
    // let app = getApp()
  },
   async onShow(){
    await this.new()
  }
}
</script>

<style lang="scss" scoped>
.homeBox {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
    background-color: rgb(247, 250, 243);
    overflow-y:scroll;
    z-index: -999;//背景
}

.myinfo{
  // height: 200rpx;
  background-color: #fff;
  width:96vw;
  margin: 0 auto;
  border-radius: 5%;
  padding:10rpx 20rpx;
  box-sizing: border-box;
  color: rgba(69, 67, 67, 0.87);
  .title{
    padding: 20rpx 0;
    margin-top: 15rpx;
    font-size: 35rpx;
    color: black;
    border-bottom: 1px solid rgb(198, 194, 194);
  }
  .address{
        font-size: 25rpx;
    }
  .receinfo{
    margin: 15rpx 0;
    display: flex;
    flex-direction: row;
    font-size: 25rpx;
    .name{
      width: 250rpx;
      flex-shrink: 1;
    }
    .tele{
      flex: 1;
      flex-shrink: 1;

    }
    .changeinfo{
      font-size: 25rpx;
      width: 80rpx;
      height: 40rpx;
      border: 1px solid black;
      border-radius: 20rpx;
      text-align: center;
      line-height: 40rpx;
    }
  }
  // .address{
  //   background-color: rgb(30, 204, 204);
  // }
}
//渐变分割线
.back{
  margin: 0 auto;
  height: 1px;
  width: 96vw;
  background: -webkit-linear-gradient(left,red,white,blue,red,white,blue,red,white,blue,red,white,blue,red,white,blue); 
}
.iteminfo{
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  width: 96vw;
  margin: 10rpx auto;
  padding:0 10rpx ;
  box-sizing: border-box;
  .centerimg{
    img{
      height: 200rpx;
      width: 200rpx;
      border-radius: 5%;
    }
  }
  .right{
    align-self: start;
    flex:1;
    display: flex;
    flex-direction: column;
    padding-left: 15rpx;
    height: 200rpx;
    .r-top{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title{
        align-self: flex-start;
        font-size: 30rpx;
      }
      .price{
        font-size: 40rpx;
        font-family:Arial;
        color: red;
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
        color-adjust: gray;
        font-size: 30rpx;
      }

    }
    
  }
}

.aui-head-access { 
    margin: 15rpx auto;
    width: 96vw;
    height: 100rpx;
    background-color: #fff;
    padding: 30rpx 20rpx;
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px #e4e2e2 solid;
    box-sizing: border-box;
    border-radius: 20rpx;
    .aui-head-access-hd {
      flex: 1;
      font-size: 35rpx;;
      color: #333333;
    }
    .aui-head-access-fr {
      align-self:end;
      font-size: 15px;
      margin-right: 20rpx;
      color: cornsilk;
      text-align: right;
      color: #a7a2a2;
      position: relative;
      font-size: 16px;
  }
}

.botnav{
  height: 100rpx;
  width: 100vw;
  position: fixed;
  background-color: #FFFFFF;
  bottom: 0;
  border-top: 1px solid rgb(233, 230, 230);
  border-bottom: 1px solid rgb(233, 230, 230);
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 30rpx;
  box-sizing: border-box;
  padding: 0 10rpx;
  .compute{
    font-size: 40rpx;
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    .yen{
      color: red;
      font-size: 30rpx;
    }
    .price{
      color: red;
      font-size: 40rpx;
      margin-left: 15rpx;
    }
  }
  .btn{
    margin-top: 10rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    width: 400rpx;
    background: red;
    color: white;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
  }
}
</style>
