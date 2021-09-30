class Player {
    #name;
    #score;

    constructor(name) {
        this.#name = name;
        this.#score = 0;
    }

    get name() { return this.#name }
}