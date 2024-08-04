var CONSTS = {
    BLOCKOUT: true,
    DEBUG: true,

    BULLET: {
        VELOCITY: 7,
        RADIUS: 7,
    },
    SOLDIER_VELOCITY: 5,
    SOLDIER: {
        RADIUS: 60,
        ATTACK_DISTANCE: 460,
        SHOT_FREQUENCY: 1000,
        HP: 30,
        SOLDIER_SALVAGE: 10,

    },
    TOWER: {
        COOLDOWN: 0,
        ATTACK_DISTANCE: 900,
        SHOT_FREQUENCY: 900,
        HP: 200,
        COST: 60,
        BUILDING_DISTANCE: 800,
        TOWE_SALVAGE: 30,
        RADIUS: 100,
    },
    COMMAND_CENTER: {
        SPAWN_FREQUENCY: 6000,
        SOLDIER_LIMIT: 15,
        HP: 700,
        WIDTH: 100,
        HEIGHT: 250,
        A_POS_X: 27,
        A_POS_Y: 1079,
        A_SPAWN_X: 54,
        A_SPAWN_Y: 1079,
        B_POS_X: 3806,
        B_POS_Y: 1079,
        B_SPAWN_X: 3779,
        B_SPAWN_Y: 1079,
    },
    SYNC_TIMEOUT: 50,
    FRAME_RATE: 16.7,
    UPGRADE_SPAWN_SPEED_COOLDOWN: 100,
    UPGRADE_SPAWN_SPEED_COST: 100,
    BLACK_HOLE_COST: 35
}

try {
    module.exports.CONSTS = CONSTS;
} catch (e) { }