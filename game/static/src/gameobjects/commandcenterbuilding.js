class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;

    constructor(image, pos, spawnPoint) {
        super(image, pos.x, pos.y);
        this.selectable = true;
        this.#productionTimestamp = new Date();
        this.#spawnFrequency = 5 * 1000;
        this.#spawnPoint = spawnPoint;
    }

    produceNewSoldier() {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y);
        soldier.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.getProperty(InputManager.INPUT_LISTENER_PROPERTY));
        soldier.addProperty(Player.PLAYER_PROPERTY,
            this.getProperty(Player.PLAYER_PROPERTY));
        GameContext.engine.addObject(soldier);
    }

    update(ctx, objects) {
        Building.prototype.update.call(this, ctx, objects);
        let now = new Date();

        if (now.getTime() - this.#productionTimestamp.getTime()
            > this.#spawnFrequency) {

            this.produceNewSoldier();
            this.#productionTimestamp = new Date();
        }

    }
}