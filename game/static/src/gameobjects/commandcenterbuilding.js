
class CreateTower extends GameAction {
    #towerImage;
    #towerImageSelected;
    #bulletImage;
    #pushFunc;

    constructor(callback, towerImage, towerImageSelected, bulletImage, player, pushFunc) {
        super(callback);

        this.#towerImage = towerImage;
        this.#towerImageSelected = towerImageSelected;
        this.#bulletImage = bulletImage;
        this.player = player;
        this.#pushFunc = pushFunc;
        this.lock = true;
    }

    update(ctx, objects) {
        this.findClostestBuilding(objects);

        let image = ResourceManager.instance.getImageResource(this.#towerImage);

        ctx.globalAlpha = 0.3;

        ctx.setTransform(1, 0, 0, 1,
            GameContext.inputManager.mousePosX,
            GameContext.inputManager.mousePosY);

        ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2);

        ctx.globalAlpha = 0.1;

        if (!this.lock) {
            ctx.fillStyle = 'green';
        } else {
            ctx.fillStyle = 'red';
        }

        ctx.beginPath();
        ctx.arc(0, 0, CONSTS.TOWER_ATTACK_DISTANCE, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();

        this.drawBuildingZone(ctx);

        ctx.globalAlpha = 1;
    }

    mouseUp() {
        super.stop();

        if (!this.lock) {
            let tower = new Tower(
                new Vector2d(GameContext.inputManager.mousePosX,
                    GameContext.inputManager.mousePosY),
                new Vector2d(GameContext.inputManager.mousePosX,
                    GameContext.inputManager.mousePosY),
                this.#towerImage,
                this.#towerImageSelected,
                this.#bulletImage
            );

            tower.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                this.player);

            tower.owner = this.player;


            this.#pushFunc(tower);

            this.callback();
        }
    }
}


class SpawnSpeedAction extends GameAction {
    #incFunc

    constructor(callback, player, incFunc) {
        super(callback);
        this.player = player;
        this.#incFunc = incFunc;
    }

    mouseUp() {
        this.#incFunc(this.player);
        this.callback();
    }
}

class CreateBlackHoleAction extends GameAction {
    #holeImage;
    #holeImageSelected;
    #pushFunc;
    #mode;
    #first;
    #second;

    static MODE_BLANK = 0;
    static MODE_FIRST_BUILDING = 1;
    static MODE_SECOND_BUILDING = 2;
    constructor(callback, holeImage, holeImageSelected, player, pushFunc) {
        super(callback);

        this.#holeImage = holeImage;
        this.#holeImageSelected = holeImageSelected;
        this.player = player;
        this.#pushFunc = pushFunc;
        this.lock = true;
        this.#mode = CreateBlackHoleAction.MODE_BLANK;
    }

    update(ctx, objects) {
        this.findClostestBuilding(objects);

        let image = ResourceManager.instance.getImageResource(this.#holeImage);

        ctx.globalAlpha = 0.3;

        ctx.setTransform(1, 0, 0, 1,
            GameContext.inputManager.mousePosX,
            GameContext.inputManager.mousePosY);

        ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2);

        ctx.globalAlpha = 0.1;

        if (!this.lock) {
            ctx.fillStyle = 'green';
        } else {
            ctx.fillStyle = 'red';
        }

        ctx.beginPath();
        ctx.arc(0, 0, CONSTS.TOWER_ATTACK_DISTANCE, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
        this.drawBuildingZone(ctx);

        if (this.#mode == CreateBlackHoleAction.MODE_FIRST_BUILDING) {
            this.#first.update(ctx, objects);
        }

        ctx.globalAlpha = 1;
    }

    mouseUp() {

        if (!this.lock) {
            let tower = new BlackHole(
                new Vector2d(GameContext.inputManager.mousePosX,
                    GameContext.inputManager.mousePosY),
                this.#holeImage,
                this.#holeImageSelected,
                null
            );

            tower.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                this.player);

            tower.owner = this.player;

            if (this.#mode == CreateBlackHoleAction.MODE_BLANK) {
                this.#first = tower;
                this.#mode = CreateBlackHoleAction.MODE_FIRST_BUILDING;
            } else if (this.#mode == CreateBlackHoleAction.MODE_FIRST_BUILDING) {
                super.stop();
                this.#second = tower;
                this.#first.sibling = this.#second.id;

                this.#pushFunc(this.#first, this.#second);
                this.callback();
            }
        }
    }
}

