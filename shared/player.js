class Player {
    #name;
    #score;
    #self;

    static PLAYER_PROPERTY = "PLAYER_PROPERTY"

    constructor(name, self) {
        this.#name = name;
        this.#score = 0;
        this.#self = self;
    }

    get name() { return this.#name; }
    get score() { return this.#score; }
    set score(value) { this.#score = Number.parseInt(value); }
    get self() { return this.#self; }

    toDTO() {
        return {
            class: "Player",
            name: this.#name,
            score: this.#score
        };
    }

    sync(dto) {
        this.#score = dto.score;
    }

    static fromDTO(dto, self) {
        let p = new Player(dto.name);
        p.score = dto.score;
        p.self = slef;

        return p;
    }
}

try {
    module.exports.Player = Player;
} catch (e) { /*dummy hack to share code between browser*/ }