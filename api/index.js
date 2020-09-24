const express = require('express');
const app = express();
const io = require('socket.io')();
const fs = require('fs');
const path = require('path');
const https = require('https');
const cors = require('cors');
let games = [];

var privateKey  = fs.readFileSync(path.join(__dirname, 'sslcert/private.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, 'sslcert/cert.pem'), 'utf8');

var credentials = {key: privateKey, cert: certificate};


app.use(cors());

const httpsServer = https.createServer(credentials, app);
const server = httpsServer.listen(5443);

/*const server = app.listen(5000, () => {
    console.log('listening on *:5000');
});*/

app.get('/api/test', (req, res) => {
    res.json({ msg: 'success' });
});

app.get('/api/game/:gameid', (req, res) => {
    let game = games.find(e => e.id === req.params.gameid);
    if(game) {
        res.json({ users: game.users });
        return;
    }
    res.json({ users: [] });
});

io.listen(server);
io.on('connection', (socket) => {
    console.log(games);
    socket.on('join', (data) => {
        socket.join(data.game, () => {

        });
    });
    socket.on('getusers', (data) => {
        console.log(data);
    });
});
