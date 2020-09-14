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
    <div v-else>
      <div class="list" v-for="(item,index) in getlist" :key="index">
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
              <img :src="item.imgId[0]" alt="" @click="tocomdetail(item.cid)">
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
import { messageApi} from '@/utils/api'
export default {
  data () {
    return {
      List:[],
      Listdelay:[],//临时list
      totalPrice:0.00,
      nothing:false,
    }
  },

  components: {
    // card
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
    tocomdetail(e){
      console.log(e)
      wx.navigateTo({
        url:'../com-detail/main?id='+e,
      })
    },
    // 获取购物车商品数量
    async  getshopcount(){
      let self = this;
      let params = {
        uid: self.$store.state.openId
      }
    await  self.$fly.get(self.url+"/shoppingCart/getItemCount",
          params
      )
      .then(res=>{
        console.log("数量",res.data.content)
        if(res.data.content>0){
            let num = res.data.content;
            wx.setTabBarBadge({
              index: 1,
              text: num.toString()
            })
        }
        else{
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
    // 获取购物车列表
    async  getshoppinglist(){
      let self = this;
      let params = {
        uid: self.$store.state.openId
      }
      // wx.request({
      //     url:self.url+'/shoppingCart/getShoppingItems',
      //     data: {
      //           uid: self.$store.state.openId
      //         },
      //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      //     // header: {}, // 设置请求的 header  
      //     header: {
      //       'Content-Type': 'application/json'
      //     },
      //     success: function (res) {
      //       console.log(res.data)
      //       self.List = res.data.content;
      //       // that.setData({
      //       //   list: res.data          //返回二维数组
      //       //   // views: res.data[0].views,     //查看数
      //       //   // praise: res.data[0].praise    //点赞数
      //       // })
      //       // page++;
      //     }
      // })
      self.$fly.get(self.url+"/shoppingCart/getShoppingItems",
          params
      )
      .then(res=>{
            console.log(res)
        if(res.data.isSuccess){
            console.log("列表项",res.data.content)
            if(res.data.content != undefined &&res.data.content.length!=0){
              self.Listdelay = res.data.content;
              // console.log("--------------------------")
              // console.log(self.Listdelay)
              // console.log("--------------------------")
              // self.List = self.Listdelay;
              // this.$forceUpdate();
              // for(let i=0;i<arr.length;i++){
              //   this.$set(this.List,i,arr[i])
              // }
              // console.log("返回的数组",res.data.content);
            }
            else{
              this.nothing = true
              console.log('列表异常')
            }
        }
      })
      .catch(err=>{
        console.log(err)
      })						   
    },
    check(e){
      if(!e.checked){
        this.$set(e,"checked",true);
      }
      else{
        this.$set(e,"checked",false);
      }
    },
    async  subcount(e){
      if(e.number>1){
        e.number = e.number -1;
        this.$set(e,"number",e.number);
        //同步数据到数据库
        await  this.changenumber(e)
        this.$set(e,"checked",true);
      }

    },
   async addcount(e){
      //查库存
      if(e.number<10){
        e.number = e.number +1;
        this.$set(e,"number",e.number);
        await  this.changenumber(e)
        this.$set(e,"checked",true);
      }
      else{
        wx.showToast({
          title: '该商品限购10件！',
          icon: 'none',
          duration: 1500
      })
      }
      //同步数据到数据库
      // 修改数量接口
    },
  async  changenumber(e){
      let self = this;

      let params = {
        itemId: e.itemId,
        number:e.number
      }
      console.log(e.itemId)
      console.log(e.number)
      // self.$fly.request(self.url+"/shoppingCart/updateShoppingItem", params, {method:"PUT"})
      self.$fly.put(self.url+"/shoppingCart/updateShoppingItem",self.$qs.stringify(
          params
      )    
      )
      .then(async res=>{
        if(res.data.isSuccess){
          // console.log("下面要更新列表")
          // await  this.getshoppinglist();
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
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
        itemId: e.itemId
      }
      self.$fly.delete(self.url+"/shoppingCart/deleteShoppingItem",
          params
      )
      .then(async res=>{
        if(res.data.isSuccess){
          console.log("下面要更新角标")
          this.getshopcount();
          console.log("下面要更新列表")
        await  this.getshoppinglist();
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 1500
          })
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 去结算
    topay(){
      let self = this;
      let itemList = [];
      for(let i = 0;i<self.List.length;i++){
        if(self.List[i].checked){
          // let item ={};
          // item.itemId = self.List[i].itemId;
          // itemList[i]=item;
          itemList.push(self.List[i].itemId);//购物项的整数数组
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
    getlist:function(){
      let self = this;
      self.List = self.Listdelay;
      console.log("--------------------------")
      console.log(self.List)
      console.log("--------------------------")
      self.$forceUpdate()
      return self.List;
    }
    },

  created () {
    // let app = getApp()
     //移除角标
  //  wx.removeTabBarBadge({
  //    index: 2,
  //  })

  },
 async onShow(){
    let self=this;
    // 获取购物车数量
    self.getshopcount()
    //获取购物车列表
    await self.getshoppinglist()
    self.getcount()
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
