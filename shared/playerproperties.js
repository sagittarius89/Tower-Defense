let CONSTS = require('./consts').CONSTS;

class PlayerProperties {
    #map;
    #player;

    constructor(player, consts) {
        this.#player = player;
        this.#map = {};

        this.parseConstansts(consts);
    }

    *parseSubKey(obj) {
        for (const [key, value] of Object.entries(obj)) {
            if (value instanceof Object) {
                for (const pair of this.parseSubKey(value)) {
                    yield {
                        key: key + "." + pair.key,
                        value: pair.value
                    }
                }
            } else {
                yield {
                    key: key,
                    value: value
                };
            }
        }
    }

    parseConstansts(consts) {
        for (const [key, value] of Object.entries(CONSTS)) {

            if (value instanceof Object) {
                for (const pair of this.parseSubKey(value)) {
                    this.#map[key + "." + pair.key] = pair.value;
                }
            }
            else {
                this.#map[key] = value;
            }

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