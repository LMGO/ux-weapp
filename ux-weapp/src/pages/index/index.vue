<template>
  <div class="homeBox"> 
    <!-- 导航栏 -->
    <ul class="nav">
      <li :class="[ishot?'active':'']" @click="gethotlist()">热销</li>
      <li :class="[isvagetable?'active':'']" @click="getvagetablelist(1)">蔬菜</li>
      <li :class="[ismeat?'active':'']" @click="getmeatlist(2)">肉禽</li>
      <li :class="[isseafood?'active':'']" @click="getseafoodlist(3)">海产</li>
      <li :class="[isdaily?'active':'']" @click="getdailylist(4)">日用</li>
      <li :class="[ismedical?'active':'']" @click="getmedicallist(5)">医护</li>
    </ul>
    <!-- 热销页面 -->
    <!-- 轮播图 -->
    <swiper v-show="ishot" class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="500">
        <block v-for="(item, index) in images" :key="index">
            <swiper-item>
                <image :src="item" class="slide-image" mode="aspectFill"/>
            </swiper-item>
        </block>
    </swiper>
    <div class="listhot" v-show="ishot">
      <div class="hot">热销榜</div>
        <ul class="ullist">
          <li v-for="(item,index) in comlist" :key="index" @click="tocomdetail(item.cid)">
            <div class="left">
              <img :src="item.imgId[0]" alt="">
            </div>
            <div class="right">
              <div class="r-top">
                <span class="title">{{item.cname}}</span>
                <span class="price">&yen;{{item.price}}</span>
              </div>
              <div class="r-des">
                <span class="title">{{item.description}}</span>
              </div>
              <div class="r-bot">
                  <span>月销: {{item.saleVolume}}</span>
                  <span>库存: {{item.repertory}}</span>
                  <div class="add" ><img src="../../../static/images/add.png" alt="" @click.stop="addtoshopingcart(item)"></div>
              </div>
            </div>
          </li>
        </ul>
    </div>
    <!-- 其它页面 -->
    <!-- 搜索框 -->
    <div v-show="!ishot">
      <div class="search">
        <img src="../../../static/images/search-icon.png" alt="">
        <input class="inputtext" type="text" placeholder="请输入商品名称"  v-model="search">
      </div>
      <div :class="{listhot:ishot,list:!ishot}">
      <ul class="ullist">
        <li v-for="(item,index) in items" :key="index" @click="tocomdetail(item.cid)">
          <div class="left">
              <img :src="item.imgId[0]" alt="">
          </div>
          <div class="right">
              <div class="r-top">
                <span class="title">{{item.cname}}</span>
                <span class="price">&yen;{{item.price}}</span>
              </div>
              <div class="r-des">
                <span class="title">{{item.description}}</span>
              </div>
              <div class="r-bot">
                  <span>月销: {{item.saleVolume}}</span>
                  <span>库存: {{item.repertory}}</span>
                  <div class="add" ><img src="../../../static/images/add.png" alt="" @click.stop="addtoshopingcart(item)"></div>
              </div>
          </div>
        </li>
      </ul>
    </div>
    </div>
    <!-- 遮罩层及购物车选择数量弹窗 -->
    <div class="mask" v-show="showmask" @touchmove.stop.prevent="TouchMove()" @click="escshowmask()">
        <div :class="{choosenumberbefore:chhoosenumber,choosenumberafter:!chhoosenumber,choosenumber:true}" @click.stop="">
          <!-- 取消 -->
          <div class="escadd"><img src="../../../static/images/esc.png" alt="" @click="escshowmask()"></div>
          <div class="li">
            <div class="left">
                <img :src="add.imgId[0]" alt="">
            </div>
            <div class="right">
                <div class="r-top">
                  <span class="title">{{add.cname}}</span>
                  <span class="price">&yen;{{add.price}}</span>
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
          <div class="btn" @click.stop="cofirmadd(add.cid)">加入购物车</div>
        </div>
    </div>
    <!-- <div :class="{content:hotcontent,}" @click="clickOne" @longpress="clickLong">{{list}}</div> -->
  </div>
</template>

<script>
import { openSocket } from '@/utils/socket'
import { messageApi} from '@/utils/api'

