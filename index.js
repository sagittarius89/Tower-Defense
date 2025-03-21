require('dotenv').config();
const express = require('express');
const app = express();
const httpPort = process.env.PORT || 8080;
const wsPort = process.env.WSPORT || 3000;
const wsProtocol = process.env.WSPROTOCOL || 'wss';

const path = require('path');
const GameServer = require('./server/gameserver')
const Message = require('./shared/protocol').Message;

let ejs = require('ejs');
let http = require('http');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/game'));
app.use(express.static('game/static'));
app.use(express.static('shared'));

app.get('/', (req, res) => {
    res.render('index',
        {
            wsSocket: process.env.WEBSOCKET_URL,
            wsPort: wsPort,
            wsProtocol: wsProtocol
        });
});

app.listen(httpPort);

let webSocketServer = require('websocket').server;

var httpServer = http.createServer(function (request, response) {
    response.writeHead(404);
    response.end();
});

httpServer.listen(wsPort, function () {
    console.log((new Date()) + ' wsSocket is listening on port ' + wsPort);
});

let wsServer = new webSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

let serverList = [];

function findFreeSlot() {
    let slot = null;

    for (let element of serverList) {
        if (!element.full()) {
            return element;
        }
    }

    if (slot == null) {
        slot = new GameServer();
        serverList.push(slot);
        return slot;
    }
}

wsServer.on('request', function (request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    let server = findFreeSlot();

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            let pMsg = Message.parse(message.utf8Data);

            server.processMsg(pMsg, connection);
        }
        else if (message.type === 'binary') {
            //console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');

        server.playerDisconnected(connection);
    });
});