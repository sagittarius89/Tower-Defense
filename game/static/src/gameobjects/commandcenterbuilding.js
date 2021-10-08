class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #dronImage;
    #bulletImage;

    constructor(pos, spawnPoint, image, imageSelected, dronImage, bulletImage) {
        super(image, imageSelected, pos.x, pos.y);

        this.#productionTimestamp = new Date();
        this.#spawnFrequency = 3 * 1000;
        this.#spawnPoint = spawnPoint;
        this.#soldierLimit = 15;
        this.#dronImage = dronImage;
        this.#bulletImage = bulletImage;

        this.selectable = true;
        this.hp = 1000;
        this.maxHp = 1000;
        this.name = "Command Center";
        this.zIndex = 30;

        let actionsList = [];

        actionsList.push(new Button(
            "build tower", null, 420, 750, 50, 50, "turret_violet_01", true
        ))

        this.addProperty(Building.ACTIONS_PROPERY, actionsList);
    }

    produceNewSoldier() {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y,
            this.#dronImage, this.#bulletImage);
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

        drawHpStripe(ctx, this.maxHp, this.hp,
            this.x,
            this.y - (this.width * 1, 25),
            this.width, 5);
    }
}