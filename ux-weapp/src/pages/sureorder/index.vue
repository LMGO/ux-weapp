<template>
  <div>
    <div class="homeBox" v-for="(item,index) in orderdetail" :key="index">
      <!-- 收货人信息 -->
      <div class="myinfo">
        <div class="title">收货人信息</div>
        <div class="receinfo">
          <span class="name">收货人：{{item.name}}</span>
          <span class="tele">电&ensp; 话：{{item.telephone}}</span>
          <span class="changeinfo" @click="change()" >{{changeoradd}}</span>
        </div>
        <div class="address">地&ensp; 址：{{item.address}}</div>
      </div>
      <!-- 线条 -->
      <div class="back"></div>
      <!-- 订单项信息 -->
      <div class="orderinfo">
        <div class="iteminfo" v-for="(ite,i) in item.itemList" :key="i">
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
        <div class="aui-head-access" v-for="(item,j) in list" :key="j">
          <div class="aui-head-access-hd">{{item.name}}</div>
          <span class="aui-head-access-fr">&yen; {{item.number}}</span>
        </div>
      </div>
      <!-- 底部确认 -->
      <div class="botnav">
        <div class="compute">
          合计：
          <span class="yen">&yen;</span>
          <span class="price">{{totalPrice}}</span>
        </div>
        <div class="btn" @click="pay()">确认订单</div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      changeoradd: '切换',
      orderitems:[],//购物车选中的信息
      totalPrice:0.00,
      orderdetail:[{
        name:"马义行",//默认的收货人信息
        telephone:"18487315405",
        address:"云南省昭通",
        itemList:[{//用户选取的商品列表信息
            cid:"0",//商品id
            cname:'布诺芬',
            imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
            type:"医护",//商品类型
            itemPrice:39.9,//商品单价
            number:2,//选中的商品数量
            },{//用户选取的商品列表信息
            cid:"0",//商品id
            cname:'布诺芬',
            imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
            type:"医护",//商品类型
            itemPrice:39.9,//商品单价
            number:2,//选中的商品数量
            }]
      }],
      list:[//订单内部信息
        {name:"商品总数",number:0},
        {name:"商品总价",number:0},
        {name:"实际付款",number:0}
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
    new(){
      console.log(this.orderitems)
      // 获取订单信息
    },

  },
  onLoad: function(options){
    let items = JSON.parse(options.items);
    this.totalPrice = options.totalPrice
    this.orderitems = items;
    //请求订单内容
    console.log(this.orderitems)
    let count =this.orderdetail[0].itemList.length;
    this.$set(this.list[0],"number",count);
    let price = 19.9
    this.$set(this.list[1],"number",price);
    this.$set(this.list[2],"number",price);
    // 根据订单中收货人信息是否为空更改按钮文字
    this.changeoradd="添加"




  },
  created () {
    // let app = getApp()
  },
   async onShow(){
    await this.new()
    // 隐藏电话号码，可使用截取字符方法
    this. orderdetail[0].telephone.toString();
    let tele = this.orderdetail[0].telephone[0]+this.orderdetail[0].telephone[1]+this.orderdetail[0].telephone[2]+'****'+this.orderdetail[0].telephone[7]+this.orderdetail[0].telephone[8]+this.orderdetail[0].telephone[9]+this.orderdetail[0].telephone[10];
    this.$set(this.orderdetail[0],"telephone",tele);
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
  .receinfo{
    margin: 15rpx 0;
    display: flex;
    flex-direction: row;
    font-size: 30rpx;
    .name{
      width: 250rpx;
    }
    .tele{
      flex: 1;
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