export default {
  data() {
    return {
      ishot: true,
      isvagetable: false,
      ismeat: false,
      isseafood: false,
      isdaily: false,
      ismedical: false,
      showmask:false,//添加到购物者的遮罩层
      images:['http://cdn.fengblog.xyz/5953e202-d291-42ff-8957-a30aa43eb588timg (3).jpeg','http://cdn.fengblog.xyz/55b28ab8-7de2-4b15-8f0c-e8a83361cb0eu=2697673446,777998154&fm=26&gp=0.jpg','https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png'],
      showswiper:true,//默认显示热销列表，包含轮播图
      chhoosenumber:true,
      search:'', //搜索
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
      count:1,
      comlist:[
      // {
      //   cid:'0',
      //   cname:'布诺芬',
      //   imgId:["http://pic.ruiwen.com/allimg/201611/70-16112p9104u25.jpg"],
      //   price:9.9,
      //   repertory:15,
      //   description:'防御病毒有效率高',
      //   type:'医护',
      //   saleVolume:10//销量
      // },
      // {
      //   cid:'1',
      //   cname:'医用外科口罩',
      //   imgId:["https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png"],
      //   price:39.9,
      //   repertory:15,
      //   description:'防御病毒有效率高',
      //   type:'医护',
      //   saleVolume:10//销量
      // },
      // {
      //   cid:'1',
      //   cname:'医用外科口罩',
      //   imgId:["https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png"],
      //   price:39.9,
      //   repertory:15,
      //   description:'防御病毒有效率高',
      //   type:'医护',
      //   saleVolume:10//销量
      // },
      // {
      //   cid:'1',
      //   cname:'医用外科口罩',
      //   imgId:["https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png"],
      //   price:39.9,
      //   repertory:15,
      //   description:'防御病毒有效率高',
      //   type:'医护',
      //   saleVolume:10//销量
      // },
      // {
      //   cid:'1',
      //   cname:'医用外科口罩',
      //   imgId:["https://img12.iqilu.com/10339/article/202001/30/e97c439173bc7cd43b0587169849cde1.png"],
      //   price:39.9,
      //   repertory:15,
      //   description:'防御病毒有效率高',
      //   type:'医护',
      //   saleVolume:10//销量
      // }
      ]
    };
  },

  components: {
  },

  methods: {
    // 热销
    gethotlist() {
      this.search = ''
      this.ishot = true;
      this.isvagetable = this.meat = this.isseafood = this.isdaily = this.ismedical = false;
      // this.list = e + "列表";
      this.showswiper = true;
      //获取热销
      let self = this;
      self.$fly.get(self.url+"/mall/getRecommendCommodities")
      .then(res=>{
        wx.hideLoading()
        self.comlist=res.data;
      })
      .catch(err=>{
        wx.showToast({
          title: '获取失败！',
          icon: 'none',
          duration: 1500
      })
        console.log(err)
      })

    },
    getvagetablelist(e) {
      this.search = ''
      this.isvagetable = true;
      this.ishot = this.ismeat = this.isseafood = this.isdaily = this.ismedical = false;
      this.showswiper = false;
      this.getotherlist(e)
    },
    getmeatlist(e) {
      this.search = ''
      this.ismeat = true;
      this.ishot = this.isvagetable = this.isseafood = this.isdaily = this.ismedical = false;
      this.showswiper = false;
      this.getotherlist(e)
    },
    getseafoodlist(e) {
      this.search = ''
      this.isseafood = true;
      this.ishot = this.isvagetable = this.ismeat = this.isdaily = this.ismedical = false;
      this.showswiper = false;
      this.getotherlist(e)
    },
    getdailylist(e) {
      this.search = ''
      this.isdaily = true;
      this.ishot = this.isvagetable = this.ismeat = this.isseafood = this.ismedical = false;
      this.showswiper = false;
      this.getotherlist(e)
    },
    getmedicallist(e) {
      this.search = ''
      this.ismedical = true;
      this.ishot = this.isvagetable = this.ismeat = this.isdaily = this.iisdaily = false;
      this.showswiper = false;
      this.getotherlist(e)
    },
    // 获取相应类型
    getotherlist(e) {
      let self = this;
      let params = {
        type: e
      }
      self.$fly.get(self.url+"/mall/getCommoditiesByType",self.$qs.stringify(
          params
      ))
      .then(res=>{
          self.comlist = res.data.content
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
    // 跳到商品详情页
    tocomdetail(e){
      console.log(e)
      wx.navigateTo({
        url:'../com-detail/main?id='+e,
      })
    },
    //弹出添加数量界面
    addtoshopingcart(item){
      this.add = item;
      this.TouchMove()//遮罩层滑动问题
      this.showmask = true;
      this.chhoosenumber = false;
      wx.hideTabBar();
    },
    //解决遮罩层穿透滑动问题
    TouchMove(){

    },
    //退出选择数量界面
    escshowmask(){
      this.showmask = false;
      this.chhoosenumber = true;
      this.count = 1;
      wx.showTabBar();
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
    cofirmadd(e){
      let self = this;
      console.log(e);
      console.log(self.count);
      // 添加到购物车接口
      let params = {
        uid: self.$store.state.openId,
        cid:e,
        number:self.count
      }
      self.$fly.post(self.url+"/shoppingCart/addShoppingItem",self.$qs.stringify(
                    params
      ))
      .then(res=>{
        if(res.data.isSuccess){
            self.getshopcount()//更新购物车数量
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

    },
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
  },

  created() {

  },
  computed: {
 //过滤方法
  items: function() {
   var _search = this.search;
   if (_search) {
    //不区分大小写处理
    var reg = new RegExp(_search, 'ig')
    //es6 filter过滤匹配，有则返回当前，无则返回所有
    return this.comlist.filter(function(e) {
     //匹配所有字段
    //  return Object.keys(e).some(function(key) {
    //   return e[key].match(reg);
    //  })
    //  匹配某个字段
     return e.cname.match(reg);
    })
   };
   return this.comlist;
  }
},
  onShow(){
    this.search = ''
    let self = this;
    // 获取热销列表
    wx.showLoading({ title: '拼命加载中...' })
    self.gethotlist() 
    // 获取购物车数量
    self.getshopcount()
    self.getcount()
}
};
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
.nav{
  z-index: 1;//导航栏
  top:0;
  position: fixed;
  display: flex;
  justify-content: space-around;
  width: 100vw;
  border-top: 1px solid rgb(231, 230, 230);
  list-style: none;
  // background:#5ad9fe;
  background-color:#ffffff;
  // background-color: rgb(75, 148, 177);
  color: black;
  box-sizing: border-box;
  height:60rpx ;
  // transition: 2s;
  /* padding: 8rpx 0px; */
  align-items: center;
  /* height:5vh; */
li {
  margin:8rpx 0px; ;
  letter-spacing: 8rpx;
  font-size: 30rpx;
  padding: 10rpx 5rpx;
  text-align: center;
  // font-family: "Times New Roman", Times, serif;
}
}
/*当前选中*/
.active {
  color:black;
  font-size: 35rpx;
  border-bottom: 2px solid red;
  border-radius: 20%;
  text-align: center;
  // font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.content {
  margin-top:60rpx;
}
.swiper{
  margin: 65rpx auto 0 auto;
  // margin-right:15rpx;
  // margin-left:15rpx;
  box-sizing: border-box;
  border-radius: 15%;
}
.swiper,.swiper .slide-image{
  width:96vw;
  height:450rpx;
  border-radius: 5%;
}
// 搜素框
.search{
  background: rgb(248, 242, 242);
  z-index: 1;
  position: fixed;
  top: 60rpx;
  box-sizing: border-box;
  padding: 15rpx;
  width: 100vw;
  height: 70rpx;
  border-radius: 5%;
  img{
    position: absolute;
    margin-left:11vw;
    margin-top: 25rpx;
    transform: translateY(-50%);
    width: 40rpx;
    height: 40rpx;
    z-index: 2;
  }
  .inputtext{
    background: rgb(247, 244, 244);
    border-radius: 50px;
    margin-left: 10vw;
    position: relative;
    border: 1px solid gray;
    height: 5vh;
    box-sizing: border-box;
    padding-left: 15vw ;
    width:80vw ;
    font-size: 30rpx;
  }
}
//其他nav
.list{
  margin-top:140rpx;
}
//热销nav
.listhot{
  margin: 10px auto 0 auto;
  width: 96vw;
  .hot{
      height: 65rpx ;
      width: 100%;
      text-align: center;
      font-size: 40rpx;
      color: red;
      background-color: #ffffff;
      border-radius: 3%;
    }
  }
  .ullist{
      margin-top: 10px;
      list-style: none;
      li{
        cursor: pointer;  
        height: 300rpx;
        display: flex;
        flex-direction: row;
        padding: 5rpx;
        margin-bottom: 2vh;
        background-color: #ffffff;
        box-sizing: border-box;
        border-radius: 5%;
      }
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
          }
        }
        .r-des{
          margin-top: 10rpx;
          flex-shrink: 1;
          // flex:1;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 90rpx;
          .title{
            font-size: 25rpx;
            color: gray;
          }
        }
        .r-bot{
          margin: 70rpx 0 10rpx 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          span{
            font-size: 20rpx;
            margin-left: 20rpx;
            color: gray;
            flex: 1;
          }
          .add{
            align-self: flex-end;
            height: 50rpx;
            width: 50rpx;
            border-radius: 50%;
            background: rgb(243, 183, 161);
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
