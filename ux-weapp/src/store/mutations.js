import {MYWXINFO, USERINFO, OPENID} from './mutation-type'

export default {
    [OPENID](state, data){
      state.openId = data;
      console.log("openId获取成功");
    },
    [MYWXINFO](state, data){
        state.myWxInfo = data;
        console.log("用户微信信息获取成功");
      },
    [USERINFO](state, data){
      state.userInfo = data;
      console.log("用户自定义信息获取成功");
    }
  }
  