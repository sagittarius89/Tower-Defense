const MessageType = require('../shared/protocol').MessageType;
const Message = require('../shared/protocol').Message;
const Player = require('../shared/player').Player;
const GameContext = require('./servercontext').GameContext;

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
                break
            default:
                this.send(connection, Message.error('uknow message type'));
        }
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

    registerPlayer(connection) {
        let player = null;

        if (!this.#player1) {
            this.#player1 = player = new Player("player 1");
            this.#p1Conn = connection;

            this.send(connection, Message.playerRegistered(1, player.toDTO(), true));

            if (this.#player2) {
                this.send(this.#p2Conn, Message.playerRegistered(
                    1,
                    this.#player1.toDTO(),
                    false
                ));
            }
        } else if (!this.#player2) {
            this.#player2 = player = new Player("player 2");
            this.#p2Conn = connection;


            this.send(connection, Message.playerRegistered(
                2,
                player.toDTO(),
                true
            ));

            if (this.#player1) {
                this.send(this.#p1Conn, Message.playerRegistered(
                    2,
                    this.#player2.toDTO(),
                    false
                ));
            }
        } else {
            let msg = Message.error('server is full');
            return;
        }

        if (this.full()) {
            this.startGame();
        }
    }

    countDown() {
        //@todo
    }


    sync() {
        let objectList = [];
        this.#gameContext.engine.objects.foreach(element => {
            objectList.push(element.toDTO());
        });

        let msg = Message.objectsSync(objectList);

        this.broadcast(msg);

        setTimeout(function () {
            this.sync();
        }.bind(this), 50);
    }

    startGame() {
        this.countDown();
        this.#gameContext = new GameContext(this.#player1, this.#player2);

        let objectList = [];
        this.#gameContext.engine.objects.foreach(element => {
            objectList.push(element.toDTO());
        });

        let msg = Message.startGame(objectList);

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