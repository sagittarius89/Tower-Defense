const MessageType = {
    EHLO: "ehlo",
    ERROR: 'error',
    REGISTER_PLAYER: "register_player",
    PLAYER_REGISTERED: "player_registered",
    SYNC_OBJECTS: "sync_objects",
    INIT_GAME: "init_game",
    START_GAME: "start_game",
    CLIENT_READY: "client_ready",
    PLAYER_IDX: 'player_idx',
    SYNC_PACK: 'sync_pack',
    ADD_BUILDING: 'add_building',
    INC_SPAWN_SPEED: 'inc_spawn_speed',
    UPDATE_POSITION: 'update_position',
    SYNC_SCORE: 'sync_score',
    MOVE_SOLDIER: 'move_soldier',
    STOP_GAME: 'stop_game',
    RESUME_GAME: 'resume_game'
}

class Message {
    #data;
    #type;

    constructor(type) {
        this.#type = type;
        this.#data = {};
    }

    set(key, value) {
        this.#data[key] = value;
    }

    get(key) {
        return this.#data[key];
    }

    /**@member {MessageType} */
    get type() {
        return this.#type;
    }

    serialize() {
        this.#data['type'] = this.#type;

        return JSON.stringify(this.#data);
    }

    static parse(value) {
        let parsedData = JSON.parse(value);

        let msg = new Message(parsedData['type']);
        for (const [key, value] of Object.entries(parsedData)) {
            msg.set(key, value);
        };

        return msg;
    }

    static registerPlayer(player) {
        let msg = new Message(MessageType.REGISTER_PLAYER);

        return msg;
    }

    static playerRegistered(players) {
        let msg = new Message(MessageType.PLAYER_REGISTERED);
        msg.set('players', players);

        return msg;
    }

    static playerIndex(number) {
        let msg = new Message(MessageType.PLAYER_IDX);

        msg.set('player_idx', number);

        return msg;
    }

    static initGame(objectList) {
        let msg = new Message(MessageType.INIT_GAME);

        msg.set('obj_list', objectList);

        return msg;
    }

    static startGame() {
        let msg = new Message(MessageType.START_GAME);
        return msg;
    }

    static clientReady() {
        let msg = new Message(MessageType.CLIENT_READY);

        return msg;
    }

    static syncPack(objectList) {
        let msg = new Message(MessageType.SYNC_PACK);

        msg.set('obj_list', objectList);

        return msg;
    }

    static objectsSync(objectList) {
        let msg = new Message(MessageType.SYNC_OBJECTS);

        msg.set('obj_list', objectList);

        return msg;
    }

    static addBuilding(dto) {
        let msg = new Message(MessageType.ADD_BUILDING);

        msg.set('obj', dto);

        return msg;
    }

    static moveSoldier(id, pos) {
        let msg = new Message(MessageType.MOVE_SOLDIER)
        msg.set('id', id);
        msg.set('movement', pos);

        return msg;
    }

    static updatePosition(id, pos) {
        let msg = new Message(MessageType.UPDATE_POSITION)
        msg.set('obj', id);
        msg.set('pos', pos);

        return msg;
    }

    static incSpawnSpeed(player) {
        let msg = new Message(MessageType.INC_SPAWN_SPEED);

        msg.set('player', player);

        return msg;
    }

    static syncScore(player) {
        let msg = new Message(MessageType.SYNC_SCORE);
        msg.set('player', player);

        return msg;
    }

    static error(text) {
        let msg = new Message(MessageType.ERROR);
        msg.set('message', text);

        return msg;
    }

    static stopGame() {
        let msg = new Message(MessageType.STOP_GAME);

        return msg;
    }

    static resumeGame() {
        let msg = new Message(MessageType.RESUME_GAME);

        return msg;
    }
}

try {
    module.exports.Message = Message;
    module.exports.MessageType = MessageType;
    module.exports.PlayerDTO = PlayerDTO;
} catch (e) { /*dummy hack to share code between browser*/ }