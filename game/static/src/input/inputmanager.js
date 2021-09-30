class InputManager extends GameObject {
    #devices;

    constructor() {
        super();

        /** @member {Map<Player, InputDevice>} */
        this.#devices = {};
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
        objects.foreach((obj) => {
            var player = obj.getProperty(InputManager.INPUT_LISTENER_PROPERTY);

            if (player && this.#devices[player]) {
                obj.notify(this.#devices[player]);
            }
        });
    }
}