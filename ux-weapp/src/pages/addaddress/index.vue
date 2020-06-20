<template>
  <div>
    <div class="homeBox">
        <div class="title">
          <span class="bar">新增收货人信息</span>
        </div>
        <div  class="myinfo">
          <div class="change">
            <div class="putinfo">
                <span>姓 名：<input type="text" v-model="changeform.name" maxlength="10"></span>
                <span>电 话：<input type="text" v-model="changeform.telephone" maxlength="11"></span>
                <span>地 址：<input type="text" v-model="changeform.address" maxlength="50"></span>
                <button @click="addmyinfo()">新 增</button>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        changeform:{
            sid:'',
            name:'',
            telephone:'',
            address:''
        },
    };
  },

  components: {
    // card
  },

    methods: {
        // 清除表单
        clear(){
            let self = this;
            self.changeform.sid = '';
            self.changeform.name = '';
            self.changeform.telephone = '';
            self.changeform.address = '';
        },
        addmyinfo(){
            let self = this;
            if(self.changeform.address.length<=8){
              wx.showToast({
                title: '请填写详细地址！',
                icon: 'none',
                duration: 1500
              })
            }else{
            let params ={
                address: self.changeform.address,
                name:self.changeform.name,
                telephone:self.changeform.telephone,
                uid: self.$store.state.openId
              }
            self.$fly.post(self.url+"/user/addAddress",self.$qs.stringify(
                  params
            )
                
            )
            .then(res=>{
              console.log(res)
              if(res.data.isSuccess){
                  // 返回上一页
                  wx.navigateBack({
                    delta: 1,
                  })
              }else{
                wx.showToast({
                  title: '请注意格式！',
                  icon: 'fail',
                  duration: 1500
                })                
              }
            })
            .catch(err=>{
              console.log(err)
              wx.showToast({
                title: '服务器异常！',
                icon: 'fail',
                duration: 1500
              })
            })
          }
        },
    },
    onShow(){
      this.clear()
    },
};
</script>

<style lang="scss" scoped>
.homeBox {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: rgb(247, 250, 243);
    overflow-y: scroll;
    z-index: -999; //背景
}

.title {
    display: flex;
    width: 96vw;
    margin: 15rpx auto;
    padding: 15rpx 0;
    font-size: 40rpx;
    color: black;
    border-radius: 5%;
    background-color: #fff;
    border-bottom: 1px solid rgb(198, 194, 194);
    .bar{
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
    }
    .add{
        width: 100rpx;
        box-sizing: border-box;
        img{
            // margin: 18rpx 0;
            width: 60rpx;
            height: 60rpx;
            border-radius: 40rpx;
        }
    }
}
.none{
    display: flex;
    width: 100vw;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    img{
        height: 200rpx;
        width: 200rpx;
    }
    span{
        color: gray;
        font-size: 30rpx;
    }
}
.myinfo {
    position: relative;
    background-color: #fff;
    width: 96vw;
    margin: 15rpx auto;
    border-radius: 5%;
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    color: rgba(69, 67, 67, 0.87);
    .change{
        .putinfo{
            margin-top: 20rpx;
            width: 100%;
            span{
              border-bottom: 1px solid rgb(233, 231, 231);
                margin-top: 15rpx;
                height: 85rpx;
                display: flex;
                 background: #ffff;
                align-items: center;
                padding: 10rpx;
                font-size: 30rpx;
                input{
                    height: 60rpx;
                    width: 500rpx;
                    border: 1px solid rgb(194, 191, 191);
                    border-radius: 20rpx;
                    background-color: rgb(243, 237, 237);
                    color: black;
                    font-size: 25rpx;
                }
            }
            button{
              margin: 20rpx auto;
                background: #fff;
                height: 60rpx;
                width: 150rpx;
                font-size: 30rpx;
                line-height: 60rpx;
                box-shadow:5rpx 5rpx 5rpx gray ;
            }
        }
    }
}

</style>
