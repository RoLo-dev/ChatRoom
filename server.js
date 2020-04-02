const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const userBot = 'Chat Bot';
//When user connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        socket.emit('message', formatMessage(userBot, 'Welcome to ChatApp'));
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Message when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(userBot, `${user.username} has joined the chat`));

        // Provides users and room name
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listens for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username, msg));
    });
    // When a user disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(userBot, `${user.username} has left the chat`));
            // Provides users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        };
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));