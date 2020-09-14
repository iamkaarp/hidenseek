const express = require('express');
const app = express();
const io = require('socket.io')();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
let rooms = [];



var privateKey  = fs.readFileSync(path.join(__dirname, 'sslcert/private.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, 'sslcert/cert.pem'), 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(5000);
const server = httpsServer.listen(5443);

/*const server = app.listen(5000, () => {
    console.log('listening on *:5000');
});*/

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
