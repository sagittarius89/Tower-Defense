const MessageType = require('../shared/protocol').MessageType;
const Message = require('../shared/protocol').Message;
const Player = require('../shared/player').Player;
const GameContext = require('./servercontext');
const Tower = require('./gameobjects/towerbuilding');
const BlackHole = require('./gameobjects/blackholebuilding');
const CONSTS = require('../shared/consts').CONSTS;
const PlayerProperties = require('../shared/playerproperties');
const Vector2d = require('../game/static/src/math/vector').Vector2d;


class GameServer {
    #player1;
    #player2;
    #p1Conn;
    #p2Conn;
    #p1prop;
    #p2prop;
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
            case MessageType.ADD_BUILDING:
                this.processAddBuilding(msg);
                break;
            case MessageType.INC_SPAWN_SPEED:
                this.processIncSpawnSpeed(msg);
                break;
            case MessageType.MOVE_SOLDIER:
                this.processMoveSoldier(msg);
                break;
            case MessageType.STOP_GAME:
                this.#gameContext.engine.stop();
                this.broadcast(Message.stopGame());
                break;
            case MessageType.RESUME_GAME:
                this.#gameContext.engine.resume();
                this.broadcast(Message.resumeGame());
                break;
            default:
                this.send(connection, Message.error('uknow message type'));
        }
    }

    processMoveSoldier(msg) {
        let id = msg.get('id');
        let pos = msg.get('movement');
        let soldier = this.#gameContext.engine.objects.byId(id);

        if (soldier) {
            soldier.movement = new Vector2d(pos.x, pos.y);
            soldier.lastActonCooldownRestart();
            soldier.idle = false;
        }
    }

    processAddBuilding(msg) {
        let dto = msg.get('obj');
        let obj = null;
        switch (dto.type) {
            case Tower.name: {
                obj = Tower.fromDTO(dto);
                this.addScore(obj.owner, -CONSTS.TOWER.COST);
                break;
            }
            case BlackHole.name: {
                obj = BlackHole.fromDTO(dto);
                this.addScore(obj.owner, -CONSTS.BLACK_HOLE_COST);
                break;
            }
        }

        if (obj)
            this.#gameContext.engine.objects.push(obj);
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

    processIncSpawnSpeed(msg) {
        let pDto = msg.get('player');
        let p = Player.fromDTO(pDto);

        let ccsf = this.playerProp(p).get('COMMAND_CENTER_SPAWN_FREQUENCY');

        ccsf *= 0.9;

        this.playerProp(p).set('COMMAND_CENTER_SPAWN_FREQUENCY', ccsf);
        this.addScore(p, -CONSTS.UPGRADE_SPAWN_SPEED_COST);
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
            this.#gameContext.engine.endGame(true, false);
        } else if (conn == this.#p2Conn) {
            this.#gameContext.engine.endGame(false, true);
        }

        this.#gameContext.engine.stop();
    }

    playerProp(player) {
        if (this.#p1prop && this.#p1prop.player.name == player.name) {
            return this.#p1prop;
        } else if (this.#p2prop && this.#p2prop.player.name == player.name) {
            return this.#p2prop;
        }
    }

    setPlayer(idx, player, conn) {
        if (idx == 0) {
            this.#player1 = player;
            this.#p1Conn = conn;
            this.#p1prop = new PlayerProperties(player, CONSTS);
        } else if (idx == 1) {
            this.#player2 = player;
            this.#p2Conn = conn;
            this.#p2prop = new PlayerProperties(player, CONSTS);
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

    updatePosition(id, pos) {
        let msg = Message.updatePosition(id, pos.toDTO());

        this.broadcast(msg);
    }

    addScore(player, score) {
        let tPlayer = null;
        if (this.#player1.name == player.name) {
            this.#player1.score += score;

            tPlayer = this.#player1;
        } else if (this.#player2.name == player.name) {
            this.#player2.score += score;

            tPlayer = this.#player2;
        }

        let msg = Message.syncScore(tPlayer.toDTO());
        this.broadcast(msg);
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
        this.#gameContext = new GameContext(this.#player1, this.#player2, this);

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