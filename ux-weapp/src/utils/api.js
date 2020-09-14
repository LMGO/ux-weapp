let Fly = require("flyio/dist/npm/wx")
let fly = new Fly
fly.config.baseURL = 'http://106.14.83.188:8080/YouXian'
 



//*-----------新消息部分-------------*//

// 获取未删除消息
export function  getmesglist(params){
    console.log(params)
    return fly.get("/order/getNotDeleteOrderMsg",params)					   
}
// 消息已读或删除（传整个对象）
export function  updatemessage(params){
    console.log(params)
    return fly.put("/order/updateOrderMsg",params)					   
}
// 未读消息数量 
export function  newmessageCount(params){
    console.log(params)
    return fly.get("/order/getNotReadOrderMsg",params)					   
}

export const messageApi = {
    getmesglist,
    updatemessage,
    newmessageCount
}
  export default{
    messageApi
  }