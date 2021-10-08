class CreateTower extends GameAction {
    #towerImage;
    #towerImageName;
    #towerImageSelected;
    #bulletImage;
    #player;

    constructor(callback, towerImage, towerImageSelected, bulletImage, player) {
        super(callback);

        this.#towerImage = ResourceManager.instance.getImageResource(towerImage);
        this.#towerImageName = towerImage;
        this.#towerImageSelected = towerImageSelected;
        this.#bulletImage = bulletImage;
        this.#player = player;
    }

    update(ctx, objects) {
        ctx.globalAlpha = 0.3;

        ctx.setTransform(1, 0, 0, 1,
            GameContext.inputManager.mousePosX,
            GameContext.inputManager.mousePosY);

        ctx.drawImage(
            this.#towerImage,
            -this.#towerImage.width / 2,
            -this.#towerImage.height / 2);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    mouseUp() {
        super.stop();

        let tower = new Tower(
            new Vector2d(GameContext.inputManager.mousePosX,
                GameContext.inputManager.mousePosY),
            new Vector2d(GameContext.inputManager.mousePosX,
                GameContext.inputManager.mousePosY),
            this.#towerImageName,
            this.#towerImageSelected,
            this.#bulletImage
        );

        tower.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.#player);

        tower.addProperty(Player.PLAYER_PROPERTY,
            this.#player);

        GameContext.engine.addObject(tower);

        this.callback();
    }
}


class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #dronImage;
    #bulletImage;

    constructor(pos, spawnPoint, player,
        image, imageSelected,
        dronImage, bulletImage,
        towerImage, towerImageSelected) {

        super(image, imageSelected, pos.x, pos.y);

        this.addProperty(Player.PLAYER_PROPERTY, player);
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

        let towerAction = new Button(
            "build tower", CreateTower,
            [towerImage, towerImageSelected, bulletImage, this.getProperty(Player.PLAYER_PROPERTY)],
            420, 750, 50, 50, "turret_violet_01", 25, true
        );

        actionsList.push(towerAction);

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
    }
}