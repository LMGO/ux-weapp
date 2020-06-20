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
Vue.prototype.url ='http://106.14.83.188:8080/YouXian'//服务器url
const app = new Vue(App)
app.$mount()
