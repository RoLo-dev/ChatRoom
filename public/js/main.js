AOS.init({
    duration: 850
});
const chatForm = document.getElementById('chat-form');
const socket = io();

// Messages from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
}