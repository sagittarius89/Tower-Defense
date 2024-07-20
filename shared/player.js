class Player {
    #name;
    #score;
    #self;

    static PLAYER_PROPERTY = "PLAYER_PROPERTY"

    constructor(name) {
        this.#name = name;
        this.#score = 100;
    }

    get name() { return this.#name; }
    get score() { return this.#score; }
    set score(value) {
        let old = this.#score;
        this.#score = Number.parseInt(value);
        if (this.#score == null || isNaN(this.#score)) /*prevent null*/
            this.#score = old;
    }
    set self(value) { this.#self = Boolean(value); }
    get self() { return this.#self; }

    toDTO() {
        return {
            class: "Player",
            name: this.#name,
            score: this.#score
        };
    }

    sync(dto) {
        this.score = dto.score;
    }

    static fromDTO(dto, self) {
        let p = new Player(dto.name);
        p.score = dto.score;
        p.self = dto.self;

        if (self) {
            p.self = true;
        }

        return p;
    }
}

try {
    module.exports.Player = Player;
} catch (e) { /*dummy hack to share code between browser*/ }