<template>
  <div class="homeBox">
    <!-- 无商品 -->
    <div v-if="nothing">
      <div class="nothing" >
        <img src="../../../static/images/nothing.png" alt="">
        <div class="text">空空如也</div>
      </div>
    </div>
    <!-- 购物车列表 -->
    <div>
      <div class="list" v-for="(item,index) in List" :key="index">
        <!-- 选中框 -->
        <div class="circle" @click="check(item)">
          <!-- <input type="checkbox"
              name="Radio"
              :value="item.itemId"
              @click.stop="Checkcom(item)"
          class="circle"> -->
          <img v-show="item.checked" src="../../../static/images/checked.png" alt="">
        </div>
          <div class="centerimg">
              <img :src="item.imgId[0]" alt="">
          </div>
          <div class="right">
              <div class="r-top">
                <span class="title">{{item.cname}}</span>
                <div class="price"><i>&yen;</i><span>{{item.itemPrice}}</span></div>
              </div>
              <div class="r-bot">
                <div class="click">
                  <span class="countnumber" @click="subcount(item)">-</span>
                  <span >{{item.number}}</span>
                  <span class="countnumber" @click="addcount(item)">+</span>
                  <div class="add" ><img src="../../../static/images/dele.png" alt="" @click.stop="del(item)"></div>
                </div>
              </div>
          </div>
      </div>
    </div>
    <!-- 底部操作栏 -->
    <div class="botnav">
      <div class="compute">
        合计：
        <span class="yen">&yen;</span>
        <span class="price">{{totalPrice}}</span>
      </div>
      <div class="btn" @click="topay()">结算</div>
    </div>
  </div>
</template>

<script>

import { add } from '@/utils/index'
export default {
  data () {
    return {
      List:[],
      totalPrice:0.00,
      hasList: true,//判断购物车是否有数据
      nothing:false,
      // checked:''//是否选中
    }
  },

  components: {
    // card
  },

  methods: {
    check(e){
      if(!e.checked){
        this.$set(e,"checked",true);
      }
      else{
        this.$set(e,"checked",false);
      }
    },
    subcount(e){
      this.$set(e,"checked",true);
      if(e.number>1){
        e.number = e.number -1;
        this.$set(e,"number",e.number);
      }
      //同步数据到数据库
    },
    addcount(e){
      //查库存
      this.$set(e,"checked",true);
      if(e.number<5){
        e.number = e.number +1;
        this.$set(e,"number",e.number);
      }
      else{
        wx.showToast({
          title: '该商品限购5件！',
          icon: 'none',
          duration: 1500
      })
      }
      //同步数据到数据库
      // 修改数量接口
    },
    del(e){
      let self = this;
      for(let i = 0;i<self.List.length;i++){
        if(self.List[i].checked){
          this.$set(e,"checked",false);
        }
      }
      //删除接口
    },
    // 去结算
    topay(){
      let self = this;
      let itemList = [];
      for(let i = 0;i<self.List.length;i++){
        if(self.List[i].checked){
          let item ={};
          item.itemId = self.List[i].itemId;
          itemList[i]=item;
        }
      }
      console.log(itemList);
      if(itemList.length!=0){
        let items = JSON.stringify(itemList);
        wx.navigateTo({
          url:'../sureorder/main?items='+items+'&totalPrice='+self.totalPrice,
        })
      }
      else{
        wx.showToast({
          title: '您尚未选择商品！',
          icon: 'none',
          duration: 1500
      })
      }

    }
  },
  computed:{
    totalprice(){
      let self = this;
      self.totalPrice=0.00;
      for(let i = 0;i<self.List.length;i++){
        if(self.List[i].checked){
          self.totalPrice += self.List[i].number*self.List[i].itemPrice;
        }
      }
      self.totalPrice=self.totalPrice.toFixed(2)
      return self.totalPrice;
      },
    },

  created () {
    // let app = getApp()
     //移除角标
  //  wx.removeTabBarBadge({
  //    index: 2,
  //  })

  },
  onShow(){
    //获取购物车商品项数量
    let num = 2;
    wx.setTabBarBadge({
      index: 1,
      text: num.toString()
    })
    //获取购物车列表
    let shoppingItemList=[{
      itemId:"0",//商品对应的购物车项
      // cid:'0',
      cname:'布诺芬',
      imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
      type:"医护",//商品类型
      itemPrice:39.9,//商品单价
      number:2,//商品数量
      checked:false
	  },{
      itemId:"1",//商品对应的购物车项
      cname:"医用外科口罩",//商品名称
      imgId:["https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png"],
      type:"医护",//商品类型
      itemPrice:9.9,//商品单价
      number:5,//商品数量
      checked:false
    }];
    this.List = shoppingItemList;
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
.nothing{
  position: absolute;
  top: 30vh;
  left: 50vw;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img{
    position: relative;
    height: 100rpx;
    width: 100rpx;
  }
  .text{
    position: relative;
    margin-top: 15rpx;
    font-size: 30rpx;
    width: 150rpx;
    text-align: center;
  }
}
.list{
  height: 250rpx;
  width: 96vw;
  border-radius:4% ;
  margin: 15rpx auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  .circle{
    height: 40rpx;
    width: 40rpx;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid gray;
    // background-color: red;
    margin: 0 10rpx;
    img{
      height: 45rpx;
      width: 45rpx;
      border-radius: 50%;
      box-sizing: border-box;
      margin-top: -4rpx;
      margin-left: -4rpx;
    }
  }
  .circleactive{
    height: 40rpx;
    width: 40rpx;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid gray;
    background-color: red;
    margin: 0 10rpx;
  }
  .centerimg{
    img{
      height: 240rpx;
      width: 240rpx;
      border-radius: 5%;
    }
  }
  .right{
    align-self: start;
    flex:1;
    display: flex;
    flex-direction: column;
    padding-left: 15rpx;
    height: 250rpx;
    .r-top{
      // height: 8vh;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title{
        align-self: flex-start;
        font-size: 40rpx;
      }
      .price{
        font-size: 50rpx;
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
      margin-bottom: 10rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      .click{
        position: relative;
        align-self: flex-end;
        margin-bottom: 10rpx;
        flex: 1;
        height: 80rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        span{
          height: 60rpx;
          width: 50rpx;
          font-size: 35rpx;
          margin: 0 15rpx;
          line-height: 60rpx;
          text-align: center;
        }
        .countnumber{
          font-size: 40rpx;
          background-color: rgb(236, 240, 240);
          height: 60rpx;
          width: 50rpx;
          border-radius: 10%;
        }
        .add{
          position: absolute;
          right: 10rpx;
          height: 50rpx;
          width: 50rpx;
          border-radius: 50%;
          background: rgb(250, 221, 211);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img{
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

    }
    
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
    font-size: 40rpx;
    width: 25%;
    background: red;
    color: white;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
  }
}
</style>
