const messageUl = document.querySelector('ul');
const messgeForm = document.querySelector('form');
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('connected to server ✅');
});

socket.addEventListener('message', (message) => {
  console.log('New messgae: ', message.data);
});

socket.addEventListener('close', () => {
  console.log('disconnected from server ❌');
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messgeForm.querySelector('input');
  socket.send(input.value);
  input.value = '';
}

messgeForm.addEventListener('submit', handleSubmit);
