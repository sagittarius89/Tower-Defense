const ColliderShape = {
    SQUARE: "square",
    CIRCLE: "circle",
    SURFACE: "surface"
}

class Collider {
    static get OBJECT_PROPERTY() {
        return "collision_object";
    }

    static get SHAPE_PROPERTY() {
        return "shape_property";
    }

    static get STATIC_PROPERTY() {
        return "static_property";
    }

    /**
     * @param {ColliderShape} shape
     * @param {boolean} static
     */
    static COLLIDER_OBJECT_DATA(shape, static_) {
        var result = {}

        result[this.SHAPE_PROPERTY] = shape;
        result[this.STATIC_PROPERTY] = static_;

        return result;
    }

    static checkCollisionPointWithSquare(point, square) {
        return point.x > square.topLeft.x && point.x < square.topRight.x &&
            point.y > square.topLeft.y && point.y < square.bottomLeft.y;
    }

    checkCollision(objA, colDataA, objB, colDataB) {
        let shapeA = colDataA[Collider.SHAPE_PROPERTY];
        let shapeB = colDataB[Collider.SHAPE_PROPERTY];

        if (shapeA == ColliderShape.CIRCLE && shapeB == ColliderShape.CIRCLE) {
            this.processCircleCircleCollision(
                objA,
                colDataA[Collider.STATIC_PROPERTY],
                objB,
                colDataB[Collider.STATIC_PROPERTY]
            );
        }
        else if (shapeA == ColliderShape.CIRCLE && shapeB == ColliderShape.SURFACE) {
            this.processCircleShapeCollision(
                objA,
                colDataA[Collider.STATIC_PROPERTY],
                objB,
                colDataB[Collider.STATIC_PROPERTY]
            );
        }

        /** @todo */
    }

    processCircleCircleCollision(objA, isStaticA, objB, isStaticB) {
        let objAPos = objA.position;
        let objBPos = objB.position;

        var distance = objAPos.getDistance(objBPos);

        if (distance <= objA.radius + objB.radius) {
            //todo
        }
    }

    static resolveIntersectionBallBall(ball1, ball2) {
        var ball1Pos = ball1.pos;
        var ball2Pos = ball2.pos;

        var n = ball1Pos.substract(ball2Pos);

        // How much the distance between centers is less than the radii's sum.
        var offset = (ball1.radius + ball2.radius) - (n.getLength());
        n = n.normalize();
        n = n.multiplyByFloat(offset);

        // Bring back the two ball according to their mass.
        ball1Pos = ball1Pos.add(n = n.multiplyByFloat(0.5));
        ball2Pos = ball2Pos.substract(n = n.multiplyByFloat(0.5));

        ball1.pos = ball1Pos;
        ball2.pos = ball2Pos;
    }

    processCircleShapeCollision(objA, isStaticA, objB, isStaticB) {
        let orientation = objB.orientation;
        let position = objA.position;
        let level = objB.startPoint;
        let velocity = objA.velocity;


        if (orientation == Orientation.HORIZONTAL) {
            if (position.y > level.y - objA.radius && position.y < level.y
                && position.x > level.x && position.x < level.x + objB.length) {
                objA.position = new Vector2d(position.x, level.y - objA.radius - 1);
                objA.velocity = new Vector2d(velocity.x, Physics.elasticity * velocity.y);
            }
            else if (position.y < level.y + objA.radius && position.y > level.y
                && position.x > level.x && position.x < level.x + objB.length + 1) {
                objA.position = new Vector2d(position.x, level.y + objA.radius);
                objA.velocity = new Vector2d(velocity.x, Physics.elasticity * velocity.y);
            }
        } else {
            if (position.x < level.x + objA.radius && position.x > level.x
                && position.y > level.y && position.y < level.y + objB.length) {
                objA.position = new Vector2d(level.x + objA.radius, position.y);
                objA.velocity = new Vector2d(velocity.x * Physics.elasticity, velocity.y);
            }
            else if (position.x > level.x - objA.radius && position.x < level.x
                && position.y > level.y && position.y < level.y + objB.length) {
                objA.position = new Vector2d(level.x - objA.radius, position.y);
                objA.velocity = new Vector2d(velocity.x * Physics.elasticity, velocity.y);
            }
        }

        if (position.y > level.y - (objA.radius + 20) && position.y < level.y
            && position.x > level.x && position.x < level.x + objB.length) {
            objA.addProperty("jumpable", objB.id);
        }
        else {
            if (objA.getProperty("jumpable") == objB.id)
                objA.addProperty("jumpable", false);
        }
    }
}