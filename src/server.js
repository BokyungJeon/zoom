import express from 'express';
import http from 'http';
import SoketIo from 'socket.io';
// 브라우저간 호환(WebSocket은 오래된 브라우저에서 지원하지 않는 경우가 있다)
// socket.io는 websocket을 포함한 여러 실시간 기능을 구현.
// 접속이 끊겼을 때 자동으로 재접속을 시도한다.
// 내가 만든 이벤트를 전송할 수 있고, 여러타입(object까지도)을 여러개까지 타입을 그대로 전송하고 받을 수 있다.

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

// http와 websocket을 같은 서버(포트)에서 작동
const httpServer = http.createServer(app);
const wsServer = SoketIo(httpServer);

wsServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on('enter_room', (roomName, done) => {
    // console.log(socket.id);
    // console.log(socket.rooms);
    socket.join(roomName);
    done();
    // console.log(socket.rooms);
  });
});

/*
// fake database
const sockets = [];

// wss.는 전체 소켓에 대한 것 / socket.은 연결된 해당 브라우저에 대한 것
wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['nickname'] = 'Anon';
  console.log('connected to server ✅');
  socket.on('close', () => console.log('Disconnected from th Browser ❌'));
  socket.on('message', (msg) => {
    const message = JSON.parse(msg.toString('utf-8'));
    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
      case 'nickname':
        // socket은 오브젝트이므로 새로 nickname을 추가해줄 수 있다.
        socket['nickname'] = message.payload;
    }
  });
});
*/
const handleListen = () => console.log(`Listening on http://localhost:3000`); // ws://localhost:3000도 지원
httpServer.listen(3000, handleListen);
