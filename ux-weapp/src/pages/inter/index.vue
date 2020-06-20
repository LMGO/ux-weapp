<template>
	<div class="ceng">		
		<button @getuserinfo="getVxUserInfo" open-type="getUserInfo"  class="btn">点击微信授权</button>
	</div>
</template>
 
<script>
const appId="wxf1e194860af08100"   //开发者appid
const secret="52e06254d441f608831248944f1640a0"  //开发者AppSecret(小程序密钥)	,登录微信小程序平台后-》开发-》开发设置-》开发者ID（AppSecret(小程序密钥)	）生成
import { formatTime } from '@/utils/index'
// import { register } from '@/utils/api'
export default{
	data(){
		return{
			userinfo:{},  //存放用户信息，保存在自己的数据库中  		
		}
	},
	mounted(){
		this.isLogin()		
	},
	methods:{		
		getVxUserInfo(e){				
			if(e.target.userInfo){
				this.isLogin()
			}
		},		
		  isLogin(){		
			var self=this;
	        wx.getSetting({
	          success(res) {    	          	 
	            if (!res.authSetting['scope.userInfo']) {//未授权getUserInfo            	
	              wx.authorize({
						scope: 'scope.userInfo',
						success(res) {	                
						// 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问       
							wx.getUserInfo({
								success(res) {
									self.loginOk(res);
								},
								fail(err) {
								console.log(err)
								}
							})
						},
						fail(err){
							console.log(err)
						}
				 	})
				}else{//已授权
					wx.getUserInfo({
						success(res) {
							self.loginOk(res);
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
			let self=this;
			self.userinfo.encryptedData=res.encryptedData;
	        self.userinfo.iv=res.iv;
	        self.userinfo.rawData=res.rawData;
	        self.userinfo.signature=res.signature;
	        self.userinfo.infos=res.userInfo;
	        self.userName=res.userInfo.nickName;
            self.$store.dispatch('getMyWxInfo', self.userinfo.infos);
			self.getOpenId()
		},
		getOpenId(){  //获取用户的openid
			let self = this;
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
								self.userinfo.openid=res.data.openid;
								self.userinfo.session_key=res.data.session_key;
								self.$store.dispatch('getOpenId', self.userinfo.openid);
								console.log(self.$store.state.openId);
								// 注册接口位置
								let params ={
										registrationDate: formatTime(new Date()),
										uid: self.$store.state.openId
									}
									console.log(params)
								self.$fly.post(self.url+"/user/register",
										params
								)
								.then(res=>{
									console.log(res.data.isSuccess)
									if(res.data.isSuccess){
										const url = '../index/main';
										mpvue.switchTab({ url });
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

.btn{
	background:#CCCCCC;
	color: black;
	width: 60%;
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