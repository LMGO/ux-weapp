<template>
  <div class="homeBox">
    <div v-for="(item, index0) in comlist" :key="index0">
      <swiper  class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="500">
        <block v-for="(i, index1) in item.imgId" :key="index1">
            <swiper-item>
                <image :src="i" class="slide-image" mode="aspectFill"/>
            </swiper-item>
        </block>
      </swiper>
      <div class="cominfo" >
        <div class="price">
          <span><span>{{item.cname}}</span><i>&yen;</i>{{item.price}}</span>
          <div class="repandsale"> <span>月销： {{item.saleVolume}}</span> /<span>还剩： {{comlist[0].repertory}}</span> </div>
        </div>
        <div class="intro"> {{item.description}}</div>
      </div>
      <div class="imgshow" v-for="(j,index2) in item.imgId" :key="index2">
        <img :src="j" alt="">
      </div>
      <!-- 底部两个按钮 -->
      <div class="addorbuy"><span class="add" @click="showadd(item)">添加到购物车</span><span class="buy" @click="showbuy(item)">立即购买</span></div>
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
      comlist:[],
      add:{
        cid:'',
        cname:'',
        imgId:[],
        price:0,
        repertory:0,
        description:'',
        type:0,
        saleVolume:0//销量
      },//选择数量界面
    }
  },

  components: {
    // card
  },

  methods: {
    // 获取详情
    getcomdetail(e){
      let self = this;
      let params = {
        cid: e
      }
      self.$fly.get(self.url+"/mall/getCommodityDetail",
          params
      )
      .then(res=>{
        if(res.data.isSuccess){
          // 复制给商品信息数组
            self.$set(self.comlist,0,res.data.content);
            console.log(self.comlist)
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
    showadd(item){
      this.add = item
      console.log(item,this.add)
      this.value = "add";
      this.addtoshopingcart();
    },
    showbuy(item){
      this.add = item
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
        if(this.count<this.add.repertory){
          if(this.count<5){
              this.count++
          }else{
              wx.showToast({
                title: '限购五件！',
                icon: 'none',
                duration: 1500
            })
          }
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
      if(self.value =="add"){
        self.addtoshoppingcart()
      }else{
          //直接购买
          self.escshowmask();
      }
    },
    addtoshoppingcart(){
      let self =this;
      let params = {
        uid: self.$store.state.openId,
        cid:self.add.cid,
        number:self.count
      }
      self.$fly.post(self.url+"/shoppingCart/addShoppingItem",self.$qs.stringify(
                    params
      ))
      .then(res=>{
        if(res.data.isSuccess){
            // self.getshopcount()//更新购物车数量
            self.escshowmask()//隐藏添加界面
            wx.showToast({
              title: '添加成功！',
              icon: 'success',
              duration: 1500
            })
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

    }
  },

  created () {


  },
  onLoad: function(options){
    console.log(options.id)
    this.getcomdetail(options.id)
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
  margin: 10rpx auto;
  background: #fff;
  padding: 0 20rpx;
  width: 96vw;
  .intro{
    text-indent: 2em;
    font-size: 25rpx;
    color: rgb(185, 186, 186);
  }
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
