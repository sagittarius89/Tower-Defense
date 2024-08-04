const RoundObject = require('./roundobject');
const ResourceManager = require('../resourcemanager').ResourceManager;
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
//const Soldier = require('./soldier');
const Building = require('./building');
const SquareObject = require('./squareobject');
const Collider = require('../../game/static/src/physics/collider').Collider;
const ColliderShape = require('../../game/static/src/physics/collider').ColliderShape;
const CONSTS = require('../../shared/consts').CONSTS;

module.exports = class Bullet extends RoundObject {
    #vector;
    #parent;
    #image;
    #currFrame;
    #imgWidth;
    #imgHeight;

    constructor(x, y, vector, parent, image) {
        super(5, x, y);

        let tmpImg = ResourceManager.instance.getImageResource(image);

        this.#image = image;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#vector = vector;
        this.selectable = false;
        this.syncable = true;
        this.#parent = parent.id;
        this.zIndex = 50;
        this.#currFrame = 0;

        this.parentOwner = parent.owner;
    }

    logic(objects, conn) {
        this.x += this.#vector.x;
        this.y += this.#vector.y;

        this.checkCollisions(objects, conn);
    }

    checkCollisions(objects, conn) {
        objects.foreach(obj => {
            if (obj.id != this.#parent) {
                if ((obj.hp > 0) && //prevent shoting to destroyed objects
                    (obj.owner && this.parentOwner && obj.owner.name != this.parentOwner.name) &&
                    //turn off friendly fire
                    (obj.constructor.name == 'Soldier' || obj instanceof Building)) {

                    let player = obj.owner;

                    if (player) {

                        if (obj instanceof RoundObject) {
                            let objPos = new Vector2d(obj.x, obj.y);
                            let myPos = new Vector2d(this.x, this.y);

                            var distance = myPos.getDistance(objPos);

                            if (distance <= this.radius + obj.radius) {
                                if (obj.lumbago(15, objects)) {
                                    let parent = objects.byId(this.#parent);
                                    if (parent) {
                                        parent.kills++;
                                        conn.addScore(parent.owner, CONSTS.SOLDIER.SALVAGE);
                                    }
                                }

                                objects.delete(this);
                            }
                        } else if (obj instanceof SquareObject) {
                            let myPos = new Vector2d(this.x, this.y);

                            if (Collider.checkCollisionPointWithSquare(myPos, obj.toSquare())) {
                                if (obj.lumbago(15, objects)) {
                                    let parent = objects.byId(this.#parent);
                                    if (parent) {
                                        parent.kills++;
                                        conn.addScore(parent.owner, CONSTS.TOWER.SALVAGE);
                                    }
                                }

                                objects.delete(this);
                            }
                        }
                    }
                }
            }
        });
    }

    toDTO() {
        let dto = super.toDTO();

        dto.vector = this.#vector.toDTO();
        dto.parent = this.#parent;
        dto.image = this.#image;
        dto.imgWidth = this.#imgWidth;
        dto.imgHeight = this.#imgHeight;

        dto.type = 'bullet';

        dto.type = this.constructor.name;

        return dto;
    }

    static fromDTO(dto, obj = new Bullet()) {

        super.fromDTO(dto, obj);

        obj.#vector = Vector2d.fromDTO(dto.vector);
        obj.#parent = dto.parent;
        obj.#image = dto.image;
        obj.#imgWidth = dto.imgWidth;
        obj.#imgHeight = dto.imgHeight;
        obj.#currFrame = 0;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#vector = Vector2d.fromDTO(dto.vector);
        this.#image = dto.image;
    }
}
