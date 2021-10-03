class InputManager extends GameObject {
    #devices;
    #mousePosX;
    #mousePosY;

    constructor() {
        super();

        /** @member {Map<Player, InputDevice>} */
        this.#devices = {};

        this.#mousePosX = 0;
        this.#mousePosY = 0;
    }

    static get INPUT_LISTENER_PROPERTY() {
        return "input_listener";
    }

    attachPlayer(player, device) {
        this.#devices[player] = device;
    }

    detachPlayer(player) {
        delete this.#devices[player];
    }

    update(ctx, objects) {
        let device = this.#devices[GameContext.player1];
        while (!device.eventQueue.isEmpty()) {
            let event = device.eventQueue.dequeue();

            if (event.type == MouseEventType.MOUSE_MOVE) {
                this.#mousePosX = event.x;
                this.#mousePosY = event.y;
            }

            objects.foreach((obj) => {
                let player = obj.getProperty(InputManager.INPUT_LISTENER_PROPERTY);

                if (player && device) {
                    obj.notify(event);
                }
            });
        }
    }

    get mousePosY() { return this.#mousePosY; }
    get mousePosX() { return this.#mousePosX; }
}