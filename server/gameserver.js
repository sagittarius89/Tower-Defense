const MessageType = require('../shared/protocol').MessageType;
const Message = require('../shared/protocol').Message;
const Player = require('../shared/player').Player;
const GameContext = require('./servercontext');

class GameServer {
    #player1;
    #player2;
    #p1Conn;
    #p2Conn;
    #gameContext;


    constructor() {
        this.countDownNumber = 3;
    }

    processMsg(msg, connection) {
        switch (msg.type) {
            case MessageType.EHLO:
                this.send(connection, msg);
                break;
            case MessageType.REGISTER_PLAYER:
                this.registerPlayer(connection, msg.get('player'))
                break;
            case MessageType.CLIENT_READY:
                this.processReady(connection);
                break;
            case MessageType.SYNC_PACK:
                this.processSync(msg);
                break;
            default:
                this.send(connection, Message.error('uknow message type'));
        }
    }

    processSync(msg) {
        let dtoList = msg.get('obj_list');
        this.#gameContext.engine.sync(dtoList);
        let objList = this.#gameContext.engine.objects;
        dtoList = [];

        objList.foreach((obj => {
            if (obj.syncable) {
                let dto = obj.toDTO();
                dtoList.push(dto);
            }
        }).bind(this));

        let resp = Message.objectsSync(dtoList);
        this.broadcast(resp);
    }

    processReady(connection) {
        if (connection == this.#p1Conn) {
            this.#player1.ready = true;
        } else if (connection == this.#p2Conn) {
            this.#player2.ready = true;
        }

        if (this.#player1.ready && this.#player2.ready) {
            this.broadcast(Message.startGame());
        }

        this.#gameContext.engine.start();
    }

    playerDisconnected(conn) {
        if (conn == this.#p1Conn) {
            this.#p1Conn = null;
            this.#player1 = null;
        } else if (conn == this.#p2Conn) {
            this.#p2Conn = null;
            this.#player2 = null;
        }
    }

    setPlayer(idx, player, conn) {
        if (idx == 0) {
            this.#player1 = player;
            this.#p1Conn = conn;
        } else if (idx == 1) {
            this.#player2 = player;
            this.#p2Conn = conn;
        }
    }

    registerPlayer(connection) {
        if (!(this.#player1 && this.$player2)) {
            let players = [this.#player1, this.#player2];
            let ffSlotIdx = players.findIndex(element => element == null);

            let idxMsg = Message.playerIndex(ffSlotIdx);
            this.send(connection, idxMsg);

            players[ffSlotIdx] = new Player("Player " + (ffSlotIdx + 1));
            this.setPlayer(ffSlotIdx, players[ffSlotIdx], connection);

            let dtoList = [];

            players.forEach(p => {
                if (p)
                    dtoList.push(p.toDTO());
                else
                    dtoList.push(null);
            });

            let msg = Message.playerRegistered(dtoList);
            this.broadcast(msg);
        } else {
            let msg = Message.error('server is full');
            this.send(msg);
            return;
        }

        if (this.full()) {
            this.startGame();
        }
    }

    countDown() {
        //@todo
    }


    /*sync() {
        let objectList = [];
        this.#gameContext.engine.objects.foreach(element => {
            objectList.push(element.toDTO());
        });

        let msg = Message.objectsSync(objectList);

        this.broadcast(msg);

        setTimeout(function () {
            this.sync();
        }.bind(this), 50);
    }*/

    startGame() {
        this.countDown();
        this.#gameContext = new GameContext(this.#player1, this.#player2);

        let objectList = [];
        this.#gameContext.engine.objects.foreach(element => {
            objectList.push(element.toDTO());
        });

        let msg = Message.initGame(objectList);

        this.broadcast(msg);
    }

    broadcast(msg) {
        if (this.#p1Conn)
            this.send(this.#p1Conn, msg);

        if (this.#p2Conn)
            this.send(this.#p2Conn, msg);
    }

    full() {
        return this.#player1 && this.#player2;
    }

    send(connection, msg) {
        let data = msg.serialize();
        connection.sendUTF(data);
    }
}

module.exports = GameServer;