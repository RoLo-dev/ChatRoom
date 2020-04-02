AOS.init({
    duration: 850
});
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();
const roomName = document.getElementById('room-name');
const allUsers = document.getElementById('users');

// Get username and chat room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(`name: ${username} | room: ${room}`);

// Join ChatApp
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Messages from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.setAttribute('data-aos', 'fade-right');
    div.innerHTML = `<p class="user bold">${message.username} <span>${message.time}</span></p>
    <p class="message-text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users){
    allUsers.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}