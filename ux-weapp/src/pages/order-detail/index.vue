<template>
  <div>
    <div class="homeBox" v-for="(item,index) in orderdetail" :key="index">
      <div class="topstutas">
        <div class="text">{{status}}</div>
        <!-- <div class="rest-time" v-if="time">{{resttime}}</div> -->
      </div>
      <!-- 收货人信息 -->
      <div class="myinfo">
        <div class="title">收货人信息</div>
        <div class="receinfo">
          <span class="name">收货人：{{item.address.name}}</span>
          <span class="tele">电&ensp; 话：{{item.address.telephone}}</span>
          <!-- <span class="changeinfo" @click="change()" >{{changeoradd}}</span> -->
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
          <span class="price">{{item.totalPrice}}</span>
        </div>
        <div class="btn" v-show="topay" @click="tofinishpay(item)">去付款</div>
        <div class="btn" v-show="tosurereceive" @click="surereceive(item)">确认收货</div>
      </div>
    </div>
  </div>
</template>

<script>

import { formatTime } from '@/utils/index'

export default {
  data () {
    return {
      topay:false,//控制底部按钮
      tosurereceive:false,//控制底部按钮
      time: true,//是否显示剩余时间
      resttime:"",
      status:'',
      orderdetail:[
      //   {
      //       oid:"0",
      //       totalPrice:"79.80",
      //       status:"",
      //       orderTime:'',
      //       deliveryTime: "",
      //       address:{
      //           sid: 7,
      //           uid: "o6ADs4ntkX4EHTllQSpPktUu_elg",
      //           name: "沐雙惜",
      //           telephone: "18487315400",
      //           address: "昆明市云南大学楸苑三栋",
      //           default: true,
      //           delete: false
      //       },
      //       orderItems:[{       //订单里包含的订单项商品
      //         "itemId": 1,
      //         "cid": "f8275737-1aa4-49a2-85bf-441f1576cc74",
      //         "imgId": [
      //           "http://cdn.fengblog.xyz/5953e202-d291-42ff-8957-a30aa43eb588timg (3).jpeg"
      //         ],
      //         "cname": "鸡肉",
      //         "type": 2,
      //         "itemPrice": 30,
      //         "number": 2,
      //         "checked": false
      //       }]
      // }
      ],
      list:[//订单内部信息
        {name:"商品总价"},
        {name:"实际付款"}
      ],

    }
  },

  methods: {
    getoederdetail(e){
      let self = this;
      let params = {
        oid:e
      }
      self.$fly.get(self.url+'/order/getOrder',
        params
      )
      .then(res=>{
        console.log(res);
       this.orderdetail[0]= res.data.content;
       this.orderdetail[0].address.telephone.toString();
        let tele = this.orderdetail[0].address.telephone[0]+this.orderdetail[0].address.telephone[1]+this.orderdetail[0].address.telephone[2]+'****'+this.orderdetail[0].address.telephone[7]+this.orderdetail[0].address.telephone[8]+this.orderdetail[0].address.telephone[9]+this.orderdetail[0].address.telephone[10];
        this.$set(this.orderdetail[0].address,"telephone",tele);
        if(this.orderdetail[0].status==1){
          this.status = "等待买家付款~";
          this.topay = true
          this.tosurereceive = false;
        }else if(this.orderdetail[0].status==2||this.orderdetail[0].status==4){
              this.status = "等待卖家发货~";
              this.tosurereceive = false;
              this.topay = false
        }else if(this.orderdetail[0].status==4){
              this.status = "订单已完成";
              this.tosurereceive = false;
              this.topay = false
        }else{
          this.topay = false
          this.tosurereceive = true;
          this.status = "卖家已发货~";
        }
        this.$forceUpdate();

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
                  self.$fly.request(self.url+"/order/updateOrderStatus",  {oid:e.oid,status:2,}, {method:"PUT"})
                  .then(res=>{
                  console.log(res)
                  if(res.data.isSuccess){
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

  },
  onLoad: function(options){
    console.log(options.id)
    this.getoederdetail(options.id)
    // this.resttime = formatTime(new Date())-this.orderdetail[0].orderTime;

  },
  created () {
    // let app = getApp()
  },
  onShow(){
    // await this.new()
    // 隐藏电话号码，可使用截取字符方法
    
    
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
.topstutas{
  border-top: 1px solid rgb(221, 219, 219);
  height: 150rpx;
  background-color: red;
  width: 100vw;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 40rpx;
  padding-left: 100rpx;

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
    font-size: 30rpx;
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
  margin: 25rpx auto;
  height: 1px;
  width: 96vw;
  background: -webkit-linear-gradient(left,red,white,blue,red,white,blue,red,white,blue,red,white,blue,red,white,blue); 
}
// .orderinfo{
//   margin-top: 25rpx;
// }
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
