const MessageType = {
    EHLO: "ehlo",
    ERROR: 'error',
    REGISTER_PLAYER: "register_player",
    PLAYER_REGISTERED: "player_registered"
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

    static playerRegistered(number, player, self) {
        let msg = new Message(MessageType.PLAYER_REGISTERED);

        msg.set('number', number);
        msg.set('player', player);
        msg.set('self', self);

        return msg;
    }

    static error(text) {
        let msg = new Message(MessageType.ERROR);
        msg.set('message', text);

        return msg;
    }
}

try {
    module.exports.Message = Message;
    module.exports.MessageType = MessageType;
    module.exports.PlayerDTO = PlayerDTO;
} catch (e) { /*dummy hack to share code between browser*/ }