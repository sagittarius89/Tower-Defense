class GameAction extends GameObject {
    #callback;

    get callback() { return this.#callback; }

    constructor(callback) {
        super();

        this.#callback = callback;
    }

    stop() {
        GameContext.engine.objects.delete(this);
        GameContext.hud.currentAction = null;
    }

    mouseUp() {
        this.#callback();
    }

    update(ctx, objects) {
        //nothing to do
    }
}