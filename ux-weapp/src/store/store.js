import Vue from 'vue'
import Vuex from 'vuex'
// import store from './store'
// import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

  
Vue.use(Vuex);

const state = {
    openId: "",
    myWxInfo: {},
    userInfo: {},
    getTime: () => {
      let date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth()+1,
          day = date.getDate(),
          hour = date.getHours(),
          minute = date.getMinutes(),
          second = date.getSeconds();
      return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    },
    getPid: () => {
      let mydate = new Date();
      return "weapp"+mydate.getDay()+ mydate.getHours()+ mydate.getMinutes()+mydate.getSeconds()+mydate.getMilliseconds();
    }
}

export default new Vuex.Store({
 state,
 mutations,
 actions,
 getters
})
