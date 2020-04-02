const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const userBot = 'ChatApp Bot';
//When user connects
io.on('connection', socket => {
    socket.emit('message', formatMessage(userBot, 'Welcome to ChatApp'));

    // Message when a user connects
    socket.broadcast.emit('message', formatMessage(userBot, 'A user has joined the chat'));

    // When a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(userBot, 'A user has left the chat'));
    })

    // Listens for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));