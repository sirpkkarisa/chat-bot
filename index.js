const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const PORT = process.env.PORT || 7000;
const server = http.createServer(app)
server.listen(
    PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
    }
)
const io = socketio(server);

//open connection
app.get('/',(req, res) => {
    res.send('Server running...')
})
io.on('connection', (socket) => {
    console.log('connected');

    //status
    sendStatus = (s) => {
        return socket.emit('status', {msg: s});
    };
    
    socket.on('loggedIn', (data)=> {
        //welcome
        socket.emit('welcome', {msg: `Welcome ${data.usernameValue}`, user: data.usernameValue})
    });
    
    socket.on('chat', (data) => {
        io.emit('conversation', {
            id: socket.id, 
            conversation: data.conversation,
            author: data.usernameValue
        });
    });

    socket.on('disconnect',() => {
        console.log('socket disconnected')
    });
})