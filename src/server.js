import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`); // ws://localhost:3000도 지원

// http와 websocket을 같은 서버(포트)에서 작동
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // http서버 위에 webSocket서버를 만든다. 웹소켓만 작동시키려면 {server}를 생략한다.

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

server.listen(3000, handleListen);
