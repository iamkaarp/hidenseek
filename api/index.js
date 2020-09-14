const express = require('express');
const app = express();
const io = require('socket.io')();
let rooms = [];

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const server = app.listen(5000, () => {
    console.log('listening on *:5000');
});

app.get('/api/test', (req, res) => {
    res.json({ msg: 'success' });
});

io.listen(server);
io.on('connection', (socket) => {
    socket.on('join', (data, fn) => {
        console.log(data.room, fn);
        fn(`joining ${data.room}`);
        socket.join(data.room);
        rooms.push(data.room);
    });
    socket.on('send', (data) => {
        io.in(data.room).emit('response', data.msg);
    });
});
