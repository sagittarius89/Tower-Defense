class Network {
    #client;
    #player1Data;
    #player2Data;
    #playerIdx;
    #gameContext;

    constructor() {
        this.#client = new WebSocket('ws://tower-defense.fly.dev:8081/', 'echo-protocol');

        this.#client.addEventListener('error', this.onError.bind(this));

        this.#client.addEventListener('open', this.onOpen.bind(this));
        this.#client.addEventListener('close', this.onClose.bind(this));
        this.#client.addEventListener('message', this.onMessage.bind(this));
    }

    async sendEhlo() {
        while (true) {
            if (!ResourceManager.instance.isReady()) {
                await sleep(100);
                continue;
            }

            if (this.#client.readyState === this.#client.OPEN) {
                let msg = new Message(MessageType.EHLO);

                this.#client.send(msg.serialize());
                return;
            }
        }
    }

    processSync(dtoList) {
        let objList = GameContext.engine.objects;
        objList.foreach((obj => {

            if (obj.syncable) {
                if (!dtoList.find(dto => dto.id == obj.id)) {

                    objList.delete(obj);
                }
            }

        }).bind(this));

        dtoList.forEach(dto => {
            let obj = objList.byId(dto.id);

            if (obj) {
                obj.sync(dto);
            } else {
                GameContext.engine.addFromDTO(dto);
            }
        });

        //check if obj was destroyed
    }

    syncScore(msg) {
        let dto = msg.get('player');

        if (dto.name == GameContext.player1.name) {
            GameContext.player1.sync(dto);
        } else if (dto.name == GameContext.player2.name) {
            GameContext.player2.sync(dto);
        }
    }

    processUpdatePosition(msg) {
        let id = msg.get('obj');
        let newPos = Vector2d.fromDTO(msg.get('pos'));

        let obj = GameContext.engine.objects.byId(id);

        obj.pos = newPos;
    }

    sync() {
        let objList = GameContext.engine.objects;
        let dtoList = [];

        objList.foreach((obj => {
            if (obj.syncable) {
                dtoList.push(obj.toDTO());
            }
        }).bind(this));

        this.send(Message.syncPack(dtoList));

        if (GameContext.engine.continue) {
            setTimeout(this.sync.bind(this), CONSTS.SYNC_TIMEOUT);
        }
    }

    incSpawnSpeed(player) {
        let msg = Message.incSpawnSpeed(player.toDTO());

        this.send(msg);
    }

    addBuilding(dto) {
        let msg = Message.addBuilding(dto);

        this.send(msg);
    }

    enrichOwner(dto) {
        if (dto.owner && dto.owner.name == this.#player1Data.name && this.#playerIdx == 0) {
            dto.owner.self = true;
        } else if (dto.owner && dto.owner.name == this.#player2Data.name && this.#playerIdx == 1) {
            dto.owner.self = true;
        }
    }

    initGameContext(dtoList) {
        let cmdCntP1 = null;
        let cmdCntP2 = null;
        let objList = [];

        dtoList.forEach(dto => {
            this.enrichOwner(dto);

            switch (dto.type) {
                case 'CommandCenterBuilding': {
                    let obj = CommandCenterBuilding.fromDTO(dto);

                    if (obj.owner.name == this.#player1Data.name) {
                        cmdCntP1 = obj;
                    } else if (obj.owner.name == this.#player2Data.name) {
                        cmdCntP2 = obj;
                    }

                    break;
                }
                case 'Solider': {
                    let obj = Soldier.fromDTO(dto);
                    objList.push(obj);
                    break;
                }
                case 'World': {
                    let obj = World.fromDTO(dto);
                    objList.push(obj);
                    break;
                }
            }
        });

        this.#gameContext = createGameContext(
            this.#player1Data,
            this.#player2Data,
            cmdCntP1,
            cmdCntP2,
            objList);
    }

    onError(e) {
        console.log('Connection Error: ' + e);
    }

    onOpen(e) {
        console.log('WebSocket Client Connected');

        this.sendEhlo();
    }

    onClose() {
        console.log('echo-protocol Client Closed');

        GameContext.engine.continue = false;
    };

    onMessage(e) {
        if (typeof e.data === 'string') {
            let msg = Message.parse(e.data);

            switch (msg.type) {
                case MessageType.EHLO: {
                    console.log("EHLO ok");
                    let resp = Message.registerPlayer();
                    this.send(resp);
                    break;
                }
                case MessageType.PLAYER_IDX: {
                    this.#playerIdx = msg.get('player_idx');
                    console.log(`player index is ${this.#playerIdx}`);
                    break;
                }
                case MessageType.PLAYER_REGISTERED: {
                    console.log("Player registered ...");

                    let dtoList = msg.get('players');

                    if (dtoList[0]) {
                        this.#player1Data = Player.fromDTO(dtoList[0], this.#playerIdx == 0);
                    }

                    if (dtoList[1]) {
                        this.#player2Data = Player.fromDTO(dtoList[1], this.#playerIdx == 0);
                    }
                    break;
                }
                case MessageType.INIT_GAME: {
                    let objLst = msg.get('obj_list');

                    this.initGameContext(objLst);

                    let resp = Message.clientReady();
                    this.send(resp);

                    break;
                }
                case MessageType.START_GAME: {
                    GameContext.engine.start();

                    this.sync();
                    break;
                }
                case MessageType.SYNC_OBJECTS: {
                    let objLst = msg.get('obj_list');

                    this.processSync(objLst);
                    break;
                }
                case MessageType.UPDATE_POSITION: {
                    this.processUpdatePosition(msg);
                    break;
                }
                case MessageType.SYNC_SCORE: {
                    this.syncScore(msg);
                    break;
                }
            }
        }
    }

    send(msg) {
        this.#client.send(msg.serialize());
    }
};

Network.instance = new Network();
GameContext = null;