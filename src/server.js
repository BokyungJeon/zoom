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
  socket['nickname'] = 'Anonymous';
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on('enter_room', (roomName, done) => {
    // 여기서 socket.은 해당 이벤트(enter_room)가 발생한 소켓
    socket.join(roomName);
    done();
    console.log(roomName);
    socket.to(roomName).emit('welcome', socket.nickname);
  });
  // disconnecting: 연결이 끊기기 바로 직전 찰나에 발생하는 이벤트. room정보가 살아있음
  // disconnect: 연결이 완전히 끊어졌을 때 발생하는 이벤트. room정보가 비어있음
  socket.on('disconnecting', () => {
    // 여기서 socket.은 해당 이벤트(disconnecting)가 발생한 소켓
    // socket.rooms에는 Set(중복 X, index X, forEach O)형태로 diconnecting이벤트가 발생한 socket이 들어있다.
    // 브라우저 하나 껐을 때 {"처음들어갈때 id", "내가 들어간 방이름"}이 들어있다.
    console.log(socket.rooms);
    socket.rooms.forEach((room) => {
      console.log('room', room);
      socket.to(room).emit('bye', socket.nickname);
    });
  });

  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

const handleListen = () => console.log(`Listening on http://localhost:3000`); // ws://localhost:3000도 지원
httpServer.listen(3000, handleListen);
