import { MYWXINFO, USERINFO,OPENID} from './mutation-type'
// import listData from '../datas/list-data'

export default {
  getOpenId({commit}, data){
    commit(OPENID, data)
  },
 getMyWxInfo({commit}, data){
  commit(MYWXINFO, data)
  },
  getUserInfo({commit}, data){
    commit(USERINFO, data)
  },
}