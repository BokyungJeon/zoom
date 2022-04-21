const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  // 내가 만든 이벤트를 전송할 수 있고, 여러타입(object, 콜백함수까지도)을 여러개까지 타입을 그대로 전송하고 받을 수 있다.
  // 콜백함수는 반드시 마지막에 순서해야한다.
  // 콜백함수는 백엔드에서 callback();으로 적어 백엔드에서 실행하는 것처럼 보이지만, (백엔드에서 argument인자도 넣을 수 있다.)
  // 백엔드에서 실행 명령만 한것이고 코드는 프론트엔드에서 실행되는 것이다.(백엔드에서 실행하게 되면 보안문제가 발생한다.)
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);
