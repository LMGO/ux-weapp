<template>
<div class="home"  >	
	<!-- <div class="title" v-if="userName">
		欢迎登录：<span class="name">{{userName}}</span>
	</div>	 -->
	<div class="ceng" v-if="isCeng" @touchmove.stop.prevent="touchmovehandle">		
		<button @getuserinfo="getVxUserInfo" open-type="getUserInfo" v-if="!userName" class="btn">点击微信授权</button>
	</div>
</div>
</template>
 
<script>
const appId="wxf1e194860af08100"   //开发者appid
const secret="52e06254d441f608831248944f1640a0"  //开发者AppSecret(小程序密钥)	,登录微信小程序平台后-》开发-》开发设置-》开发者ID（AppSecret(小程序密钥)	）生成
 
export default{
	data(){
		return{
			userName:"",
			isCeng:true,
			userinfo:{},  //存放用户信息，保存在自己的数据库中  		
		}
	},
	mounted(){
		this.isLogin()		
	},
	methods:{		
		getVxUserInfo(e){				
			if(e.target.userInfo){
				this.userName=e.target.userInfo.nickName;
				this.isCeng=false;
				this.isLogin()
			}else{
				this.userName="";
				this.isCeng=true;
			}	
		},		
		isLogin(){		
			var _this=this;
	        wx.getSetting({
	          success(res) {    	          	 
	            if (!res.authSetting['scope.userInfo']) {//未授权getUserInfo            	
	              wx.authorize({
	                scope: 'scope.getUserInfo',
	                success(res) {	                
	                  // 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问       
	                  console.log(res)
	                  _this.isCeng=false;
					  _this.userName=res.target.userInfo.nickName;
	                  
	                },
	                fail(err){
	                 console.log(err)
	                }
	              })
	            }else{//已授权
	              wx.getUserInfo({
	                success(res) {	
	                	_this.loginOk(res)
	                },
	                fail(err) {
	                  console.log(err)
	                }
	              })
	            }
	          }
	        })
	    },
		touchmovehandle(){ //解决vue蒙层滑动穿透问题
			
		},		
		loginOk(res){  //登录成功后的信息处理
			let _this=this;
			_this.userinfo.encryptedData=res.encryptedData;
	        _this.userinfo.iv=res.iv;
	        _this.userinfo.rawData=res.rawData;
	        _this.userinfo.signature=res.signature;
	        _this.userinfo.infos=res.userInfo;
	        _this.getOpenId()
	        _this.isCeng=false;
	        _this.userName=res.userInfo.nickName;
            console.log(_this.userinfo);
            _this.$store.dispatch('getMyWxInfo', _this.userinfo.infos);
		    console.log(_this.$store.state.myWxInfo);
			const url = '../index/main';
			mpvue.switchTab({ url });
		},
		getOpenId(){  //获取用户的openid
			let _this=this;
			wx.login({
			  success(res) {
			  	  	if (res.code) {
				      // 发起网络请求
				      wx.request({
				        url: 'https://api.weixin.qq.com/sns/jscode2session',
				        data: {
				            appid:appId,  //开发者appid
				            secret:secret, //开发者AppSecret(小程序密钥)	
				            grant_type:"authorization_code",  //默认authorization_code
				            js_code: res.code    //wx.login登录获取的code值
				        },
				        success(res) {
				        	_this.userinfo.openid=res.data.openid;
							_this.userinfo.session_key=res.data.session_key;
							_this.$store.dispatch('getOpenId', _this.userinfo.openid);
							console.log(_this.$store.state.openId);
                  		//注册接口位置						   
						}
				      })
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
			  
			  }
			})
		}
	}
}
</script>
 
<style scoped>
.home{
	padding-bottom: 140rpx;
}
.btn{
	background:#CCCCCC;
	color: black;
	width: 60%;
}
	
.title{
	text-align: right;
	font-size: 15px;
	padding-right: 30rpx;
	padding-top: 30rpx;
}
.name{
	color: royalblue;
}
.ceng{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	z-index: 20;
	display: flex;
	align-items: center;	
	justify-content: center;
	flex-direction: column;
}
 
</style>