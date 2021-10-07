class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #hp;
    #maxHp;

    constructor(image, pos, spawnPoint) {
        super(image, pos.x, pos.y);
        this.selectable = true;
        this.#productionTimestamp = new Date();
        this.#spawnFrequency = 3 * 1000;
        this.#spawnPoint = spawnPoint;
        this.#soldierLimit = 15;
        this.#hp = 1000;
        this.#maxHp = 1000;
    }

    produceNewSoldier() {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y);
        soldier.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.getProperty(InputManager.INPUT_LISTENER_PROPERTY));
        soldier.addProperty(Player.PLAYER_PROPERTY,
            this.getProperty(Player.PLAYER_PROPERTY));
        GameContext.engine.addObject(soldier);
    }

    soldierCount(objects) {
        let count = 0;
        objects.foreach((obj) => {
            if (obj instanceof Soldier &&
                obj.getProperty(Player.PLAYER_PROPERTY) ==
                this.getProperty(Player.PLAYER_PROPERTY)) {
                count++;
            }
        });

        return count;
    }

    update(ctx, objects) {
        Building.prototype.update.call(this, ctx, objects);
        let now = new Date();

        if (now.getTime() - this.#productionTimestamp.getTime()
            > this.#spawnFrequency &&
            this.#soldierLimit > this.soldierCount(objects)) {

            this.produceNewSoldier();
            this.#productionTimestamp = new Date();
        }

    }
}