class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #dronImage;
    #bulletImage;
    #towerImage;
    #towerImageSelected;
    #blackHoleImage;
    #blackHoleImageSelected;

    constructor(pos, spawnPoint, player,
        image, imageSelected,
        dronImage, bulletImage,
        towerImage, towerImageSelected,
        blackHoleImage, blackHoleImageSelected) {

        super(image, imageSelected, pos.x, pos.y);

        this.#productionTimestamp = new Date().getTime();
        this.#spawnFrequency = CONSTS.COMMAND_CENTER_SPAWN_FREQUENCY;
        this.#soldierLimit = CONSTS.COMMAND_CENTER_SOLDIER_LIMIT;
        this.hp = CONSTS.COMMAND_CENTER_HP;
        this.maxHp = CONSTS.COMMAND_CENTER_HP;
        this.#spawnPoint = spawnPoint;
        this.#dronImage = dronImage;
        this.#bulletImage = bulletImage;
        this.#towerImage = towerImage;
        this.#towerImageSelected = towerImageSelected;

        this.#blackHoleImage = blackHoleImage;
        this.#blackHoleImageSelected = blackHoleImageSelected;

        this.owner = player;
        this.selectable = true;
        this.syncable = true;
        this.name = "Command Center";
        this.zIndex = 30;

        let actionsList = [];

        if (player.self) {
            let towerAction = new Button(
                "build tower", CreateTower,
                [towerImage, towerImageSelected, bulletImage, this.owner, function (obj) {
                    let dto = obj.toDTO();
                    Network.instance.addBuilding(dto);
                }],
                420, 750, 50, 50, "turret_violet_01", CONSTS.TOWER_COOLDOWN, true
            );

            let incSpawnSpeed = new Button(
                "increase spawn speed", SpawnSpeedAction,
                [this.owner, function (owner) {
                    Network.instance.incSpawnSpeed(owner)
                }], 480, 750, 50, 50, 'inc_spawn_speed', CONSTS.UPGRADE_SPAWN_SPEED_COOLDOWN, true
            );

            let holeAction = new Button(
                "build black hole", CreateBlackHoleAction,
                [blackHoleImage, blackHoleImageSelected, this.owner, function (obj1, obj2) {
                    let dto1 = obj1.toDTO();
                    let dto2 = obj2.toDTO();
                    Network.instance.addBuilding(dto1);
                    Network.instance.addBuilding(dto2);
                }],
                540, 750, 50, 50, "black_holeoviolet", CONSTS.TOWER_COOLDOWN, true
            );

            actionsList.push(towerAction, incSpawnSpeed, holeAction);
        }


        this.addProperty(Building.ACTIONS_PROPERY, actionsList);
    }

    produceNewSoldier() {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y,
            this.#dronImage, this.#bulletImage, this.owner);

        soldier.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.getProperty(InputManager.INPUT_LISTENER_PROPERTY));

        GameContext.engine.addObject(soldier);
    }

    soldierCount(objects) {
        let count = 0;
        objects.foreach((obj) => {
            if (obj instanceof Soldier && obj.owner == this.owner) {
                count++;
            }
        });

        return count;
    }

    update(ctx, objects) {
        super.update(ctx, objects);
    }

    logic(objects) {
        let now = new Date();

        if (now.getTime() - this.#productionTimestamp
            > this.#spawnFrequency &&
            this.#soldierLimit > this.soldierCount(objects)) {

            //this.produceNewSoldier();

            this.#productionTimestamp = new Date().getTime();
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.productionTimestamp = this.#productionTimestamp;
        dto.spawnPoint = this.#spawnPoint.toDTO();
        dto.spawnFrequency = this.#spawnFrequency;
        dto.soldierLimit = this.#soldierLimit;
        dto.dronImage = this.#dronImage;
        dto.bulletImage = this.#bulletImage;
        dto.towerImage = this.#towerImage;
        dto.towerImageSelected = this.#towerImageSelected;
        dto.blackHoleImage = this.#blackHoleImage;
        dto.blackHoleImageSelected = this.#blackHoleImageSelected;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new CommandCenterBuilding(
        new Vector2d(dto.x, dto.y),
        Vector2d.fromDTO(dto.spawnPoint),
        Player.fromDTO(dto.owner),
        dto.image, dto.imageSelected, dto.dronImage, dto.bulletImage,
        dto.towerImage, dto.towerImageSelected,
        dto.blackHoleImage, dto.blackHoleImageSelected
    )) {

        super.fromDTO(dto, obj);

        obj.#productionTimestamp = dto.productionTimestamp;
        obj.#spawnFrequency = dto.spawnFrequency;
        obj.#soldierLimit = dto.soldierLimit;
        obj.#dronImage = dto.dronImage;
        obj.#bulletImage = dto.bulletImage;
        obj.#towerImage = dto.towerImage;
        obj.#towerImageSelected = dto.towerImageSelected;
        obj.#blackHoleImage = dto.blackHoleImage;
        obj.#blackHoleImageSelected = dto.blackHoleImageSelected;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#productionTimestamp = dto.productionTimestamp;
        this.#spawnPoint = Vector2d.fromDTO(dto.spawnPoint);
        this.#spawnFrequency = dto.spawnFrequency;
        this.#soldierLimit = dto.soldierLimit;
        this.#dronImage = dto.dronImage;
        this.#bulletImage = dto.bulletImage;
    }
}