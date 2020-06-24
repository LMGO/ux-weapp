<template>
  <div class="homeBox">
    <!-- 无信息 -->
    <div v-if="nothing">
      <div class="nothing" >
        <img src="../../../static/images/nomessage.png" alt="">
        <div class="text">暂无消息</div>
      </div>
    </div>
    <!-- 购物车列表 -->
    <div v-else class="card">
        <ul >
            <li v-for="(item,index) in messagelist" :key="index">
              <div :class="{barisread:item.isRead,barisunread:!item.isRead}">
                <div class="title">
                  <img src="../../../static/images/dele.png" alt="" @click.stop="del(item)">
                  <div class="ourname">U 鲜</div>
                  <div class="time">{{deliverTime}}2020-02-05 02:05:25</div>
                </div>
                <div class="texttop">
                  <div class="ordertitle">发货提醒 :</div>
                  <div class="text">
                    <div class="texttitle">您好！您的订单 ：</div>
                    <div class="id">{{item.oid}}</div>
                    <div class="textbot">已经发货!</div>
                    <div class="todetail" @click.stop="toorderdetail(item)">查看详情</div>
                  </div>
                </div>
              </div>
               
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { messageApi} from '@/utils/api'

export default {
  data () {
    return {
      messagelist:[
      //   {
      //   id:'1',
      //   oid:"11111111111111111111111111",
      //   uid:'111',
      //   isRead:false,
      //   isDelete:false
      // },{
      //   id:'1',
      //   oid:"111111111111111111111",
      //   uid:'1111111111111111111',
      //   isRead:true,
      //   isDelete:false
      // }
      ],
      nothing:false,
    }
  },

  components: {
    // card
  },

  methods: {
    // 跳转到订单详情页
    async  toorderdetail(e){
      // 消息已读
      if(e.isRead){
          wx.navigateTo({
          url:'../order-detail/main?id='+e.oid,
        })
      }else{
        let parmas={
          id:e.id,
          oid:e.oid,
          uid:e.uid,
          isRead:true,
          isDelete:false,
          deliverTime:e.deliverTime
        }
        await  messageApi.updatemessage(parmas).then(res=>{
          this.$set(e,"isRead",true);
        //   wx.navigateTo({
        //   url:'../order-detail/main?id='+e.oid,
        // })
        }).catch(err=>console.log(err))
      }
      
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
    // 获取未删除新消息列表
    getmeaasgelist(){
        let params = {
          uid: this.$store.state.openId
        }
        messageApi.getmesglist(params).then(res=>{
          console.log(res)
          if(res.data.content.length>0){
            this.messagelist = res.data.content
          }
          else{
            this.nothing = true
          }
          
        }).catch(err=>{
          console.log(err)
        })					   
    },
    del(e){
      //删除消息
      let parmas={
          oid:e.oid,
          uid:e.uid,
          isRead:true,
          isDelete:true,
          deliverTime:e.deliverTime
        }
      messageApi.updatemessage(parmas).then(res=>{
        this.getmeaasgelist();
        this.getcount()
      }).catch(err=>console.log(err))
    }
  },

  created () {
    // let app = getApp()
     //移除角标
  //  wx.removeTabBarBadge({
  //    index: 2,
  //  })

  },
  onShow(){
  //  获取数量
  this.getcount()
  // 获取新消息列表
  this.getmeaasgelist()
  
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
.barisread{
  opacity: 0.7;
}
.barisunread{
  opacity: 1;
}
.card{
  width: 90vw;
  height: 400rpx;
  margin: 30rpx auto;
  li{
    padding: 10rpx;
    width: 100%;
    height: 400rpx;
    margin: 30rpx auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow:8rpx 8rpx 5rpx  rgb(235, 232, 232);
    box-sizing: border-box;
    .title{
      position: relative;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgb(209, 205, 205);
      box-sizing: border-box;
      img{
        position: absolute;
        right: -20rpx;
        top: -20rpx;
        height: 50rpx;
        width: 50rpx;
        display: block;
        border: 1px solid rgb(250, 247, 247);
        border-radius: 25rpx;
        opacity: 0.7;
      }
      .ourname{
        line-height: 80rpx;
        height: 80rpx;
        width: 80rpx;
        text-align: center;
        border: 1px solid gray;
        color: white;
        background-color: red;
        font-size: 30rpx;
        border-radius: 40rpx;
      }
      .time{
        text-align:right;
        padding-right: 10rpx;
        flex: 1;
        color: rgb(133, 130, 130);
        font-size: 20rpx;
        justify-self: flex-end;

      }
    }
    .texttop{
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      color: rgb(41, 38, 38);
        .ordertitle{
            margin-top: 10rpx;
            font-size: 32rpx;
        }
        .text{
          flex: 1;
          margin-top: 10rpx;
          font-size: 32rpx;
          display: flex;
          flex-direction: column;
          font-size: 32rpx;
          align-items: center;
          .texttitle{
            font-size: 32rpx;
            text-indent: 2em;
            width: 100%;
            text-align: left;
          }
          .id{
            margin: 10rpx auto;
            font-size: 40rpx;
            flex: 1;
          }
          .textbot{
            width: 100%;
            text-align: left;
          }
          .todetail{
            margin-top:10rpx;
            border-top: 1px solid rgb(209, 205, 205);
            height: 80rpx;
            width: 100%;
            text-align: center;
            line-height: 80rpx;
          }
        }
    }
  
  }

}
</style>
