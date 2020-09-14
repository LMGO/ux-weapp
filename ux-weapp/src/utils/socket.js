

let globalData ={
    socketStatus: 'closed'
  };

  export function openSocket(callback){
     // 打开信道
     wx.connectSocket({
       url: "ws://106.14.83.188:8080/YouXian/server/weApp",
     })
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      globalData.socketStatus = 'connected';
      // this.sendMessage('连接成功');
    })
     //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      globalData.socketStatus = 'closed'
    })
     //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
     // 监听服务器推送的消息
     wx.onSocketMessage(message => {
       //把JSONStr转为JSON
       // message = message.data.replace(" ", "");
       // if (typeof message != 'object') {
       //   message = message.replace(/\ufeff/g, ""); //重点
       //   var jj = JSON.parse(message);
       //   message = jj;
       // }
       console.log("【websocket监听到消息】内容如下：");
       console.log(message)
      callback(message)
     })
   }
     
 //关闭信道
 export function closeSocket() {
     if (globalData.socketStatus === 'connected') {
       wx.closeSocket({
         success: () => {
            globalData.socketStatus = 'closed'
         }
       })
     }
   }
     
  //发送消息函数
  export function  sendMessage(params) {
     if (globalData.socketStatus === 'connected') {
     //自定义的发给后台识别的参数 ，我这里发送的是name
     console.log("发送成功")
       wx.sendSocketMessage({
        data: params  
      })
     }
   }

export default {
    openSocket,
    sendMessage,
    closeSocket
  }