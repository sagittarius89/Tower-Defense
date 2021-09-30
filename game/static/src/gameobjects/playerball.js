class PlayerBall extends Ball {
    #player;

    constructor(x, y, color, player) {
        super(x, y, color);

        /** @member {Player} */
        this.#player = player;

        this.addProperty(InputManager.INPUT_LISTENER_PROPERTY, player);
    }

    /**
     * 
     * @param {InputDevice} input 
     */
    notify(input) {

    }
}