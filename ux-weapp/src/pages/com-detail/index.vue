<template>
  <div class="homeBox">
    <swiper  class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="500">
        <block v-for="(item, index) in comlist[0].imgId" :key="index">
            <swiper-item>
                <image :src="item" class="slide-image" mode="aspectFill"/>
            </swiper-item>
        </block>
    </swiper>
    <div class="cominfo">
      <div class="price">
        <span><span>{{comlist[0].cname}}</span><i>&yen;</i>{{comlist[0].price}}</span>
        <div class="repandsale"> <span>月销： {{comlist[0].saleVolume}}</span> /<span>还剩： {{comlist[0].repertory}}</span> </div>
      </div>
      <div class="intro"> {{comlist[0].description}}</div>
    </div>
    <div class="imgshow" v-for="(item,index) in comlist[0].imgId" :key="index">
      <img :src="item" alt="">
    </div>
    <!-- 底部两个按钮 -->
    <div class="addorbuy"><span class="add" @click="showadd()">添加到购物车</span><span class="buy" @click="showbuy()">立即购买</span></div>
    <!-- 遮罩层及购物车选择数量弹窗 -->
    <div class="mask" v-show="showmask" @touchmove.stop.prevent="TouchMove()" @click="escshowmask()">
        <div :class="{choosenumberbefore:chhoosenumber,choosenumberafter:!chhoosenumber,choosenumber:true}" @click.stop="">
          <!-- 取消 -->
          <div class="escadd"><img src="../../../static/images/esc.png" alt="" @click="escshowmask()"></div>
          <div class="li">
            <div class="left">
                <img :src="comlist[0].imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{comlist[0].cname}}</span>
                  <span class="price">&yen;{{comlist[0].price}}</span>
                </div>
            </div>
          </div>
          <div class="number">
            <div class="text">购买数量</div>
            <div class="click">
              <span class="countnumber" @click="subcount()">-</span>
              <span >{{count}}</span>
              <span class="countnumber" @click="addcount()">+</span>
            </div>
          </div>
          <div class="btn" @click.stop="cofirmadd()">确定</div>
        </div>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      showmask:false,//添加到购物者的遮罩层
      count:1,//默认数量
      chhoosenumber:true,
      value:'',
      comlist:[{
        cid:'0',
        cname:'布诺芬',
        imgId:['https://iknow-pic.cdn.bcebos.com/8ad4b31c8701a18b82ac2fae992f07082938fe8f?x-bce-process=image/resize,m_lfit,w_600,h_800,limit_1','http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg','https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png'],
        price:9.9,
        repertory:15,
        description:'防御病毒有效率高',
        type:'医护',
        saleVolume:10//销量
      }],
    }
  },

  components: {
    // card
  },

  methods: {
    showadd(){
      this.value = "add";
      this.addtoshopingcart();
    },
    showbuy(){
      this.value = "buy";
      this.addtoshopingcart();
    },
//弹出添加数量界面
    addtoshopingcart(){
      this.TouchMove()//遮罩层滑动问题
      this.showmask = true;
      this.chhoosenumber = false;
    },
    //解决遮罩层穿透滑动问题
    TouchMove(){

    },
    //退出选择数量界面
    escshowmask(){
      this.showmask = false;
      this.chhoosenumber = true;
      this.count = 1;
      this.value = "";
    },
    subcount(){
      if(this.count>1){
        this.count--
      }
    },
    addcount(){
      //小于当前库存
      if(this.count<5){
        this.count++
      }else{
        wx.showToast({
          title: '库存不足！',
          icon: 'none',
          duration: 1500
      })
      }
    },
    cofirmadd(){
      let self = this;
      console.log(self.value);
      console.log(self.count);
      // 添加到购物车接口
      // 根据value决定请求哪个接口
      self.escshowmask();
    }
  },

  created () {
    // let app = getApp()
     //移除角标
  //  wx.removeTabBarBadge({
  //    index: 2,
  //  })
    let num = 10;
    wx.setTabBarBadge({
      index: 1,
      text: num.toString()
    })
  },
  onLoad: function(options){
    console.log(options.id)
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
    z-index: -999
}
.swiper,.swiper .slide-image{
  width:100vw;
  height:800rpx;
  // border-radius: 5%;
}
.cominfo{
  margin: 10rpx 0;
  background: #fff;
  padding: 0 20rpx;
  width: 100vw;
  .price{
    color: red;
    display: flex;
    // background: yellow;
    // justify-content: center;
    span {
      height: 80rpx;
      font-size: 50rpx;
      flex: 1;
      span{
        color:black;
      }
      i{
        margin:0 10rpx;
        font-size: 30rpx;
        display: inline;
      }
    }
    .repandsale{
      width: 40%;
      // background: violet;
      font-size: 20rpx;
      color: wheat;
      span{
        font-size: 20rpx;
        color: gray;
        margin: 0 15rpx;
        height: 80rpx;
        line-height: 80rpx;
      }
    }
  }
 
}
.imgshow{
  margin: 15rpx 15rpx;
  height: 500rpx;
  width: 95vw;
  border-radius: 5%;
  img{
    height: 500rpx;
    width: 95vw;
    border-radius: 5%;
  }
}
.addorbuy{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  font-size: 35rpx;
  justify-content: center;
  color: white;
  .add{
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    box-sizing: border-box;
    border-right:1px solid gray;
    background-color: orange;
  }
  .buy{
    width: 30%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    background-color: red;
  }
}
/* 点击添加购物车后的遮罩层 */
.mask{
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  // opacity: 0.5;
  z-index: 999;
  position: fixed;
  top: 0;
    .choosenumber{
      opacity:1;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 800rpx;
      width: 100%;
      z-index: 9999;
      background: white;
      display: flex;
      flex-direction: column;
      .escadd{
        cursor: pointer;
        position: absolute;
        top:0;
        right: 0;
        height:60rpx;
        width: 60rpx;
        border-radius: 30rpx;
        img{
          height:60rpx;
          width: 60rpx;
          border-radius: 30rpx;
        }
      }
      .li{
        cursor: pointer;  
        height: 300rpx;
        display: flex;
        flex-direction: row;
        width: 96vw;
        margin: 20rpx auto;
        background-color: #ffffff;
        box-sizing: border-box;
        border-radius: 5%;
        .left{
          margin: auto;
          img{
            height: 290rpx;
            width: 290rpx;
            border-radius: 5%;
          }
        }
        .right{
          flex:1;
          display: flex;
          flex-direction: column;
          padding-left: 15rpx;
          .r-top{
            // height: 8vh;
            margin: 20rpx 30rpx 0 0;
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
            }
          } 
        }
      }
      .number{
        flex: 1;
        width: 96vw;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        .text{
          font-size: 40rpx;
          height: 80rpx;
          width: 60%;
          line-height: 80rpx;
        }
        .click{
          flex: 1;
          height: 80rpx;
          display: flex;
          span{
            height: 80rpx;
            width: 80rpx;
            font-size: 40rpx;
            margin-left: 15rpx;
            line-height: 80rpx;
            text-align: center;
          }
          .countnumber{
            background-color: rgb(236, 240, 240);
          }
        }
        // background-color: ;
      }
      .btn{
        width: 100%;
        height: 100rpx;
        align-self: flex-start;
        color: white;
        font-size: 40rpx;
        line-height: 100rpx;
        text-align: center;
        background-color: orange;
      }
    }
    .choosenumberbefore{
      transform: translateY(100%);
      transition: transform 1s linear ;
    }
    .choosenumberafter{
      transform: translateY(0%);
      transition: transform 1s linear ;
    }
}
</style>
