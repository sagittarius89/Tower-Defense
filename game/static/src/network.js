class Network {
    #client;
    #player1Data;
    #player2Data;

    constructor() {
        this.#client = new WebSocket('ws://localhost:8081/', 'echo-protocol');

        this.#client.addEventListener('error', this.onError.bind(this));

        this.#client.addEventListener('open', this.onOpen.bind(this));
        this.#client.addEventListener('close', this.onClose.bind(this));
        this.#client.addEventListener('message', this.onMessage.bind(this));
    }

    onError(e) {
        console.log('Connection Error: ' + e);
    }

    onOpen(e) {
        console.log('WebSocket Client Connected');

        while (true) {
            if (this.#client.readyState === this.#client.OPEN) {
                let msg = new Message(MessageType.EHLO);

                this.#client.send(msg.serialize());
                return;
            }
        }
    }

    onClose() {
        console.log('echo-protocol Client Closed');
    };

    onMessage(e) {
        if (typeof e.data === 'string') {
            let msg = Message.parse(e.data);

            switch (msg.type) {
                case MessageType.EHLO:
                    console.log("EHLO ok");
                    let resp = Message.registerPlayer();
                    this.send(resp);
                    break;
                case MessageType.PLAYER_REGISTERED:
                    console.log("Player registered ...");

                    if (msg.number == 1) {
                        this.#player1Data = Player.fromDTO(msg.player);
                    } else if (msg.number == 2) {
                        this.#player2Data = Player.fromDTO(msg.player);
                    }
            }
        }
    };

    send(msg) {
        this.#client.send(msg.serialize());
    }
}

Network.instance = new Network();
GameContext = null;