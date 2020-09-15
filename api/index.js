const express = require('express');
const app = express();
const io = require('socket.io')();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
let games = [];



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
        let response = {
            status: 'success',
        };
        socket.join(data.game);
        let game = games.find(e => e.name === data.game);
        if(game) {
            if(!game.users.find(e => e === data.user)) {
                game.users.push({ name: data.user, creator: false });
            }
        } else {
            games.push({ name: data.game, users: [ { name: data.user, creator: true } ] });
        }
        console.log(game);
        fn(response);
    });
    socket.on('send', (data) => {
        io.in(data.game).emit('response', data.msg);
    });
    socket.on('getusers', (data) => {
        let game = games.find(e => e.name === data.game);
        io.in(data.game).emit('listusers', game.users);
    });
});
