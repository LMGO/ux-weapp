<template>
  <div>
    <div class="homeBox">
        <!-- 收货人信息 -->
        <div class="title">
          <span class="bar">收货人信息</span>
          <span class="add">
              <img src="../../../static/images/addinfo.png" alt="" @click="addinfo()">
          </span>
        </div>
        <div v-if="listnone" class="none">
            <img src="../../../static/images/recinfonone.png" alt="">
            <span>空空如也</span>
        </div>
        <div v-else class="martop">
            <div  class="myinfo"  :style="{ background: item.default ? 'lightblue' : 'white' }" v-for="(item, index) in infolist" :key="index">
            <div class="receinfo" >
                <span class="name">收货人：{{ item.name }}</span>
                <span class="tele">电&ensp; 话：{{ item.telephone }}</span>
                <span class="changeinfo" @click="changeinfo(item)">编辑</span>
            </div>
            <div class="address">地&ensp; 址：{{ item.address }}</div>
        </div>
        </div>

    </div>
        <!-- 遮罩层及购物车选择数量弹窗 -->
    <div class="mask" v-show="showmask" @touchmove.stop.prevent="TouchMove()" >
        <div class="change">
            <div class="escimg" @click.stop="escshowmask()">
                <img src="../../../static/images/esc.png" alt="" >
            </div>
            <div class="putinfo">
                <span >姓 名：<input type="text" v-model="changeform.name" maxlength="5"></span>
                <span >电 话：<input type="text" v-model="changeform.telephone" maxlength="11"></span>
                <span >地 址：<input type="text" v-model="changeform.address" maxlength="25"></span>
                <span >
                    <button style="background:lightblue;width:180rpx" @click="defaultchange()">置为默认</button>
                    <button @click="surechange()">修改</button>
                    <button style="background:red;color:white" @click="deleinfo()">删除</button>
                </span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        showmask:false,
        listnone:false,//列表是否为空
        changeform:{
            sid:0,
            name:'',
            telephone:'',
            address:'',
            default: false,
        },
        infolist: [
            // {
            // sid: "0",
            // uid: "11111",
            // name: "沐雙惜",
            // telephone: "18481***405",
            // address: "云南昭通",
            // default: true,
            // },
            // {
            // sid: "1",
            // uid: "11111",
            // name: "乖乖李",
            // telephone: "18481***405",
            // address: "云南昭通",
            // default: false,
            // },
        ],
    };
  },

  components: {
    // card
  },

    methods: {
        defaultchange() {
            let self = this;
            if (!self.changeform.default) {
                //修改默认信息
                let self = this;
                let params = {
                    sid: self.changeform.sid
                }
                self.$fly.post(self.url+"/user/setDefault",self.$qs.stringify(
                    params
                ))
                .then(res=>{
                    if(res.data.isSuccess){
                        self. escshowmask()
                        self.getaddresslist()
                        wx.showToast({
                            title: '修改默认信息成功！',
                            icon: 'success',
                            duration: 1500
                        })
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            else{
            wx.showToast({
                title: '该信息已为默认！',
                icon: 'none',
                duration: 1500
            })
            }
        },
        addinfo(){
            wx.navigateTo({
                url:'../addaddress/main'
            })
        },
        changeinfo(item) {
            // 展示遮罩层
            // 展示编辑框
            this.showmask = true;
            let self = this;
            self.changeform.sid = item.sid;
            self.changeform.name = item.name;
            self.changeform.telephone = item.telephone;
            self.changeform.address = item.address;
            self.changeform.default = item.default;
        },
        // 遮罩层滑动
        TouchMove(){
            
        },
        escshowmask(){
            this.showmask = false;
            this.clear()
        },
        // 清除表单
        clear(){
            let self = this;
            self.changeform.sid = 0;
            self.changeform.name = '';
            self.changeform.telephone = '';
            self.changeform.address = '';
        },
        surechange(){
            let self = this;
            if(self.changeform.address.length<=8){
              wx.showToast({
                title: '请填写详细地址！',
                icon: 'none',
                duration: 1500
              })
            }else if(self.changeform.telephone.length!=11){
                wx.showToast({
                    title: '手机号格式不正确！',
                    icon: 'none',
                    duration: 1500
                })
            }
            else{
            let params ={
                address: self.changeform.address,
                name:self.changeform.name,
                telephone:self.changeform.telephone,
                sid: self.changeform.sid
              }
            self.$fly.post(self.url+"/user/updateAddress",
            self.$qs.stringify(
                params
            ))
            .then(res=>{
              if(res.data.isSuccess){
                self. escshowmask()
                self.getaddresslist()
              
              }else{
                wx.showToast({
                  title: '修改失败！',
                  icon: 'none',
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
        deleinfo(){
            let self = this;
            console.log(self.changeform.sid)
            if(self.changeform.default){
                wx.showToast({
                    title: '无法删除默认地址！',
                    icon: 'none',
                    duration: 1500
                })
            }else{
            // 删除接口位置，
            let params = {
                    sid: self.changeform.sid
                }
            self.$fly.delete(self.url+"/user/deleteAddress",self.$qs.stringify(
                    params
            ))
            .then(res=>{
                if(res.data.isSuccess){
                    wx.showToast({
                        title: '删除成功！',
                        icon: 'success',
                        duration: 1500
                    })
                    self. escshowmask()
                    self.getaddresslist()
                 }
            })
            .catch(err=>{
               console.log(err)
            })
            }
        },
        getaddresslist(){
            //获取收货人信息接口，判断是否为空显示背景图片
            let self = this; 
            let params = {
            uid: self.$store.state.openId
            }
            self.$fly.get(self.url+"/user/getAddresses",
                params
            )
            .then(res=>{
                if(res.data.content.length>0){
                    self.infolist=res.data.content;
                }else{
                    self.listnone = true;
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
        },
    },
    onShow(){
        this.getaddresslist();
    },
    created() {
        // let app = getApp()
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
    position: fixed;
    z-index: 999;
    top: 0;
    left: 50vw;
    transform: translateX(-50%);
    display: flex;
    width: 96vw;
    margin: 0 auto 15rpx auto;
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
.martop{
    margin-top: 130rpx ;
    .address{
        font-size: 25rpx;
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
    img {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        width: 40rpx;
        height: 40rpx;
        border-radius: 20rpx;
        border: 1px solid rgb(194, 189, 189);
    }
    .receinfo {
        margin: 15rpx 0;
        display: flex;
        flex-direction: row;
        font-size: 25rpx;
        .name {
            width: 250rpx;
            flex-shrink: 1;
        }
        .tele {
            flex: 1;
            flex-shrink: 1;
        }
        .changeinfo {
            width: 80rpx;
            height: 40rpx;
            box-sizing: border-box;
            border-left: 1px solid rgb(125, 124, 124);
            text-align: center;
            line-height: 40rpx;
        }
    }
    // .address{
    //   background-color: rgb(30, 204, 204);
    // }
}
.mask{
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    // opacity: 0.5;
    z-index: 999;
    position: fixed;
    top: 0;
    .change{
        position: absolute;
        top: 50vh;
        left: 50vw;
        opacity:1;
        // position: fixed;
        height: 500rpx;
        width: 96vw;
        border-radius: 3%;
        transform: translate(-50%,-50%);
        background-color: rgb(247, 250, 243);
        .escimg{
            position: absolute;
            width: 80rpx;
            height: 80rpx;
            right: -20rpx;
            top: -10rpx;
            img{
                width: 70rpx;
                height: 70rpx;
            }
        }
        .putinfo{
            margin-top: 20rpx;
            width: 100%;
            span{
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
                button{
                    height: 60rpx;
                    width: 150rpx;
                    font-size: 30rpx;
                    line-height: 60rpx;
                }
            }
        }
    }
}

</style>
