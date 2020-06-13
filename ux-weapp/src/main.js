import Vue from 'vue'
import App from './App'
import store from './store/store'
import qs from 'qs'
import Fly from  'flyio/dist/npm/wx'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store=store
Vue.prototype.$qs = qs;
let fly=new Fly
Vue.prototype.$fly = fly // 将fly实例挂在vue原型上
const app = new Vue(App)
app.$mount()
