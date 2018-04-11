var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: 9000,
    verifyClient: socketVerify
  });

function socketVerify(info) {
  return true
}

wss.broadcast = function (s, ws) {
  wss.clients.forEach(client => {
    if (s == 1) {
      client.send(ws.name + ':' + ws.msg)
    } if (s == 0) {
      client.send(ws.name + '退出聊天室')
    }
  })
}

wss.on('connection', (ws) => {
  // console.log(wss.clients)
  // ws.send('你是第' + wss.clients.length + '位');

  ws.on('message', (jsonStr, flags) => {
    var obj = eval('(' + jsonStr + ')')
    this.user = obj;

    if (typeof this.user.msg != "undefined") {
      wss.broadcast('1', obj)
    }
  })

  ws.on('close', (cl) => {
    try {
      wss.broadcast(0, this.user)
    } catch (e) {
      console.log('刷新页面了');
    }
  })
})