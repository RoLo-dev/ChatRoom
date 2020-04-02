AOS.init({
    duration: 850
});
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// Get username and chat room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(`name: ${username} | room: ${room}`);

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