class Player {
    #name;
    #score;

    static PLAYER_PROPERTY = "PLAYER_PROPERTY"

    constructor(name) {
        this.#name = name;
        this.#score = 0;
    }

    get name() { return this.#name }
}