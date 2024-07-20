let CONSTS = require('./consts').CONSTS;

class PlayerProperties {
    #map;
    #player;

    constructor(player, consts) {
        this.#player = player;
        this.#map = {};
        for (const [key, value] of Object.entries(CONSTS)) {
            this.#map[key] = value;
            this[key] = key;
        }
    }

    get player() {
        return this.#player;
    }


    get(value) {
        return this.#map[value];
    }

    set(key, value) {
        this.#map[key] = value;
    }
}

try {
    module.exports = PlayerProperties;
} catch (e) { }